"use client"
import {
    Card,
    CardAction,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Project } from "@/lib/generated/prisma/client"
import { Blockchain04Icon, Calendar03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { format } from "date-fns"
import { Activity, Fragment } from "react"
import Empty from "../empty"
import { ProjectAction } from "./project-actions"

export default function ProjectsList({ projects }: { projects: Project[] }) {
    return (
        <Fragment>
            <Activity mode={projects.length === 0 ? "visible" : "hidden"}>
                <Empty
                    icon={
                        <HugeiconsIcon
                            icon={Blockchain04Icon}
                            size={36}
                            color="currentColor"
                            strokeWidth={1.5}
                        />
                    }
                    title="No projects found"
                    description="Tip: If you didn't create any projects yet, you can start by creating a new project. If you are searching for a specific project, try adjusting your search or filter criteria."
                />
            </Activity>
            <Activity mode={projects.length > 0 ? "visible" : "hidden"}>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {projects.map((project) => (
                        <Card key={project.id}>
                            <CardHeader>
                                <CardTitle>{project.title}</CardTitle>
                                <CardDescription>
                                    {project.description}
                                </CardDescription>
                                <CardAction className="-mt-2 -mr-2">
                                    <ProjectAction project={project} />
                                </CardAction>
                            </CardHeader>
                            <CardFooter className="mt-auto flex items-center gap-1 py-3 text-xs text-muted-foreground">
                                <HugeiconsIcon
                                    icon={Calendar03Icon}
                                    size={14}
                                    color="currentColor"
                                    strokeWidth={1.5}
                                />
                                {format(
                                    new Date(project.createdAt),
                                    "dd MMM yyyy"
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </Activity>
        </Fragment>
    )
}
