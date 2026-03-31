import {
    getBottlenecks,
    getInsights,
    getMetrics,
    getTasksByStatus,
    getWorkload,
} from "@/actions/dashboard"
import { Spinner } from "@/components/ui/spinner"
import { Suspense } from "react"
import AiActions from "./components/ai-actions"
import Bottleneck from "./components/bottleneck"
import { MetricCard } from "./components/metric-card"
import WorkloadDistribution from "./components/workload-distribution"
import { AlertSquareIcon } from "@hugeicons/core-free-icons"
import Icon from "@/components/icon"
import { ScrollArea } from "@/components/ui/scroll-area"
import Workload from "./components/workload"
import Metrics from "./components/metrics"
import TasksStatus from "./components/tasks-status"

type DashboardTasksSummary = {
    open: number
    inReview: number
    urgentOpen: number
    highOpen: number
}

type DashboardStuckTask = {
    id: string
    title: string
    days: number
    priority: "high"
    projectId: string
}

type DashboardWorkloadUser = {
    userId: string
    name: string
    avatar: string
    active: number
    urgent: number
    score: number
}

type DashboardOverloadedUser = {
    userId: string
    name: string
    score: number
    ratioVsAvg: number
}

type DashboardInsights = {
    tasks: DashboardTasksSummary
    stuck: Array<DashboardStuckTask>
    workload: Array<DashboardWorkloadUser>
    overloaded: Array<DashboardOverloadedUser>
    actions: Array<string>
}

export default async function Page() {
    const insightsRaw = await getInsights()
    const workload = await getWorkload()
    const metrics = await getMetrics()
    const bottleneck = await getBottlenecks()
    const tasksByStatus = await getTasksByStatus()
    const insights = insightsRaw as Partial<DashboardInsights>
    const tasks = insights.tasks ?? {
        open: 0,
        inReview: 0,
        urgentOpen: 0,
        highOpen: 0,
    }
    const stuck = insights.stuck ?? []
    const actions = insights.actions ?? []

    return (
        <Suspense
            fallback={
                <div className="grid h-full w-full place-content-center">
                    <Spinner />
                </div>
            }
        >
            <ScrollArea className="h-[calc(100svh-4.5rem)]">
                <div className="space-y-3 px-3 py-[1px]">
                    <Metrics metrics={metrics} />
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                        <Suspense
                            fallback={
                                <div className="h-64 w-full animate-pulse rounded-xl bg-muted" />
                            }
                        >
                            <AiActions actions={actions} />
                        </Suspense>
                        <Suspense
                            fallback={
                                <div className="h-64 w-full animate-pulse rounded-xl bg-muted" />
                            }
                        >
                            <TasksStatus tasks={tasksByStatus} />
                        </Suspense>
                    </div>
                    <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                        <Suspense
                            fallback={
                                <div className="h-64 w-full animate-pulse rounded-xl bg-muted" />
                            }
                        >
                            <Workload workload={workload} />
                        </Suspense>
                        <Suspense
                            fallback={
                                <div className="h-64 w-full animate-pulse rounded-xl bg-muted" />
                            }
                        >
                            <Bottleneck projects={bottleneck} />
                        </Suspense>
                    </div>
                </div>
            </ScrollArea>
        </Suspense>
    )
}
