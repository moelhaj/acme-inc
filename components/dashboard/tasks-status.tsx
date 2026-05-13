import { getTasksByStatus } from "@/actions/dashboard"
import PieChart from "@/components/pie-chart"

export default async function TasksByStatus() {
  const tasks = await getTasksByStatus()

  const chartData = [
    { status: "todo", tasks: tasks.todo, fill: "var(--color-todo)" },
    {
      status: "in_progress",
      tasks: tasks.in_progress,
      fill: "var(--color-in_progress)",
    },
    {
      status: "in_review",
      tasks: tasks.in_review,
      fill: "var(--color-in_review)",
    },
    { status: "done", tasks: tasks.done, fill: "var(--color-done)" },
  ]

  const chartConfig = {
    tasks: {
      label: "Tasks",
    },
    todo: {
      label: "Todo",
      color: "var(--chart-2)",
    },
    in_progress: {
      label: "In Progress",
      color: "var(--chart-4)",
    },
    in_review: {
      label: "In Review",
      color: "var(--chart-1)",
    },
    done: {
      label: "Done",
      color: "var(--chart-3)",
    },
  }

  return (
    <PieChart
      title="Tasks by status"
      dataKey="tasks"
      nameKey="status"
      chartData={chartData}
      chartConfig={chartConfig}
    />
  )
}
