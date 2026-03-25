"use server"
import prisma from "@/lib/prisma"
import { TaskPriority, TaskStatus } from "@/lib/generated/prisma/client"
import { aiFallback, callLLM } from "./open-ai"

const safePct = (value: number) => Number((value * 100).toFixed(2))

export async function getWorkload() {
    try {
        const workloadRows = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                avatar: true,
                title: true,
                tasks: {
                    select: {
                        status: true,
                        priority: true,
                    },
                },
            },
        })

        const workload = workloadRows
            .map((row) => {
                let active = 0
                let high = 0
                let score = 0

                for (const task of row.tasks) {
                    const isActive = task.status !== TaskStatus.done
                    const isHigh = task.priority === TaskPriority.high

                    if (isActive) active++
                    if (isActive && isHigh) high++

                    if (task.status === TaskStatus.in_progress) score += 2
                    if (task.status === TaskStatus.in_review) score += 2
                    if (task.status === TaskStatus.todo) score += 1
                    if (task.priority === TaskPriority.high) score += 2
                    if (isHigh) score += 3
                }

                return {
                    userId: row.id,
                    name: row.name,
                    avatar: row.avatar,
                    active,
                    high,
                    score,
                }
            })
            .sort((a, b) => b.score - a.score)
        return workload
    } catch (error) {
        console.error("Error getting workload:", error)
    }
}

export async function buildSnapshotBase() {
    try {
        const [open, inReview, highOpen] = await Promise.all([
            prisma.task.count({
                where: { status: { not: TaskStatus.done } },
            }),
            prisma.task.count({
                where: { status: TaskStatus.in_review },
            }),
            prisma.task.count({
                where: {
                    status: { not: TaskStatus.done },
                    priority: TaskPriority.high,
                },
            }),
        ])

        const now = Date.now()
        const stuckItems = await prisma.task.findMany({
            where: {
                status: TaskStatus.in_review,
                priority: TaskPriority.high,
                updatedAt: { lte: new Date(now - 3 * 24 * 60 * 60 * 1000) },
            },
            select: {
                id: true,
                title: true,
                priority: true,
                projectId: true,
                updatedAt: true,
            },
            orderBy: {
                updatedAt: "asc",
            },
            take: 10,
        })

        const workloadRows = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                avatar: true,
                tasks: {
                    select: {
                        status: true,
                        priority: true,
                    },
                },
            },
        })

        const users = workloadRows
            .map((row) => {
                let active = 0
                let high = 0
                let score = 0

                for (const task of row.tasks) {
                    const isActive = task.status !== TaskStatus.done
                    const isHigh = task.priority === TaskPriority.high

                    if (isActive) active++
                    if (isActive && isHigh) high++

                    if (task.status === TaskStatus.in_progress) score += 2
                    if (task.status === TaskStatus.in_review) score += 2
                    if (task.status === TaskStatus.todo) score += 1
                    if (task.priority === TaskPriority.high) score += 2
                    if (isHigh) score += 3
                }

                return {
                    userId: row.id,
                    name: row.name,
                    avatar: row.avatar,
                    active,
                    high,
                    score,
                }
            })
            .sort((a, b) => b.score - a.score)

        const scores = users.map((row) => row.score)
        const avgScore = scores.length
            ? scores.reduce((a, b) => a + b, 0) / scores.length
            : 0

        const overloaded = avgScore
            ? users
                  .filter((u) => u.score / avgScore >= 1.6)
                  .map((u) => ({
                      userId: u.userId,
                      name: u.name,
                      score: u.score,
                      ratioVsAvg: safePct(u.score / avgScore),
                  }))
            : []

        return {
            tasks: {
                open,
                inReview,
                highOpen,
            },
            stuck: stuckItems.map((item) => ({
                id: item.id,
                title: item.title,
                days: Math.ceil((now - item.updatedAt.getTime()) / 86400000),
                priority: item.priority,
                projectId: item.projectId,
            })),
            workload: users,
            overloaded,
        }
    } catch (error) {
        console.error("Error building snapshot base:", error)
        throw error
    }
}

export async function getInsights() {
    const cached = await prisma.aiLogs.findFirst({
        where: {
            createdAt: {
                gte: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        select: {
            output: true,
        },
    })

    const cachedText = cached?.output
    if (cachedText) {
        const parsedCached = JSON.parse(cachedText)
        return parsedCached
    }

    const snapshot = await buildSnapshotBase()
    let actions = await callLLM(snapshot)
    if (!actions) {
        actions = aiFallback(snapshot)
    }
    const insights = {
        tasks: snapshot.tasks,
        stuck: snapshot.stuck,
        workload: snapshot.workload,
        overloaded: snapshot.overloaded,
        actions,
    }

    await prisma.aiLogs.create({
        data: {
            input: JSON.stringify(snapshot),
            output: JSON.stringify(insights),
        },
    })

    return insights
}
