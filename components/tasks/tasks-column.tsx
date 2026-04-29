"use client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BoardTask, Column } from "@/lib/definitions"
import { TaskStatus } from "@/prisma/generated/prisma/client"
import { cn } from "@/lib/utils"
import { useState } from "react"
import TaskCard from "./task-card"

export default function TasksColumn({
    column,
    tasks,
    updateTask,
}: {
    column: Column
    tasks: BoardTask[]
    updateTask: (
        taskId: string,
        newStatus: TaskStatus,
        newPosition: number
    ) => void
}) {
    const [isDraggingOver, setIsDraggingOver] = useState(false)
    const [draggedOverTask, setDraggedOverTask] = useState<BoardTask | null>(
        null
    )

    function handleDragOver(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()
        setIsDraggingOver(true)
    }

    function handleDragLeave(event: React.DragEvent<HTMLDivElement>) {
        setIsDraggingOver(false)
    }

    function handleDragEnd(event: React.DragEvent<HTMLDivElement>) {
        setIsDraggingOver(false)
    }

    function handleDrop(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()
        const taskId = event.dataTransfer.getData("activeTaskId")
        const activeTask = tasks.find((task) => task.id === taskId)
        if (
            !activeTask ||
            (activeTask.status === column.id &&
                activeTask.id === draggedOverTask?.id)
        ) {
            return
        }

        updateTask(
            taskId,
            column.id as TaskStatus,
            draggedOverTask?.position || 0
        )
        setIsDraggingOver(false)
    }

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            className="flex flex-col overflow-hidden"
        >
            <div
                className={cn(
                    "mx-1.5 mt-1 flex items-center gap-2 rounded-lg border bg-card p-2 text-sm text-xs font-semibold ring-ring/50 ring-offset-2 ring-offset-background duration-300",
                    isDraggingOver && "ring-2"
                )}
            >
                <span className="rounded-sm bg-muted px-2 py-0.5">
                    {tasks.filter((task) => task.status === column.id).length}
                </span>
                <h2>{column.title}</h2>
            </div>
            <ScrollArea className="h-[calc(100svh-6.5rem)]">
                <div className="mx-1.5 flex flex-col gap-3 pt-3 pb-2">
                    {tasks
                        .filter((task) => task.status === column.id)
                        .map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                setDraggedOverTask={setDraggedOverTask}
                            />
                        ))}
                </div>
            </ScrollArea>
        </div>
    )
}
