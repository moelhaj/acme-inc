import { getProjects } from "@/actions/project"
import ProjectsHeader from "@/components/projects/projects-header"
import ProjectsList from "@/components/projects/projects-list"
import { ProjectsListSkeleton } from "@/components/skeleton"
import { ScrollArea } from "@/components/ui/scroll-area"
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
        <ScrollArea className="h-[calc(100svh-4.5rem)]">
            <div className="space-y-3 px-3 pt-1">
                <ProjectsHeader />
                <Suspense key={query} fallback={<ProjectsListSkeleton />}>
                    <ProjectsList projects={projects} />
                </Suspense>
            </div>
        </ScrollArea>
    )
}
