"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
} from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

const data = [
  { name: "Chilonzor", bookings: 847 },
  { name: "Yunusobod", bookings: 534 },
  { name: "Mirobod", bookings: 261 },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function ValueLabel(props: any) {
  const { x, y, width, height, value } = props
  return (
    <text
      x={x + width + 8}
      y={y + height / 2}
      dominantBaseline="central"
      fontSize={12}
      fontWeight={600}
      fill="#1e293b"
    >
      {value}
    </text>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs shadow-md">
      <span className="font-medium text-gray-900">
        {payload[0].payload.name}: {payload[0].value} ta bron
      </span>
    </div>
  )
}

export function BranchComparisonChart() {
  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle>
          Filiallar bo&apos;yicha umumiy bron (bu oy)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} layout="vertical" barSize={28}>
            <XAxis
              type="number"
              tick={{ fontSize: 11, fill: "var(--brand-muted, #94a3b8)" }}
              tickLine={false}
              axisLine={false}
              hide
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fontSize: 12, fill: "var(--brand-muted, #94a3b8)" }}
              tickLine={false}
              axisLine={false}
              width={90}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="bookings"
              fill="#2563EB"
              radius={[0, 6, 6, 0]}
            >
              <LabelList content={<ValueLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
