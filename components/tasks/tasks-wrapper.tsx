"use client"
import { BoardTask } from "@/lib/definitions"
import { Activity, useMemo, useState } from "react"
import TasksHeader from "./tasks-header"
import TasksList from "./tasks-list"
import AppItem from "../app-item"
import TasksKanban from "./tasks-kanban"

type TaskFilters = {
  priority: string[]
  type: string[]
  status: string[]
}

function applyTaskFilters(
  tasks: BoardTask[],
  searchTerm: string,
  filters: TaskFilters
) {
  const normalizedSearch = searchTerm.trim().toLowerCase()

  return tasks.filter((task) => {
    const matchesSearch =
      normalizedSearch === "" ||
      task.title.toLowerCase().includes(normalizedSearch)

    const matchesPriority =
      filters.priority.length === 0 || filters.priority.includes(task.priority)

    const matchesType =
      filters.type.length === 0 || filters.type.includes(task.type)

    const matchesStatus =
      filters.status.length === 0 || filters.status.includes(task.status)

    return matchesSearch && matchesPriority && matchesType && matchesStatus
  })
}

export default function TasksWrapper({
  tasks: initialTasks,
  projectId,
}: {
  tasks: BoardTask[]
  projectId: string
}) {
  const [view, setView] = useState<"board" | "table">("board")
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<TaskFilters>({
    priority: [],
    type: [],
    status: [],
  })

  const tasks = useMemo(
    () => applyTaskFilters(initialTasks, searchTerm, filters),
    [initialTasks, searchTerm, filters]
  )

  function searchTasks(term: string) {
    setSearchTerm(term)
  }

  function filterTasks(term: string, type: string) {
    if (type !== "priority" && type !== "type" && type !== "status") {
      return
    }

    setFilters((currentFilters) => ({
      ...currentFilters,
      [type]: term === "" ? [] : term.split(","),
    }))
  }

  return (
    <div className="w-full space-y-3 p-3">
      <TasksHeader
        view={view}
        setView={setView}
        searchTasks={searchTasks}
        filterTasks={filterTasks}
        projectId={projectId}
      />
      <AppItem
        emptyTitle="No tasks found"
        emptyLabel="task"
        hide={tasks.length <= 0}
        show={tasks.length > 0}
      >
        <div className="flex w-full flex-1 xl:hidden">
          <TasksList tasks={tasks} />
        </div>
        <Activity mode={view === "table" ? "visible" : "hidden"}>
          <div className="hidden w-full flex-1 xl:flex">
            <TasksList tasks={tasks} />
          </div>
        </Activity>
        <Activity mode={view === "board" ? "visible" : "hidden"}>
          <div className="hidden flex-1 xl:flex">
            <TasksKanban tasks={tasks} projectId={projectId} />
          </div>
        </Activity>
      </AppItem>
    </div>
  )
}
