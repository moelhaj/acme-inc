"use server"
import { redirect } from "next/navigation"
import { compare } from "bcryptjs"
import { encrypt } from "@/lib/auth"
import { cookies } from "next/headers"
import { User } from "@/lib/generated/prisma/client"
import prisma from "@/lib/prisma"

async function getUser(email: string): Promise<User | undefined> {
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        })
        return user ?? undefined
    } catch (error) {
        console.error("Failed to fetch user:", error)
        throw new Error("Failed to fetch user.")
    }
}

export async function signIn(data: { email: string; password: string }) {
    const { email, password } = data
    const user = await getUser(email)

    if (!user) {
        return {
            message: "Invalid credentials",
        }
    }

    const passwordsMatch = await compare(password, user.password)

    if (!passwordsMatch) {
        return {
            message: "Invalid credentials",
        }
    }

    user.password = ""

    const expires = new Date(Date.now() + 12 * 60 * 60 * 1000)
    const session = await encrypt({ user, expires })
    ;(await cookies()).set("session", session, { expires, httpOnly: true })
    redirect("/")
}

export async function signOut() {
    ;(await cookies()).set("session", "", { expires: new Date(0) })
    redirect("/")
}
