import { getMetrics } from "@/actions/dashboard"
import {
  LicensePinIcon,
  NoteIcon,
  TaskDaily02Icon,
  TransactionHistoryIcon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export default async function Metrics() {
  const metrics = await getMetrics()
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
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-4">
      {metricsData.map((metric) => (
        <div
          key={metric.label}
          className="flex items-center gap-2 rounded-lg bg-sidebar px-4 py-4 ring-1 ring-border lg:py-1"
        >
          {metric.icon}
          <span className="text-sm text-muted-foreground">{metric.label}</span>
          <div className="flex-1" />
          <span className="font-bold">{metric.value}</span>
        </div>
      ))}
    </div>
  )
}
