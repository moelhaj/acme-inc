jest.mock("@/lib/prisma", () => ({
    __esModule: true,
    default: {
        user: {
            findMany: jest.fn(),
        },
    },
}))

jest.mock("@/lib/auth", () => ({
    getSession: jest.fn(),
    isAuthenticated: jest.fn().mockResolvedValue(undefined),
}))

import prisma from "@/lib/prisma"
import { getUsers } from "@/actions/user"

const mockFindMany = jest.mocked(prisma.user.findMany)

const mockUser = {
    id: "user-1",
    name: "Alice Smith",
    email: "alice@example.com",
    password: "$2b$10$hashed",
    title: "Engineer",
    avatar: null,
    role: "user" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
}

describe("getUsers", () => {
    it("returns all users ordered by createdAt desc", async () => {
        mockFindMany.mockResolvedValue([mockUser] as any)
        const result = await getUsers()
        expect(mockFindMany).toHaveBeenCalledWith(
            expect.objectContaining({ orderBy: { createdAt: "desc" } })
        )
        expect(result).toHaveLength(1)
        expect(result[0].name).toBe("Alice Smith")
    })

    it("returns empty array when no users exist", async () => {
        mockFindMany.mockResolvedValue([])
        const result = await getUsers()
        expect(result).toEqual([])
    })

    it("throws when database query fails", async () => {
        mockFindMany.mockRejectedValue(new Error("DB error"))
        await expect(getUsers()).rejects.toThrow("Failed to fetch users.")
    })
})
