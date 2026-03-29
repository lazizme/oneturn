"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { Tick02Icon, Alert01Icon, Timer01Icon } from "@hugeicons/core-free-icons"
import { useStaff } from "@/context/staff-context"
import { mockBranches } from "@workspace/mock-data"
import { toast } from "sonner"

export function ServingScreen() {
  const {
    currentBooking,
    branchId,
    elapsedSeconds,
    estimatedDuration,
    dispatch,
    markComplete,
  } = useStaff()
  const [confirmUndo, setConfirmUndo] = useState(false)
  const [flashGreen, setFlashGreen] = useState(false)

  if (!currentBooking) return null

  const branch = mockBranches.find((b) => b.id === branchId)
  const service = branch?.services.find(
    (s) => s.id === currentBooking.serviceId
  )

  const minutes = Math.floor(elapsedSeconds / 60)
  const seconds = elapsedSeconds % 60
  const timeStr = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`

  const estimatedSec = (estimatedDuration ?? 20) * 60
  const isOvertime = elapsedSeconds > estimatedSec
  const isWayOvertime = elapsedSeconds > estimatedSec + 300 // +5 min
  const overtimeMin = Math.floor((elapsedSeconds - estimatedSec) / 60)

  let timerColor = "var(--staff-text)"
  if (isWayOvertime) timerColor = "var(--staff-red)"
  else if (isOvertime) timerColor = "var(--staff-amber)"

  function handleComplete() {
    const durationMin = Math.ceil(elapsedSeconds / 60)
    setFlashGreen(true)
    setTimeout(() => {
      toast.success(
        `${currentBooking!.ticketNumber} yakunlandi · ${durationMin} daqiqa`
      )
      markComplete()
      setFlashGreen(false)
    }, 200)
  }

  function handleUndo() {
    dispatch({ type: "UNDO_ARRIVED" })
    setConfirmUndo(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={`flex flex-1 flex-col items-center justify-center px-6 ${flashGreen ? "animate-flash-green" : ""}`}
      style={isWayOvertime ? { borderLeft: "3px solid var(--staff-red)", borderRight: "3px solid var(--staff-red)" } : undefined}
    >
      {/* Label */}
      <p
        className="mb-4 text-sm font-semibold uppercase tracking-widest"
        style={{ color: "var(--staff-blue)" }}
      >
        Xizmat davom etmoqda
      </p>

      {/* Ticket number */}
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
        className="mb-6 text-lg"
        style={{ color: "var(--staff-muted)" }}
      >
        {service?.name ?? currentBooking.serviceId}
      </p>

      {/* Timer */}
      <div className="mb-2 flex items-center gap-3">
        <HugeiconsIcon icon={Timer01Icon} size={20} style={{ color: timerColor }} />
        <span
          className="font-mono text-4xl font-bold"
          style={{ color: timerColor }}
        >
          {timeStr}
        </span>
      </div>

      {/* Overtime warning */}
      {isOvertime && (
        <p
          className="mb-2 flex items-center gap-1.5 text-sm"
          style={{ color: timerColor }}
        >
          <HugeiconsIcon icon={Alert01Icon} size={14} />
          +{overtimeMin} daq kechikmoqda
        </p>
      )}

      {/* Estimated duration */}
      <p
        className="mb-10 text-sm"
        style={{ color: "var(--staff-muted)" }}
      >
        Taxminiy davomiylik: ~{estimatedDuration ?? 20} daqiqa
      </p>

      {/* Complete button */}
      <button
        onClick={handleComplete}
        className="mb-4 flex w-full max-w-md items-center justify-center gap-3 rounded-2xl py-6 text-xl font-bold uppercase tracking-wide text-white transition-all duration-75 hover:brightness-110 active:scale-[0.97]"
        style={{ backgroundColor: "var(--staff-blue)", minHeight: "80px" }}
      >
        <HugeiconsIcon icon={Tick02Icon} size={24} />
        Xizmat yakunlandi
      </button>

      {/* Undo link */}
      {confirmUndo ? (
        <div
          className="w-full max-w-md rounded-xl p-4 text-center"
          style={{
            backgroundColor: "var(--staff-card)",
            border: "1px solid var(--staff-border)",
          }}
        >
          <p
            className="mb-3 text-sm"
            style={{ color: "var(--staff-muted)" }}
          >
            {currentBooking.ticketNumber}ni qaytarmoqchimisiz? Xizmat vaqti
            hisoblanmaydi.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleUndo}
              className="flex-1 rounded-lg px-3 py-2 text-sm font-medium text-white"
              style={{ backgroundColor: "var(--staff-amber)" }}
            >
              Ha
            </button>
            <button
              onClick={() => setConfirmUndo(false)}
              className="flex-1 rounded-lg px-3 py-2 text-sm font-medium"
              style={{
                color: "var(--staff-muted)",
                border: "1px solid var(--staff-border)",
              }}
            >
              Yo&apos;q
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setConfirmUndo(true)}
          className="text-sm transition-colors hover:underline"
          style={{ color: "var(--staff-muted)" }}
        >
          ← Orqaga (xato bosdim)
        </button>
      )}
    </motion.div>
  )
}
