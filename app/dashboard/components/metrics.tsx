import { getMetrics } from "@/actions/dashboard"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AiBrowserIcon,
    AlertSquareIcon,
    Note03Icon,
    ClipboardClockIcon,
    TransactionHistoryIcon,
    NoteIcon,
    TaskDaily02Icon,
    LicensePinIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { MetricCard } from "./metric-card"

export default function Metrics({
    metrics,
}: {
    metrics: Awaited<ReturnType<typeof getMetrics>>
}) {
    const { totalTask, inReview, highOpen, stuckTasks } = metrics
    const metricsData = [
        {
            label: "Total Tasks",
            value: totalTask,
            content: "Across all projects",
            icon: <HugeiconsIcon icon={NoteIcon} size={20} />,
        },
        {
            label: "High Open",
            value: highOpen,
            content: "Needs attention in 2-3 days",
            icon: <HugeiconsIcon icon={TaskDaily02Icon} size={20} />,
        },
        {
            label: "In Review",
            value: inReview,
            content: "Needs attention in 2-3 days",
            icon: <HugeiconsIcon icon={LicensePinIcon} size={20} />,
        },
        {
            label: "Stuck in Review",
            value: stuckTasks,
            content: "In review for over 3 days",
            icon: <HugeiconsIcon icon={TransactionHistoryIcon} size={20} />,
        },
    ]
    return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            {metricsData.map((metric) => (
                <Card key={metric.label} className="gap-2">
                    <CardHeader>
                        <CardDescription>{metric.label}</CardDescription>
                        <CardTitle className="text-2xl">
                            {metric.value}
                        </CardTitle>
                        <CardAction>{metric.icon}</CardAction>
                    </CardHeader>
                    <CardContent className="text-xs text-muted-foreground">
                        {metric.content}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
