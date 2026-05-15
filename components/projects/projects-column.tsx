"use client"
import Avatars from "@/components/avatars"
import DateChip from "@/components/date-chip"
import type { ProjectWithMembers } from "@/lib/definitions"
import { type ColumnDef } from "@tanstack/react-table"
import { ProjectAction } from "./project-actions"
import Link from "next/link"

export const columns: ColumnDef<ProjectWithMembers>[] = [
  {
    accessorKey: "title",
    header: () => <span className="pl-2">Title</span>,
    cell: ({ row }) => (
      <div className="flex flex-col pl-2">
        <Link
          className="font-medium hover:underline"
          href={`/tasks/${row.original.id}`}
        >
          {row.original.title}
        </Link>
        <span className="text-xs text-muted-foreground">
          {row.original.description}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "members",
    header: "Members",
    cell: ({ row }) => <Avatars members={row.original.members} />,
  },
  {
    accessorKey: "dueDate",
    header: "Due date",
    cell: ({ row }) => <DateChip date={row.original.dueDate} />,
  },
  {
    id: "actions",
    cell: ({ row }) => <ProjectAction project={row.original} />,
  },
]
