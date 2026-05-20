"use client"
import { ProjectWithMembers } from "@/lib/definitions"
import Link from "next/link"
import Avatars from "../avatars"
import DateChip from "../date-chip"
import { ProjectAction } from "./project-actions"

export default function ProjectCard({
  project,
}: {
  project: ProjectWithMembers
}) {
  return (
    <div className="relative grid grid-cols-1 gap-3 rounded-lg bg-sidebar p-3 ring-1 ring-border lg:grid-cols-3 lg:rounded-none lg:py-1 lg:last:rounded-b-lg">
      <div>
        <Link
          className="text-sm font-medium select-none hover:underline"
          href={`/tasks/${project.id}`}
        >
          {project.title}
        </Link>
        <div className="text-xs text-muted-foreground">
          {project.description}
        </div>
      </div>

      <div className="absolute top-2 right-2 lg:top-1/2 lg:right-3 lg:translate-y-[-50%]">
        <ProjectAction project={project} />
      </div>

      <Avatars members={project.members} />
      <DateChip date={project.dueDate} />
    </div>
  )
}
