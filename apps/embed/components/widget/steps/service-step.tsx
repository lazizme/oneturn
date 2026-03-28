"use client"

import { Clock } from "lucide-react"
import { Card } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import type { Service } from "@workspace/types"
import { useBooking, useBookingDispatch } from "../booking-context"

export function ServiceStep() {
  const { selectedBranch, selectedService } = useBooking()
  const dispatch = useBookingDispatch()

  if (!selectedBranch) return null

  const services = selectedBranch.services.filter((s) => s.isAvailable)

  function handleSelect(service: Service) {
    dispatch({ type: "SELECT_SERVICE", payload: service })
    dispatch({ type: "NEXT_STEP" })
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {services.map((service) => (
        <Card
          key={service.id}
          onClick={() => handleSelect(service)}
          className={`cursor-pointer rounded-xl p-4 transition-all hover:shadow-md ${
            selectedService?.id === service.id
              ? "ring-2"
              : ""
          }`}
          style={
            selectedService?.id === service.id
              ? { borderColor: "var(--brand-primary)" }
              : undefined
          }
        >
          <h3 className="text-sm font-semibold text-gray-900">
            {service.name}
          </h3>
          <div className="mt-2 flex items-center gap-1">
            <Clock className="size-3 text-gray-400" />
            <Badge
              variant="secondary"
              className="rounded-full px-2 py-0.5 text-[10px]"
            >
              ~{service.estimatedDurationMin} daq
            </Badge>
          </div>
          <p className="mt-1 text-[10px] text-gray-400">
            Soatiga {service.maxSlotsPerHour} joy
          </p>
        </Card>
      ))}
    </div>
  )
}
