import { Badge } from "@/components/ui/badge"
import { Priorities } from "@/lib/definitions"

export function TaskPriority({ taskPriority }: { taskPriority: string }) {
    const selectedPriority = Priorities.find(
        (priority) => priority.value === taskPriority
    )
    switch (selectedPriority?.value) {
        case "low":
            return (
                <div className="flex h-6 w-fit items-center gap-2 rounded-sm bg-muted px-2 text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {selectedPriority.label}
                </div>
            )
        case "medium":
            return (
                <div className="flex h-6 w-fit items-center gap-2 rounded-sm bg-muted px-2 text-xs">
                    <span className="bg-warning h-1.5 w-1.5 rounded-full" />
                    {selectedPriority.label}
                </div>
            )
        case "high":
            return (
                <div className="flex h-6 w-fit items-center gap-2 rounded-sm bg-muted px-2 text-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-destructive" />
                    {selectedPriority.label}
                </div>
            )
        default:
            return null
    }
}

export function TaskType({ taskType }: { taskType: string }) {
    return (
        <span className="rounded-sm bg-muted px-1.5 py-1 text-xs capitalize">
            {taskType.replace(/_/g, " ").toLowerCase()}
        </span>
    )
}
