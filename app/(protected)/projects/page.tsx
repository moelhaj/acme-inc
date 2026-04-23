import { fetchProjects } from "@/actions/project"
import ProjectsList from "@/components/projects/projects-list"
import { ProjectsSkeleton } from "@/components/skeletons"
import { Suspense } from "react"

export default async function ProjectsPage(props: {
    searchParams?: Promise<{
        query?: string
    }>
}) {
    const searchParams = await props.searchParams
    const query = searchParams?.query || ""
    const projects = await fetchProjects(query)

    return (
        <div className="w-full p-3">
            <Suspense key={query} fallback={<ProjectsSkeleton />}>
                <ProjectsList projects={projects} />
            </Suspense>
        </div>
    )
}
