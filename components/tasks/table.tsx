"use client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { BoardTask } from "@/lib/definitions"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Priority } from "./task-items"
import TaskActions from "./tasks-action"

type Props = {
    projectId: string
    tasks: BoardTask[]
}

export default function IssuesTable({ projectId, tasks }: Props) {
    if (tasks.length === 0) {
        return (
            <div className="flex h-[calc(100vh-11rem)] items-center justify-center">
                <p className="text-sm text-muted-foreground">
                    No issues found.
                </p>
            </div>
        )
    }

    return (
        <div className="w-full rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="pl-4">Title</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Assignee</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell className="pl-4 font-medium">
                                {task.title}
                            </TableCell>
                            <TableCell className="capitalize">
                                {task.type}
                            </TableCell>
                            <TableCell className="capitalize">
                                {task.status.replace(/_/g, " ").toLowerCase()}
                            </TableCell>
                            <TableCell>
                                <Priority taskPriority={task.priority} />
                            </TableCell>
                            <TableCell className="flex items-center gap-2">
                                <Avatar size="sm">
                                    <AvatarImage
                                        src={`/${task.user.avatar}`}
                                        alt={task.user.name}
                                    />
                                    <AvatarFallback>
                                        {task.user.name
                                            .split(" ")
                                            .map((name) => name[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                {task.user.name ?? "Unassigned"}
                            </TableCell>
                            <TableCell>
                                <TaskActions
                                    projectId={projectId}
                                    task={task}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
