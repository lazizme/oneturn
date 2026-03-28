"use client"

import { motion } from "framer-motion"
import { Check, X, Clock, Zap } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Card } from "@workspace/ui/components/card"
import type { Booking } from "@workspace/types"
import { mockBranches } from "@workspace/mock-data"
import { ServiceTimer } from "./service-timer"

interface QueueCardProps {
  booking: Booking
  onArrived?: () => void
  onCompleted?: () => void
  onNoShow?: () => void
}

function getServiceName(serviceId: string): string {
  for (const branch of mockBranches) {
    const service = branch.services.find((s) => s.id === serviceId)
    if (service) return service.name
  }
  return serviceId
}

function getEstimatedDuration(serviceId: string): number | undefined {
  for (const branch of mockBranches) {
    const service = branch.services.find((s) => s.id === serviceId)
    if (service) return service.estimatedDurationMin
  }
  return undefined
}

export function QueueCard({
  booking,
  onArrived,
  onCompleted,
  onNoShow,
}: QueueCardProps) {
  const serviceName = getServiceName(booking.serviceId)
  const estimatedDuration = getEstimatedDuration(booking.serviceId)

  return (
    <motion.div
      layout
      layoutId={booking.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <Card className="rounded-xl p-3">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-lg font-black text-gray-900">
              {booking.ticketNumber}
            </p>
            <p className="text-sm font-medium text-gray-700">
              {booking.userName}
            </p>
          </div>
          <Badge
            className="rounded-full px-2 py-0.5 text-[10px] text-white"
            style={{
              backgroundColor:
                booking.type === "live"
                  ? "var(--brand-accent)"
                  : "var(--brand-primary)",
            }}
          >
            {booking.type === "live" ? (
              <span className="flex items-center gap-1">
                <Zap className="size-2.5" /> Jonli
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Clock className="size-2.5" /> Bron
              </span>
            )}
          </Badge>
        </div>

        <p className="mt-1 text-xs text-gray-500">{serviceName}</p>

        {/* Timer for serving status */}
        {booking.status === "serving" && booking.serviceStartedAt && (
          <div className="mt-2">
            <ServiceTimer
              startedAt={booking.serviceStartedAt}
              estimatedMinutes={estimatedDuration}
            />
          </div>
        )}

        {/* Duration for completed */}
        {booking.status === "completed" &&
          booking.actualDurationMin !== undefined && (
            <p className="mt-1 text-[10px] text-gray-400">
              {booking.actualDurationMin} daq
            </p>
          )}

        {/* Actions */}
        {booking.status === "pending" && (
          <div className="mt-3 flex gap-2">
            <Button
              size="sm"
              className="h-7 flex-1 rounded-lg text-xs text-white"
              style={{ backgroundColor: "var(--brand-accent)" }}
              onClick={onArrived}
            >
              <Check className="mr-1 size-3" />
              Keldi
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 rounded-lg text-xs"
              style={{
                color: "var(--brand-danger)",
                borderColor: "var(--brand-danger)",
              }}
              onClick={onNoShow}
            >
              <X className="size-3" />
            </Button>
          </div>
        )}

        {booking.status === "arrived" && (
          <div className="mt-3">
            <Button
              size="sm"
              className="h-7 w-full rounded-lg text-xs text-white"
              style={{ backgroundColor: "var(--brand-primary)" }}
              onClick={onArrived}
            >
              Xizmatni boshlash
            </Button>
          </div>
        )}

        {booking.status === "serving" && (
          <div className="mt-3">
            <Button
              size="sm"
              className="h-7 w-full rounded-lg text-xs text-white"
              style={{ backgroundColor: "var(--brand-accent)" }}
              onClick={onCompleted}
            >
              <Check className="mr-1 size-3" />
              Yakunlandi
            </Button>
          </div>
        )}
      </Card>
    </motion.div>
  )
}
