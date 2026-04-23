jest.mock("@/prisma/generated/prisma/client", () => ({
    TaskStatus: { todo: "todo", in_progress: "in_progress", in_review: "in_review", done: "done" },
    TaskPriority: { low: "low", medium: "medium", high: "high" },
    TaskType: { feature: "feature", bug: "bug", improvement: "improvement" },
}))

jest.mock("@/lib/prisma", () => ({
    __esModule: true,
    default: {
        task: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        $transaction: jest.fn(),
    },
}))

jest.mock("next/cache", () => ({
    revalidatePath: jest.fn(),
}))

jest.mock("@/lib/auth", () => ({
    getSession: jest.fn(),
    isAuthenticated: jest.fn().mockResolvedValue(undefined),
}))

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import {
    getTasks,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
} from "@/actions/task"

const mockFindMany = jest.mocked(prisma.task.findMany)
const mockFindFirst = jest.mocked(prisma.task.findFirst)
const mockCreate = jest.mocked(prisma.task.create)
const mockUpdate = jest.mocked(prisma.task.update)
const mockDelete = jest.mocked(prisma.task.delete)
const mockTransaction = jest.mocked(prisma.$transaction)
const mockRevalidatePath = jest.mocked(revalidatePath)

const VALID_UUID = "550e8400-e29b-41d4-a716-446655440000"
const PROJECT_UUID = "550e8400-e29b-41d4-a716-446655440001"

function makeFormData(data: Record<string, string>): FormData {
    const fd = new FormData()
    Object.entries(data).forEach(([k, v]) => fd.append(k, v))
    return fd
}

const mockTask = {
    id: VALID_UUID,
    title: "Fix login bug",
    description: "Users cannot log in on mobile",
    type: "bug",
    status: "todo",
    priority: "high",
    position: 0,
    projectId: PROJECT_UUID,
    userId: VALID_UUID,
    createdAt: new Date(),
    updatedAt: new Date(),
    user: { name: "Alice", avatar: null },
    project: { title: "Acme App" },
}

describe("getTasks", () => {
    it("returns tasks for a project with no filters", async () => {
        mockFindMany.mockResolvedValue([mockTask] as any)
        const result = await getTasks(PROJECT_UUID, "", [], [], [])
        expect(mockFindMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    projectId: PROJECT_UUID,
                    status: undefined,
                    priority: undefined,
                    type: undefined,
                }),
            })
        )
        expect(result).toHaveLength(1)
    })

    it("applies status filter when provided", async () => {
        mockFindMany.mockResolvedValue([mockTask] as any)
        await getTasks(PROJECT_UUID, "", ["todo" as any], [], [])
        expect(mockFindMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({ status: { in: ["todo"] } }),
            })
        )
    })

    it("applies priority and type filters", async () => {
        mockFindMany.mockResolvedValue([])
        await getTasks(PROJECT_UUID, "bug", [], ["high" as any], ["bug" as any])
        expect(mockFindMany).toHaveBeenCalledWith(
            expect.objectContaining({
                where: expect.objectContaining({
                    priority: { in: ["high"] },
                    type: { in: ["bug"] },
                }),
            })
        )
    })

    it("throws when database query fails", async () => {
        mockFindMany.mockRejectedValue(new Error("DB error"))
        await expect(getTasks(PROJECT_UUID, "", [], [], [])).rejects.toThrow(
            "Failed to fetch tasks."
        )
    })
})

