"use client"
import { fetchProjects } from "@/actions/project"
import Empty from "@/components/empty"
import { Blockchain04Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Activity } from "react"
import ProjectCard from "./project-card"
import ProjectsHeader from "./projects-header"

export default function ProjectsList({
    projects,
}: {
    projects: Awaited<ReturnType<typeof fetchProjects>>
}) {
    return (
        <div className="flex flex-1 flex-col gap-3">
            <ProjectsHeader />
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
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                </div>
            </Activity>
        </div>
    )
}
