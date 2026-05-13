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
const HIGH_PRIORITY_WEIGHT = 2
const STUCK_IN_REVIEW_WEIGHT = 1

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
    const [highPriorityByProject, stuckInReviewByProject] = await Promise.all([
      prisma.task.groupBy({
        by: ["projectId"],
        where: {
          priority: TaskPriority.high,
          status: {
            not: TaskStatus.done,
          },
        },
        _count: {
          projectId: true,
        },
      }),
      prisma.task.groupBy({
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
      }),
    ])

    const projectFocus = new Map<
      string,
      {
        highPriorityCount: number
        stuckInReviewCount: number
        focusScore: number
      }
    >()

    for (const project of highPriorityByProject) {
      projectFocus.set(project.projectId, {
        highPriorityCount: project._count.projectId,
        stuckInReviewCount: 0,
        focusScore: project._count.projectId * HIGH_PRIORITY_WEIGHT,
      })
    }

    for (const project of stuckInReviewByProject) {
      const existing = projectFocus.get(project.projectId)
      const highPriorityCount = existing?.highPriorityCount ?? 0
      const stuckInReviewCount = project._count.projectId

      projectFocus.set(project.projectId, {
        highPriorityCount,
        stuckInReviewCount,
        focusScore:
          highPriorityCount * HIGH_PRIORITY_WEIGHT +
          stuckInReviewCount * STUCK_IN_REVIEW_WEIGHT,
      })
    }

    const topProjectsByFocus = Array.from(projectFocus.entries())
      .map(([projectId, score]) => ({ projectId, ...score }))
      .sort((a, b) => {
        if (b.focusScore !== a.focusScore) return b.focusScore - a.focusScore
        if (b.highPriorityCount !== a.highPriorityCount) {
          return b.highPriorityCount - a.highPriorityCount
        }
        return b.stuckInReviewCount - a.stuckInReviewCount
      })
      .slice(0, TOP_USERS_COUNT)

    if (topProjectsByFocus.length === 0) {
      return []
    }

    const projectIds = topProjectsByFocus.map((project) => project.projectId)

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
            OR: [
              {
                priority: TaskPriority.high,
                status: {
                  not: TaskStatus.done,
                },
              },
              {
                status: TaskStatus.in_review,
                updatedAt: {
                  lte: THREE_DAYS_AGO,
                },
              },
            ],
          },
        },
      },
    })

    const projectsById = new Map(
      projects.map((project) => [project.id, project])
    )

    const bottleneckProjects = topProjectsByFocus
      .map((projectFocus) => {
        const project = projectsById.get(projectFocus.projectId)

        if (!project || project.tasks.length === 0) return null

        const bottleneckTask = project.tasks.reduce((selected, task) => {
          const selectedIsHigh = selected.priority === TaskPriority.high
          const taskIsHigh = task.priority === TaskPriority.high
          const selectedIsStuck =
            selected.status === TaskStatus.in_review &&
            selected.updatedAt <= THREE_DAYS_AGO
          const taskIsStuck =
            task.status === TaskStatus.in_review &&
            task.updatedAt <= THREE_DAYS_AGO

          const selectedTaskScore =
            (selectedIsHigh ? HIGH_PRIORITY_WEIGHT : 0) +
            (selectedIsStuck ? STUCK_IN_REVIEW_WEIGHT : 0)
          const taskScore =
            (taskIsHigh ? HIGH_PRIORITY_WEIGHT : 0) +
            (taskIsStuck ? STUCK_IN_REVIEW_WEIGHT : 0)

          if (taskScore === selectedTaskScore) {
            return task.updatedAt < selected.updatedAt ? task : selected
          }

          return taskScore > selectedTaskScore ? task : selected
        })

        const isStuckInReview =
          bottleneckTask.status === TaskStatus.in_review &&
          bottleneckTask.updatedAt <= THREE_DAYS_AGO

        return {
          id: bottleneckTask.id,
          title: bottleneckTask.title,
          priority: bottleneckTask.priority,
          projectId: projectFocus.projectId,
          daysInReview: isStuckInReview
            ? Math.ceil(
                (Date.now() - bottleneckTask.updatedAt.getTime()) / 86400000
              )
            : 0,
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
