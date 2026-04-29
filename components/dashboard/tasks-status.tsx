import { getTasksByStatus } from "@/actions/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PipelineChart from "@/components/dashboard/pipeline-chart"

export default async function TasksByStatus() {
    const tasks = await getTasksByStatus()
    const data = [
        { value: tasks.todo, label: "Todo", color: "var(--chart-1)" },
        {
            value: tasks.in_progress,
            label: "In Progress",
            color: "var(--chart-2)",
        },
        { value: tasks.in_review, label: "In Review", color: "var(--chart-3)" },
        { value: tasks.done, label: "Done", color: "var(--chart-4)" },
    ]

    return (
        <Card>
            <CardHeader className="items-center pb-0">
                <CardTitle>Tasks by status</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <PipelineChart data={data} />
            </CardContent>
        </Card>
    )
}
