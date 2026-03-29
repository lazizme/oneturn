"use client"

import { useMemo, useState } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { HugeiconsIcon } from "@hugeicons/react"
import { PlusSignIcon, Refresh01Icon } from "@hugeicons/core-free-icons"
import { mockBranches } from "@workspace/mock-data"
import { useQueue } from "./queue-context"
import { QueueColumn } from "./queue-column"

export function QueueBoard() {
  const {
    bookings,
    selectedBranch,
    setSelectedBranch,
    markArrived,
    markCompleted,
    markNoShow,
    addSimulatedBooking,
  } = useQueue()

  const [autoRefresh] = useState(true)

  const waiting = useMemo(
    () => bookings.filter((b) => b.status === "pending" || b.status === "arrived"),
    [bookings]
  )
  const serving = useMemo(
    () => bookings.filter((b) => b.status === "serving"),
    [bookings]
  )
  const completed = useMemo(
    () =>
      bookings
        .filter((b) => b.status === "completed")
        .slice(0, 20),
    [bookings]
  )

  function handleArrived(bookingId: string) {
    const booking = bookings.find((b) => b.id === bookingId)
    if (booking?.status === "pending") {
      markArrived(bookingId)
    } else if (booking?.status === "arrived") {
      // Start service — change to serving
      markArrived(bookingId)
    }
  }

  const now = new Date()
  const timeString = now.toLocaleTimeString("uz-UZ", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="flex h-full flex-col">
      {/* Controls bar */}
      <div className="flex items-center justify-between border-b bg-white px-6 py-3">
        <div className="flex items-center gap-4">
          <Select
            value={selectedBranch}
            onValueChange={setSelectedBranch}
          >
            <SelectTrigger className="w-48 rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {mockBranches.map((branch) => (
                <SelectItem key={branch.id} value={branch.id}>
                  {branch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Badge variant="secondary" className="rounded-full">
            <HugeiconsIcon
              icon={Refresh01Icon}
              size={12}
              className={`mr-1 ${autoRefresh ? "animate-spin" : ""}`}
              style={{ animationDuration: "3s" }}
            />
            {autoRefresh ? "Avto-yangilash" : "To'xtatilgan"}
          </Badge>

          <span className="font-mono text-sm text-gray-500">
            {timeString}
          </span>
        </div>

        <Button
          size="sm"
          className="rounded-xl text-xs"
          variant="outline"
          onClick={addSimulatedBooking}
        >
          <HugeiconsIcon icon={PlusSignIcon} size={12} className="mr-1" />
          Simulyatsiya
        </Button>
      </div>

      {/* Kanban columns */}
      <div className="flex flex-1 gap-4 overflow-hidden p-4">
        <QueueColumn
          title="KUTMOQDA"
          count={waiting.length}
          color="var(--brand-warning)"
          bookings={waiting}
          onArrived={handleArrived}
          onNoShow={markNoShow}
        />
        <QueueColumn
          title="XIZMATDA"
          count={serving.length}
          color="var(--brand-primary)"
          bookings={serving}
          onCompleted={markCompleted}
        />
        <QueueColumn
          title="YAKUNLANDI"
          count={completed.length}
          color="var(--brand-accent)"
          bookings={completed}
        />
      </div>
    </div>
  )
}
