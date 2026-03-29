"use client"

import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Clock01Icon, UserGroupIcon } from "@hugeicons/core-free-icons"
import { Card } from "@workspace/ui/components/card"
import type { Branch } from "@workspace/types"
import { getBusyColor } from "@/lib/utils"

interface BranchLeaderboardProps {
  branches: Branch[]
}

export function BranchLeaderboard({ branches }: BranchLeaderboardProps) {
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 100)
    return () => clearTimeout(t)
  }, [])

  return (
    <Card className="rounded-xl p-5">
      <h2 className="mb-5 text-sm font-semibold text-gray-900">
        Hozirgi holat
      </h2>
      <div className="space-y-4">
        {branches.map((branch) => {
          const color = getBusyColor(branch.busyIndex)
          return (
            <div
              key={branch.id}
              className="rounded-lg p-2"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">
                  {branch.name.split(" ")[0]}
                </span>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-xs" style={{ color: "var(--brand-muted)" }}>
                    <HugeiconsIcon icon={UserGroupIcon} size={12} />
                    {branch.currentQueue}
                  </span>
                  <span className="flex items-center gap-1 text-xs" style={{ color: "var(--brand-muted)" }}>
                    <HugeiconsIcon icon={Clock01Icon} size={12} />~{branch.avgWaitMinutes} daq
                  </span>
                  <span className="size-2.5 rounded-full" style={{ backgroundColor: color }} />
                </div>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: animated ? `${branch.busyIndex}%` : "0%",
                    backgroundColor: color,
                  }}
                />
              </div>
              <div className="mt-1 text-right">
                <span className="text-xs font-semibold" style={{ color }}>
                  {branch.busyIndex}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
