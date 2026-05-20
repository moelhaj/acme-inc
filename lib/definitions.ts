import {
  TaskStatus,
  TaskPriority,
  TaskType,
  Task,
  User,
  Project,
} from "@/prisma/generated/prisma/client"

export type { TaskType, TaskStatus, TaskPriority, Task, User, Project }
export type ProjectWithMembers = Project & {
  members: User[]
}

export const TaskPriorities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
] satisfies Array<{ value: TaskPriority; label: string }>

export const TaskTypes = [
  { value: "feature", label: "Feature" },
  { value: "bug", label: "Bug" },
  { value: "improvement", label: "Improvement" },
] satisfies Array<{ value: TaskType; label: string }>

export const TaskStatuses = [
  { value: "todo", label: "To Do" },
  { value: "in_progress", label: "In Progress" },
  { value: "in_review", label: "In Review" },
  { value: "done", label: "Done" },
] satisfies Array<{ value: TaskStatus; label: string }>

export type BoardTask = Task & {
  user: {
    name: string
    avatar: string
    title: string
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
