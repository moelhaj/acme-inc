import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
    addMonths,
    addYears,
    differenceInDays,
    differenceInMonths,
    differenceInYears,
    isPast,
} from "date-fns"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function userInitials(name: string): string {
    const names = name.trim().split(" ")
    if (!names[0]) return ""
    if (names.length === 0) return ""
    if (names.length === 1) return names[0][0].toUpperCase()
    return names[0][0].toUpperCase() + names[names.length - 1][0].toUpperCase()
}

export function formatDueDate(dueDate: Date | string): string {
    const now = new Date()
    const due = new Date(dueDate)
    const overdue = isPast(due)
    const [start, end] = overdue ? [due, now] : [now, due]
    const prefix = overdue ? "Overdue by" : "Due in"

    const years = differenceInYears(end, start)
    const months = differenceInMonths(addYears(end, -years), start)
    const days = differenceInDays(
        addMonths(addYears(end, -years), -months),
        start
    )

    const parts: string[] = []
    if (years > 0) parts.push(`${years} year${years > 1 ? "s" : ""}`)
    if (months > 0) parts.push(`${months} month${months > 1 ? "s" : ""}`)
    if (days > 0 && years === 0) parts.push(`${days} day${days > 1 ? "s" : ""}`)
    if (parts.length === 0) parts.push("today")

    return parts.length === 1 && parts[0] === "today"
        ? "Due today"
        : `${prefix} ${parts.join(" and ")}`
}

export function toArray<T extends string>(
    value: string | string[] | undefined
): T[] {
    if (!value) return []
    return (Array.isArray(value) ? value : [value]) as T[]
}
