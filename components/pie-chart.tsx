"use client"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Pie, PieChart } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type PieChartComponentProps = {
  title: string
  dataKey: string
  nameKey: string
  chartData: Array<Record<string, string | number>>
  chartConfig: ChartConfig
}

export default function PieChartComponent({
  title,
  dataKey,
  nameKey,
  chartData,
  chartConfig,
}: PieChartComponentProps) {
  return (
    <Card className="gap-0">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey={dataKey}
              nameKey={nameKey}
              innerRadius={50}
              strokeWidth={5}
            />
            <ChartLegend
              content={<ChartLegendContent nameKey={nameKey} />}
              className="translate-y-2 flex-wrap gap-2 whitespace-nowrap *:basis-1/5 *:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
