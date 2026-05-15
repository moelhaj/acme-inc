import { getTasks } from "@/actions/task"
import TasksWrapper from "@/components/tasks/tasks-wrapper"
import { notFound } from "next/navigation"
import { Suspense } from "react"

export default async function Project(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params

  const tasks = await getTasks(params.id)

  if (!tasks) {
    notFound()
  }

  return (
    <Suspense>
      <TasksWrapper tasks={tasks} projectId={params.id} />
    </Suspense>
  )
}
