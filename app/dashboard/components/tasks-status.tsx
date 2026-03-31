"use client"
import { getTasksByStatus } from "@/actions/dashboard"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import { Pie, PieChart } from "recharts"

export default function TasksStatus({
    tasks,
}: {
    tasks: Awaited<ReturnType<typeof getTasksByStatus>>
}) {
    const pieChartData = [
        { status: "todo", value: tasks.todo, fill: "var(--color-todo)" },
        {
            status: "inProgress",
            value: tasks.in_progress,
            fill: "var(--color-inProgress)",
        },
        {
            status: "inReview",
            value: tasks.in_review,
            fill: "var(--color-inReview)",
        },
        { status: "done", value: tasks.done, fill: "var(--color-done)" },
    ]

    const pieChartConfig = {
        value: {
            label: "Value",
        },
        todo: {
            label: "Todo",
            color: "var(--chart-1)",
        },
        inProgress: {
            label: "In Progress",
            color: "var(--chart-2)",
        },
        inReview: {
            label: "In Review",
            color: "var(--chart-3)",
        },
        done: {
            label: "Done",
            color: "var(--chart-4)",
        },
    } satisfies ChartConfig

    return (
        <Card>
            <CardHeader className="pb-0">
                <CardTitle>Task Status Distribution</CardTitle>
                <CardDescription>
                    Overview of all tasks by status
                </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
                <ChartContainer
                    config={pieChartConfig}
                    className="mx-auto aspect-square max-h-[190px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={pieChartData}
                            dataKey="value"
                            nameKey="status"
                            innerRadius={50}
                            strokeWidth={5}
                        />
                        <ChartLegend
                            content={<ChartLegendContent nameKey="status" />}
                            className="w-fit -translate-x-10 translate-y-2 whitespace-nowrap"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
