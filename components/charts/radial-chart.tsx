"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { LabelList, RadialBar, RadialBarChart } from "recharts"

type RadialChartComponentProps = {
  title: string
  label: string
  value: string
  chartData: Array<Record<string, string | number>>
  chartConfig: ChartConfig
}

export default function RadialChartComponent({
  title,
  label,
  value,
  chartData,
  chartConfig,
}: RadialChartComponentProps) {
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
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={380}
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey={label} />}
            />
            <RadialBar dataKey={value} background>
              <LabelList
                position="insideStart"
                dataKey={label}
                className="fill-foreground capitalize mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
