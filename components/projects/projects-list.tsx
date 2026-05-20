"use client"
import AppItem from "@/components/app-item"
import { ProjectWithMembers } from "@/lib/definitions"
import ProjectCard from "./project-card"
import Pagination from "./projects-pagination"

export default function ProjectsList({
  projects,
  totalPages,
}: {
  projects: ProjectWithMembers[]
  totalPages: number
}) {
  return (
    <AppItem
      emptyTitle="No projects found"
      emptyLabel="project"
      hide={projects.length <= 0}
      show={projects.length > 0}
    >
      <div>
        <div className="hidden grid-cols-3 rounded-t-lg bg-sidebar p-3 ring-1 ring-border lg:grid">
          <span className="pl-1 text-sm font-medium">Project</span>
          <span className="pl-1 text-sm font-medium">Members</span>
          <span className="pl-2 text-sm font-medium">Due date</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1 lg:gap-0">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
      <Pagination totalPages={totalPages} />
    </AppItem>
  )
}
