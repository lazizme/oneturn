"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
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
  { name: "Hisob ochish", estimated: 20, actual: 18 },
  { name: "Kredit", estimated: 30, actual: 34 },
  { name: "Karta", estimated: 10, actual: 9 },
  { name: "Konsultatsiya", estimated: 25, actual: 28 },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function WarningLabel(props: any) {
  const { x, y, width, index } = props
  const item = data[index]
  if (!item) return null
  const overPercent =
    ((item.actual - item.estimated) / item.estimated) * 100
  if (overPercent <= 10) return null
  return (
    <text
      x={x + width / 2}
      y={y - 6}
      textAnchor="middle"
      fontSize={10}
      fill="#EF4444"
      fontWeight={600}
    >
      +{Math.round(overPercent)}%
    </text>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs shadow-md">
      <p className="mb-1 font-medium text-gray-900">{label}</p>
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
      {payload.map((entry: any) => (
        <p key={entry.dataKey} style={{ color: entry.color }}>
          {entry.name}: {entry.value} daq
        </p>
      ))}
    </div>
  )
}

function CustomLegend() {
  return (
    <div className="mt-3 flex items-center justify-center gap-6 text-xs">
      <span className="flex items-center gap-1.5">
        <span
          className="inline-block h-3 w-3 rounded-sm"
          style={{ backgroundColor: "#2563EB" }}
        />
        Taxminiy vaqt
      </span>
      <span className="flex items-center gap-1.5">
        <span
          className="inline-block h-3 w-3 rounded-sm"
          style={{ backgroundColor: "#10B981" }}
        />
        Haqiqiy o&apos;rtacha
      </span>
    </div>
  )
}

export function ServiceAccuracyChart() {
  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle>Xizmat davomiyligi: taxmin vs haqiqat</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} barGap={4} barSize={32}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "var(--brand-muted, #94a3b8)" }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              domain={[0, 40]}
              tick={{ fontSize: 11, fill: "var(--brand-muted, #94a3b8)" }}
              tickLine={false}
              axisLine={false}
              width={30}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="estimated"
              name="Taxminiy vaqt"
              fill="#2563EB"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="actual"
              name="Haqiqiy o'rtacha"
              fill="#10B981"
              radius={[4, 4, 0, 0]}
            >
              <LabelList content={<WarningLabel />} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <CustomLegend />
      </CardContent>
    </Card>
  )
}
