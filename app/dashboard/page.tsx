import Metrics from "@/components/dashboard/metrics"
import Workload from "@/components/dashboard/workload"
import TasksByPriorities from "@/components/dashboard/tasks-priorities"
import TasksByStatus from "@/components/dashboard/tasks-status"
import TasksByTypes from "@/components/dashboard/tasks-types"
import { Suspense } from "react"
import Bottleneck from "@/components/dashboard/bottleneck"
import {
  MetricsSkeleton,
  TasksCardsSkeleton,
  WorkloadSkeleton,
} from "@/components/skeletons"

export default function DashboardPage() {
  return (
    <div className="grid h-full grid-cols-1 gap-3 p-3">
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
        <Workload />
        <Bottleneck />
      </div>
      <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 xl:grid-cols-4">
        <Metrics />
        <TasksByStatus />
        <TasksByPriorities />
        <TasksByTypes />
      </div>
    </div>
  )
}
