"use client"
import { updateTaskStatus } from "@/actions/task"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { BoardTask, TaskStatus } from "@/lib/definitions"
import { useEffect, useState } from "react"
import KanbanColumn from "./tasks-column"

const columns = [
  {
    id: "todo",
    title: "To Do",
  },
  {
    id: "in_progress",
    title: "In Progress",
  },
  {
    id: "in_review",
    title: "In Review",
  },
  {
    id: "done",
    title: "Done",
  },
]

export default function TasksKanban({
  tasks: initialTasks,
  projectId,
}: {
  tasks: BoardTask[]
  projectId: string
}) {
  const [tasks, setTasks] = useState<BoardTask[]>(
    [...initialTasks].sort((a, b) => a.position - b.position)
  )

  useEffect(() => {
    setTasks([...initialTasks].sort((a, b) => a.position - b.position))
  }, [initialTasks])

  function updateTask(
    taskId: string,
    newStatus: TaskStatus,
    newPosition: number
  ) {
    const updated = [...tasks]
    const currentIndex = updated.findIndex((t) => t.id === taskId)
    if (currentIndex === -1) return

    const originalTargetIndex = updated.findIndex(
      (t) => t.position === newPosition
    )
    const isSameColumn = updated[currentIndex].status === newStatus
    const movingDown = isSameColumn && currentIndex < originalTargetIndex

    const [element] = updated.splice(currentIndex, 1)
    const targetIndex = updated.findIndex((t) => t.position === newPosition)
    const insertAt =
      targetIndex === -1
        ? updated.length
        : movingDown
          ? targetIndex + 1
          : targetIndex
    updated.splice(insertAt, 0, {
      ...element,
      status: newStatus,
    })

    const reordered = updated.map((task, index) => ({
      ...task,
      position: index,
    }))

    setTasks(reordered)
    void updateTaskStatus({
      projectId,
      params: reordered.map(({ id, status, position }) => ({
        id,
        status,
        position,
      })),
    })
  }

  return (
    <ScrollArea className="w-[100vw] lg:w-full">
      <div className="grid min-w-[800px] grid-cols-4">
        {columns.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={tasks.filter((task) => task.status === column.id)}
            updateTask={updateTask}
          />
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  )
}
