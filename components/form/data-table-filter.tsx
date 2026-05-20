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
import { FilterHorizontalIcon, Tick02Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import * as React from "react"

type DataTableFilterProps = {
  title?: string
  options: {
    label: string
    value: string
  }[]
  action: (term: string, type: string) => void
}

export function DataTableFilter<TData, TValue>({
  title,
  options,
  action,
}: DataTableFilterProps) {
  const [selectedValues, setSelectedValues] = React.useState<Set<string>>(
    new Set()
  )
  const facets = new Map<string, number>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <HugeiconsIcon
            icon={FilterHorizontalIcon}
            size={24}
            color="currentColor"
            strokeWidth={1.5}
          />
          <span className="hidden md:inline">{title}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value)
                      } else {
                        selectedValues.add(option.value)
                      }
                      setSelectedValues(new Set(selectedValues))
                      const filterValues = Array.from(selectedValues)
                      action(filterValues.join(","), title?.toLowerCase() || "")
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
                        size={24}
                        color="currentColor"
                        strokeWidth={1.5}
                        className="size-3.5 text-primary-foreground"
                      />
                    </div>
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex size-4 items-center justify-center font-mono text-xs text-muted-foreground">
                        {facets.get(option.value)}
                      </span>
                    )}
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
                      action("", title?.toLowerCase() || "")
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
