"use client"
import { fetchProjects } from "@/actions/project"
import Link from "next/link"
import Avatars from "../avatars"
import DateChip from "../date-chip"
import { ProjectAction } from "./project-actions"

export default function ProjectCard({
  project,
}: {
  project: Awaited<ReturnType<typeof fetchProjects>>[number]
}) {
  return (
    <div className="relative grid grid-cols-1 gap-3 rounded-lg bg-sidebar p-3 ring-1 ring-border">
      <div>
        <Link
          className="text-sm font-medium hover:underline"
          href={`/tasks/${project.id}`}
        >
          {project.title}
        </Link>
        <div className="text-xs text-muted-foreground">
          {project.description}
        </div>
      </div>

      <div className="absolute top-1 right-1">
        <ProjectAction project={project} />
      </div>

      <Avatars members={project.members} />
      <DateChip date={project.dueDate} />
    </div>
  )
}
