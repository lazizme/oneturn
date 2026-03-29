"use client"

import { useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Clock01Icon, UserGroupIcon, ZapIcon } from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { useBooking, useBookingDispatch } from "../booking-context"
import { randomInt } from "@workspace/mock-data"

function generateTimeSlots(): { time: string; remaining: number }[] {
  const now = new Date()
  const slots: { time: string; remaining: number }[] = []
  let hour = now.getHours()
  let minute = Math.ceil(now.getMinutes() / 30) * 30
  if (minute >= 60) {
    hour += 1
    minute = 0
  }

  for (let i = 0; i < 8; i++) {
    const h = hour + Math.floor((minute + i * 30) / 60)
    const m = (minute + i * 30) % 60
    if (h >= 18) break
    slots.push({
      time: `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`,
      remaining: randomInt(1, 5),
    })
  }

  if (slots.length === 0) {
    slots.push(
      { time: "09:00", remaining: 3 },
      { time: "09:30", remaining: 2 },
      { time: "10:00", remaining: 4 },
      { time: "10:30", remaining: 1 },
      { time: "11:00", remaining: 3 },
      { time: "11:30", remaining: 2 }
    )
  }

  return slots
}

const TIME_SLOTS = generateTimeSlots()

export function SlotStep() {
  const { selectedBranch } = useBooking()
  const dispatch = useBookingDispatch()
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  if (!selectedBranch) return null

  function handleLiveQueue() {
    dispatch({ type: "SET_BOOKING_TYPE", payload: "live" })
    dispatch({ type: "NEXT_STEP" })
  }

  function handleSchedule() {
    if (!selectedSlot) return
    dispatch({ type: "SET_BOOKING_TYPE", payload: "scheduled" })
    dispatch({ type: "SELECT_SLOT", payload: selectedSlot })
    dispatch({ type: "NEXT_STEP" })
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Live queue option */}
      <Card className="rounded-xl p-4">
        <div className="mb-3 flex items-center gap-2">
          <HugeiconsIcon icon={ZapIcon} size={16} className="text-green-500" />
          <h3 className="text-sm font-semibold text-gray-900">
            Hozir kelaman (Jonli navbat)
          </h3>
        </div>
        <div className="mb-3 flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <HugeiconsIcon icon={UserGroupIcon} size={12} />
            Hozirgi navbat: #{selectedBranch.currentQueue}
          </span>
          <span className="flex items-center gap-1">
            <HugeiconsIcon icon={Clock01Icon} size={12} />
            Kutish: ~{selectedBranch.avgWaitMinutes} daqiqa
          </span>
        </div>
        <Button
          onClick={handleLiveQueue}
          className="w-full rounded-xl"
          style={{ backgroundColor: "var(--brand-accent)" }}
        >
          Hozir navbatga kirish
        </Button>
      </Card>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-xs text-gray-400">yoki</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Scheduled option */}
      <Card className="rounded-xl p-4">
        <div className="mb-3 flex items-center gap-2">
          <HugeiconsIcon icon={Clock01Icon} size={16} style={{ color: "var(--brand-primary)" }} />
          <h3 className="text-sm font-semibold text-gray-900">
            Vaqt band qilaman
          </h3>
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot.time}
              onClick={() => setSelectedSlot(slot.time)}
              className={`rounded-lg border px-3 py-2 text-xs font-medium transition-all ${
                selectedSlot === slot.time
                  ? "border-transparent text-white"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
              style={
                selectedSlot === slot.time
                  ? { backgroundColor: "var(--brand-primary)" }
                  : undefined
              }
            >
              <div>{slot.time}</div>
              <div className="mt-0.5 text-[10px] opacity-70">
                {slot.remaining} joy
              </div>
            </button>
          ))}
        </div>
        <Button
          onClick={handleSchedule}
          disabled={!selectedSlot}
          className="w-full rounded-xl"
          style={{ backgroundColor: "var(--brand-primary)" }}
        >
          {selectedSlot
            ? `${selectedSlot} ga band qilish`
            : "Vaqtni tanlang"}
        </Button>
      </Card>
    </div>
  )
}
