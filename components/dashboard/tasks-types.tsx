import { getTasksByType } from "@/actions/dashboard"
import PieChart from "@/components/charts/pie-chart"

export default async function TasksByTypes() {
  const tasks = await getTasksByType()

  const chartData = [
    { taskType: "feature", tasks: tasks.feature, fill: "var(--color-feature)" },
    {
      taskType: "bug",
      tasks: tasks.bug,
      fill: "var(--color-bug)",
    },
    {
      taskType: "improvement",
      tasks: tasks.improvement,
      fill: "var(--color-improvement)",
    },
  ]

  const chartConfig = {
    tasks: {
      label: "Tasks",
    },
    feature: {
      label: "Feature",
      color: "var(--chart-2)",
    },
    bug: {
      label: "Bug",
      color: "var(--chart-1)",
    },
    improvement: {
      label: "Improvement",
      color: "var(--chart-3)",
    },
  }

  return (
    <PieChart
      title="Tasks by type"
      dataKey="tasks"
      nameKey="taskType"
      chartData={chartData}
      chartConfig={chartConfig}
    />
  )
}
