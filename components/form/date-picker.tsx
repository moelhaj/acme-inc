"use client"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Calendar03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import { format } from "date-fns"

export function DatePicker({
  date = new Date(),
  setDate,
}: {
  date?: Date
  setDate: (date: Date | undefined) => void
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="flex items-center justify-between font-normal"
          variant={"outline"}
        >
          {date && format(date, "PPP")}
          {!date && <span>Pick a date</span>}
          <HugeiconsIcon
            icon={Calendar03Icon}
            size={24}
            color="currentColor"
            strokeWidth={1.5}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          captionLayout="dropdown"
          fromYear={new Date().getFullYear()}
          toYear={new Date().getFullYear() + 10}
          disabled={(date) =>
            date < new Date() || date < new Date("1900-01-01")
          }
        />
      </PopoverContent>
    </Popover>
  )
}
