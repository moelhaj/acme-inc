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
import { Priority, Type } from "./task-items"

export default function KanbanCard({ task }: { task: BoardTask }) {
    function handleDragStart(event: React.DragEvent<HTMLDivElement>) {
        event.dataTransfer.setData("text/plain", task.id)
    }

    return (
        <Card
            draggable
            onDragStart={handleDragStart}
            className="w-full translate-x-0 translate-y-0 cursor-grab active:cursor-grabbing"
        >
            <CardHeader>
                <div>
                    <Priority taskPriority={task.priority} />
                </div>
                <CardTitle className="mt-2">{task.title}</CardTitle>
                <CardDescription>{task.description}</CardDescription>
            </CardHeader>
            <CardFooter className="flex items-center justify-between bg-card py-2">
                {task.user.name && task.user.avatar && (
                    <div className="flex items-center gap-2">
                        <Avatar size="sm" className="border-0">
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
                        <span className="text-xs">{task.user.name}</span>
                    </div>
                )}
                <span className="ml-2 rounded-md bg-muted px-2 py-1 text-xs capitalize">
                    {task.type.replace(/_/g, " ").toLowerCase()}
                </span>
            </CardFooter>
        </Card>
    )
}
