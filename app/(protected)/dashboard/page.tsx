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
} from "@/components/dashboard/skeletons"

export default function DashboardPage() {
    return (
        <div className="grid h-full grid-cols-1 gap-3 p-3">
            <Suspense fallback={<MetricsSkeleton />}>
                <Metrics />
            </Suspense>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                <Suspense fallback={<TasksCardsSkeleton />}>
                    <TasksByStatus />
                    <TasksByPriorities />
                    <TasksByTypes />
                </Suspense>
            </div>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <Suspense fallback={<WorkloadSkeleton />}>
                    <Workload />
                    <Bottleneck />
                </Suspense>
            </div>
        </div>
    )
}
