import { Priorities, Types } from "@/lib/definitions"
import {
    Bug01Icon,
    QrCodeIcon,
    WebDesign02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "../badge"

export function Priority({ taskPriority }: { taskPriority: string }) {
    const selectedPriority = Priorities.find(
        (priority) => priority.value === taskPriority
    )
    switch (selectedPriority?.value) {
        case "low":
            return (
                <Badge className="w-fit bg-green-200 text-green-800 dark:bg-green-400 dark:text-green-900">
                    {selectedPriority.label}
                </Badge>
            )
        case "medium":
            return (
                <Badge className="w-fit bg-orange-200 text-orange-800 dark:bg-orange-400 dark:text-orange-900">
                    {selectedPriority.label}
                </Badge>
            )
        case "high":
            return (
                <Badge className="w-fit bg-rose-200 text-rose-800 dark:bg-rose-400 dark:text-rose-900">
                    {selectedPriority.label}
                </Badge>
            )
        default:
            return null
    }
}

export function Type({ taskType }: { taskType: string }) {
    const selectedType = Types.find((type) => type.value === taskType)
    const icon =
        selectedType?.value === "improvement"
            ? WebDesign02Icon
            : selectedType?.value === "bug"
              ? Bug01Icon
              : selectedType?.value === "feature"
                ? QrCodeIcon
                : null
    return (
        <Tooltip>
            <TooltipTrigger
                render={
                    <div className="grid h-[21px] w-fit place-content-center rounded-sm bg-muted px-1.5">
                        <HugeiconsIcon
                            icon={icon!}
                            size={12}
                            color="currentColor"
                            strokeWidth={1.5}
                        />
                    </div>
                }
            />
            <TooltipContent className="px-2 py-1 text-xs">
                <p>{selectedType?.label}</p>
            </TooltipContent>
        </Tooltip>
    )
}
