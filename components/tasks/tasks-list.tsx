import { BoardTask } from "@/lib/definitions"
import AppItem from "../app-item"
import TaskListCard from "./task-list-card"

export default function TasksList({ tasks }: { tasks: BoardTask[] }) {
  return (
    <AppItem
      emptyTitle="No tasks found"
      emptyLabel="task"
      hide={tasks.length <= 0}
      show={tasks.length > 0}
    >
      <div className="w-full">
        <div className="hidden grid-cols-7 rounded-t-lg bg-sidebar p-3 ring-1 ring-border lg:grid">
          <span className="col-span-2 pl-1 text-sm font-medium">Title</span>
          <span className="pl-1 text-sm font-medium">Type</span>
          <span className="pl-1 text-sm font-medium">Priority</span>
          <span className="pl-1 text-sm font-medium">Status</span>
          <span className="pl-4 text-sm font-medium">Assignee</span>
          <span></span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:gap-0">
          {tasks.map((task) => (
            <TaskListCard key={task.id} task={task} />
          ))}
        </div>
      </div>
    </AppItem>
  )
}
