"use client"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import { Card } from "@workspace/ui/components/card"

const HOURS = Array.from({ length: 11 }, (_, i) => {
  const hour = i + 8
  return {
    hour: `${hour.toString().padStart(2, "0")}:00`,
    bookings:
      hour === 10
        ? 22
        : hour === 11
          ? 19
          : hour === 9
            ? 16
            : hour === 14
              ? 18
              : hour === 15
                ? 17
                : hour === 12
                  ? 8
                  : hour === 13
                    ? 7
                    : hour === 16
                      ? 12
                      : hour === 17
                        ? 9
                        : hour === 8
                          ? 6
                          : 4,
  }
})

export function HourlyChart() {
  const currentHour = new Date().getHours()

  return (
    <Card className="rounded-xl p-5">
      <h2 className="mb-5 text-sm font-semibold text-gray-900">
        Bugungi bronlar
      </h2>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={HOURS} barSize={24}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis
            dataKey="hour"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            width={30}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              fontSize: "12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            }}
            formatter={(value: number) => [`${value} ta bron`, "Bronlar"]}
          />
          <Bar dataKey="bookings" radius={[6, 6, 0, 0]}>
            {HOURS.map((entry, index) => {
              const h = parseInt(entry.hour)
              return (
                <Cell
                  key={index}
                  fill={h === currentHour ? "#10B981" : "#2563EB"}
                  fillOpacity={h === currentHour ? 1 : 0.75}
                />
              )
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}
