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
import { Fragment } from "react"
import { ScrollArea } from "../ui/scroll-area"

type Props = {
    projectId: string
    tasks: BoardTask[]
}

export default function TasksLists({ projectId, tasks }: Props) {
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
        <div className="h-[calc(100svh-8rem)] overflow-y-hidden">
            <ScrollArea className="h-[calc(100svh-8rem)] w-full p-3 pb-0">
                <div className="flex flex-col gap-3">
                    {tasks.filter((task) => task.status === "todo").length >
                        0 && (
                        <ListItem
                            heading="To Do"
                            tasks={tasks.filter(
                                (task) => task.status === "todo"
                            )}
                            projectId={projectId}
                        />
                    )}
                    {tasks.filter((task) => task.status === "in_progress")
                        .length > 0 && (
                        <ListItem
                            heading="In Progress"
                            tasks={tasks.filter(
                                (task) => task.status === "in_progress"
                            )}
                            projectId={projectId}
                        />
                    )}
                    {tasks.filter((task) => task.status === "in_review")
                        .length > 0 && (
                        <ListItem
                            heading="In Review"
                            tasks={tasks.filter(
                                (task) => task.status === "in_review"
                            )}
                            projectId={projectId}
                        />
                    )}
                    {tasks.filter((task) => task.status === "done").length >
                        0 && (
                        <ListItem
                            heading="Done"
                            tasks={tasks.filter(
                                (task) => task.status === "done"
                            )}
                            projectId={projectId}
                        />
                    )}
                </div>
            </ScrollArea>
        </div>
    )
}

function ListItem({
    heading,
    tasks,
    projectId,
}: {
    heading: string
    tasks: BoardTask[]
    projectId: string
}) {
    return (
        <Fragment>
            <div className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-xs font-medium">
                <span className="rounded-sm bg-foreground/20 px-2 py-0.5">
                    {tasks.length}
                </span>
                {heading}
            </div>
            <Table>
                <TableHeader>
                    <TableRow className="text-xs text-muted-foreground">
                        <TableHead className="pl-4">Title</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Assignee</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="">
                    {tasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell className="pl-4 font-medium">
                                {task.title}
                            </TableCell>
                            <TableCell className="w-48 truncate">
                                {task.description.slice(0, 50)}
                                {task.description.length > 50 && "..."}
                            </TableCell>
                            <TableCell>
                                <Priority taskPriority={task.priority} />
                            </TableCell>
                            <TableCell className="capitalize">
                                {task.type}
                            </TableCell>
                            <TableCell className="flex items-center gap-2">
                                <Avatar className="flex h-8 w-8 items-center justify-center">
                                    <AvatarImage
                                        src={`/${task.user.avatar}`}
                                        alt={task.user.name}
                                        className="h-6 w-6 rounded-full object-contain"
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
        </Fragment>
    )
}
