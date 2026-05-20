import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { getBottlenecks } from "@/actions/dashboard"

export default async function Bottleneck() {
  const bottlenecks = await getBottlenecks()
  return (
    <Card className="gap-6">
      <CardHeader>
        <CardTitle>Projects bottleneck</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {bottlenecks.length === 0 && (
          <div className="flex h-full flex-1 items-center justify-center">
            <p className="text-center text-sm text-muted-foreground">
              No projects found!
            </p>
          </div>
        )}
        {bottlenecks.length > 0 &&
          bottlenecks.map((project) => (
            <Link
              key={project.id}
              href={`/tasks/${project.id}`}
              className="group mb-3 flex cursor-pointer items-center justify-between gap-4 rounded-lg bg-muted/70 px-4 py-2 select-none"
            >
              <div className="flex flex-col gap-1">
                <span className="font-medium">{project.title}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {project.tasksCount} Tasks
                  </span>
                </div>
              </div>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="size-4 transition-transform group-hover:translate-x-1"
              />
            </Link>
          ))}
      </CardContent>
    </Card>
  )
}
