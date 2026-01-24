"use client";

import { LabelList, Pie, PieChart, Cell } from "recharts";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
	ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";

// Configure the size increase between each pie ring
const BASE_RADIUS = 50; // Starting radius for the smallest pie
const SIZE_INCREMENT = 10; // How much to increase radius for each subsequent pie

type TasksByPriority = {
	priority: "low" | "medium" | "high" | "urgent";
	count: number;
};

type TasksPrioritiesProps = {
	data: TasksByPriority[];
};

const chartConfig = {
	count: {
		label: "Tasks",
	},
	low: {
		label: "Low",
		color: "var(--chart-1)",
	},
	medium: {
		label: "Medium",
		color: "var(--chart-2)",
	},
	high: {
		label: "High",
		color: "var(--chart-3)",
	},
	urgent: {
		label: "Urgent",
		color: "var(--chart-4)",
	},
} satisfies ChartConfig;

export default function TasksPriorities({ data }: TasksPrioritiesProps) {
	const chartData = data.map(item => ({
		key: item.priority,
		label: chartConfig[item.priority].label,
		count: item.count,
		fill: chartConfig[item.priority].color,
	}));

	// Sort the data by count in ascending order (smallest to largest) it will make graph look better
	const sortedChartData = [...chartData].sort((a, b) => a.count - b.count);
	const totalCount = sortedChartData.reduce((sum, item) => sum + item.count, 0);

	return (
		<Card className="gap-0 py-4">
			<CardHeader className="items-center pb-0">
				<CardTitle>Tasks Priorities</CardTitle>
				<CardDescription>All time</CardDescription>
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer
					config={chartConfig}
					className="[&_.recharts-text]:fill-background mx-auto aspect-square max-h-54.5"
				>
					<PieChart>
						<ChartTooltip content={<ChartTooltipContent nameKey="count" hideLabel />} />
						{sortedChartData.map((entry, index) => (
							<Pie
								key={entry.key}
								data={[entry]}
								innerRadius={30}
								outerRadius={BASE_RADIUS + index * SIZE_INCREMENT}
								dataKey="count"
								cornerRadius={4}
								startAngle={
									// Calculate the percentage of total visitors up to current index
									totalCount === 0
										? 0
										: (sortedChartData
												.slice(0, index)
												.reduce((sum, d) => sum + d.count, 0) /
												totalCount) *
											360
								}
								endAngle={
									// Calculate the percentage of total visitors up to and including current index
									totalCount === 0
										? 0
										: (sortedChartData
												.slice(0, index + 1)
												.reduce((sum, d) => sum + d.count, 0) /
												totalCount) *
											360
								}
							>
								<Cell fill={entry.fill} />
								<LabelList
									dataKey="count"
									stroke="none"
									fontSize={12}
									fontWeight={500}
									fill="currentColor"
									formatter={(value: number) => value.toString()}
								/>
							</Pie>
						))}
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	);
}
