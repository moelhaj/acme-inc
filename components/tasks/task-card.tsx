"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { BoardTask } from "@/lib/definitions"
import { cn, userInitials } from "@/lib/utils"
import { Fragment, useState } from "react"
import TaskForm from "./task-form"
import { TaskPriority, TaskType } from "./task-items"
import { TaskAction } from "./task-action"

type TaskCardProps = {
  task: BoardTask
  setDraggedOverTask: React.Dispatch<React.SetStateAction<BoardTask | null>>
}

export default function TaskCard({ task, setDraggedOverTask }: TaskCardProps) {
  const [openUpdateSheet, setOpenUpdateSheet] = useState(false)
  const [isDraggingOver, setIsDraggingOver] = useState(false)

  function handleDragStart(event: React.DragEvent<HTMLDivElement>) {
    event.dataTransfer.setData("activeTaskId", task.id)
  }

  function handleDragOVer(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault()
    setDraggedOverTask(task)
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
    setIsDraggingOver(false)
  }

  return (
    <Fragment>
      <Card
        draggable
        onDragStart={handleDragStart}
        onDragOver={handleDragOVer}
        onDragLeave={handleDragLeave}
        onDragEnd={handleDragEnd}
        onDrop={handleDrop}
        className={cn(
          "w-full translate-x-0 translate-y-0 cursor-grab opacity-100 active:cursor-grabbing",
          isDraggingOver && "opacity-50"
        )}
      >
        <CardHeader>
          <div>
            <TaskPriority taskPriority={task.priority} />
          </div>
          <CardTitle className="mt-2 text-sm">{task.title}</CardTitle>
          <CardDescription className="text-xs">
            {task.description}
          </CardDescription>
          <CardAction className="-mt-2 -mr-2">
            <TaskAction task={task} />
          </CardAction>
        </CardHeader>
        <CardFooter className="flex items-center justify-between bg-card py-2">
          {task.user.name && task.user.avatar && (
            <div className="flex items-center gap-2">
              <Avatar className="flex h-8 w-8 items-center justify-center">
                <AvatarImage
                  src={`/${task.user.avatar}`}
                  alt={task.user.name}
                  className="h-6 w-6 rounded-full object-contain"
                />
                <AvatarFallback>{userInitials(task.user.name)}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-medium">{task.user.name}</span>
            </div>
          )}
          <TaskType taskType={task.type} />
        </CardFooter>
      </Card>
      <TaskForm
        open={openUpdateSheet}
        setOpen={setOpenUpdateSheet}
        task={task}
        projectId={task.projectId}
      />
    </Fragment>
  )
}
