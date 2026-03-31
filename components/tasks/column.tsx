"use client"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BoardTask, Column } from "@/lib/definitions"
import { TaskStatus } from "@/lib/generated/prisma/client"
import { cn } from "@/lib/utils"
import { useState } from "react"
import KanbanCard from "./card"

export default function KanbanColumn({
    column,
    tasks,
    updateTask,
}: {
    column: Column
    tasks: BoardTask[]
    updateTask: (taskId: string, newStatus: TaskStatus) => void
}) {
    const [isDraggingOver, setIsDraggingOver] = useState(false)

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
        const taskId = event.dataTransfer.getData("text/plain")
        const activeTask = tasks.find((task) => task.id === taskId)
        if (!activeTask || activeTask.status === column.id) return

        updateTask(taskId, column.id as TaskStatus)
        setIsDraggingOver(false)
    }

    return (
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDragEnd={handleDragEnd}
            onDrop={handleDrop}
            className="flex h-[calc(100svh-6.9rem)] flex-col gap-2 overflow-hidden"
        >
            <div
                className={cn(
                    "mx-3 mt-1 flex items-center gap-2 rounded-lg border bg-card p-2 text-sm text-xs font-semibold ring-primary/30 ring-offset-2 ring-offset-background duration-300",
                    isDraggingOver && "ring-2"
                )}
            >
                <span className="rounded-md bg-muted px-2 py-1">
                    {tasks.filter((task) => task.status === column.id).length}
                </span>
                <h2>{column.title}</h2>
            </div>
            <ScrollArea className="h-[calc(100svh-6.9rem)]">
                <div className="mx-3 my-1 flex flex-col gap-2 pb-14">
                    {tasks
                        .filter((task) => task.status === column.id)
                        .map((task) => (
                            <KanbanCard key={task.id} task={task} />
                        ))}
                </div>
            </ScrollArea>
        </div>
    )
}
