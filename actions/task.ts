"use server"
import { revalidatePath } from "next/cache"
import prisma from "@/lib/prisma"
import {
    TaskStatus,
    TaskPriority,
    TaskType,
} from "@/lib/generated/prisma/client"
import { TaskSchema } from "@/lib/schema"
import { State } from "@/lib/definitions"

export type TaskState = State & {
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

const ModifyTask = TaskSchema.omit({ id: true })

export async function getTasks(
    projectId: string,
    query: string,
    status: string,
    priority: string,
    type: string
) {
    try {
        const tasks = await prisma.task.findMany({
            where: {
                projectId,
                title: {
                    contains: query,
                    mode: "insensitive",
                },
                status: status ? (status as TaskStatus) : undefined,
                priority: priority
                    ? { in: priority.split(",") as TaskPriority[] }
                    : undefined,
                type: type ? { in: type.split(",") as TaskType[] } : undefined,
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

export async function createTask(prevState: State, formData: FormData) {
    const validatedFields = ModifyTask.safeParse({
        title: formData.get("title"),
        description: formData.get("description"),
        type: formData.get("type"),
        status: formData.get("status"),
        priority: formData.get("priority"),
        projectId: formData.get("projectId"),
        userId: formData.get("userId"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing fields. Failed to create task.",
            fields: {
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                type: formData.get("type") as string,
                status: formData.get("status") as string,
                priority: formData.get("priority") as string,
                projectId: formData.get("projectId") as string,
                userId: formData.get("userId") as string,
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
        throw new Error("Failed to create task.")
    }
}

export async function updateTask(prevState: State, formData: FormData) {
    const validatedFields = TaskSchema.safeParse({
        id: formData.get("id"),
        title: formData.get("title"),
        description: formData.get("description"),
        type: formData.get("type"),
        status: formData.get("status"),
        priority: formData.get("priority"),
        projectId: formData.get("projectId"),
        userId: formData.get("userId"),
    })

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Missing fields. Failed to update task.",
            fields: {
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                type: formData.get("type") as string,
                status: formData.get("status") as string,
                priority: formData.get("priority") as string,
                projectId: formData.get("projectId") as string,
                userId: formData.get("userId") as string,
            },
            status: "error",
        }
    }

    const { id, projectId } = validatedFields.data
    try {
        await prisma.task.update({
            where: { id },
            data: validatedFields.data,
        })
        revalidatePath(`/projects/${projectId}`)
        return {
            message: "Task updated successfully!",
            status: "success",

            fields: {
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                type: formData.get("type") as string,
                status: formData.get("status") as string,
                priority: formData.get("priority") as string,
                projectId: formData.get("projectId") as string,
                userId: formData.get("userId") as string,
            },
        }
    } catch (error) {
        throw new Error("Failed to update task.")
    }
}

export async function deleteTask(id: string, projectId: string) {
    try {
        await prisma.task.delete({
            where: { id },
        })
        revalidatePath(`/projects/${projectId}`)
        return { message: "Task deleted successfully!", status: "success" }
    } catch (error) {
        throw new Error("Failed to delete task.")
    }
}

export async function updateTaskStatus(
    id: string,
    status: TaskStatus,
    projectId: string
) {
    try {
        await prisma.task.update({
            where: { id },
            data: { status },
        })
        revalidatePath(`/projects/${projectId}`)
        return {
            message: "Task status updated successfully!",
            status: "success",
        }
    } catch (error) {
        throw new Error("Failed to update task status.")
    }
}
