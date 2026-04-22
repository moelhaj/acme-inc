"use server"
import prisma from "@/lib/prisma"
import { isAuthenticated } from "@/lib/auth"

export async function getUsers() {
    await isAuthenticated()
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
        })
        return users
    } catch (error) {
        throw new Error("Failed to fetch users.")
    }
}
