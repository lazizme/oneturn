"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"

interface BranchNoshow {
  name: string
  noshowRate: number
  noshowCount: number
  totalBookings: number
  trustScore: number
}

const branches: BranchNoshow[] = [
  {
    name: "Chilonzor",
    noshowRate: 8.3,
    noshowCount: 12,
    totalBookings: 142,
    trustScore: 83,
  },
  {
    name: "Yunusobod",
    noshowRate: 11.2,
    noshowCount: 18,
    totalBookings: 160,
    trustScore: 74,
  },
  {
    name: "Mirobod",
    noshowRate: 5.1,
    noshowCount: 6,
    totalBookings: 118,
    trustScore: 91,
  },
]

function getProgressColor(trustScore: number): string {
  if (trustScore > 85) return "var(--brand-accent, #10B981)"
  if (trustScore >= 70) return "var(--brand-warning, #F59E0B)"
  return "var(--brand-danger, #EF4444)"
}

export function NoshowBranchCards() {
  return (
    <div className="grid grid-cols-3 gap-4">
      {branches.map((branch) => {
        const trustPercent = 100 - branch.noshowRate
        const color = getProgressColor(branch.trustScore)

        return (
          <Card key={branch.name} className="rounded-xl">
            <CardHeader>
              <CardTitle>{branch.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-gray-900">
                  {branch.noshowRate}%
                </span>
                <span
                  className="text-sm"
                  style={{ color: "var(--brand-muted, #94a3b8)" }}
                >
                  no-show
                </span>
              </div>

              {/* Progress bar */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <span
                    className="text-xs"
                    style={{ color: "var(--brand-muted, #94a3b8)" }}
                  >
                    Mijoz ishonchi
                  </span>
                  <span className="text-xs font-medium text-gray-700">
                    {branch.trustScore}/100
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${trustPercent}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>
                <p
                  className="mt-1 text-[11px]"
                  style={{ color: "var(--brand-muted, #94a3b8)" }}
                >
                  {branch.trustScore}/100 mijoz ishonchi
                </p>
              </div>

              {/* Stats */}
              <div
                className="flex items-center gap-4 text-xs"
                style={{ color: "var(--brand-muted, #94a3b8)" }}
              >
                <span>{branch.noshowCount} ta no-show</span>
                <span>{branch.totalBookings} ta jami bron</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
