"use client"
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty"
import { cn } from "@/lib/utils"

type Props = {
    icon: React.ReactNode
    title: string
    description: string
    className?: string
}

export default function CustomEmpty({
    icon,
    title,
    description,
    className,
}: Props) {
    return (
        <div
            className={cn(
                "flex h-[calc(100svh-11rem)] flex-col items-center justify-center gap-4 text-center text-sm text-muted-foreground",
                className
            )}
        >
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon" className="bg-muted">
                        {icon}
                    </EmptyMedia>
                    <EmptyTitle>{title}</EmptyTitle>
                    <EmptyDescription>{description}</EmptyDescription>
                </EmptyHeader>
            </Empty>
        </div>
    )
}
