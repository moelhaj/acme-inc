"use client"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { FilterHorizontalIcon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export interface FilterOption {
    value: string
    label: string
}

interface SearchFilterProps {
    options: FilterOption[]
    param: string
    label?: string
}

export default function SearchFilter({
    options,
    param,
    label = "Filter",
}: SearchFilterProps) {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()

    const selected = new Set(searchParams.getAll(param))

    function toggle(value: string) {
        const params = new URLSearchParams(searchParams)
        params.delete(param)
        const next = new Set(selected)
        if (next.has(value)) {
            next.delete(value)
        } else {
            next.add(value)
        }
        next.forEach((v) => params.append(param, v))
        router.push(`${pathname}?${params.toString()}`)
    }

    function clearAll() {
        const params = new URLSearchParams(searchParams)
        params.delete(param)
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="default"
                    aria-expanded={open}
                    className="h-7.5 gap-2 text-xs"
                >
                    <HugeiconsIcon
                        icon={FilterHorizontalIcon}
                        strokeWidth={2}
                        size={15}
                    />
                    {label}
                    {selected.size > 0 && (
                        <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                            {selected.size}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-48 gap-0 p-1">
                <div className="flex flex-col">
                    {options.map((option) => (
                        <label
                            key={option.value}
                            className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
                        >
                            <Checkbox
                                checked={selected.has(option.value)}
                                onCheckedChange={() => toggle(option.value)}
                            />
                            {option.label}
                        </label>
                    ))}
                </div>
                {selected.size > 0 && (
                    <>
                        <div className="my-1 h-px bg-border" />
                        <button
                            onClick={clearAll}
                            className="w-full rounded-md px-2 py-1.5 text-left text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
                        >
                            Clear filters
                        </button>
                    </>
                )}
            </PopoverContent>
        </Popover>
    )
}
