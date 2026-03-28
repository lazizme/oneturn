"use client"

import { motion, AnimatePresence } from "framer-motion"
import { X, Phone, Star } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Separator } from "@workspace/ui/components/separator"
import type { Booking } from "@workspace/types"
import type { Branch } from "@workspace/types"
import { getServiceName, getBranchName, formatDate } from "@/lib/utils"

interface BookingDetailPanelProps {
  booking: Booking | null
  branches: Branch[]
  onClose: () => void
}

export function BookingDetailPanel({
  booking,
  branches,
  onClose,
}: BookingDetailPanelProps) {
  return (
    <AnimatePresence>
      {booking && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed top-0 right-0 z-50 flex h-full w-[420px] flex-col border-l bg-white shadow-xl"
            initial={{ x: 420 }}
            animate={{ x: 0 }}
            exit={{ x: 420 }}
            transition={{ ease: [0.32, 0.72, 0, 1], duration: 0.35 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b px-6 py-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="gap-1 text-xs"
              >
                <X className="size-3.5" />
                Yopish
              </Button>
              <span className="font-mono text-lg font-black text-gray-900">
                {booking.ticketNumber}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {/* User info */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">
                  {booking.userName}
                </h3>
                <div className="mt-2 flex items-center gap-3">
                  <span className="flex items-center gap-1 text-sm" style={{ color: "var(--brand-muted)" }}>
                    <Phone className="size-3.5" />
                    {booking.userPhone}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-1 text-sm" style={{ color: "var(--brand-muted)" }}>
                  <Star className="size-3.5" style={{ color: "var(--brand-warning)" }} />
                  Reyting: 94/100
                </div>
              </div>

              <Separator className="mb-6" />

              {/* Booking info */}
              <div className="mb-6">
                <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                  Bron ma&apos;lumotlari
                </h4>
                <div className="space-y-2.5">
                  <InfoRow
                    label="Filial"
                    value={getBranchName(booking.branchId, branches)}
                  />
                  <InfoRow
                    label="Xizmat"
                    value={getServiceName(booking.serviceId, branches)}
                  />
                  <InfoRow
                    label="Turi"
                    value={booking.type === "scheduled" ? "Oldindan bron" : "Jonli navbat"}
                  />
                  {booking.scheduledAt && (
                    <InfoRow
                      label="Rejalashtirilgan"
                      value={formatDate(booking.scheduledAt)}
                    />
                  )}
                  {booking.actualDurationMin !== undefined && (
                    <InfoRow
                      label="Davomiyligi"
                      value={`${booking.actualDurationMin} daqiqa`}
                    />
                  )}
                </div>
              </div>

              <Separator className="mb-6" />

              {/* Timeline */}
              <div>
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                  Tarix
                </h4>
                <div className="relative pl-6">
                  <div
                    className="absolute top-1 left-[7px] h-[calc(100%-12px)] w-[2px]"
                    style={{ backgroundColor: "var(--brand-border)" }}
                  />
                  <TimelineItem
                    time={formatTime(booking.createdAt)}
                    label="Bron qilindi"
                    active
                  />
                  {booking.createdAt && (
                    <TimelineItem
                      time={formatTime(
                        new Date(
                          new Date(booking.createdAt).getTime() + 8 * 60000
                        )
                      )}
                      label="SMS tasdiqlash yuborildi"
                      active
                    />
                  )}
                  {booking.arrivedAt && (
                    <TimelineItem
                      time={formatTime(booking.arrivedAt)}
                      label="Keldi (Aziz N. tasdiqladi)"
                      active
                    />
                  )}
                  {booking.serviceStartedAt && (
                    <TimelineItem
                      time={formatTime(booking.serviceStartedAt)}
                      label="Xizmat boshlandi"
                      active
                    />
                  )}
                  {booking.serviceEndedAt && (
                    <TimelineItem
                      time={formatTime(booking.serviceEndedAt)}
                      label={`Yakunlandi · ${booking.actualDurationMin} daqiqa`}
                      active
                    />
                  )}
                  {booking.status === "no_show" && (
                    <TimelineItem
                      time="—"
                      label="Kelmadi (no-show)"
                      active={false}
                      danger
                    />
                  )}
                  {booking.status === "cancelled" && (
                    <TimelineItem
                      time="—"
                      label="Bekor qilindi"
                      active={false}
                      danger
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t px-6 py-4">
              <Button variant="outline" size="sm" className="rounded-xl text-xs" style={{ color: "var(--brand-danger)", borderColor: "var(--brand-danger)" }}>
                Bekor qilish
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl text-xs" onClick={onClose}>
                Yopish
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm" style={{ color: "var(--brand-muted)" }}>
        {label}
      </span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  )
}

function TimelineItem({
  time,
  label,
  active,
  danger,
}: {
  time: string
  label: string
  active: boolean
  danger?: boolean
}) {
  return (
    <div className="relative mb-4 last:mb-0">
      <div
        className="absolute -left-6 top-1 size-3.5 rounded-full border-2"
        style={{
          backgroundColor: danger
            ? "var(--brand-danger)"
            : active
              ? "var(--brand-accent)"
              : "white",
          borderColor: danger
            ? "var(--brand-danger)"
            : active
              ? "var(--brand-accent)"
              : "var(--brand-border)",
        }}
      />
      <div className="flex items-baseline gap-3">
        <span className="w-12 font-mono text-xs" style={{ color: "var(--brand-muted)" }}>
          {time}
        </span>
        <span className={`text-sm ${danger ? "font-medium" : ""}`} style={danger ? { color: "var(--brand-danger)" } : { color: "var(--brand-text)" }}>
          {label}
        </span>
      </div>
    </div>
  )
}

function formatTime(date: Date): string {
  const d = new Date(date)
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`
}
