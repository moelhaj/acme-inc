"use server"
import prisma from "@/lib/prisma"
import {
    TaskPriority,
    TaskStatus,
    TaskType,
} from "@/prisma/generated/prisma/client"
import { isAuthenticated } from "@/lib/auth"

const OVERLOAD_THRESHOLD = 1.5
const TOP_USERS_COUNT = 4
const THREE_DAYS_AGO = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)

export async function getWorkload() {
    await isAuthenticated()
    try {
        const workloadRows = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                avatar: true,
                title: true,
                _count: {
                    select: {
                        tasks: true,
                    },
                },
            },
        })

        const averageWorkload =
            workloadRows.length > 0
                ? workloadRows.reduce(
                      (sum, user) => sum + user._count.tasks,
                      0
                  ) / workloadRows.length
                : 0

        const workload = workloadRows.map((user) => ({
            id: user.id,
            name: user.name,
            title: user.title,
            avatar: user.avatar,
            tasksCount: user._count.tasks,
            overloaded:
                user._count.tasks > averageWorkload * OVERLOAD_THRESHOLD,
        }))

        return workload
            .sort((a, b) => b.tasksCount - a.tasksCount)
            .slice(0, TOP_USERS_COUNT)
    } catch (error) {
        throw new Error("Failed to fetch workload data")
    }
}

export async function getMetrics() {
    await isAuthenticated()
    try {
        const [totalTask, inReview, highOpen, stuckTasks] = await Promise.all([
            prisma.task.count(),
            prisma.task.count({
                where: { status: TaskStatus.in_review },
            }),
            prisma.task.count({
                where: {
                    status: { not: TaskStatus.done },
                    priority: TaskPriority.high,
                },
            }),
            prisma.task.count({
                where: {
                    status: TaskStatus.in_review,
                    updatedAt: {
                        lte: THREE_DAYS_AGO,
                    },
                },
            }),
        ])
        return {
            totalTask,
            inReview,
            highOpen,
            stuckTasks,
        }
    } catch (error) {
        throw new Error("Failed to fetch metrics")
    }
}

export async function getBottlenecks() {
    await isAuthenticated()
    try {
        const projects = await prisma.project.findMany({
            include: {
                tasks: true,
                _count: {
                    select: { tasks: true },
                },
            },
        })

        const bottleneckProjects = projects
            .map((project) => {
                const inReviewTasks = project.tasks.filter(
                    (task) =>
                        task.status === TaskStatus.in_review &&
                        task.priority === TaskPriority.high &&
                        task.updatedAt <= THREE_DAYS_AGO
                )

                if (inReviewTasks.length === 0) return null

                const bottleneckTask = inReviewTasks.reduce((oldest, task) =>
                    task.updatedAt < oldest.updatedAt ? task : oldest
                )

                return {
                    id: bottleneckTask.id,
                    title: bottleneckTask.title,
                    priority: bottleneckTask.priority,
                    projectId: project.id,
                    daysInReview: Math.ceil(
                        (Date.now() - bottleneckTask.updatedAt.getTime()) /
                            86400000
                    ),
                }
            })
            .filter((p): p is NonNullable<typeof p> => p !== null)
        return bottleneckProjects
            .sort((a, b) => b.daysInReview - a.daysInReview)
            .slice(0, TOP_USERS_COUNT)
    } catch (error) {
        throw new Error("Failed to fetch bottlenecks")
    }
}

export async function getTasksByStatus() {
    await isAuthenticated()
    try {
        const tasksByStatusRaw = await prisma.task.groupBy({
            by: ["status"],
            _count: { status: true },
        })
        const tasksByStatus = tasksByStatusRaw.reduce(
            (acc, item) => {
                acc[item.status] = item._count.status
                return acc
            },
            {} as Record<TaskStatus, number>
        )
        return tasksByStatus
    } catch (error) {
        throw new Error("Failed to fetch tasks by status")
    }
}

export async function getTasksByPriorities() {
    await isAuthenticated()
    try {
        const tasksByPriorityRaw = await prisma.task.groupBy({
            by: ["priority"],
            _count: { priority: true },
        })
        const tasksByPriority = tasksByPriorityRaw.reduce(
            (acc, item) => {
                acc[item.priority] = item._count.priority
                return acc
            },
            {} as Record<TaskPriority, number>
        )
        return tasksByPriority
    } catch (error) {
        throw new Error("Failed to fetch tasks by priority")
    }
}

export async function getTasksByType() {
    await isAuthenticated()
    try {
        const tasksByTypeRaw = await prisma.task.groupBy({
            by: ["type"],
            _count: { type: true },
        })
        const tasksByType = tasksByTypeRaw.reduce(
            (acc, item) => {
                acc[item.type] = item._count.type
                return acc
            },
            {} as Record<TaskType, number>
        )
        return tasksByType
    } catch (error) {
        throw new Error("Failed to fetch tasks by type")
    }
}
