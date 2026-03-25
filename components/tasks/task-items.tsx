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

export function Priority({ taskPriority }: { taskPriority: string }) {
    const selectedPriority = Priorities.find(
        (priority) => priority.value === taskPriority
    )
    switch (selectedPriority?.value) {
        case "low":
            return (
                <span className="rounded-sm bg-green-200 px-2 py-1 text-[10px] font-medium text-green-800 dark:bg-green-400">
                    {selectedPriority.label}
                </span>
            )
        case "medium":
            return (
                <span className="rounded-sm bg-orange-200 px-2 py-1 text-[10px] font-medium text-orange-800 dark:bg-orange-300">
                    {selectedPriority.label}
                </span>
            )
        case "high":
            return (
                <span className="rounded-sm bg-rose-200 px-2 py-1 text-[10px] font-medium text-rose-800 dark:bg-rose-400">
                    {selectedPriority.label}
                </span>
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
