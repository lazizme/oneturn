"use client"

import type { TimeSlot } from "@/lib/booking/types"

interface SlotPickerProps {
  slots: TimeSlot[]
  selectedSlot: string | null
  onSelect: (slot: string) => void
  loading?: boolean
}

export function SlotPicker({
  slots,
  selectedSlot,
  onSelect,
  loading = false,
}: SlotPickerProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg"
            style={{
              height: 44,
              backgroundColor: "var(--c-surface)",
            }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-4 gap-2">
      {slots.map((slot) => {
        const isSelected = selectedSlot === slot.datetime
        const isUnavailable = !slot.available

        return (
          <button
            key={slot.datetime}
            onClick={() => {
              if (!isUnavailable) onSelect(slot.datetime)
            }}
            disabled={isUnavailable}
            className="flex flex-col items-center justify-center rounded-lg border px-1 py-1.5 text-center transition-all"
            style={{
              minHeight: 44,
              borderColor: isSelected
                ? "var(--c-primary)"
                : "var(--c-border)",
              backgroundColor: isUnavailable
                ? "var(--c-surface)"
                : isSelected
                  ? "var(--c-primary)"
                  : "white",
              color: isUnavailable
                ? "var(--c-muted)"
                : isSelected
                  ? "white"
                  : "var(--c-text)",
              opacity: isUnavailable ? 0.5 : 1,
              cursor: isUnavailable ? "not-allowed" : "pointer",
            }}
          >
            <span
              className="text-sm font-semibold"
              style={{
                textDecoration: isUnavailable ? "line-through" : "none",
              }}
            >
              {slot.time}
            </span>
            {!isUnavailable && (
              <span
                className="text-[10px] leading-tight"
                style={{
                  color: isSelected ? "rgba(255,255,255,0.8)" : "var(--c-muted)",
                }}
              >
                {slot.spotsLeft} joy
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
