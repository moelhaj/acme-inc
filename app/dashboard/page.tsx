import {
	Card,
	CardAction,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Page() {
	return (
		<div className="p-4">
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-4">
				<Card className="@container/card">
					<CardHeader>
						<CardDescription>Total Revenue</CardDescription>
						<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
							$1,250.00
						</CardTitle>
						<CardAction>
							<Badge variant="outline">+12.5%</Badge>
						</CardAction>
					</CardHeader>
					<CardFooter className="flex-col items-start gap-1.5 text-sm">
						<div className="line-clamp-1 flex gap-2 font-medium">
							Trending up this month
						</div>
						<div className="text-muted-foreground">Visitors for the last 6 months</div>
					</CardFooter>
				</Card>
				<Card className="@container/card">
					<CardHeader>
						<CardDescription>New Customers</CardDescription>
						<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
							1,234
						</CardTitle>
						<CardAction>
							<Badge variant="outline">-20%</Badge>
						</CardAction>
					</CardHeader>
					<CardFooter className="flex-col items-start gap-1.5 text-sm">
						<div className="line-clamp-1 flex gap-2 font-medium">
							Down 20% this period
						</div>
						<div className="text-muted-foreground">Acquisition needs attention</div>
					</CardFooter>
				</Card>
				<Card className="@container/card">
					<CardHeader>
						<CardDescription>Active Accounts</CardDescription>
						<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
							45,678
						</CardTitle>
						<CardAction>
							<Badge variant="outline">+12.5%</Badge>
						</CardAction>
					</CardHeader>
					<CardFooter className="flex-col items-start gap-1.5 text-sm">
						<div className="line-clamp-1 flex gap-2 font-medium">
							Strong user retention
						</div>
						<div className="text-muted-foreground">Engagement exceed targets</div>
					</CardFooter>
				</Card>
				<Card className="@container/card">
					<CardHeader>
						<CardDescription>Growth Rate</CardDescription>
						<CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
							4.5%
						</CardTitle>
						<CardAction>
							<Badge variant="outline">+4.5%</Badge>
						</CardAction>
					</CardHeader>
					<CardFooter className="flex-col items-start gap-1.5 text-sm">
						<div className="line-clamp-1 flex gap-2 font-medium">
							Steady performance increase
						</div>
						<div className="text-muted-foreground">Meets growth projections</div>
					</CardFooter>
				</Card>
			</div>
			<div className="flex flex-1 flex-col gap-4">
				{Array.from({ length: 24 }).map((_, index) => (
					<div key={index} className="bg-muted/50 aspect-video h-12 w-full rounded-lg" />
				))}
			</div>
		</div>
	);
}
