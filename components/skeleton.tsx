import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

function SkeletonCard() {
    return (
        <Card className="w-full max-w-xs">
            <CardHeader>
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                <Skeleton className="aspect-video w-full" />
            </CardContent>
        </Card>
    )
}

export function DashboardSkeleton() {
    return (
        <div className="animate-pulse">
            <div className="mb-4 h-6 w-1/2 rounded bg-gray-300"></div>
            <div className="mb-2 h-4 w-full rounded bg-gray-300"></div>
            <div className="mb-2 h-4 w-full rounded bg-gray-300"></div>
            <div className="mb-2 h-4 w-full rounded bg-gray-300"></div>
            <div className="mb-2 h-4 w-full rounded bg-gray-300"></div>
        </div>
    )
}

export function ProjectsListSkeleton() {
    return (
        <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
        </div>
    )
}

export function TasksKanbanSkeleton() {
    return (
        <div className="grid grid-cols-4 gap-2 p-4">
            <Skeleton className="h-[calc(100svh-11rem)] w-full rounded" />
            <Skeleton className="h-[calc(100svh-11rem)] w-full rounded" />
            <Skeleton className="h-[calc(100svh-11rem)] w-full rounded" />
            <Skeleton className="h-[calc(100svh-11rem)] w-full rounded" />
        </div>
    )
}
