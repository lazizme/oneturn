"use client"

import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card"

const MONTHS = [
  "yan", "fev", "mart", "apr", "may", "iyun",
  "iyul", "avg", "sen", "okt", "noy", "dek",
]

function generateData() {
  const data = []
  const now = new Date()
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const day = d.getDate()
    const month = MONTHS[d.getMonth()]
    const progress = (29 - i) / 29
    const base = 22 - progress * 8
    const seed = (day * 7 + i * 13) % 10
    const noise = (seed - 5) * 0.6
    const value = Math.round((base + noise) * 10) / 10
    data.push({
      date: `${day} ${month}`,
      value: Math.max(10, Math.min(28, value)),
    })
  }
  return data
}

const data = generateData()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div
      className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-xs shadow-md"
    >
      <span className="font-medium text-gray-900">
        {label} &middot; {payload[0].value} daqiqa
      </span>
    </div>
  )
}

export function WaitTimeChart() {
  const first = data[0]!.value
  const last = data[data.length - 1]!.value
  const delta = Math.round(((first - last) / first) * 100)

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle>O&apos;rtacha kutish vaqti</CardTitle>
        <CardDescription>
          O&apos;tgan oyga nisbatan{" "}
          <span className="font-medium text-green-600">&darr;{delta}%</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="waitFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2563EB" stopOpacity={0.1} />
                <stop offset="100%" stopColor="#2563EB" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f1f5f9"
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: "var(--brand-muted, #94a3b8)" }}
              tickLine={false}
              axisLine={false}
              interval={4}
            />
            <YAxis
              domain={[0, 30]}
              tick={{ fontSize: 11, fill: "var(--brand-muted, #94a3b8)" }}
              tickLine={false}
              axisLine={false}
              width={35}
              tickFormatter={(v) => `${v}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine
              y={15}
              stroke="#94a3b8"
              strokeDasharray="4 4"
              label={{
                value: "Maqsad: 15 daq",
                position: "right",
                fontSize: 11,
                fill: "var(--brand-muted, #94a3b8)",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              fill="url(#waitFill)"
              stroke="none"
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563EB"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#2563EB" }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
