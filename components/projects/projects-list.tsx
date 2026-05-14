"use client"
import Empty from "@/components/empty"
import { ProjectWithMembers } from "@/lib/definitions"
import { Blockchain04Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { Activity } from "react"
import ProjectCard from "./project-card"
import ProjectsHeader from "./projects-header"
import Pagination from "./projects-pagination"
import AppItem from "@/components/app-item"

export default function ProjectsList({
  projects,
  totalPages,
}: {
  projects: ProjectWithMembers[]
  totalPages: number
}) {
  return (
    <div className="flex flex-1 flex-col gap-3">
      <ProjectsHeader />
      <AppItem
        emptyTitle="No projects found"
        emptyLabel="project"
        hide={projects.length <= 0}
        show={projects.length > 0}
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
        <Pagination totalPages={totalPages} />
      </AppItem>
    </div>
  )
}
