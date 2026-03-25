export function MetricCard({
	label,
	value,
	footer,
	icon,
}: {
	label: string;
	value: number;
	footer: string;
	icon: React.ReactNode;
}) {
	return (
		<div className="relative bg-card text-card-foreground flex flex-col justify-between rounded-xl border py-3 px-4">
			<p className="first-letter:uppercase text-xs text-muted-foreground">{label}</p>
			<h4 className="text-xl font-semibold tabular-nums @[250px]/card:text-3xl">{value}</h4>
			<p className="text-xs text-muted-foreground">{footer}</p>
			<div className="absolute top-3 right-4 p-2 rounded-md bg-muted dark:bg-background">
				{icon}
			</div>
		</div>
	);
}
