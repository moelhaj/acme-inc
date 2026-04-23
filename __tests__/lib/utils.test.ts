jest.mock("@/lib/auth", () => ({
    getSession: jest.fn(),
    encrypt: jest.fn(),
    decrypt: jest.fn(),
}))

import { cn, toArray, formatDueDate, userInitials } from "@/lib/utils"

describe("cn", () => {
    it("merges class names", () => {
        expect(cn("foo", "bar")).toBe("foo bar")
    })

    it("handles conditional classes", () => {
        expect(cn("foo", false && "bar", "baz")).toBe("foo baz")
    })

    it("deduplicates tailwind classes (last wins)", () => {
        expect(cn("p-2", "p-4")).toBe("p-4")
    })
})

describe("toArray", () => {
    it("returns empty array for undefined", () => {
        expect(toArray(undefined)).toEqual([])
    })

    it("wraps a single string in an array", () => {
        expect(toArray("foo")).toEqual(["foo"])
    })

    it("returns array unchanged", () => {
        expect(toArray(["a", "b"])).toEqual(["a", "b"])
    })
})

describe("userInitials", () => {
    it("returns single initial for one name", () => {
        expect(userInitials("Alice")).toBe("A")
    })

    it("returns first and last initials for full name", () => {
        expect(userInitials("John Doe")).toBe("JD")
    })

    it("uses first and last word for names with multiple words", () => {
        expect(userInitials("Mary Jane Watson")).toBe("MW")
    })

    it("returns empty string for empty input", () => {
        expect(userInitials("")).toBe("")
    })

    it("uppercases initials", () => {
        expect(userInitials("alice bob")).toBe("AB")
    })
})

describe("formatDueDate", () => {
    it("returns 'Due today' for today's date", () => {
        const today = new Date()
        expect(formatDueDate(today)).toBe("Due today")
    })

    it("shows days remaining for future date", () => {
        const future = new Date()
        future.setDate(future.getDate() + 5)
        const result = formatDueDate(future)
        expect(result).toMatch(/^Due in/)
        expect(result).toContain("5 days")
    })

    it("shows single day for tomorrow", () => {
        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        const result = formatDueDate(tomorrow)
        expect(result).toContain("1 day")
    })

    it("shows overdue message for past date", () => {
        const past = new Date()
        past.setDate(past.getDate() - 10)
        const result = formatDueDate(past)
        expect(result).toMatch(/^Overdue by/)
        expect(result).toContain("10 days")
    })

    it("uses months for dates > 1 month away", () => {
        const future = new Date()
        future.setMonth(future.getMonth() + 2)
        const result = formatDueDate(future)
        expect(result).toMatch(/month/)
    })

    it("accepts a string date", () => {
        const future = new Date()
        future.setDate(future.getDate() + 3)
        const result = formatDueDate(future.toISOString())
        expect(result).toMatch(/^Due in/)
    })
})
