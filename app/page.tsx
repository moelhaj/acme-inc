import { getInsights, getWorkload } from "@/actions/dashboard"
import { Spinner } from "@/components/ui/spinner"
import { LayoutList, Skull, TriangleAlert, Turtle } from "lucide-react"
import { Suspense } from "react"
import AiActions from "./dashboard/ai-actions"
import Bottleneck from "./dashboard/bottleneck"
import { MetricCard } from "./dashboard/metric-card"
import WorkloadDistribution from "./dashboard/workload-distribution"

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
            <div className="space-y-4 p-4">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <div className="grid grid-cols-2 gap-4">
                        <MetricCard
                            label="Open tasks"
                            value={tasks.open}
                            footer="Across all projects"
                            icon={<LayoutList size="15" />}
                        />
                        <MetricCard
                            label="Urgent open"
                            value={tasks.urgentOpen}
                            footer="Needs same day attention"
                            icon={
                                <Skull size="15" className="text-destructive" />
                            }
                        />
                        <MetricCard
                            label="High open"
                            value={tasks.highOpen}
                            footer="Needs attention in 2-3 days"
                            icon={<TriangleAlert size="15" />}
                        />
                        <MetricCard
                            label="Stuck in review"
                            value={tasks.inReview}
                            footer="In review for over 3 days"
                            icon={<Turtle size="15" />}
                        />
                    </div>
                    <AiActions actions={actions} />
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <WorkloadDistribution workload={workload} />
                    <Bottleneck stuck={stuck} />
                </div>
            </div>
        </Suspense>
    )
}
