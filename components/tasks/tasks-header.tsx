import { Input } from "@/components/ui/input"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  AppleReminderIcon,
  Cancel01Icon,
  KanbanIcon,
  Search02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { useRef } from "react"

type TasksHeaderProps = {
  view: "board" | "table"
  setView: (view: "board" | "table") => void
  searchTasks: (term: string) => void
}

export default function TasksHeader({
  view,
  setView,
  searchTasks,
}: TasksHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null)

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
      <div className="hidden items-center gap-4 xl:flex">
        <ToggleGroup
          variant="outline"
          type="single"
          defaultValue={view}
          onValueChange={(value) => setView(value as "board" | "table")}
        >
          <ToggleGroupItem value="board" aria-label="Toggle board view">
            <HugeiconsIcon
              icon={KanbanIcon}
              size={24}
              color="currentColor"
              strokeWidth={2}
            />
            <span className="text-sm font-normal">Kanban</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="table" aria-label="Toggle table view">
            <HugeiconsIcon
              icon={AppleReminderIcon}
              size={24}
              color="currentColor"
              strokeWidth={2}
            />
            <span className="text-sm font-normal">Table</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex-1" />
    </div>
  )
}
