"use server"
import { encrypt } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { compare } from "bcryptjs"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { z } from "zod"

const SESSION_DURATION_MS = 12 * 60 * 60 * 1000

export type State = {
    message?: string | null
    errors?: {
        email?: string[]
        password?: string[]
    }
}

const UserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

export async function Login(
    prevState: State,
    formData: FormData
): Promise<State> {
    const validatedFields = UserSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing fields. Failed to sign in.",
        }
    }

    const { email, password } = validatedFields.data
    try {
        const user = await prisma.user.findUnique({
            where: { email },
        })
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

        const expires = new Date(Date.now() + SESSION_DURATION_MS)
        const session = await encrypt({ user, expires })
        ;(await cookies()).set("session", session, { expires, httpOnly: true })
    } catch (error) {
        return { message: "Failed to sign in." }
    }
    redirect("/")
}

export async function signOut() {
    ;(await cookies()).set("session", "", { expires: new Date(0) })
    redirect("/")
}
