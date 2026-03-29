"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { AnalyticsUpIcon, AnalyticsDownIcon } from "@hugeicons/core-free-icons"
import { Card } from "@workspace/ui/components/card"
import { useCountUp } from "@/hooks/use-count-up"

interface StatCardProps {
  label: string
  value: number
  suffix?: string
  delta?: string
  deltaPositive?: boolean
  icon: any
  color: string
}

export function StatCard({
  label,
  value,
  suffix = "",
  delta,
  deltaPositive,
  icon: Icon,
  color,
}: StatCardProps) {
  const animatedValue = useCountUp(value)

  return (
    <Card className="rounded-xl p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium" style={{ color: "var(--brand-muted)" }}>
            {label}
          </p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {animatedValue}
            {suffix && (
              <span className="text-lg font-semibold text-gray-400">
                {suffix}
              </span>
            )}
          </p>
          {delta && (
            <div className="mt-2 flex items-center gap-1">
              {deltaPositive ? (
                <HugeiconsIcon icon={AnalyticsUpIcon} size={14} style={{ color: "var(--brand-accent)" }} />
              ) : (
                <HugeiconsIcon icon={AnalyticsDownIcon} size={14} style={{ color: "var(--brand-accent)" }} />
              )}
              <span className="text-xs" style={{ color: "var(--brand-muted)" }}>
                {delta}
              </span>
            </div>
          )}
        </div>
        <div
          className="flex size-11 items-center justify-center rounded-xl"
          style={{
            backgroundColor: `color-mix(in srgb, ${color} 12%, transparent)`,
          }}
        >
          <HugeiconsIcon icon={Icon} size={20} style={{ color }} />
        </div>
      </div>
    </Card>
  )
}
