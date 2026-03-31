import { cn } from "@/lib/utils"

export function Badge({
    children,
    className,
}: {
    children: React.ReactNode
    className?: string
}) {
    // switch (selectedPriority?.value) {
    //     case "low":
    //         return (
    //             <span className="rounded-sm bg-green-200 px-2 py-1 text-[10px] font-medium text-green-800 dark:bg-green-400">
    //                 {selectedPriority.label}
    //             </span>
    //         )
    //     case "medium":
    //         return (
    //             <span className="rounded-sm bg-orange-200 px-2 py-1 text-[10px] font-medium text-orange-800 dark:bg-orange-300">
    //                 {selectedPriority.label}
    //             </span>
    //         )
    //     case "high":
    //         return (
    //             <span className="rounded-sm bg-rose-200 px-2 py-1 text-[10px] font-medium text-rose-800 dark:bg-rose-400">
    //                 {selectedPriority.label}
    //             </span>
    //         )
    //     default:
    //         return null
    // }
    return (
        <div
            className={cn(
                "rounded-sm px-2 py-1 text-[10px] font-medium",
                className
            )}
        >
            {children}
        </div>
    )
}
