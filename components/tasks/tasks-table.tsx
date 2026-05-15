import { BoardTask } from "@/lib/definitions"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import UserChip from "../user-chip"
import { TaskType, TaskPriority } from "../tasks2/task-items"

export default function TasksTable({ tasks }: { tasks: BoardTask[] }) {
  const todoTasks = tasks.filter((task) => task.status === "todo")
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress")
  const inReviewTasks = tasks.filter((task) => task.status === "in_review")
  const doneTasks = tasks.filter((task) => task.status === "done")

  return (
    <div className="w-full space-y-6 text-sm">
      {todoTasks.length > 0 && <TaskRow title="To do" tasks={todoTasks} />}
      {inProgressTasks.length > 0 && (
        <TaskRow title="In progress" tasks={inProgressTasks} />
      )}
      {inReviewTasks.length > 0 && (
        <TaskRow title="In review" tasks={inReviewTasks} />
      )}
      {doneTasks.length > 0 && <TaskRow title="Done" tasks={doneTasks} />}
    </div>
  )
}

function TaskRow({ tasks, title }: { title: string; tasks: BoardTask[] }) {
  console.log("Rendering TaskRow for", title, "with tasks:", tasks)
  return (
    <div className="w-full">
      <div className="flex items-center gap-4 rounded-t-lg border border-b-0 bg-muted/50 px-4 py-2">
        <h3 className="font-semibold">{title}</h3>
        <div className="rounded-md bg-background px-2.5 py-1 text-xs font-medium">
          {tasks.length}
        </div>
      </div>
      <div className="rounded-b-lg border">
        <Table>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="w-1/3 font-medium">
                  <span className="pl-2">{task.title}</span>
                </TableCell>
                <TableCell className="w-1/6">
                  <TaskType taskType={task.type} />
                </TableCell>
                <TableCell className="w-1/6">
                  <TaskPriority taskPriority={task.priority} />
                </TableCell>
                <TableCell className="w-1/6">
                  <UserChip name={task.user.name} avatar={task.user.avatar} />
                </TableCell>
                <TableCell className="w-1/6 pr-3 text-right text-muted-foreground">
                  Actions
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
