// components/ui/chart-listening-history.tsx

"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

// Define the shape of the data prop
interface ListeningData {
  date: string;
  minutesListened: number;
}

interface ChartListeningHistoryProps {
  data: ListeningData[];
}

// Define the chart's configuration
const chartConfig = {
  minutesListened: {
    label: "Minutes Listened",
    color: "hsl(var(--chart-1))", // Uses your theme's primary chart color
  },
} satisfies ChartConfig;

export function ChartListeningHistory({ data }: ChartListeningHistoryProps) {
  return (
    <Card className=" !bg-[#0000007a] !backdrop-blur-lg !shadow-[2px_2px_15px_rgba(0,0,0,0.2)]  " >
      <CardHeader>
        <CardTitle>Listening History</CardTitle>
        <CardDescription>
          Total minutes of songs listened to per day over the last 3 months.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              interval={2}
            />
            <YAxis
              dataKey="minutesListened"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value} min`}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar
              dataKey="minutesListened"
              fill="var(--color-minutesListened)"
              radius={4}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
