"use client"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { BoardTask } from "@/lib/definitions"

const columns = [
  {
    id: "todo",
    name: "To Do",
  },
  {
    id: "in_progress",
    name: "In Progress",
  },
  {
    id: "in_review",
    name: "In Review",
  },
  {
    id: "done",
    name: "Done",
  },
]

export default function TasksKanban({ tasks }: { tasks: BoardTask[] }) {
  const [data, setData] = useState(
    tasks
      .map((task) => ({
        id: task.id,
        name: task.title,
        column: task.status,
        description: task.description,
        status: task.status,
        priority: task.priority,
        type: task.type,
        position: task.position,
        projectId: task.projectId,
        userId: task.userId,
      }))
      .sort((a, b) => a.position - b.position)
  )

  function handleOnDrop(
    cardId: string,
    sourceColumnId: string,
    destinationColumnId: string
  ) {
    console.log(
      `Card ${cardId} moved from ${sourceColumnId} to ${destinationColumnId}`
    )
  }

  return <div>Kanban</div>
}
