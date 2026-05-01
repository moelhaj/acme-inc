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
}) {
  const params = await props.params

  const tasks = await getTasks(params.id)

  if (!tasks) {
    notFound()
  }

  return (
    <Suspense>
      <TasksBoard tasks={tasks} projectId={params.id} />
    </Suspense>
  )
}
