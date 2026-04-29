import { getTasks } from "@/actions/task"
import {
    TaskPriority,
    TaskStatus,
    TaskType,
} from "@/prisma/generated/prisma/client"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import TasksBoard from "@/components/tasks/tasks-board"
import { toArray } from "@/lib/utils"

export default async function Project(props: {
    params: Promise<{ id: string }>
    searchParams?: Promise<{
        query?: string
        status?: string | string[]
        priority?: string | string[]
        type?: string | string[]
    }>
}) {
    const params = await props.params
    const searchParams = await props.searchParams

    const query = searchParams?.query ?? ""
    const status = toArray<TaskStatus>(searchParams?.status)
    const priority = toArray<TaskPriority>(searchParams?.priority)
    const type = toArray<TaskType>(searchParams?.type)

    const tasks = await getTasks(params.id, query, status, priority, type)

    if (!tasks) {
        notFound()
    }

    return (
        <Suspense
            key={`${query}-${status.join(",")}-${priority.join(",")}-${type.join(",")}`}
        >
            <TasksBoard tasks={tasks} projectId={params.id} />
        </Suspense>
    )
}
