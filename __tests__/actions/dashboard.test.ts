jest.mock("@/prisma/generated/prisma/client", () => ({
    TaskStatus: {
        todo: "todo",
        in_progress: "in_progress",
        in_review: "in_review",
        done: "done",
    },
    TaskPriority: { low: "low", medium: "medium", high: "high" },
    TaskType: { feature: "feature", bug: "bug", improvement: "improvement" },
}))

jest.mock("@/lib/prisma", () => ({
    __esModule: true,
    default: {
        user: {
            findMany: jest.fn(),
        },
        task: {
            count: jest.fn(),
            groupBy: jest.fn(),
        },
        project: {
            findMany: jest.fn(),
        },
    },
}))

jest.mock("@/lib/auth", () => ({
    getSession: jest.fn(),
    isAuthenticated: jest.fn().mockResolvedValue(undefined),
}))

import prisma from "@/lib/prisma"
import {
    getWorkload,
    getMetrics,
    getBottlenecks,
    getTasksByStatus,
    getTasksByPriorities,
    getTasksByType,
} from "@/actions/dashboard"

const mockUserFindMany = jest.mocked(prisma.user.findMany)
const mockTaskCount = jest.mocked(prisma.task.count)
const mockTaskGroupBy = jest.mocked(prisma.task.groupBy)
const mockProjectFindMany = jest.mocked(prisma.project.findMany)

describe("getWorkload", () => {
    it("returns users sorted by task count descending", async () => {
        mockUserFindMany.mockResolvedValue([
            {
                id: "u1",
                name: "Alice",
                title: "Dev",
                avatar: null,
                _count: { tasks: 10 },
            },
            {
                id: "u2",
                name: "Bob",
                title: "QA",
                avatar: null,
                _count: { tasks: 3 },
            },
            {
                id: "u3",
                name: "Carol",
                title: "PM",
                avatar: null,
                _count: { tasks: 7 },
            },
        ] as any)
        const result = await getWorkload()
        expect(result[0].name).toBe("Alice")
        expect(result[1].name).toBe("Carol")
        expect(result[2].name).toBe("Bob")
    })

    it("flags overloaded users (>1.5x average)", async () => {
        // avg = (12 + 2) / 2 = 7; threshold = 7 * 1.5 = 10.5
        mockUserFindMany.mockResolvedValue([
            {
                id: "u1",
                name: "Alice",
                title: "Dev",
                avatar: null,
                _count: { tasks: 12 },
            },
            {
                id: "u2",
                name: "Bob",
                title: "QA",
                avatar: null,
                _count: { tasks: 2 },
            },
        ] as any)
        const result = await getWorkload()
        const alice = result.find((u) => u.name === "Alice")!
        const bob = result.find((u) => u.name === "Bob")!
        expect(alice.overloaded).toBe(true)
        expect(bob.overloaded).toBe(false)
    })

    it("returns at most 4 users", async () => {
        mockUserFindMany.mockResolvedValue(
            Array.from({ length: 10 }, (_, i) => ({
                id: `u${i}`,
                name: `User ${i}`,
                title: "Dev",
                avatar: null,
                _count: { tasks: i },
            })) as any
        )
        const result = await getWorkload()
        expect(result).toHaveLength(4)
    })

    it("handles empty user list (averageWorkload = 0)", async () => {
        mockUserFindMany.mockResolvedValue([])
        const result = await getWorkload()
        expect(result).toEqual([])
    })

    it("throws on database failure", async () => {
        mockUserFindMany.mockRejectedValue(new Error("DB error"))
        await expect(getWorkload()).rejects.toThrow("Failed to fetch workload")
    })
})

describe("getMetrics", () => {
    it("returns all four metrics", async () => {
        mockTaskCount
            .mockResolvedValueOnce(50) // totalTask
            .mockResolvedValueOnce(8) // inReview
            .mockResolvedValueOnce(12) // highOpen
            .mockResolvedValueOnce(3) // stuckTasks

        const result = await getMetrics()
        expect(result).toEqual({
            totalTask: 50,
            inReview: 8,
            highOpen: 12,
            stuckTasks: 3,
        })
    })

    it("calls prisma.task.count four times in parallel", async () => {
        mockTaskCount.mockResolvedValue(0)
        await getMetrics()
        expect(mockTaskCount).toHaveBeenCalledTimes(4)
    })

    it("throws on database failure", async () => {
        mockTaskCount.mockRejectedValue(new Error("DB error"))
        await expect(getMetrics()).rejects.toThrow("Failed to fetch metrics")
    })
})

