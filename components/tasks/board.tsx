"use client"
import { updateTaskStatus } from "@/actions/task"
import { BoardTask } from "@/lib/definitions"
import { TaskStatus } from "@/lib/generated/prisma/client"
import { TaskAdd01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Activity, startTransition, useOptimistic, useState } from "react"
import Empty from "../empty"
import KanbanColumn from "./column"
import TasksTable from "./table"
import KanbanToolbar from "./tasks-header"
import TasksLists from "./tasks-list"

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

export default function KanbanBoard({
    tasks,
    projectId,
}: {
    tasks: BoardTask[]
    projectId: string
}) {
    const [view, setView] = useState<"board" | "table">("board")
    const [optimisticTasks, setOptimisticTasks] = useOptimistic(
        tasks,
        (
            currentTasks: BoardTask[],
            action: { taskId: string; newStatus: TaskStatus }
        ) => {
            return currentTasks.map((task) => {
                if (task.id === action.taskId) {
                    return { ...task, status: action.newStatus }
                }
                return task
            })
        }
    )
    function updateTask(taskId: string, newStatus: TaskStatus) {
        startTransition(() => {
            setOptimisticTasks({ taskId, newStatus })
            void updateTaskStatus(taskId, newStatus, projectId)
        })
    }

    return (
        <div className="h-[calc(100svh-3rem)] space-y-3 overflow-x-auto overflow-y-hidden pt-1">
            <KanbanToolbar
                projectId={projectId}
                view={view}
                setView={setView}
            />
            <Activity mode={tasks.length === 0 ? "visible" : "hidden"}>
                <Empty
                    icon={
                        <HugeiconsIcon
                            icon={TaskAdd01Icon}
                            size={36}
                            color="currentColor"
                            strokeWidth={1.5}
                        />
                    }
                    title="No tasks found"
                    description="Tip: If you didn't create any task yet, you
                                can start by creating a new task. If you
                                are searching for a specific task, try adjusting
                                your search or filter criteria."
                />
            </Activity>
            <Activity mode={tasks.length > 0 ? "visible" : "hidden"}>
                <div className="h-full w-full lg:hidden">
                    <TasksLists projectId={projectId} tasks={optimisticTasks} />
                </div>
                <div className="hidden lg:block">
                    {view === "table" && (
                        <div className="h-full w-full">
                            <TasksLists
                                projectId={projectId}
                                tasks={optimisticTasks}
                            />
                        </div>
                    )}
                    {view === "board" && (
                        <div className="grid grid-cols-4">
                            {columns.map((column) => (
                                <KanbanColumn
                                    key={column.id}
                                    column={column}
                                    tasks={optimisticTasks}
                                    updateTask={updateTask}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </Activity>
        </div>
    )
}
