"use client"
import { updateTaskStatus } from "@/actions/task"
import Empty from "@/components/empty"
import { BoardTask } from "@/lib/definitions"
import { TaskStatus } from "@/prisma/generated/prisma/client"
import { TaskAdd01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Activity, startTransition, useOptimistic } from "react"
import KanbanColumn from "./tasks-column"
import TasksHeader from "./tasks-header"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

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

export default function TasksBoard({
    tasks,
    projectId,
}: {
    tasks: BoardTask[]
    projectId: string
}) {
    const [optimisticTasks, setOptimisticTasks] = useOptimistic(
        tasks.sort((a, b) => a.position - b.position),
        (
            currentTasks: BoardTask[],
            action: {
                taskId: string
                newStatus: TaskStatus
                newPosition: number
            }
        ) => {
            return currentTasks.map((task) => {
                if (task.id === action.taskId) {
                    return {
                        ...task,
                        status: action.newStatus,
                        position: action.newPosition,
                    }
                }
                return task
            })
        }
    )
    function updateTask(
        taskId: string,
        newStatus: TaskStatus,
        currentPosition: number,
        newPosition: number
    ) {
        const updated = [...tasks]
        const [element] = updated.splice(currentPosition, 1)

        updated.splice(newPosition, 0, element)

        const updatedTasks = updated.map((task, index) => {
            return {
                id: task.id,
                status: task.id === taskId ? newStatus : task.status,
                position: index,
            }
        })

        startTransition(() => {
            setOptimisticTasks({ taskId, newStatus, newPosition })
            void updateTaskStatus({ projectId, params: updatedTasks })
        })
    }

    return (
        <div className="space-y-3 overflow-hidden p-3">
            <TasksHeader projectId={projectId} />
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
                <ScrollArea className="w-[100vw] lg:w-full">
                    <div className="grid w-full grid-cols-4">
                        {columns.map((column) => (
                            <KanbanColumn
                                key={column.id}
                                column={column}
                                tasks={optimisticTasks}
                                updateTask={updateTask}
                            />
                        ))}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </Activity>
        </div>
    )
}
