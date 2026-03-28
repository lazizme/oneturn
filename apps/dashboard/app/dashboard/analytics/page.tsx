"use client"

import { useEffect, useState } from "react"
import { Topbar } from "@/components/topbar"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { WaitTimeChart } from "@/components/analytics/wait-time-chart"
import { NoshowChart } from "@/components/analytics/noshow-chart"
import { PeakHeatmap } from "@/components/analytics/peak-heatmap"
import { ServiceAccuracyChart } from "@/components/analytics/service-accuracy-chart"
import { BranchComparisonChart } from "@/components/analytics/branch-comparison-chart"
import { NoshowBranchCards } from "@/components/analytics/noshow-branch-cards"

const RANGES = [
  { label: "7 kun", value: "7" },
  { label: "30 kun", value: "30" },
  { label: "90 kun", value: "90" },
]

function AnalyticsSkeleton() {
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="mb-6 grid grid-cols-2 gap-6">
        <Skeleton className="h-[380px] rounded-xl" />
        <Skeleton className="h-[380px] rounded-xl" />
      </div>
      <Skeleton className="mb-6 h-[320px] rounded-xl" />
      <Skeleton className="mb-6 h-[360px] rounded-xl" />
      <Skeleton className="mb-6 h-[260px] rounded-xl" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-[220px] rounded-xl" />
        <Skeleton className="h-[220px] rounded-xl" />
        <Skeleton className="h-[220px] rounded-xl" />
      </div>
    </div>
  )
}

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true)
  const [range, setRange] = useState("30")

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const activeRange = RANGES.find((r) => r.value === range)

  return (
    <>
      <Topbar title="Analitika" subtitle={`So'nggi ${activeRange?.label ?? "30 kun"}`} />

      {loading ? (
        <AnalyticsSkeleton />
      ) : (
        <div className="flex-1 overflow-auto p-6">
          {/* Time range toggle */}
          <div className="mb-6 flex items-center gap-2">
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
                  range === r.value
                    ? "text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                style={
                  range === r.value
                    ? { backgroundColor: "var(--brand-primary, #2563EB)" }
                    : undefined
                }
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Row 1: Wait Time + No-show side by side */}
          <div className="mb-6 grid grid-cols-2 gap-6">
            <WaitTimeChart />
            <NoshowChart />
          </div>

          {/* Row 2: Peak Heatmap */}
          <div className="mb-6">
            <PeakHeatmap />
          </div>

          {/* Row 3: Service Accuracy */}
          <div className="mb-6">
            <ServiceAccuracyChart />
          </div>

          {/* Row 4: Branch Comparison */}
          <div className="mb-6">
            <BranchComparisonChart />
          </div>

          {/* Row 5: No-show Branch Cards */}
          <div>
            <NoshowBranchCards />
          </div>
        </div>
      )}
    </>
  )
}
