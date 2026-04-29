import { Fragment } from "react"
import { Skeleton } from "./ui/skeleton"

export function DashboardSkeleton() {
    return (
        <div className="grid h-full grid-cols-1 gap-3 p-3">
            <MetricsSkeleton />
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
                <TasksCardsSkeleton />
            </div>
            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <WorkloadSkeleton />
            </div>
        </div>
    )
}

export function MetricsSkeleton() {
    return (
        <div className="grid min-h-[116px] grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
        </div>
    )
}

export function TasksCardsSkeleton() {
    return (
        <Fragment>
            <Skeleton className="h-[186px] w-full" />
            <Skeleton className="h-[186px] w-full" />
            <Skeleton className="h-[186px] w-full" />
        </Fragment>
    )
}

export function WorkloadSkeleton() {
    return (
        <Fragment>
            <Skeleton className="h-[324px] w-full" />
            <Skeleton className="h-[324px] w-full" />
        </Fragment>
    )
}

export function ProjectsSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
            <Skeleton className="h-full w-full" />
        </div>
    )
}
