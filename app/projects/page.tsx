import { getProjects } from "@/actions/project"
import ProjectsHeader from "@/components/projects/projects-header"
import ProjectsList from "@/components/projects/projects-list"
import { ProjectsListSkeleton } from "@/components/skeleton"
import { Suspense } from "react"

export default async function Projects(props: {
    searchParams?: Promise<{
        query?: string
    }>
}) {
    const searchParams = await props.searchParams
    const query = searchParams?.query || ""
    const projects = await getProjects(query)

    return (
        <div className="flex w-full flex-col overflow-x-hidden">
            <ProjectsHeader />
            <Suspense key={query} fallback={<ProjectsListSkeleton />}>
                <ProjectsList projects={projects} />
            </Suspense>
        </div>
    )
}
