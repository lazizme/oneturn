"use client"

import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { Card } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import type { Booking, BookingStatus } from "@workspace/types"
import { getServiceName } from "@/lib/utils"
import type { Branch } from "@workspace/types"

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; bg: string; text: string }
> = {
  pending: { label: "Kutmoqda", bg: "bg-slate-100", text: "text-slate-600" },
  arrived: { label: "Keldi", bg: "bg-blue-100", text: "text-blue-700" },
  serving: { label: "Xizmatda", bg: "bg-blue-100", text: "text-blue-700" },
  completed: { label: "Yakunlandi", bg: "bg-emerald-100", text: "text-emerald-700" },
  no_show: { label: "No-show", bg: "bg-red-100", text: "text-red-700" },
  cancelled: { label: "Bekor", bg: "bg-amber-100", text: "text-amber-700" },
}

interface RecentBookingsProps {
  bookings: Booking[]
  branches: Branch[]
}

export function RecentBookings({ bookings, branches }: RecentBookingsProps) {
  const recent = bookings.slice(0, 10)

  return (
    <Card className="rounded-xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900">
          So&apos;nggi bronlar
        </h2>
        <Link
          href="/dashboard/bookings"
          className="flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80"
          style={{ color: "var(--brand-primary)" }}
        >
          Barchasi
          <HugeiconsIcon icon={ArrowRight02Icon} size={12} />
        </Link>
      </div>
      <div className="space-y-0">
        {recent.map((booking) => {
          const status = STATUS_CONFIG[booking.status]
          return (
            <div
              key={booking.id}
              className="flex items-center justify-between border-b border-gray-50 py-2.5 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="w-12 font-mono text-xs font-bold text-gray-900">
                  {booking.ticketNumber}
                </span>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {booking.userName}
                  </p>
                  <p className="text-xs" style={{ color: "var(--brand-muted)" }}>
                    {getServiceName(booking.serviceId, branches)}
                  </p>
                </div>
              </div>
              <Badge className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${status.bg} ${status.text}`}>
                {status.label}
              </Badge>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
