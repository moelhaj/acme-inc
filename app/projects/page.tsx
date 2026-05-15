import { getProjects } from "@/actions/project"
import { columns } from "@/components/projects/projects-column"
import ProjectsHeader from "@/components/projects/projects-header"
import { ProjectsSkeleton } from "@/components/skeletons"
import { DataTable } from "@/components/table/data-table"
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
  const { projects, totalPages } = await getProjects(query, page)

  return (
    <Suspense key={query + page} fallback={<ProjectsSkeleton />}>
      <div className="space-y-3 p-3">
        <ProjectsHeader />
        <DataTable columns={columns} data={projects} totalPages={totalPages} />
      </div>
    </Suspense>
  )
}
