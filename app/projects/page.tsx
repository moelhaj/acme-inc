import { fetchProjects } from "@/actions/project"
import ProjectsList from "@/components/projects/projects-list"
import { ProjectsSkeleton } from "@/components/skeletons"
import { Suspense } from "react"

export default async function ProjectsPage(props: {
  searchParams?: Promise<{
    query?: string
    page?: string
  }>
}) {
  const searchParams = await props.searchParams
  const query = searchParams?.query || ""
  const page = parseInt(searchParams?.page || "1", 10)
  const { projects, totalPages } = await fetchProjects(query, page)

  return (
    <div className="w-full p-3">
      <Suspense key={query + page} fallback={<ProjectsSkeleton />}>
        <ProjectsList projects={projects} totalPages={totalPages} />
      </Suspense>
    </div>
  )
}
