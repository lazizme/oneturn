"use client"

import { AnimatePresence } from "framer-motion"
import { ScrollArea } from "@workspace/ui/components/scroll-area"
import type { Booking } from "@workspace/types"
import { QueueCard } from "./queue-card"

interface QueueColumnProps {
  title: string
  count: number
  color: string
  bookings: Booking[]
  onArrived?: (id: string) => void
  onCompleted?: (id: string) => void
  onNoShow?: (id: string) => void
}

export function QueueColumn({
  title,
  count,
  color,
  bookings,
  onArrived,
  onCompleted,
  onNoShow,
}: QueueColumnProps) {
  return (
    <div className="flex flex-1 flex-col rounded-xl border bg-gray-50/50">
      <div className="flex items-center justify-between border-b bg-white px-4 py-3 rounded-t-xl">
        <div className="flex items-center gap-2">
          <div
            className="size-2.5 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h3 className="text-sm font-semibold text-gray-900">
            {title}
          </h3>
        </div>
        <span
          className="flex size-6 items-center justify-center rounded-full text-xs font-bold text-white"
          style={{ backgroundColor: color }}
        >
          {count}
        </span>
      </div>
      <ScrollArea className="flex-1 p-3">
        <div className="space-y-2">
          <AnimatePresence mode="popLayout">
            {bookings.map((booking) => (
              <QueueCard
                key={booking.id}
                booking={booking}
                onArrived={() => onArrived?.(booking.id)}
                onCompleted={() => onCompleted?.(booking.id)}
                onNoShow={() => onNoShow?.(booking.id)}
              />
            ))}
          </AnimatePresence>
          {bookings.length === 0 && (
            <p className="py-8 text-center text-xs text-gray-400">
              Hozircha yo&apos;q
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
