import { getTasksByPriorities } from "@/actions/dashboard"
import PieChart from "@/components/charts/pie-chart"

export default async function TasksByPriorities() {
  const tasks = await getTasksByPriorities()

  const chartData = [
    { priority: "low", tasks: tasks.low, fill: "var(--color-low)" },
    {
      priority: "medium",
      tasks: tasks.medium,
      fill: "var(--color-medium)",
    },
    {
      priority: "high",
      tasks: tasks.high,
      fill: "var(--color-high)",
    },
  ]

  const chartConfig = {
    tasks: {
      label: "Tasks",
    },
    low: {
      label: "Low",
      color: "var(--chart-3)",
    },
    medium: {
      label: "Medium",
      color: "var(--chart-2)",
    },
    high: {
      label: "High",
      color: "var(--chart-1)",
    },
  }

  return (
    <PieChart
      title="Tasks by priorities"
      dataKey="tasks"
      nameKey="priority"
      chartData={chartData}
      chartConfig={chartConfig}
    />
  )
}
