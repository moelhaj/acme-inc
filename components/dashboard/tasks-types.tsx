import { getTasksByType } from "@/actions/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import PipelineChart from "@/components/dashboard/pipeline-chart"

export default async function TasksByTypes() {
    const tasks = await getTasksByType()
    const data = [
        { value: tasks.feature, label: "Feature", color: "var(--chart-1)" },
        { value: tasks.bug, label: "Bug", color: "var(--chart-2)" },
        {
            value: tasks.improvement,
            label: "Improvement",
            color: "var(--chart-3)",
        },
    ]

    return (
        <Card>
            <CardHeader className="items-center pb-0">
                <CardTitle>Tasks by types</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <PipelineChart data={data} />
            </CardContent>
        </Card>
    )
}
