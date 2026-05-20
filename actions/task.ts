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

export async function getTasks(projectId: string) {
  try {
    const tasks = await prisma.task.findMany({
      where: {
        projectId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true,
            title: true,
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

type TaskPayload = {
  title: string
  description: string
  type: TaskType
  priority: TaskPriority
  userId: string
}

export async function createTask(projectId: string, data: TaskPayload) {
  try {
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
    await prisma.task.create({
      data: { ...data, position: position, status: "todo", projectId },
    })
    revalidatePath(`/tasks/${projectId}`)
  } catch (error) {
    throw new Error("Failed to create task.")
  }
}

export async function updateTask(
  task: TaskPayload & { id?: string; projectId: string }
) {
  try {
    await prisma.task.update({
      where: { id: task.id },
      data: task,
    })
    revalidatePath(`/tasks/${task.projectId}`)
  } catch (error) {
    throw new Error("Failed to update task.")
  }
}

export async function deleteTask(id: string, projectId: string) {
  try {
    await prisma.task.delete({
      where: { id },
    })
    revalidatePath(`/tasks/${projectId}`)
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
    revalidatePath(`/tasks/${projectId}`)
  } catch (error) {
    throw new Error("Failed to update task status.")
  }
}
