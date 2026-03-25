import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRightIcon } from "lucide-react"
import Link from "next/link"

type StuckTask = {
    id: string
    title: string
    days: number
    priority: "high"
    projectId: string
}

export default function Bottleneck({ stuck }: { stuck: Array<StuckTask> }) {
    return (
        <Card className="gap-2">
            <CardHeader>
                <CardTitle>Urgent bottleneck</CardTitle>
            </CardHeader>
            <CardContent>
                {stuck.length === 0 && (
                    <p className="py-24 text-center text-sm text-muted-foreground">
                        No tasks are currently stuck in review.
                    </p>
                )}
                {stuck.length > 0 &&
                    stuck.map((task: StuckTask) => (
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
                                        In review for {task.days} days -
                                    </span>
                                    <span className="text-xs text-muted-foreground first-letter:uppercase">
                                        {task.priority} priority
                                    </span>
                                </div>
                            </div>
                            <ChevronRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    ))}
            </CardContent>
        </Card>
    )
}
