import { getProjectsTitles } from "@/actions/project"
import { Activity, Suspense } from "react"
import { ProjectsMenu } from "./projects-menu"

export default async function NavProject() {
    const projects = await getProjectsTitles()
    return (
        <Suspense fallback={<div>Loading projects ...</div>}>
            <Activity mode={projects.length === 0 ? "visible" : "hidden"}>
                <p className="px-2 text-xs text-muted-foreground">
                    No projects found. Create a project to see it here.
                </p>
            </Activity>
            <Activity mode={projects.length > 0 ? "visible" : "hidden"}>
                <ProjectsMenu projects={projects} />
            </Activity>
        </Suspense>
    )
}
