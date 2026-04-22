"use client"
import { fetchProjects } from "@/actions/project"
import {
    Avatar,
    AvatarFallback,
    AvatarGroup,
    AvatarGroupCount,
    AvatarImage,
} from "@/components/ui/avatar"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { formatDueDate, userInitials } from "@/lib/utils"
import { Calendar03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import Link from "next/link"
import { ProjectAction } from "./project-actions"

export default function ProjectCard({
    project,
}: {
    project: Awaited<ReturnType<typeof fetchProjects>>[number]
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm">
                    <Link
                        className="hover:underline"
                        href={`/tasks/${project.id}`}
                    >
                        {project.title}
                    </Link>
                </CardTitle>
                <CardDescription>{project.description}</CardDescription>
                <CardAction className="-mt-2 -mr-2">
                    <ProjectAction project={project} />
                </CardAction>
            </CardHeader>
            <CardContent className="mt-auto">
                <div className="flex flex-col items-start gap-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <HugeiconsIcon
                            icon={Calendar03Icon}
                            size={14}
                            color="currentColor"
                            strokeWidth={1.5}
                        />
                        {formatDueDate(project.dueDate)}
                    </div>
                    <div className="mt-3 flex items-center gap-1 space-x-2 text-xs text-muted-foreground">
                        <AvatarGroup>
                            {project.members.slice(0, 3).map((member) => (
                                <Avatar
                                    key={member.id}
                                    className="flex h-8 w-8 items-center justify-center"
                                >
                                    <AvatarImage
                                        src={member.avatar}
                                        alt={member.name}
                                        className="h-6 w-6 object-contain"
                                    />
                                    <AvatarFallback>
                                        {userInitials(member.name)}
                                    </AvatarFallback>
                                </Avatar>
                            ))}
                            {project.members.length > 3 && (
                                <AvatarGroupCount>
                                    +{project.members.length - 3}
                                </AvatarGroupCount>
                            )}
                        </AvatarGroup>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
