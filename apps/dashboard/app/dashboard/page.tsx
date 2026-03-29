"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import {
  CalendarCheckIn01Icon,
  UserBlock01Icon,
  Clock01Icon,
  Building01Icon,
} from "@hugeicons/core-free-icons"
import { Card } from "@workspace/ui/components/card"
import { mockBookings, mockBranches } from "@workspace/mock-data"
import { getStats, subscribe } from "@workspace/sync"
import { Topbar } from "@/components/topbar"
import { StatCard } from "@/components/overview/stat-card"
import { BranchLeaderboard } from "@/components/overview/branch-leaderboard"
import { HourlyChart } from "@/components/overview/hourly-chart"
import { RecentBookings } from "@/components/overview/recent-bookings"
import { OverviewSkeleton } from "@/components/overview/overview-skeleton"

const BranchMap = dynamic(
  () => import("@/components/overview/branch-map"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[280px] items-center justify-center rounded-xl bg-gray-100">
        <span className="text-sm" style={{ color: "var(--brand-muted)" }}>
          Xarita yuklanmoqda...
        </span>
      </div>
    ),
  }
)

const DEMO_ORG_ID = "agrobank-demo"

function computeStats() {
  const completed = mockBookings.filter(
    (b) => b.status === "completed" && b.actualDurationMin !== undefined
  )
  const noShowCount = mockBookings.filter((b) => b.status === "no_show").length
  const noShowRate = (noShowCount / mockBookings.length) * 100
  const avgWait =
    completed.length > 0
      ? Math.round(
          completed.reduce((sum, b) => sum + (b.actualDurationMin ?? 0), 0) /
            completed.length
        )
      : 0
  const activeBranches = mockBranches.filter((b) => b.isOpen).length

  return { noShowRate, avgWait, activeBranches }
}

export default function OverviewPage() {
  const [loading, setLoading] = useState(true)
  const [todayCount, setTodayCount] = useState(() => {
    if (typeof window !== "undefined") {
      return getStats(DEMO_ORG_ID).todayTotal
    }
    return 142
  })

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  // Subscribe to sync events — update stats in real time
  useEffect(() => {
    if (typeof window === "undefined") return
    return subscribe({ orgId: DEMO_ORG_ID }, () => {
      setTodayCount(getStats(DEMO_ORG_ID).todayTotal)
    })
  }, [])

  if (loading) {
    return (
      <>
        <Topbar title="Umumiy ko'rinish" subtitle="Agrobank boshqaruv paneli" />
        <OverviewSkeleton />
      </>
    )
  }

  const { noShowRate, avgWait, activeBranches } = computeStats()

  return (
    <>
      <Topbar title="Umumiy ko'rinish" subtitle="Agrobank boshqaruv paneli" />

      <div className="flex-1 overflow-auto p-6">
        {/* Stat cards */}
        <div className="mb-8 grid grid-cols-4 gap-4">
          <StatCard
            label="Bugungi bron"
            value={todayCount}
            delta="+12 kechadan"
            deltaPositive={true}
            icon={CalendarCheckIn01Icon}
            color="var(--brand-primary)"
          />
          <StatCard
            label="No-show darajasi"
            value={Math.round(noShowRate * 10) / 10}
            suffix="%"
            delta="-2% kechadan"
            deltaPositive={true}
            icon={UserBlock01Icon}
            color="var(--brand-danger)"
          />
          <StatCard
            label="O'rtacha kutish"
            value={avgWait}
            suffix=" daq"
            delta="-3 daq kechadan"
            deltaPositive={true}
            icon={Clock01Icon}
            color="var(--brand-warning)"
          />
          <StatCard
            label="Faol filiallar"
            value={activeBranches}
            suffix={`/${mockBranches.length}`}
            icon={Building01Icon}
            color="var(--brand-accent)"
          />
        </div>

        {/* Map + Leaderboard */}
        <div className="mb-8 grid grid-cols-5 gap-6">
          <Card className="col-span-3 overflow-hidden rounded-xl p-0">
            <BranchMap branches={mockBranches} />
          </Card>
          <div className="col-span-2">
            <BranchLeaderboard branches={mockBranches} />
          </div>
        </div>

        {/* Chart + Recent Bookings */}
        <div className="grid grid-cols-5 gap-6">
          <div className="col-span-3">
            <HourlyChart />
          </div>
          <div className="col-span-2">
            <RecentBookings bookings={mockBookings} branches={mockBranches} />
          </div>
        </div>
      </div>
    </>
  )
}
