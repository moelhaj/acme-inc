type Props = {
    data: Array<{
        value?: number
        label: string
        color: string
    }>
}

export default function PipelineChart({ data }: Props) {
    const total = data.reduce((sum, item) => sum + (item.value ?? 0), 0)
    const visible = data.filter((item) => (item.value ?? 0) > 0)

    return (
        <div className="space-y-3">
            <div className="flex w-full">
                {visible.map((item, index) => {
                    const percentage =
                        total > 0 ? ((item.value ?? 0) / total) * 100 : 0
                    return (
                        <div
                            key={index}
                            className="h-3 first:rounded-l-lg last:rounded-r-lg"
                            style={{
                                width: `${percentage}%`,
                                backgroundColor: item.color,
                            }}
                        />
                    )
                })}
            </div>
            <div className="mt-3 space-y-2 text-xs text-muted-foreground">
                {data.map((item) => (
                    <div
                        key={item.label}
                        className="flex w-full items-center gap-2"
                    >
                        <span
                            className="h-2 w-2 rounded-xs"
                            style={{ backgroundColor: item.color }}
                        />
                        <span>{item.label}</span>
                        <div className="flex-1" />
                        <span>{item.value ?? 0}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}
