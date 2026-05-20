"use client"
import { BoardTask } from "@/lib/definitions"
import UserChip from "../user-chip"
import { TaskAction } from "./task-action"
import { TaskPriority, TaskType, TaskStatus } from "./task-items"

export default function TaskListCard({ task }: { task: BoardTask }) {
  return (
    <div className="relative grid grid-cols-1 items-center gap-3 rounded-lg bg-sidebar p-3 ring-1 ring-border lg:grid-cols-7 lg:rounded-none lg:py-1 lg:last:rounded-b-lg">
      <div className="col-span-2 pl-1">
        <span className="text-sm font-medium">{task.title}</span>
        <div className="text-xs text-muted-foreground">{task.description}</div>
      </div>

      <div>
        <TaskType taskType={task.type} />
      </div>
      <div className="text-sm">
        <TaskPriority taskPriority={task.priority} />
      </div>
      <div className="text-sm">
        <TaskStatus taskStatus={task.status} />
      </div>

      <UserChip name={task.user.name} avatar={task.user.avatar} />

      <div className="absolute top-2 right-2 lg:top-1/2 lg:right-3 lg:translate-y-[-50%]">
        <TaskAction task={task} />
      </div>
    </div>
  )
}
