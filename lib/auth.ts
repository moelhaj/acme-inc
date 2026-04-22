"use server"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { User } from "@/prisma/generated/prisma/client"
import { redirect } from "next/navigation"

if (!process.env.AUTH_SECRET) throw new Error("AUTH_SECRET env var is required")
const key = new TextEncoder().encode(process.env.AUTH_SECRET)

const SESSION_DURATION_MS = 12 * 60 * 60 * 1000

export type SessionPayload = { user: Omit<User, "password">; expires: Date }

export async function encrypt(payload: SessionPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime(`${SESSION_DURATION_MS / 1000} seconds`)
        .sign(key)
}

export async function decrypt(input: string): Promise<SessionPayload> {
    const { payload } = await jwtVerify(input, key, {
        algorithms: ["HS256"],
    })
    return payload as SessionPayload
}

export async function getSession(): Promise<SessionPayload | null> {
    const session = (await cookies()).get("session")?.value
    if (!session) return null
    return await decrypt(session)
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get("session")?.value
    if (!session) return

    const parsed = await decrypt(session)
    parsed.expires = new Date(Date.now() + SESSION_DURATION_MS)
    const res = NextResponse.next()
    res.cookies.set("session", await encrypt(parsed), {
        httpOnly: true,
        expires: parsed.expires,
    })
    return res
}

export async function isAuthenticated() {
    const session = await getSession()
    if (!session) {
        redirect("/login")
    }
}
