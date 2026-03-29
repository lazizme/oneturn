"use client"

import { use, useState, useMemo } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { CheckmarkCircle01Icon, Location01Icon, Clock01Icon, Calendar01Icon, CancelCircleIcon, Alert01Icon } from "@hugeicons/core-free-icons"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/layout/navbar"
import { toast } from "sonner"

const LeafletMap = dynamic(() => import("./leaflet-map"), { ssr: false })

const mockTicket = {
  ticketNumber: "A-14",
  orgName: "Yagona Darcha",
  branchName: "Chilonzor MFY",
  branchAddress: "Chilonzor 45",
  serviceName: "Pasport almashish",
  date: new Date(),
  time: "14:30",
  estimatedWait: 11,
  branchLat: 41.2995,
  branchLng: 69.2401,
}

export default function BookingPage({
  params,
}: {
  params: Promise<{ bookingId: string }>
}) {
  const { bookingId } = use(params)

  const [showConfirmCancel, setShowConfirmCancel] = useState(false)
  const [isCancelled, setIsCancelled] = useState(false)

  const formattedDate = useMemo(
    () => format(mockTicket.date, "d MMMM yyyy, EEEE"),
    []
  )

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mockTicket.branchLat},${mockTicket.branchLng}`

  function handleChangeTime() {
    toast("Tez orada...")
  }

  function handleCancelConfirm() {
    setIsCancelled(true)
    setShowConfirmCancel(false)
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--c-bg)" }}>
      <Navbar />

      <main className="mx-auto max-w-lg px-4 py-8">
        <AnimatePresence mode="wait">
          {isCancelled ? (
            /* Cancelled state */
            <motion.div
              key="cancelled"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl border-2 bg-white p-8 text-center shadow-lg"
              style={{ borderColor: "var(--c-border)" }}
            >
              <div
                className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full"
                style={{ backgroundColor: "#FEF2F2" }}
              >
                <HugeiconsIcon icon={CancelCircleIcon} size={32} style={{ color: "var(--c-danger)" }} />
              </div>

              <h1 className="text-xl font-bold" style={{ color: "var(--c-danger)" }}>
                Navbat bekor qilindi
              </h1>

              <p className="mt-2 text-sm" style={{ color: "var(--c-muted)" }}>
                #{bookingId}
              </p>

              <div className="my-6">
                <p className="text-sm font-medium" style={{ color: "var(--c-muted)" }}>
                  {mockTicket.orgName} &middot; {mockTicket.branchName}
                </p>
                <p
                  className="mt-2 text-6xl font-black line-through"
                  style={{ color: "var(--c-muted)" }}
                >
                  {mockTicket.ticketNumber}
                </p>
              </div>

              <p className="text-sm" style={{ color: "var(--c-muted)" }}>
                {mockTicket.serviceName} &middot; {formattedDate}
              </p>
            </motion.div>
          ) : (
            /* Active ticket */
            <motion.div
              key="active"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div
                className="rounded-2xl border-2 bg-white p-8 text-center shadow-lg"
                style={{ borderColor: "var(--c-primary)" }}
              >
                {/* Checkmark */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.4, delay: 0.2, type: "spring" }}
                  className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full"
                  style={{ backgroundColor: "var(--c-accent-light)" }}
                >
                  <HugeiconsIcon icon={CheckmarkCircle01Icon} size={32} style={{ color: "var(--c-accent)" }} />
                </motion.div>

                {/* Title */}
                <h1 className="text-xl font-bold" style={{ color: "var(--c-text)" }}>
                  Navbat tasdiqlandi
                </h1>

                {/* Org & branch */}
                <p
                  className="mt-3 text-lg font-bold"
                  style={{ color: "var(--c-text)" }}
                >
                  {mockTicket.orgName}
                </p>
                <p className="text-sm" style={{ color: "var(--c-muted)" }}>
                  {mockTicket.branchName}
                </p>

                {/* Separator */}
                <div
                  className="my-6 h-px"
                  style={{ backgroundColor: "var(--c-border)" }}
                />

                {/* Ticket number */}
                <motion.p
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="text-6xl font-black"
                  style={{ color: "var(--c-primary)" }}
                >
                  {mockTicket.ticketNumber}
                </motion.p>

                {/* Service */}
                <p className="mt-4 text-sm font-medium" style={{ color: "var(--c-text)" }}>
                  {mockTicket.serviceName}
                </p>

                {/* Date */}
                <div className="mt-3 flex items-center justify-center gap-2">
                  <HugeiconsIcon icon={Calendar01Icon} size={16} style={{ color: "var(--c-muted)" }} />
                  <span className="text-sm" style={{ color: "var(--c-muted)" }}>
                    {formattedDate}
                  </span>
                </div>

                {/* Time */}
                <div className="mt-2 flex items-center justify-center gap-2">
                  <HugeiconsIcon icon={Clock01Icon} size={16} style={{ color: "var(--c-muted)" }} />
                  <span className="text-sm" style={{ color: "var(--c-muted)" }}>
                    {mockTicket.time}
                  </span>
                </div>

                {/* Estimated wait */}
                <p className="mt-3 text-sm" style={{ color: "var(--c-muted)" }}>
                  Taxminiy kutish: ~{mockTicket.estimatedWait} daqiqa
                </p>

                {/* Address with directions link */}
                <div className="mt-4 flex items-center justify-center gap-2">
                  <HugeiconsIcon icon={Location01Icon} size={16} style={{ color: "var(--c-primary)" }} />
                  <span className="text-sm" style={{ color: "var(--c-text)" }}>
                    {mockTicket.branchAddress}
                  </span>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium"
                    style={{ color: "var(--c-primary)" }}
                  >
                    Yo&apos;l ko&apos;rsatish &rarr;
                  </a>
                </div>

                {/* Separator */}
                <div
                  className="my-6 h-px"
                  style={{ backgroundColor: "var(--c-border)" }}
                />

                {/* Action buttons */}
                <AnimatePresence mode="wait">
                  {showConfirmCancel ? (
                    <motion.div
                      key="confirm-cancel"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center justify-center gap-2 mb-3">
                        <HugeiconsIcon icon={Alert01Icon} size={20} style={{ color: "var(--c-warning)" }} />
                        <p className="text-sm font-semibold" style={{ color: "var(--c-text)" }}>
                          Navbatni bekor qilmoqchimisiz?
                        </p>
                      </div>
                      <p className="mb-4 text-xs" style={{ color: "var(--c-muted)" }}>
                        Diqqat: Tez-tez bekor qilish reyting pasayishiga olib kelishi mumkin.
                      </p>
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={handleCancelConfirm}
                          className="rounded-lg border-2 px-5 py-2 text-sm font-medium transition-colors hover:bg-red-50"
                          style={{
                            borderColor: "var(--c-danger)",
                            color: "var(--c-danger)",
                          }}
                        >
                          Ha, bekor qilish
                        </button>
                        <button
                          onClick={() => setShowConfirmCancel(false)}
                          className="rounded-lg px-5 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
                          style={{ backgroundColor: "var(--c-primary)" }}
                        >
                          Yo&apos;q
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="action-buttons"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center justify-center gap-3"
                    >
                      <button
                        onClick={handleChangeTime}
                        className="rounded-lg border-2 px-5 py-2 text-sm font-medium transition-colors hover:bg-blue-50"
                        style={{
                          borderColor: "var(--c-primary)",
                          color: "var(--c-primary)",
                        }}
                      >
                        Vaqtni o&apos;zgartirish
                      </button>
                      <button
                        onClick={() => setShowConfirmCancel(true)}
                        className="rounded-lg border-2 px-5 py-2 text-sm font-medium transition-colors hover:bg-red-50"
                        style={{
                          borderColor: "var(--c-danger)",
                          color: "var(--c-danger)",
                        }}
                      >
                        Bekor qilish
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Map */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="mt-6 overflow-hidden rounded-xl"
              >
                <LeafletMap
                  lat={mockTicket.branchLat}
                  lng={mockTicket.branchLng}
                  label={`${mockTicket.orgName} — ${mockTicket.branchName}`}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
