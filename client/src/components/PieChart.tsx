"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import {type PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
const colors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
]
const desktopData = [
  { account: "CaixaBank", income: 2500, outcome: 1800, balance: 700, fill: "var(--chart-1)" },
  { account: "Cash", income: 500, outcome: 300, balance: 200, fill: "var(--chart-2)" },
  { account: "TradeRepublic", income: 1200, outcome: 800, balance: 400 , fill: "var(--chart-3)" },
  { account: "ImaginBank", income: 1800, outcome: 1200, balance: 600 , fill: "var(--chart-4)" },
  { account: "SantanderBank", income: 2200, outcome: 1500, balance: 700 , fill: "var(--chart-5)" },
]

const chartConfig = {
  balance: {
    label: "Balance",
  },
  income: {
    label: "Income",
  },
  outcome: {
    label: "Outcome",
  },
  CaixaBank: {
    label: "CaixaBank",
    color: colors[0],
  },
  Cash: {
    label: "Cash",
    color: "var(--chart-2)",
  },
  TradeRepublic: {
    label: "TradeRepublic",
    color: "var(--chart-3)",
  },
  ImaginBank: {
    label: "ImaginBank",
    color: "var(--chart-4)",
  },
  SantanderBank: {
    label: "SantanderBank",
    color: "var(--chart-5)",
  },
} satisfies ChartConfig

export function Component() {
  const id = "pie-interactive"
  const [activeAccount, setActiveAccount] = React.useState(desktopData[0].account)

  const activeIndex = React.useMemo(
    () => desktopData.findIndex((item) => item.account === activeAccount),
    [activeAccount]
  )

  const handlePieClick = (data: any, index: number) => {
    setActiveAccount(desktopData[index].account)
  }

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={chartConfig} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>Account Balance Distribution</CardTitle>
          <CardDescription>Current account balances</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={desktopData}
              dataKey="balance"
              nameKey="account"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              onClick={handlePieClick}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          ${desktopData[activeIndex].balance.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Balance
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
