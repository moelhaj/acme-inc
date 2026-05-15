import { getMetrics } from "@/actions/dashboard"
import RadialChart from "@/components/charts/radial-chart"

export default async function Metrics() {
  const metrics = await getMetrics()
  const { totalTask, inReview, highOpen, stuckTasks } = metrics

  const chartData = [
    { label: "inReview", tasks: inReview, fill: "var(--color-inReview)" },
    { label: "highOpen", tasks: highOpen, fill: "var(--color-highOpen)" },
    {
      label: "stuckTasks",
      tasks: stuckTasks,
      fill: "var(--color-stuckTasks)",
    },
  ]
  const chartConfig = {
    tasks: {
      label: "Tasks",
    },
    inReview: {
      label: "In Review",
      color: "var(--chart-2)",
    },
    stuckTasks: {
      label: "Stuck Tasks",
      color: "var(--chart-4)",
    },
    highOpen: {
      label: "High Open",
      color: "var(--chart-1)",
    },
  }
  return (
    <RadialChart
      title="Metrics"
      label="label"
      value="tasks"
      chartData={chartData}
      chartConfig={chartConfig}
    />
  )
}
