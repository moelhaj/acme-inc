export function MetricCard({
    label,
    value,
    footer,
    icon,
}: {
    label: string
    value: number
    footer: string
    icon: React.ReactNode
}) {
    return (
        <div className="relative flex flex-col justify-between rounded-xl bg-card px-4 py-3 text-card-foreground ring-1 ring-sidebar-border">
            <p className="text-xs text-muted-foreground first-letter:uppercase">
                {label}
            </p>
            <h4 className="text-xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {value}
            </h4>
            <p className="text-xs text-muted-foreground">{footer}</p>
            <div className="absolute top-3 right-4 rounded-md bg-muted p-2 dark:bg-background">
                {icon}
            </div>
        </div>
    )
}
