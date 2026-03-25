import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Priorities, Types } from "@/lib/definitions"
import { cn } from "@/lib/utils"
import {
    Cancel01Icon,
    FilterHorizontalIcon,
    Loading03Icon,
    Tick02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export function TasksFilter() {
    const [open, setOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [selectedValues, setSelectedValues] = useState<Set<string>>(new Set())
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()

    function handleSelect(value: string, type: "priority" | "type") {
        const params = new URLSearchParams(searchParams)
        if (params.get(type) === value) {
            params.delete(type)
        } else {
            params.set(type, value)
        }
        router.push(`${pathname}?${params.toString()}`)
        setOpen(false)
        setIsLoading(true)
    }

    useEffect(() => {
        const newSelectedValues = new Set<string>()
        const priority = searchParams.get("priority")
        const type = searchParams.get("type")
        if (priority) {
            newSelectedValues.add(priority)
        }
        if (type) {
            newSelectedValues.add(type)
        }
        setSelectedValues(newSelectedValues)

        if (priority || type) {
            const timer = setTimeout(() => {
                setIsLoading(false)
            }, 500)
            return () => clearTimeout(timer)
        } else {
            const timer = setTimeout(() => {
                setIsLoading(false)
            }, 0)
            return () => clearTimeout(timer)
        }
    }, [searchParams])

    function clearFilters() {
        const params = new URLSearchParams(searchParams)
        params.delete("priority")
        params.delete("type")
        router.push(`${pathname}?${params.toString()}`)
    }

    return (
        <div className="flex items-center gap-2">
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger
                    render={
                        <Button
                            variant="outline"
                            className="font-normal text-muted-foreground"
                        >
                            <div>
                                {!isLoading && (
                                    <HugeiconsIcon
                                        icon={FilterHorizontalIcon}
                                        size={24}
                                        color="currentColor"
                                        strokeWidth={1.5}
                                    />
                                )}
                                {isLoading && (
                                    <HugeiconsIcon
                                        icon={Loading03Icon}
                                        strokeWidth={2}
                                        size={15}
                                        className="animate-spin"
                                    />
                                )}
                            </div>
                            Filter
                        </Button>
                    }
                />
                <PopoverContent className="w-[200px] p-0" align="start">
                    <Command>
                        <CommandList>
                            <CommandEmpty>No results found.</CommandEmpty>
                            <CommandGroup heading="Priorities">
                                {Priorities.map((option) => {
                                    const isSelected = selectedValues.has(
                                        option.value
                                    )
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            onSelect={() =>
                                                handleSelect(
                                                    option.value,
                                                    "priority"
                                                )
                                            }
                                        >
                                            <div
                                                className={cn(
                                                    "flex size-4 items-center justify-center rounded-[4px] border",
                                                    isSelected
                                                        ? "border-primary bg-primary text-primary-foreground"
                                                        : "border-input [&_svg]:invisible"
                                                )}
                                            >
                                                <HugeiconsIcon
                                                    icon={Tick02Icon}
                                                    strokeWidth={2}
                                                />
                                            </div>
                                            <span>{option.label}</span>
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                            <CommandGroup heading="Types">
                                {Types.map((option) => {
                                    const isSelected = selectedValues.has(
                                        option.value
                                    )
                                    return (
                                        <CommandItem
                                            key={option.value}
                                            onSelect={() =>
                                                handleSelect(
                                                    option.value,
                                                    "type"
                                                )
                                            }
                                        >
                                            <div
                                                className={cn(
                                                    "flex size-4 items-center justify-center rounded-[4px] border",
                                                    isSelected
                                                        ? "border-primary bg-primary text-primary-foreground"
                                                        : "border-input [&_svg]:invisible"
                                                )}
                                            >
                                                <HugeiconsIcon
                                                    icon={Tick02Icon}
                                                    strokeWidth={2}
                                                />
                                            </div>
                                            <span>{option.label}</span>
                                        </CommandItem>
                                    )
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {selectedValues?.size > 0 && (
                <Button variant="ghost" onClick={clearFilters}>
                    <HugeiconsIcon
                        icon={Cancel01Icon}
                        size={24}
                        color="currentColor"
                        strokeWidth={1.5}
                    />
                    Clear filters
                </Button>
            )}
        </div>
    )
}
