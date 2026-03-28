"use client"

import { useState, useCallback } from "react"
import { mockPeakHours } from "@workspace/mock-data"
import type { PeakHourCell } from "@workspace/mock-data"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

const DAY_LABELS = ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"]
const DAY_FULL_NAMES = [
  "Dushanba",
  "Seshanba",
  "Chorshanba",
  "Payshanba",
  "Juma",
  "Shanba",
  "Yakshanba",
]
const HOURS = Array.from({ length: 12 }, (_, i) => i + 8)

function getCellColor(bookings: number): string {
  if (bookings === 0) return "#F1F5F9"
  if (bookings <= 3) return "#BFDBFE"
  if (bookings <= 7) return "#60A5FA"
  if (bookings <= 12) return "#2563EB"
  return "#1E3A8A"
}

const LEGEND_COLORS = ["#F1F5F9", "#BFDBFE", "#60A5FA", "#2563EB", "#1E3A8A"]

interface TooltipState {
  visible: boolean
  x: number
  y: number
  dayName: string
  hour: number
  bookings: number
}

export function PeakHeatmap() {
  const [tooltip, setTooltip] = useState<TooltipState>({
    visible: false,
    x: 0,
    y: 0,
    dayName: "",
    hour: 0,
    bookings: 0,
  })

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent, cell: PeakHourCell) => {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
      const parentRect = (
        e.currentTarget as HTMLElement
      ).closest("[data-heatmap]")?.getBoundingClientRect()
      if (!parentRect) return
      setTooltip({
        visible: true,
        x: rect.left - parentRect.left + rect.width / 2,
        y: rect.top - parentRect.top - 8,
        dayName: DAY_FULL_NAMES[cell.day] ?? "",
        hour: cell.hour,
        bookings: cell.bookings,
      })
    },
    []
  )

  const handleMouseLeave = useCallback(() => {
    setTooltip((prev) => ({ ...prev, visible: false }))
  }, [])

  return (
    <Card className="rounded-xl">
      <CardHeader>
        <CardTitle>Soatlik band holat</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative" data-heatmap>
          {/* Tooltip */}
          {tooltip.visible && (
            <div
              className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 shadow-md"
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              {tooltip.dayName}{" "}
              {tooltip.hour.toString().padStart(2, "0")}:00 &mdash;{" "}
              {tooltip.bookings} ta bron
            </div>
          )}

          {/* Column headers */}
          <div
            className="mb-1 grid gap-1"
            style={{
              gridTemplateColumns: "40px repeat(12, 1fr)",
            }}
          >
            <div />
            {HOURS.map((h, i) => (
              <div
                key={h}
                className="text-center text-[10px]"
                style={{ color: "var(--brand-muted, #94a3b8)" }}
              >
                {i % 2 === 0
                  ? `${h.toString().padStart(2, "0")}:00`
                  : ""}
              </div>
            ))}
          </div>

          {/* Grid rows */}
          {DAY_LABELS.map((dayLabel, dayIndex) => (
            <div
              key={dayLabel}
              className="mb-1 grid gap-1"
              style={{
                gridTemplateColumns: "40px repeat(12, 1fr)",
              }}
            >
              <div
                className="flex items-center text-xs font-medium"
                style={{ color: "var(--brand-muted, #94a3b8)" }}
              >
                {dayLabel}
              </div>
              {HOURS.map((hour) => {
                const cell = mockPeakHours.find(
                  (c) => c.day === dayIndex && c.hour === hour
                )
                const bookings = cell?.bookings ?? 0
                return (
                  <div
                    key={hour}
                    className="aspect-[2/1] cursor-pointer rounded-sm transition-transform hover:scale-110"
                    style={{ backgroundColor: getCellColor(bookings) }}
                    onMouseEnter={(e) =>
                      cell && handleMouseEnter(e, cell)
                    }
                    onMouseLeave={handleMouseLeave}
                  />
                )
              })}
            </div>
          ))}

          {/* Legend */}
          <div className="mt-4 flex items-center justify-end gap-1.5">
            <span
              className="text-[10px]"
              style={{ color: "var(--brand-muted, #94a3b8)" }}
            >
              Kam
            </span>
            {LEGEND_COLORS.map((color) => (
              <div
                key={color}
                className="h-3 w-5 rounded-sm"
                style={{ backgroundColor: color }}
              />
            ))}
            <span
              className="text-[10px]"
              style={{ color: "var(--brand-muted, #94a3b8)" }}
            >
              Ko&apos;p
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
