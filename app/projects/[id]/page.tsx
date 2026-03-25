import { getTasks } from "@/actions/task"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import KanbanBoard from "@/components/tasks/board"
import { TasksKanbanSkeleton } from "@/components/skeleton"

export default async function Project(props: {
    params: Promise<{ id: string }>
    searchParams?: Promise<{
        query?: string
        status?: string
        priority?: string | string[]
        type?: string | string[]
    }>
}) {
    const params = await props.params
    const searchParams = await props.searchParams
    const query = searchParams?.query || ""
    const status = searchParams?.status || ""
    const priority = searchParams?.priority ?? []
    const type = searchParams?.type ?? []

    const tasks = await getTasks(
        params.id,
        query,
        status,
        Array.isArray(priority) ? priority.join(",") : priority,
        Array.isArray(type) ? type.join(",") : type
    )
    if (!tasks) {
        notFound()
    }

    return (
        <Suspense fallback={<TasksKanbanSkeleton />}>
            <KanbanBoard tasks={tasks} projectId={params.id} />
        </Suspense>
    )
}
