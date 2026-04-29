import { getTasksByPriorities } from "@/actions/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PipelineChart from "@/components/dashboard/pipeline-chart"

export default async function TasksByPriorities() {
    const tasks = await getTasksByPriorities()
    const data = [
        { value: tasks.low, label: "Low", color: "var(--chart-1)" },
        { value: tasks.medium, label: "Medium", color: "var(--chart-2)" },
        { value: tasks.high, label: "High", color: "var(--chart-3)" },
    ]

    return (
        <Card>
            <CardHeader className="items-center pb-0">
                <CardTitle>Tasks by priorities</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <PipelineChart data={data} />
            </CardContent>
        </Card>
    )
}
