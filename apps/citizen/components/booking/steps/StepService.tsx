"use client"

import { useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { useBooking } from "@/lib/booking"

export function StepService() {
  const { state, dispatch } = useBooking()
  const services = state.branch?.services.filter((s) => s.isAvailable) ?? []

  const handleSelect = useCallback(
    (serviceId: string) => {
      dispatch({ type: "SELECT_SERVICE", serviceId })
    },
    [dispatch],
  )

  return (
    <div>
      <p
        className="mb-4 text-sm font-semibold"
        style={{ color: "var(--c-text)" }}
      >
        Xizmatni tanlang
      </p>

      <div className="space-y-2">
        {services.map((service) => {
          const isSelected = state.selectedServiceId === service.id

          return (
            <button
              key={service.id}
              onClick={() => handleSelect(service.id)}
              className="flex w-full items-center justify-between rounded-xl border-2 px-4 text-left transition-all"
              style={{
                minHeight: 56,
                borderColor: isSelected
                  ? "var(--c-primary)"
                  : "var(--c-border)",
                backgroundColor: isSelected
                  ? "var(--c-primary-light)"
                  : "transparent",
              }}
            >
              <div>
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--c-text)" }}
                >
                  {service.name}
                </p>
                <p className="text-xs" style={{ color: "var(--c-muted)" }}>
                  ~{service.estimatedDurationMin} daqiqa
                </p>
              </div>
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={16}
                className="shrink-0"
                style={{ color: "var(--c-muted)" }}
              />
            </button>
          )
        })}

        {services.length === 0 && (
          <p className="py-8 text-center text-sm" style={{ color: "var(--c-muted)" }}>
            Mavjud xizmatlar topilmadi
          </p>
        )}
      </div>
    </div>
  )
}
