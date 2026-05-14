import { cn } from "@/lib/utils"

type Props = {
  className?: string
  children: React.ReactNode
  color: "primary" | "warning" | "destructive"
}

export default function Chip({ className, children, color }: Props) {
  return (
    <div
      className={cn("col-span-2 flex items-center gap-2 text-xs", className)}
    >
      <span
        className={cn(
          "h-2 w-2 rounded-xs",
          color === "destructive"
            ? "bg-destructive"
            : color === "warning"
              ? "bg-warning"
              : "bg-primary"
        )}
      />
      <span className="text-xs font-medium">{children}</span>
    </div>
  )
}