describe("createTask", () => {
    const validData = {
        title: "New feature",
        description: "Implement dark mode",
        type: "feature",
        status: "todo",
        priority: "medium",
        projectId: PROJECT_UUID,
        userId: VALID_UUID,
    }

    it("returns validation errors when title is missing", async () => {
        const fd = makeFormData({ ...validData, title: "" })
        const result = await createTask({ status: "idle" }, fd)
        expect(result.status).toBe("error")
        expect(result.errors?.title).toBeDefined()
    })

    it("returns validation error when userId is not a valid UUID", async () => {
        const fd = makeFormData({ ...validData, userId: "not-a-uuid" })
        const result = await createTask({ status: "idle" }, fd)
        expect(result.status).toBe("error")
        expect(result.errors?.userId).toBeDefined()
    })

    it("returns validation error for invalid status enum", async () => {
        const fd = makeFormData({ ...validData, status: "invalid_status" })
        const result = await createTask({ status: "idle" }, fd)
        expect(result.status).toBe("error")
        expect(result.errors?.status).toBeDefined()
    })

    it("creates task with position 0 when no existing todo tasks", async () => {
        mockFindFirst.mockResolvedValue(null)
        mockCreate.mockResolvedValue(mockTask as any)
        const fd = makeFormData(validData)
        const result = await createTask({ status: "idle" }, fd)
        expect(result.status).toBe("success")
        expect(mockCreate).toHaveBeenCalledWith(
            expect.objectContaining({ data: expect.objectContaining({ position: 0 }) })
        )
    })

    it("creates task with position incremented from last todo task", async () => {
        mockFindFirst.mockResolvedValue({ position: 4 } as any)
        mockCreate.mockResolvedValue(mockTask as any)
        const fd = makeFormData(validData)
        const result = await createTask({ status: "idle" }, fd)
        expect(result.status).toBe("success")
        expect(mockCreate).toHaveBeenCalledWith(
            expect.objectContaining({ data: expect.objectContaining({ position: 5 }) })
        )
    })

    it("revalidates project path on success", async () => {
        mockFindFirst.mockResolvedValue(null)
        mockCreate.mockResolvedValue(mockTask as any)
        const fd = makeFormData(validData)
        await createTask({ status: "idle" }, fd)
        expect(mockRevalidatePath).toHaveBeenCalledWith(`/projects/${PROJECT_UUID}`)
    })

    it("returns error on database failure", async () => {
        mockFindFirst.mockResolvedValue(null)
        mockCreate.mockRejectedValue(new Error("DB error"))
        const fd = makeFormData(validData)
        const result = await createTask({ status: "idle" }, fd)
        expect(result.status).toBe("error")
        expect(result.message).toBe("Failed to create task.")
    })
})

describe("updateTask", () => {
    const validData = {
        id: VALID_UUID,
        title: "Updated task",
        description: "Updated description",
        type: "bug",
        status: "in_progress",
        priority: "high",
        projectId: PROJECT_UUID,
        userId: VALID_UUID,
    }

    it("returns validation errors when id is missing", async () => {
        const fd = makeFormData({ ...validData, id: "" })
        const result = await updateTask({ status: "idle" }, fd)
        expect(result.status).toBe("error")
    })

    it("updates task and returns success with fields", async () => {
        mockUpdate.mockResolvedValue(mockTask as any)
        const fd = makeFormData(validData)
        const result = await updateTask({ status: "idle" }, fd)
        expect(result.status).toBe("success")
        expect(result.message).toBe("Task updated successfully!")
        expect(result.fields?.title).toBe("Updated task")
        expect(mockUpdate).toHaveBeenCalledWith(
            expect.objectContaining({ where: { id: VALID_UUID } })
        )
        expect(mockRevalidatePath).toHaveBeenCalledWith(`/projects/${PROJECT_UUID}`)
    })

    it("returns error on database failure", async () => {
        mockUpdate.mockRejectedValue(new Error("DB error"))
        const fd = makeFormData(validData)
        const result = await updateTask({ status: "idle" }, fd)
        expect(result.status).toBe("error")
        expect(result.message).toBe("Failed to update task.")
    })
})

describe("deleteTask", () => {
    it("deletes the task and revalidates project path", async () => {
        mockDelete.mockResolvedValue(mockTask as any)
        await deleteTask(VALID_UUID, PROJECT_UUID)
        expect(mockDelete).toHaveBeenCalledWith({ where: { id: VALID_UUID } })
        expect(mockRevalidatePath).toHaveBeenCalledWith(`/projects/${PROJECT_UUID}`)
    })

    it("throws when the delete fails", async () => {
        mockDelete.mockRejectedValue(new Error("DB error"))
        await expect(deleteTask(VALID_UUID, PROJECT_UUID)).rejects.toThrow(
            "Failed to delete task."
        )
    })
})

describe("updateTaskStatus", () => {
    const params = [
        { id: VALID_UUID, status: "in_progress" as any, position: 0 },
        { id: "550e8400-e29b-41d4-a716-446655440002", status: "done" as any, position: 1 },
    ]

    it("calls $transaction with update for each param", async () => {
        mockTransaction.mockResolvedValue([])
        mockUpdate.mockResolvedValue(mockTask as any)
        await updateTaskStatus({ projectId: PROJECT_UUID, params })
        expect(mockTransaction).toHaveBeenCalledTimes(1)
        expect(mockUpdate).toHaveBeenCalledTimes(params.length)
        expect(mockRevalidatePath).toHaveBeenCalledWith(`/projects/${PROJECT_UUID}`)
    })

    it("throws when the transaction fails", async () => {
        mockTransaction.mockRejectedValue(new Error("TX error"))
        await expect(
            updateTaskStatus({ projectId: PROJECT_UUID, params })
        ).rejects.toThrow("Failed to update task status.")
    })
})
