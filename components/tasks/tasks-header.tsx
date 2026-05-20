import { Input } from "@/components/ui/input"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { TaskPriorities, TaskTypes, TaskStatuses } from "@/lib/definitions"
import {
  Add01Icon,
  AppleReminderIcon,
  Cancel01Icon,
  KanbanIcon,
  Search02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRef, useState } from "react"
import { DataTableFilter } from "../form/data-table-filter"
import { Button } from "../ui/button"
import TaskForm from "./task-form"

type TasksHeaderProps = {
  view: "board" | "table"
  setView: (view: "board" | "table") => void
  searchTasks: (term: string) => void
  filterTasks: (term: string, type: string) => void
  projectId: string
}

export default function TasksHeader({
  view,
  setView,
  searchTasks,
  filterTasks,
  projectId,
}: TasksHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [openCreateModal, setOpenCreateModal] = useState(false)

  function handleClearInput() {
    searchTasks("")
    if (inputRef.current) {
      inputRef.current.value = ""
      inputRef.current.focus()
    }
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative w-full max-w-42 md:max-w-60">
        <Input
          id="search-input"
          ref={inputRef}
          className="peer h-8 rounded-lg ps-9 pe-12"
          placeholder="Search..."
          type="search"
          onChange={(e) => {
            searchTasks(e.target.value)
          }}
        />
        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-muted-foreground/80 peer-disabled:opacity-50">
          <HugeiconsIcon icon={Search02Icon} strokeWidth={2} size={15} />
        </div>
        {inputRef.current?.value && (
          <button
            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-muted-foreground/80 transition-[color,box-shadow] outline-none hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Clear input"
            onClick={handleClearInput}
          >
            <HugeiconsIcon icon={Cancel01Icon} strokeWidth={2} size={15} />
          </button>
        )}
      </div>
      <DataTableFilter title="Type" options={TaskTypes} action={filterTasks} />
      <DataTableFilter
        title="Priority"
        options={TaskPriorities}
        action={filterTasks}
      />
      <DataTableFilter
        title="Status"
        options={TaskStatuses}
        action={filterTasks}
      />
      <div className="hidden items-center xl:flex">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={view === "board" ? "secondary" : "ghost"}
              onClick={() => setView("board")}
            >
              <HugeiconsIcon
                icon={KanbanIcon}
                size={24}
                color={view === "board" ? "var(--slate1)" : "currentColor"}
                strokeWidth={2}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="rounded-sm bg-muted-foreground/90 px-1.5 py-0.5 text-[10px] text-white">
            <p>Board</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={view === "table" ? "secondary" : "ghost"}
              onClick={() => setView("table")}
            >
              <HugeiconsIcon
                icon={AppleReminderIcon}
                size={24}
                color={view === "table" ? "var(--slate1)" : "currentColor"}
                strokeWidth={2}
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="rounded-sm bg-muted-foreground/90 px-1.5 py-0.5 text-[10px] text-white">
            <p>Table</p>
          </TooltipContent>
        </Tooltip>
      </div>
      <div className="flex-1" />
      <Button onClick={() => setOpenCreateModal(true)}>
        <HugeiconsIcon
          icon={Add01Icon}
          size={24}
          color="currentColor"
          strokeWidth={1.5}
        />
        <span className="hidden md:inline">New Task</span>
      </Button>
      <TaskForm
        projectId={projectId}
        open={openCreateModal}
        setOpen={setOpenCreateModal}
      />
    </div>
  )
}
