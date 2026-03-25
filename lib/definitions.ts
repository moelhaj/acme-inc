import { Task } from "./generated/prisma/client"

export const Statuses = [
    { value: "todo", label: "To Do" },
    { value: "in_progress", label: "In Progress" },
    { value: "in_review", label: "In Review" },
    { value: "done", label: "Done" },
]

export const Priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
]

export const Types = [
    { value: "feature", label: "Feature" },
    { value: "bug", label: "Bug" },
    { value: "improvement", label: "Improvement" },
]

export type TaskStatus = (typeof Statuses)[number]["value"]

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

export type Snapshot = {
    tasks: {
        open: number
        inReview: number
        highOpen: number
    }
    stuck: Array<{
        id: string
        title: string
        days: number
        priority: string
        projectId: string
    }>
    workload: Array<{
        userId: string
        name: string
        avatar: string
        active: number
        high: number
        score: number
    }>
    overloaded: Array<{
        userId: string
        name: string
        score: number
        ratioVsAvg: number
    }>
}
