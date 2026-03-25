"use client"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { EditTableIcon, KanbanIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import SearchInput from "../search-input"
import { CreateTask } from "./create-task"
import { TasksFilter } from "./task-filter"

type Props = {
    projectId: string
    view: "board" | "table"
    setView: (view: "board" | "table") => void
}

export default function KanbanHeader({ projectId, view, setView }: Props) {
    return (
        <header className="flex items-center justify-between gap-4 px-4 pt-4">
            <div className="flex items-center gap-2">
                <SearchInput />
                <TasksFilter />
            </div>
            <div className="flex items-center gap-2">
                <div className="hidden items-center gap-2 lg:flex">
                    <ButtonGroup>
                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <Button
                                        variant="outline"
                                        onClick={() => setView("board")}
                                        className={cn(
                                            view === "board"
                                                ? "bg-secondary"
                                                : "",
                                            "font-normal"
                                        )}
                                    >
                                        <HugeiconsIcon
                                            icon={KanbanIcon}
                                            strokeWidth={2}
                                        />
                                    </Button>
                                }
                            />
                            <TooltipContent className="px-2 py-1 text-xs">
                                <p>Kanban</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger
                                render={
                                    <Button
                                        variant="outline"
                                        onClick={() => setView("table")}
                                        className={cn(
                                            view === "table"
                                                ? "bg-secondary"
                                                : "",
                                            "font-normal"
                                        )}
                                    >
                                        <HugeiconsIcon
                                            icon={EditTableIcon}
                                            strokeWidth={2}
                                        />
                                    </Button>
                                }
                            />
                            <TooltipContent className="px-2 py-1 text-xs">
                                <p>Table</p>
                            </TooltipContent>
                        </Tooltip>
                    </ButtonGroup>
                </div>
                <CreateTask projectId={projectId} />
            </div>
        </header>
    )
}
