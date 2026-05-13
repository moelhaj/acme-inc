"use server"
import prisma from "@/lib/prisma"
import {
  TaskPriority,
  TaskStatus,
  TaskType,
} from "@/prisma/generated/prisma/client"

const OVERLOAD_THRESHOLD = 1.5
const TOP_USERS_COUNT = 3
const THREE_DAYS_AGO = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)

export async function getWorkload() {
  try {
    const [usersCount, tasksCount, workloadRows] = await Promise.all([
      prisma.user.count(),
      prisma.task.count(),
      prisma.user.findMany({
        take: TOP_USERS_COUNT,
        orderBy: {
          tasks: {
            _count: "desc",
          },
        },
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
      }),
    ])

    const averageWorkload = usersCount > 0 ? tasksCount / usersCount : 0

    const workload = workloadRows.map((user) => ({
      id: user.id,
      name: user.name,
      title: user.title,
      avatar: user.avatar,
      tasksCount: user._count.tasks,
      overloaded: user._count.tasks > averageWorkload * OVERLOAD_THRESHOLD,
    }))

    return workload
  } catch (error) {
    throw new Error("Failed to fetch workload data")
  }
}

export async function getMetrics() {
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
  try {
    const topProjectsByBottlenecks = await prisma.task.groupBy({
      by: ["projectId"],
      where: {
        status: TaskStatus.in_review,
        updatedAt: {
          lte: THREE_DAYS_AGO,
        },
      },
      _count: {
        projectId: true,
      },
      orderBy: {
        _count: {
          projectId: "desc",
        },
      },
      take: TOP_USERS_COUNT,
    })

    if (topProjectsByBottlenecks.length === 0) {
      return []
    }

    const projectIds = topProjectsByBottlenecks.map(
      (project) => project.projectId
    )

    const projects = await prisma.project.findMany({
      where: {
        id: {
          in: projectIds,
        },
      },
      select: {
        id: true,
        tasks: {
          where: {
            status: TaskStatus.in_review,
            updatedAt: {
              lte: THREE_DAYS_AGO,
            },
          },
        },
      },
    })

    const projectsById = new Map(
      projects.map((project) => [project.id, project])
    )

    const bottleneckProjects = topProjectsByBottlenecks
      .map((projectCount) => {
        const project = projectsById.get(projectCount.projectId)

        if (!project || project.tasks.length === 0) return null

        const bottleneckTask = project.tasks.reduce((oldest, task) =>
          task.updatedAt < oldest.updatedAt ? task : oldest
        )

        return {
          id: bottleneckTask.id,
          title: bottleneckTask.title,
          priority: bottleneckTask.priority,
          projectId: projectCount.projectId,
          daysInReview: Math.ceil(
            (Date.now() - bottleneckTask.updatedAt.getTime()) / 86400000
          ),
        }
      })
      .filter((p): p is NonNullable<typeof p> => p !== null)

    return bottleneckProjects
  } catch (error) {
    throw new Error("Failed to fetch bottlenecks")
  }
}

export async function getTasksByStatus() {
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
