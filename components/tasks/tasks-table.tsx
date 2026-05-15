import { BoardTask } from "@/lib/definitions"
import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "../table/data-table"
import { TaskAction } from "./task-action"
import UserChip from "../user-chip"

export const columns: ColumnDef<BoardTask>[] = [
  {
    accessorKey: "title",
    header: () => <span className="pl-2">Title</span>,
    cell: ({ row }) => (
      <div className="flex flex-col pl-2">
        <span className="font-medium">{row.original.title}</span>
        <span className="text-xs text-muted-foreground">
          {row.original.description}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => (
      <span className="capitalize">
        {row.original.priority.replace(/_/g, " ")}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span className="capitalize">
        {row.original.status.replace(/_/g, " ")}
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className="capitalize">{row.original.type.replace(/_/g, " ")}</span>
    ),
  },
  {
    accessorKey: "assignee",
    header: "Assignee",
    cell: ({ row }) => (
      <UserChip
        name={row.original.user.name}
        avatar={row.original.user.avatar}
      />
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <TaskAction task={row.original} />,
  },
]

export default function TasksTable({ tasks }: { tasks: BoardTask[] }) {
  return <DataTable columns={columns} data={tasks} />
}
