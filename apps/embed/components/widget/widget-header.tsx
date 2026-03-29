"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowLeft02Icon, Cancel01Icon } from "@hugeicons/core-free-icons"
import { useBooking, useBookingDispatch } from "./booking-context"

const STEP_TITLES = [
  "Qayerdasiz?",
  "Filialni tanlang",
  "Xizmat turini tanlang",
  "Qachon kelasiz?",
  "Tasdiqlash",
  "Tayyor!",
]

interface WidgetHeaderProps {
  onClose: () => void
}

export function WidgetHeader({ onClose }: WidgetHeaderProps) {
  const { step } = useBooking()
  const dispatch = useBookingDispatch()

  return (
    <div className="flex items-center justify-between border-b px-4 py-3">
      <div className="flex items-center gap-3">
        {step > 1 && step < 6 && (
          <button
            onClick={() => dispatch({ type: "PREV_STEP" })}
            className="rounded-lg p-1 transition-colors hover:bg-gray-100"
          >
            <HugeiconsIcon icon={ArrowLeft02Icon} size={16} className="text-gray-500" />
          </button>
        )}
        <div>
          <h2 className="text-sm font-semibold text-gray-900">
            {STEP_TITLES[step - 1]}
          </h2>
          {step < 6 && (
            <p className="text-xs text-gray-400">
              Qadam {step}/5
            </p>
          )}
        </div>
      </div>
      <button
        onClick={onClose}
        className="rounded-lg p-1 transition-colors hover:bg-gray-100"
      >
        <HugeiconsIcon icon={Cancel01Icon} size={16} className="text-gray-500" />
      </button>
    </div>
  )
}
