"use server"
import prisma from "@/lib/prisma"

export async function getUsers() {
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
