"use client"
import { formatDueDate } from "@/lib/utils"
import { Calendar03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

export default function DateChip({ date }: { date: Date }) {
    return (
        <div className="flex w-fit flex-row items-center gap-2">
            <HugeiconsIcon
                icon={Calendar03Icon}
                size={14}
                color="currentColor"
                strokeWidth={1.5}
            />
            <span className="pt-0.5 text-xs whitespace-nowrap text-muted-foreground">
                {formatDueDate(date)}
            </span>
        </div>
    )
}
