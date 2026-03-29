"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { Tick02Icon, Cancel01Icon, Clock01Icon, ZapIcon } from "@hugeicons/core-free-icons"
import { useStaff } from "@/context/staff-context"
import { mockBranches } from "@workspace/mock-data"

export function WaitingScreen() {
  const {
    currentBooking,
    branchId,
    markArrived,
    markNoShow,
  } = useStaff()
  const [confirmNoShow, setConfirmNoShow] = useState(false)

  if (!currentBooking) return null

  const branch = mockBranches.find((b) => b.id === branchId)
  const service = branch?.services.find(
    (s) => s.id === currentBooking.serviceId
  )

  function handleKeldi() {
    markArrived()
  }

  function handleNoShowConfirm() {
    markNoShow()
    setConfirmNoShow(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-1 flex-col items-center justify-center px-6"
    >
      {/* Label */}
      <p
        className="mb-4 text-sm font-semibold uppercase tracking-widest"
        style={{ color: "var(--staff-muted)" }}
      >
        Hozirgi navbat
      </p>

      {/* Ticket number — massive */}
      <p
        className="mb-2"
        style={{
          fontSize: "80px",
          fontWeight: 800,
          color: "var(--staff-text)",
          letterSpacing: "-2px",
          lineHeight: 1,
        }}
      >
        {currentBooking.ticketNumber}
      </p>

      {/* Name */}
      <p
        className="mb-1 text-2xl font-semibold"
        style={{ color: "var(--staff-text)" }}
      >
        {currentBooking.userName}
      </p>

      {/* Service */}
      <p
        className="mb-4 text-lg"
        style={{ color: "var(--staff-muted)" }}
      >
        {service?.name ?? currentBooking.serviceId}
      </p>

      {/* Booking type + time */}
      <p
        className="mb-10 flex items-center gap-2 text-sm"
        style={{ color: "var(--staff-muted)" }}
      >
        {currentBooking.type === "live" ? (
          <HugeiconsIcon icon={ZapIcon} size={14} />
        ) : (
          <HugeiconsIcon icon={Clock01Icon} size={14} />
        )}
        {currentBooking.type === "scheduled"
          ? `Bron: ${new Date(currentBooking.createdAt).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}`
          : "Jonli navbat"}
      </p>

      {/* Action buttons or confirmation */}
      {confirmNoShow ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md rounded-2xl p-6 text-center"
          style={{
            backgroundColor: "var(--staff-card)",
            border: "1px solid var(--staff-border)",
          }}
        >
          <p
            className="mb-1 text-base font-semibold"
            style={{ color: "var(--staff-text)" }}
          >
            {currentBooking.userName} kelmadimi?
          </p>
          <p
            className="mb-5 text-sm"
            style={{ color: "var(--staff-muted)" }}
          >
            Uning reytingi kamayadi.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleNoShowConfirm}
              className="flex-1 rounded-2xl py-4 text-base font-bold uppercase tracking-wide text-white transition-all duration-75 hover:brightness-110 active:scale-[0.97]"
              style={{ backgroundColor: "var(--staff-red)" }}
            >
              Ha, kelmadi
            </button>
            <button
              onClick={() => setConfirmNoShow(false)}
              className="flex-1 rounded-2xl py-4 text-base font-bold uppercase tracking-wide transition-all duration-75 active:scale-[0.97]"
              style={{
                color: "var(--staff-muted)",
                border: "1px solid var(--staff-border)",
              }}
            >
              Bekor qilish
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="flex w-full max-w-lg gap-4">
          <button
            onClick={handleKeldi}
            className="flex flex-[1.2] items-center justify-center gap-3 rounded-2xl py-6 text-xl font-bold uppercase tracking-wide text-white transition-all duration-75 hover:brightness-110 active:scale-[0.97]"
            style={{ backgroundColor: "var(--staff-green)", minHeight: "80px" }}
          >
            <HugeiconsIcon icon={Tick02Icon} size={24} />
            Keldi
          </button>
          <button
            onClick={() => setConfirmNoShow(true)}
            className="flex flex-1 items-center justify-center gap-3 rounded-2xl py-6 text-xl font-bold uppercase tracking-wide text-white transition-all duration-75 opacity-85 hover:opacity-100 hover:brightness-110 active:scale-[0.97]"
            style={{ backgroundColor: "var(--staff-red)", minHeight: "80px" }}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={24} />
            Kelmadi
          </button>
        </div>
      )}
    </motion.div>
  )
}
