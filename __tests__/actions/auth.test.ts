jest.mock("@/lib/prisma", () => ({
    __esModule: true,
    default: {
        user: {
            findUnique: jest.fn(),
        },
    },
}))

jest.mock("bcryptjs", () => ({
    compare: jest.fn(),
}))

jest.mock("@/lib/auth", () => ({
    encrypt: jest.fn(),
    getSession: jest.fn(),
    decrypt: jest.fn(),
}))

jest.mock("next/headers", () => ({
    cookies: jest.fn(),
}))

jest.mock("next/navigation", () => ({
    redirect: jest.fn(),
}))

import prisma from "@/lib/prisma"
import { compare } from "bcryptjs"
import { encrypt } from "@/lib/auth"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Login as signIn, signOut } from "@/actions/auth"

const mockPrismaUserFindUnique = jest.mocked(prisma.user.findUnique)
const mockCompare = jest.mocked(compare)
const mockEncrypt = jest.mocked(encrypt)
const mockCookies = jest.mocked(cookies)
const mockRedirect = jest.mocked(redirect)

const mockUser = {
    id: "user-1",
    name: "Test User",
    email: "test@example.com",
    password: "$2b$10$hashedpassword",
    title: "Engineer",
    avatar: null,
    role: "user" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
}

function makeFormData(data: Record<string, string>): FormData {
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => fd.append(k, v))
    return fd
}

describe("signIn", () => {
    let mockCookieSet: jest.Mock

    beforeEach(() => {
        mockCookieSet = jest.fn()
        mockCookies.mockResolvedValue({ set: mockCookieSet, get: jest.fn() } as any)
        mockEncrypt.mockResolvedValue("mocked-session-token")
    })

    it("returns validation error when email is missing", async () => {
        const fd = makeFormData({ password: "secret123" })
        const result = await signIn({ status: "idle" }, fd)
        expect(result.status).toBe("error")
        expect(result.errors?.email).toBeDefined()
    })

    it("returns validation error when password is too short", async () => {
        const fd = makeFormData({ email: "test@example.com", password: "abc" })
        const result = await signIn({ status: "idle" }, fd)
        expect(result.status).toBe("error")
        expect(result.errors?.password).toBeDefined()
    })

    it("returns error when user is not found", async () => {
        mockPrismaUserFindUnique.mockResolvedValue(null)
        const fd = makeFormData({ email: "unknown@example.com", password: "password123" })
        const result = await signIn({ status: "idle" }, fd)
        expect(result.status).toBe("error")
        expect(result.message).toBe("Invalid credentials")
    })

    it("returns error when password does not match", async () => {
        mockCompare.mockResolvedValue(false as never)
        mockPrismaUserFindUnique.mockResolvedValue(mockUser)
        const fd = makeFormData({ email: "test@example.com", password: "wrongpassword" })
        const result = await signIn({ status: "idle" }, fd)
        expect(result.status).toBe("error")
        expect(result.message).toBe("Invalid credentials")
    })

    it("sets session cookie and redirects on success", async () => {
        mockCompare.mockResolvedValue(true as never)
        mockPrismaUserFindUnique.mockResolvedValue(mockUser)

        const fd = makeFormData({ email: "test@example.com", password: "password123" })
        await signIn({ status: "idle" }, fd)

        expect(mockEncrypt).toHaveBeenCalledWith(
            expect.objectContaining({
                user: expect.objectContaining({ email: "test@example.com" }),
            })
        )
        expect(mockCookieSet).toHaveBeenCalledWith(
            "session",
            "mocked-session-token",
            expect.objectContaining({ httpOnly: true })
        )
        expect(mockRedirect).toHaveBeenCalledWith("/")
    })

    it("does not include password in the session payload", async () => {
        mockCompare.mockResolvedValue(true as never)
        mockPrismaUserFindUnique.mockResolvedValue(mockUser)

        const fd = makeFormData({ email: "test@example.com", password: "password123" })
        await signIn({ status: "idle" }, fd)

        const encryptCall = mockEncrypt.mock.calls[0][0]
        expect((encryptCall.user as any).password).toBeUndefined()
    })

    it("returns error on unexpected database failure", async () => {
        mockPrismaUserFindUnique.mockRejectedValue(new Error("DB connection failed"))
        const fd = makeFormData({ email: "test@example.com", password: "password123" })
        const result = await signIn({ status: "idle" }, fd)
        expect(result.status).toBe("error")
        expect(result.message).toBe("Failed to sign in.")
    })
})

describe("signOut", () => {
    let mockCookieSet: jest.Mock

    beforeEach(() => {
        mockCookieSet = jest.fn()
        mockCookies.mockResolvedValue({ set: mockCookieSet, get: jest.fn() } as any)
    })

    it("clears the session cookie and redirects", async () => {
        await signOut()
        expect(mockCookieSet).toHaveBeenCalledWith(
            "session",
            "",
            expect.objectContaining({ expires: new Date(0) })
        )
        expect(mockRedirect).toHaveBeenCalledWith("/")
    })
})