describe("getBottlenecks", () => {
    const THREE_DAYS_AGO = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    const FIVE_DAYS_AGO = new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)

    it("returns projects with high-priority in-review tasks stuck > 3 days", async () => {
        mockProjectFindMany.mockResolvedValue([
            {
                id: "proj-1",
                _count: { tasks: 2 },
                tasks: [
                    {
                        id: "task-1",
                        title: "Stuck task",
                        status: "in_review",
                        priority: "high",
                        updatedAt: FIVE_DAYS_AGO,
                    },
                ],
            },
        ] as any)
        const result = await getBottlenecks()
        expect(result).toHaveLength(1)
        expect(result[0].title).toBe("Stuck task")
        expect(result[0].daysInReview).toBeGreaterThanOrEqual(5)
    })

    it("excludes tasks that are not high priority or not in_review", async () => {
        mockProjectFindMany.mockResolvedValue([
            {
                id: "proj-1",
                _count: { tasks: 1 },
                tasks: [
                    {
                        id: "task-2",
                        title: "Low task",
                        status: "in_review",
                        priority: "low",
                        updatedAt: FIVE_DAYS_AGO,
                    },
                ],
            },
        ] as any)
        const result = await getBottlenecks()
        expect(result).toHaveLength(0)
    })

    it("excludes tasks updated within the last 3 days", async () => {
        const recentDate = new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        mockProjectFindMany.mockResolvedValue([
            {
                id: "proj-1",
                _count: { tasks: 1 },
                tasks: [
                    {
                        id: "task-3",
                        title: "Recent task",
                        status: "in_review",
                        priority: "high",
                        updatedAt: recentDate,
                    },
                ],
            },
        ] as any)
        const result = await getBottlenecks()
        expect(result).toHaveLength(0)
    })

    it("returns at most 4 bottleneck projects", async () => {
        const stuckTask = {
            status: "in_review",
            priority: "high",
            updatedAt: FIVE_DAYS_AGO,
        }
        mockProjectFindMany.mockResolvedValue(
            Array.from({ length: 8 }, (_, i) => ({
                id: `proj-${i}`,
                _count: { tasks: 1 },
                tasks: [{ id: `task-${i}`, title: `Task ${i}`, ...stuckTask }],
            })) as any
        )
        const result = await getBottlenecks()
        expect(result).toHaveLength(4)
    })

    it("throws on database failure", async () => {
        mockProjectFindMany.mockRejectedValue(new Error("DB error"))
        await expect(getBottlenecks()).rejects.toThrow(
            "Failed to fetch bottlenecks"
        )
    })
})

describe("getTasksByStatus", () => {
    it("returns a record keyed by status", async () => {
        mockTaskGroupBy.mockResolvedValue([
            { status: "todo", _count: { status: 10 } },
            { status: "done", _count: { status: 5 } },
        ] as any)
        const result = await getTasksByStatus()
        expect(result).toEqual({ todo: 10, done: 5 })
    })

    it("groups by status field", async () => {
        mockTaskGroupBy.mockResolvedValue([])
        await getTasksByStatus()
        expect(mockTaskGroupBy).toHaveBeenCalledWith(
            expect.objectContaining({ by: ["status"] })
        )
    })

    it("throws on database failure", async () => {
        mockTaskGroupBy.mockRejectedValue(new Error("DB error"))
        await expect(getTasksByStatus()).rejects.toThrow(
            "Failed to fetch tasks by status"
        )
    })
})

describe("getTasksByPriorities", () => {
    it("returns a record keyed by priority", async () => {
        mockTaskGroupBy.mockResolvedValue([
            { priority: "high", _count: { priority: 4 } },
            { priority: "low", _count: { priority: 8 } },
        ] as any)
        const result = await getTasksByPriorities()
        expect(result).toEqual({ high: 4, low: 8 })
    })

    it("groups by priority field", async () => {
        mockTaskGroupBy.mockResolvedValue([])
        await getTasksByPriorities()
        expect(mockTaskGroupBy).toHaveBeenCalledWith(
            expect.objectContaining({ by: ["priority"] })
        )
    })

    it("throws on database failure", async () => {
        mockTaskGroupBy.mockRejectedValue(new Error("DB error"))
        await expect(getTasksByPriorities()).rejects.toThrow(
            "Failed to fetch tasks by priority"
        )
    })
})

describe("getTasksByType", () => {
    it("returns a record keyed by type", async () => {
        mockTaskGroupBy.mockResolvedValue([
            { type: "bug", _count: { type: 6 } },
            { type: "feature", _count: { type: 14 } },
        ] as any)
        const result = await getTasksByType()
        expect(result).toEqual({ bug: 6, feature: 14 })
    })

    it("groups by type field", async () => {
        mockTaskGroupBy.mockResolvedValue([])
        await getTasksByType()
        expect(mockTaskGroupBy).toHaveBeenCalledWith(
            expect.objectContaining({ by: ["type"] })
        )
    })

    it("throws on database failure", async () => {
        mockTaskGroupBy.mockRejectedValue(new Error("DB error"))
        await expect(getTasksByType()).rejects.toThrow(
            "Failed to fetch tasks by type"
        )
    })
})
