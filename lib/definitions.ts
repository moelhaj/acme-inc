import {
    TaskStatus,
    TaskPriority,
    TaskType,
    Task,
    User,
    Project,
} from "@/prisma/generated/prisma/client"

export type { TaskType, TaskStatus, TaskPriority, Task, User, Project }

export const Priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
] satisfies Array<{ value: TaskPriority; label: string }>

export const Types = [
    { value: "feature", label: "Feature" },
    { value: "bug", label: "Bug" },
    { value: "improvement", label: "Improvement" },
] satisfies Array<{ value: TaskType; label: string }>

export type BoardTask = Task & {
    user: {
        name: string
        avatar: string
    }
    project: {
        title: string
    }
}

export type Column = {
    id: string
    title: string
}

export type State = {
    message?: string | null
    status: string
}
