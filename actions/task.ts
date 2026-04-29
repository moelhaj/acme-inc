"use server"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import {
    TaskStatus,
    TaskPriority,
    TaskType,
} from "@/prisma/generated/prisma/client"
import { z } from "zod"

export type TaskState = {
    message?: string | null
    status: string
    error?: unknown
    fields?: {
        title: string
        description: string
        type: string
        status: string
        priority: string
        userId: string
        projectId: string
    }
    errors?: {
        title?: string[]
        description?: string[]
        type?: string[]
        status?: string[]
        priority?: string[]
        userId?: string[]
    }
}

const TaskSchema = z.object({
    id: z.string().uuid(),
    title: z
        .string()
        .min(1, "Title is required")
        .max(50, "Title must be at most 100 characters"),
    description: z
        .string()
        .min(1, "Description is required")
        .max(100, "Description must be at most 100 characters"),
    projectId: z.string().min(1).max(50),
    userId: z.string().uuid({ message: "Assignee is required" }),
    status: z.enum(["todo", "in_progress", "in_review", "done"], {
        error: "Status is required",
    }),
    priority: z.enum(["low", "medium", "high"], {
        error: "Priority is required",
    }),
    type: z.enum(["feature", "bug", "improvement"], {
        error: "Type is required",
    }),
})

const ModifyTask = TaskSchema.omit({ id: true })

export async function getTasks(
    projectId: string,
    query: string,
    status: TaskStatus[],
    priority: TaskPriority[],
    type: TaskType[]
) {
    try {
        const tasks = await prisma.task.findMany({
            where: {
                projectId,
                title: {
                    contains: query,
                    mode: "insensitive",
                },
                status: status.length > 0 ? { in: status } : undefined,
                priority: priority.length > 0 ? { in: priority } : undefined,
                type: type.length > 0 ? { in: type } : undefined,
            },
            orderBy: {
                createdAt: "asc",
            },
            include: {
                user: {
                    select: {
                        name: true,
                        avatar: true,
                    },
                },
                project: {
                    select: {
                        title: true,
                    },
                },
            },
        })
        return tasks
    } catch (error) {
        throw new Error("Failed to fetch tasks.")
    }
}

export async function createTask(
    prevState: TaskState,
    formData: FormData
): Promise<TaskState> {
    const rawTask = {
        title: formData.get("title"),
        description: formData.get("description"),
        type: formData.get("type"),
        status: formData.get("status"),
        priority: formData.get("priority"),
        projectId: formData.get("projectId"),
        userId: formData.get("userId"),
    }
    const validatedFields = ModifyTask.safeParse(rawTask)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing fields. Failed to create task.",
            fields: {
                title: typeof rawTask.title === "string" ? rawTask.title : "",
                description:
                    typeof rawTask.description === "string"
                        ? rawTask.description
                        : "",
                type: typeof rawTask.type === "string" ? rawTask.type : "",
                status:
                    typeof rawTask.status === "string" ? rawTask.status : "",
                priority:
                    typeof rawTask.priority === "string"
                        ? rawTask.priority
                        : "",
                projectId:
                    typeof rawTask.projectId === "string"
                        ? rawTask.projectId
                        : "",
                userId:
                    typeof rawTask.userId === "string" ? rawTask.userId : "",
            },
            status: "error",
        }
    }

    const { projectId } = validatedFields.data
    const lastTodoTask = await prisma.task.findFirst({
        where: {
            projectId,
            status: "todo",
        },
        orderBy: {
            position: "desc",
        },
    })

    const position = lastTodoTask ? lastTodoTask.position + 1 : 0
    try {
        await prisma.task.create({
            data: { ...validatedFields.data, position: position },
        })
        revalidatePath(`/projects/${projectId}`)
        return { message: "Task created successfully!", status: "success" }
    } catch (error) {
        return { status: "error", message: "Failed to create task." }
    }
}

export async function updateTask(
    prevState: TaskState,
    formData: FormData
): Promise<TaskState> {
    const rawTask = {
        id: formData.get("id"),
        title: formData.get("title"),
        description: formData.get("description"),
        type: formData.get("type"),
        status: formData.get("status"),
        priority: formData.get("priority"),
        projectId: formData.get("projectId"),
        userId: formData.get("userId"),
    }
    const validatedFields = TaskSchema.safeParse(rawTask)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing fields. Failed to update task.",
            fields: {
                title: typeof rawTask.title === "string" ? rawTask.title : "",
                description:
                    typeof rawTask.description === "string"
                        ? rawTask.description
                        : "",
                type: typeof rawTask.type === "string" ? rawTask.type : "",
                status:
                    typeof rawTask.status === "string" ? rawTask.status : "",
                priority:
                    typeof rawTask.priority === "string"
                        ? rawTask.priority
                        : "",
                projectId:
                    typeof rawTask.projectId === "string"
                        ? rawTask.projectId
                        : "",
                userId:
                    typeof rawTask.userId === "string" ? rawTask.userId : "",
            },
            status: "error",
        }
    }

    const {
        id,
        projectId,
        title,
        description,
        type,
        status,
        priority,
        userId,
    } = validatedFields.data
    try {
        await prisma.task.update({
            where: { id },
            data: {
                id,
                projectId,
                title,
                description,
                type,
                status,
                priority,
                userId,
            },
        })
        revalidatePath(`/projects/${projectId}`)
        return {
            message: "Task updated successfully!",
            status: "success",
            fields: {
                title,
                description,
                type,
                status,
                priority,
                projectId,
                userId,
            },
        }
    } catch (error) {
        return { status: "error", message: "Failed to update task." }
    }
}

export async function deleteTask(id: string, projectId: string) {
    try {
        await prisma.task.delete({
            where: { id },
        })
        revalidatePath(`/projects/${projectId}`)
    } catch (error) {
        throw new Error("Failed to delete task.")
    }
}

type UpdateTaskStatusParams = Array<{
    id: string
    status: TaskStatus
    position: number
}>

export async function updateTaskStatus({
    projectId,
    params,
}: {
    projectId: string
    params: UpdateTaskStatusParams
}) {
    try {
        await prisma.$transaction(
            params.map((param) =>
                prisma.task.update({
                    where: { id: param.id },
                    data: { status: param.status, position: param.position },
                })
            )
        )
        revalidatePath(`/projects/${projectId}`)
    } catch (error) {
        throw new Error("Failed to update task status.")
    }
}
