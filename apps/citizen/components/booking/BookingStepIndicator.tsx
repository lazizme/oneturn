"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon, Tick02Icon } from "@hugeicons/core-free-icons"
import type { BookingStep } from "@/lib/booking/types"

interface Props {
  currentStep: BookingStep
  preSelected: boolean
}

const allSteps: { key: BookingStep; label: string }[] = [
  { key: "service", label: "Xizmat" },
  { key: "slot", label: "Vaqt" },
  { key: "verify", label: "Tasdiqlash" },
]

const ORDER: BookingStep[] = ["service", "slot", "verify", "success"]

export function BookingStepIndicator({ currentStep, preSelected }: Props) {
  const steps = preSelected ? allSteps.filter((s) => s.key !== "service") : allSteps
  const currentIdx = ORDER.indexOf(currentStep)

  return (
    <div className="flex items-center gap-1 px-6 py-3">
      {steps.map((step, i) => {
        const stepIdx = ORDER.indexOf(step.key)
        const isActive = step.key === currentStep
        const isDone = currentIdx > stepIdx

        return (
          <div key={step.key} className="flex items-center gap-1">
            {i > 0 && (
              <HugeiconsIcon icon={ArrowRight01Icon} size={12} style={{ color: "var(--c-border)" }} />
            )}
            <span
              className="flex items-center gap-1 text-xs font-medium"
              style={{
                color: isActive ? "var(--c-primary)" : isDone ? "var(--c-accent)" : "var(--c-muted)",
              }}
              aria-current={isActive ? "step" : undefined}
            >
              {isDone ? <HugeiconsIcon icon={Tick02Icon} size={12} /> : `${i + 1}`}
              {" "}{step.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
