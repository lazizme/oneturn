"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useBooking } from "@/lib/booking"
import { TicketCard } from "../shared/TicketCard"

const BRAND_COLORS = [
  "var(--c-primary)",
  "var(--c-accent)",
  "var(--c-warning)",
  "var(--c-danger)",
]

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  rotation: number
  isCircle: boolean
  durationExtra: number
}

function generateParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (Math.random() - 0.5) * 300,
    y: -(Math.random() * 200 + 100),
    color: BRAND_COLORS[Math.floor(Math.random() * BRAND_COLORS.length)]!,
    size: Math.random() * 6 + 4,
    rotation: Math.random() * 360,
    isCircle: Math.random() > 0.5,
    durationExtra: Math.random() * 0.6,
  }))
}

function AnimatedCheckmark() {
  return (
    <motion.svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      fill="none"
      initial="hidden"
      animate="visible"
    >
      {/* Circle */}
      <motion.circle
        cx="36"
        cy="36"
        r="32"
        stroke="var(--c-accent)"
        strokeWidth="3"
        fill="none"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 0.4, ease: "easeOut" },
          },
        }}
      />
      {/* Checkmark */}
      <motion.path
        d="M22 36L32 46L50 28"
        stroke="var(--c-accent)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={{
          hidden: { pathLength: 0, opacity: 0 },
          visible: {
            pathLength: 1,
            opacity: 1,
            transition: { duration: 0.3, delay: 0.3, ease: "easeOut" },
          },
        }}
      />
    </motion.svg>
  )
}

function Confetti() {
  const particles = useMemo(() => generateParticles(30), [])

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          initial={{
            x: 0,
            y: 0,
            opacity: 1,
            scale: 1,
            rotate: 0,
          }}
          animate={{
            x: p.x,
            y: [p.y, p.y + 400],
            opacity: [1, 1, 0],
            scale: [1, 1.2, 0.6],
            rotate: p.rotation,
          }}
          transition={{
            duration: 1.4 + p.durationExtra,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            width: p.size,
            height: p.size,
            borderRadius: p.isCircle ? "50%" : "2px",
            backgroundColor: p.color,
          }}
        />
      ))}
    </div>
  )
}

export function StepSuccess() {
  const { state, closeBooking } = useBooking()
  const router = useRouter()

  const booking = state.confirmedBooking

  if (!booking) return null

  const service = state.branch?.services.find(
    (s) => s.id === state.selectedServiceId,
  )

  const dateTimeLabel =
    booking.type === "live"
      ? "Jonli navbat"
      : booking.scheduledAt
        ? new Date(booking.scheduledAt).toLocaleString("uz-UZ", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })
        : ""

  const maskedPhone = state.phone
    ? `+998 ${state.phone.slice(0, 2)} *** ** ${state.phone.slice(7)}`
    : null

  return (
    <div
      className="flex flex-col items-center text-center"
      style={{ position: "relative", overflow: "hidden" }}
    >
      <Confetti />

      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="mb-3"
      >
        <AnimatedCheckmark />
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mb-4 text-lg font-bold"
        style={{ color: "var(--c-text)" }}
      >
        Navbat muvaffaqiyatli olindi!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mb-4 w-full"
      >
        <TicketCard
          ticketNumber={booking.ticketNumber}
          orgName={state.org?.name ?? ""}
          branchName={state.branch?.name ?? ""}
          serviceName={service?.name ?? ""}
          dateTime={dateTimeLabel}
          mode={booking.type}
          phone={booking.userPhone}
        />
      </motion.div>

      {maskedPhone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-5"
        >
          <p className="text-xs" style={{ color: "var(--c-muted)" }}>
            {maskedPhone}
          </p>
          <p
            className="text-xs font-medium"
            style={{ color: "var(--c-accent)" }}
          >
            SMS xabar yuborildi
          </p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="flex w-full flex-col gap-2"
      >
        <button
          onClick={() => {
            router.push(`/booking/${booking.id}`)
            closeBooking()
          }}
          className="w-full rounded-xl py-3 text-sm font-semibold text-white transition-all"
          style={{ backgroundColor: "var(--c-primary)" }}
        >
          {"Bronni ko\u2018rish \u2192"}
        </button>
        <button
          onClick={closeBooking}
          className="w-full py-2 text-sm font-medium transition-all"
          style={{ color: "var(--c-muted)", background: "none", border: "none" }}
        >
          Yopish
        </button>
      </motion.div>
    </div>
  )
}
