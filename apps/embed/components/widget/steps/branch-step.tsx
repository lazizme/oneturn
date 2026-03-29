"use client"

import { useMemo, useState } from "react"
import dynamic from "next/dynamic"
import { HugeiconsIcon } from "@hugeicons/react"
import { Clock01Icon, Location01Icon, UserGroupIcon } from "@hugeicons/core-free-icons"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import type { Branch } from "@workspace/types"
import { mockBranches } from "@workspace/mock-data"
import { useBooking, useBookingDispatch } from "../booking-context"

const BranchMap = dynamic(() => import("../branch-map"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[200px] items-center justify-center rounded-xl bg-gray-100">
      <span className="text-sm text-gray-400">Xarita yuklanmoqda...</span>
    </div>
  ),
})

function getBusyColor(busyIndex: number) {
  if (busyIndex <= 40) return "var(--brand-accent)"
  if (busyIndex <= 70) return "var(--brand-warning)"
  return "var(--brand-danger)"
}

function getBusyLabel(busyIndex: number) {
  if (busyIndex <= 40) return "Bo'sh"
  if (busyIndex <= 70) return "O'rtacha"
  return "Band"
}

function getDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export function BranchStep() {
  const { location } = useBooking()
  const dispatch = useBookingDispatch()
  const [showReroute, setShowReroute] = useState(true)

  const sortedBranches = useMemo(() => {
    if (!location) return mockBranches
    return [...mockBranches].sort((a, b) => {
      const distA = getDistance(location.lat, location.lng, a.lat, a.lng)
      const distB = getDistance(location.lat, location.lng, b.lat, b.lng)
      return distA - distB
    })
  }, [location])

  const closest = sortedBranches[0]
  const betterAlternative =
    closest && closest.busyIndex > 70
      ? sortedBranches.find((b) => b.id !== closest.id && b.busyIndex < 70)
      : null

  function handleSelect(branch: Branch) {
    dispatch({ type: "SELECT_BRANCH", payload: branch })
    dispatch({ type: "NEXT_STEP" })
  }

  return (
    <div className="flex flex-col gap-3 p-4">
      <BranchMap
        branches={mockBranches}
        userLocation={location}
        onSelectBranch={handleSelect}
      />

      {/* Smart rerouting banner */}
      {showReroute && betterAlternative && closest && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">
          <p className="text-xs text-amber-800">
            💡 {closest.name} ({closest.currentQueue} kutmoqda).{" "}
            {betterAlternative.name} biroz uzoqroq, lekin{" "}
            {closest.avgWaitMinutes - betterAlternative.avgWaitMinutes} daq
            tejaysiz
          </p>
          <div className="mt-2 flex gap-2">
            <Button
              size="sm"
              className="h-7 rounded-lg text-xs"
              style={{ backgroundColor: "var(--brand-primary)" }}
              onClick={() => handleSelect(betterAlternative)}
            >
              {betterAlternative.name.split(" ")[0]}ga o&apos;tish
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 rounded-lg text-xs"
              onClick={() => setShowReroute(false)}
            >
              Shu yerda qolish
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {sortedBranches.map((branch) => {
          const dist = location
            ? getDistance(location.lat, location.lng, branch.lat, branch.lng)
            : null
          return (
            <Card
              key={branch.id}
              className="cursor-pointer rounded-xl p-3 transition-all hover:shadow-md"
              onClick={() => handleSelect(branch)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">
                      {branch.name}
                    </h3>
                    <Badge
                      className="rounded-full px-2 py-0.5 text-[10px] text-white"
                      style={{
                        backgroundColor: getBusyColor(branch.busyIndex),
                      }}
                    >
                      {getBusyLabel(branch.busyIndex)}
                    </Badge>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-gray-500">
                    {dist !== null && (
                      <span className="flex items-center gap-1">
                        <HugeiconsIcon icon={Location01Icon} size={12} />
                        {dist.toFixed(1)} km
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <HugeiconsIcon icon={UserGroupIcon} size={12} />
                      {branch.currentQueue} kutmoqda
                    </span>
                    <span className="flex items-center gap-1">
                      <HugeiconsIcon icon={Clock01Icon} size={12} />~{branch.avgWaitMinutes}{" "}
                      daq
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
