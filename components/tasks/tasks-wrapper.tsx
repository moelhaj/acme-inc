"use client"
import { BoardTask } from "@/lib/definitions"
import { Activity, useState } from "react"
import TasksHeader from "./tasks-header"
import TasksTable from "./tasks-table"
import AppItem from "../app-item"

export default function TasksWrapper({
  tasks: initialTasks,
  projectId,
}: {
  tasks: BoardTask[]
  projectId: string
}) {
  const [tasks, setTasks] = useState<BoardTask[]>(initialTasks)
  const [view, setView] = useState<"board" | "table">("board")

  function searchTasks(term: string) {
    setTasks(
      initialTasks.filter((task) =>
        task.title.toLowerCase().includes(term.toLowerCase())
      )
    )
  }

  return (
    <div className="space-y-3 p-3">
      <TasksHeader view={view} setView={setView} searchTasks={searchTasks} />
      <AppItem
        emptyTitle="No tasks found"
        emptyLabel="task"
        hide={tasks.length <= 0}
        show={tasks.length > 0}
      >
        <div className="flex w-full flex-1 xl:hidden">
          <TasksTable tasks={tasks} />
        </div>
        <Activity mode={view === "table" ? "visible" : "hidden"}>
          <div className="hidden w-full flex-1 xl:flex">
            <TasksTable tasks={tasks} />
          </div>
        </Activity>
        <Activity mode={view === "board" ? "visible" : "hidden"}>
          <div className="hidden flex-1 xl:flex">board view</div>
        </Activity>
      </AppItem>
    </div>
  )
}
