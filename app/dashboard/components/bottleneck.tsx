import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { getBottlenecks } from "@/actions/dashboard"

export default function Bottleneck({
    projects,
}: {
    projects: Awaited<ReturnType<typeof getBottlenecks>>
}) {
    return (
        <Card className="gap-2">
            <CardHeader>
                <CardTitle>Urgent bottleneck</CardTitle>
            </CardHeader>
            <CardContent>
                {projects.length === 0 && (
                    <p className="py-24 text-center text-sm text-muted-foreground">
                        No tasks are currently stuck in review.
                    </p>
                )}
                {projects.length > 0 &&
                    projects.map((task) => (
                        <Link
                            key={task.id}
                            href={`/projects/${task.projectId}`}
                            className="group mb-6 flex cursor-pointer items-center justify-between gap-4 rounded-lg bg-muted/70 px-4 py-2"
                        >
                            <div className="flex flex-col gap-1">
                                <span className="font-medium">
                                    {task.title}
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">
                                        In review for {task.daysInReview} days -
                                    </span>
                                    <span className="text-xs text-muted-foreground first-letter:uppercase">
                                        {task.priority} priority
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
