import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Loading03Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

type Props = {
    options: { value: string; label: string }[]
    label: string
}

export function Filter({ options, label }: Props) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [selectedValues, setSelectedValues] = useState<Set<string>>(
        new Set(searchParams.getAll(label.toLowerCase()))
    )

    function handleChange(values: string[]) {
        const params = new URLSearchParams(searchParams.toString())
        params.delete(label.toLowerCase())
        values.forEach((value) =>
            params.append(label.toLowerCase(), value.toLowerCase())
        )
        router.push(`${pathname}?${params.toString()}`)
    }

    useEffect(() => {
        if (searchParams.get(label.toLowerCase()) !== null) {
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

    return (
        <Popover>
            <PopoverTrigger
                render={
                    <Button
                        variant="outline"
                        className="font-normal text-muted-foreground"
                    >
                        {label}
                        <div>
                            {isLoading && (
                                <HugeiconsIcon
                                    icon={Loading03Icon}
                                    strokeWidth={2}
                                    size={15}
                                    className="animate-spin"
                                />
                            )}
                        </div>
                        {selectedValues?.size > 0 && (
                            <>
                                <Separator
                                    orientation="vertical"
                                    className="mx-1 h-7.5"
                                />
                                <Badge
                                    variant="secondary"
                                    className="rounded-sm px-1 font-normal lg:hidden"
                                >
                                    {selectedValues.size}
                                </Badge>
                                <div className="hidden gap-1 lg:flex">
                                    {selectedValues.size > 2 ? (
                                        <Badge
                                            variant="secondary"
                                            className="rounded-sm px-1 font-normal"
                                        >
                                            {selectedValues.size} selected
                                        </Badge>
                                    ) : (
                                        options
                                            .filter((option) =>
                                                selectedValues.has(option.value)
                                            )
                                            .map((option) => (
                                                <Badge
                                                    variant="secondary"
                                                    key={option.value}
                                                    className="rounded-sm px-1 font-normal"
                                                >
                                                    {option.label}
                                                </Badge>
                                            ))
                                    )}
                                </div>
                            </>
                        )}
                    </Button>
                }
            />
            <PopoverContent className="w-[200px] p-0" align="start">
                <Command>
                    <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                            {options.map((option) => {
                                const isSelected = selectedValues.has(
                                    option.value
                                )
                                return (
                                    <CommandItem
                                        key={option.value}
                                        onSelect={() => {
                                            if (isSelected) {
                                                selectedValues.delete(
                                                    option.value
                                                )
                                            } else {
                                                selectedValues.add(option.value)
                                            }
                                            const filters =
                                                Array.from(selectedValues)
                                            setIsLoading(true)
                                            handleChange(filters)
                                        }}
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
                        {selectedValues.size > 0 && (
                            <>
                                <CommandSeparator />
                                <CommandGroup>
                                    <CommandItem
                                        onSelect={() => {
                                            setSelectedValues(new Set())
                                            handleChange([])
                                            setIsLoading(true)
                                        }}
                                        className="justify-center text-center"
                                    >
                                        Clear filters
                                    </CommandItem>
                                </CommandGroup>
                            </>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
