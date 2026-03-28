"use client"

import { useState, useReducer } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Check, Clock, Zap, Phone, ChevronRight, ChevronLeft, Loader2 } from "lucide-react"
import type { Branch, Service } from "@workspace/types"
import { generateTicketNumber, generateUzbekName } from "@workspace/mock-data"

interface BookingModalProps {
  open: boolean
  onClose: () => void
  branch: Branch
  orgName: string
  preSelectedService?: Service
}

interface BookingState {
  step: number
  selectedService: Service | null
  bookingType: "live" | "scheduled" | null
  selectedSlot: string | null
  phone: string
  otpCode: string
  otpVerified: boolean
  ticketNumber: string | null
  userName: string | null
}

type BookingAction =
  | { type: "SELECT_SERVICE"; service: Service }
  | { type: "SET_BOOKING_TYPE"; value: "live" | "scheduled" }
  | { type: "SELECT_SLOT"; slot: string }
  | { type: "SET_PHONE"; phone: string }
  | { type: "SET_OTP"; code: string }
  | { type: "VERIFY_OTP" }
  | { type: "CONFIRM"; ticketNumber: string; userName: string }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "RESET" }

function reducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case "SELECT_SERVICE":
      return { ...state, selectedService: action.service }
    case "SET_BOOKING_TYPE":
      return { ...state, bookingType: action.value }
    case "SELECT_SLOT":
      return { ...state, selectedSlot: action.slot }
    case "SET_PHONE":
      return { ...state, phone: action.phone }
    case "SET_OTP":
      return { ...state, otpCode: action.code }
    case "VERIFY_OTP":
      return { ...state, otpVerified: true }
    case "CONFIRM":
      return { ...state, ticketNumber: action.ticketNumber, userName: action.userName }
    case "NEXT_STEP":
      return { ...state, step: Math.min(state.step + 1, 4) }
    case "PREV_STEP":
      return { ...state, step: Math.max(state.step - 1, 1) }
    case "RESET":
      return initialState
    default:
      return state
  }
}

const initialState: BookingState = {
  step: 1,
  selectedService: null,
  bookingType: null,
  selectedSlot: null,
  phone: "",
  otpCode: "",
  otpVerified: false,
  ticketNumber: null,
  userName: null,
}

const timeSlots = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "12:00", "13:00", "13:30", "14:00", "14:30", "15:00",
  "15:30", "16:00", "16:30", "17:00",
]

export function BookingModal({ open, onClose, branch, orgName, preSelectedService }: BookingModalProps) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    selectedService: preSelectedService ?? null,
    step: preSelectedService ? 2 : 1,
  })
  const [loading, setLoading] = useState(false)

  if (!open) return null

  const stepLabels = ["Xizmat", "Vaqt", "Tasdiqlash"]
  const isSuccess = state.ticketNumber !== null

  function handleNext() {
    if (state.step === 1 && state.selectedService) {
      dispatch({ type: "NEXT_STEP" })
    } else if (state.step === 2 && (state.bookingType === "live" || state.selectedSlot)) {
      dispatch({ type: "NEXT_STEP" })
    } else if (state.step === 3 && state.phone.length >= 9) {
      setLoading(true)
      setTimeout(() => {
        const name = generateUzbekName()
        const ticket = generateTicketNumber("A", Math.floor(Math.random() * 50) + 10)
        dispatch({ type: "CONFIRM", ticketNumber: ticket, userName: `${name.first} ${name.last}` })
        dispatch({ type: "NEXT_STEP" })
        setLoading(false)
      }, 1200)
    }
  }

  function handleClose() {
    dispatch({ type: "RESET" })
    onClose()
  }

  const canNext =
    (state.step === 1 && state.selectedService !== null) ||
    (state.step === 2 && (state.bookingType === "live" || state.selectedSlot !== null)) ||
    (state.step === 3 && state.phone.length >= 9)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-[520px] rounded-2xl border bg-white shadow-xl"
        style={{ borderColor: "var(--c-border)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4" style={{ borderColor: "var(--c-border)" }}>
          <div>
            <p className="text-sm font-semibold" style={{ color: "var(--c-text)" }}>{branch.name}</p>
            <p className="text-xs" style={{ color: "var(--c-muted)" }}>{orgName}</p>
          </div>
          <button onClick={handleClose} className="rounded-lg p-1.5 transition-colors hover:bg-gray-100">
            <X className="size-4" style={{ color: "var(--c-muted)" }} />
          </button>
        </div>

        {/* Step indicator */}
        {!isSuccess && (
          <div className="flex items-center gap-1 border-b px-6 py-3" style={{ borderColor: "var(--c-border)" }}>
            {stepLabels.map((label, i) => {
              const stepNum = preSelectedService ? i + 2 : i + 1
              const isActive = state.step === stepNum
              const isDone = state.step > stepNum
              return (
                <div key={i} className="flex items-center gap-1">
                  {i > 0 && <ChevronRight className="size-3" style={{ color: "var(--c-border)" }} />}
                  <span
                    className="text-xs font-medium"
                    style={{ color: isActive ? "var(--c-primary)" : isDone ? "var(--c-accent)" : "var(--c-muted)" }}
                  >
                    {isDone ? "✓" : `${i + 1}`} {label}
                  </span>
                </div>
              )
            })}
          </div>
        )}

        {/* Content */}
        <div className="min-h-[320px] p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Service Selection */}
            {state.step === 1 && !isSuccess && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.15 }}
              >
                <p className="mb-4 text-sm font-semibold" style={{ color: "var(--c-text)" }}>
                  Xizmat turini tanlang
                </p>
                <div className="space-y-2">
                  {branch.services.filter((s) => s.isAvailable).map((service) => (
                    <button
                      key={service.id}
                      onClick={() => dispatch({ type: "SELECT_SERVICE", service })}
                      className="flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition-all"
                      style={{
                        borderColor: state.selectedService?.id === service.id ? "var(--c-primary)" : "var(--c-border)",
                        backgroundColor: state.selectedService?.id === service.id ? "var(--c-primary-light)" : "white",
                      }}
                    >
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--c-text)" }}>{service.name}</p>
                        <p className="text-xs" style={{ color: "var(--c-muted)" }}>~{service.estimatedDurationMin} daqiqa</p>
                      </div>
                      {state.selectedService?.id === service.id && (
                        <Check className="size-4" style={{ color: "var(--c-primary)" }} />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 2: Time Selection */}
            {state.step === 2 && !isSuccess && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.15 }}
              >
                <p className="mb-4 text-sm font-semibold" style={{ color: "var(--c-text)" }}>
                  Qachon kelmoqchisiz?
                </p>

                {/* Booking type */}
                <div className="mb-5 flex gap-3">
                  <button
                    onClick={() => dispatch({ type: "SET_BOOKING_TYPE", value: "live" })}
                    className="flex flex-1 items-center gap-2 rounded-xl border p-3 transition-all"
                    style={{
                      borderColor: state.bookingType === "live" ? "var(--c-accent)" : "var(--c-border)",
                      backgroundColor: state.bookingType === "live" ? "var(--c-accent-light)" : "white",
                    }}
                  >
                    <Zap className="size-4" style={{ color: "var(--c-accent)" }} />
                    <div className="text-left">
                      <p className="text-sm font-medium" style={{ color: "var(--c-text)" }}>Hozir</p>
                      <p className="text-xs" style={{ color: "var(--c-muted)" }}>Jonli navbatga qo&apos;shiling</p>
                    </div>
                  </button>
                  <button
                    onClick={() => dispatch({ type: "SET_BOOKING_TYPE", value: "scheduled" })}
                    className="flex flex-1 items-center gap-2 rounded-xl border p-3 transition-all"
                    style={{
                      borderColor: state.bookingType === "scheduled" ? "var(--c-primary)" : "var(--c-border)",
                      backgroundColor: state.bookingType === "scheduled" ? "var(--c-primary-light)" : "white",
                    }}
                  >
                    <Clock className="size-4" style={{ color: "var(--c-primary)" }} />
                    <div className="text-left">
                      <p className="text-sm font-medium" style={{ color: "var(--c-text)" }}>Vaqt tanlash</p>
                      <p className="text-xs" style={{ color: "var(--c-muted)" }}>Bron qiling</p>
                    </div>
                  </button>
                </div>

                {/* Time slots (shown for scheduled) */}
                {state.bookingType === "scheduled" && (
                  <div>
                    <p className="mb-2 text-xs font-medium" style={{ color: "var(--c-muted)" }}>Bugungi bo&apos;sh vaqtlar</p>
                    <div className="grid grid-cols-4 gap-2">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot}
                          onClick={() => dispatch({ type: "SELECT_SLOT", slot })}
                          className="rounded-lg border py-2 text-center text-sm font-medium transition-all"
                          style={{
                            borderColor: state.selectedSlot === slot ? "var(--c-primary)" : "var(--c-border)",
                            backgroundColor: state.selectedSlot === slot ? "var(--c-primary)" : "white",
                            color: state.selectedSlot === slot ? "white" : "var(--c-text)",
                          }}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {state.bookingType === "live" && (
                  <div className="rounded-xl p-4" style={{ backgroundColor: "var(--c-accent-light)" }}>
                    <p className="text-sm font-medium" style={{ color: "var(--c-accent)" }}>
                      Hozirgi navbatda {branch.currentQueue} kishi. Taxminiy kutish: ~{branch.avgWaitMinutes} daqiqa.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Phone Verification */}
            {state.step === 3 && !isSuccess && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.15 }}
              >
                <p className="mb-4 text-sm font-semibold" style={{ color: "var(--c-text)" }}>
                  Telefon raqamingiz
                </p>
                <div className="mb-4 flex items-center gap-2 rounded-xl border px-3 py-2.5" style={{ borderColor: "var(--c-border)" }}>
                  <Phone className="size-4" style={{ color: "var(--c-muted)" }} />
                  <span className="text-sm font-medium" style={{ color: "var(--c-muted)" }}>+998</span>
                  <input
                    type="tel"
                    value={state.phone}
                    onChange={(e) => dispatch({ type: "SET_PHONE", phone: e.target.value.replace(/\D/g, "").slice(0, 9) })}
                    placeholder="90 123 45 67"
                    className="flex-1 bg-transparent text-sm outline-none"
                    style={{ color: "var(--c-text)" }}
                  />
                </div>

                <div className="rounded-xl p-4" style={{ backgroundColor: "var(--c-surface)" }}>
                  <p className="mb-2 text-xs font-semibold" style={{ color: "var(--c-text)" }}>Buyurtma tafsilotlari</p>
                  <div className="space-y-1">
                    <p className="text-xs" style={{ color: "var(--c-muted)" }}>
                      Xizmat: <span style={{ color: "var(--c-text)" }}>{state.selectedService?.name}</span>
                    </p>
                    <p className="text-xs" style={{ color: "var(--c-muted)" }}>
                      Vaqt: <span style={{ color: "var(--c-text)" }}>
                        {state.bookingType === "live" ? "Hozir (jonli navbat)" : state.selectedSlot}
                      </span>
                    </p>
                    <p className="text-xs" style={{ color: "var(--c-muted)" }}>
                      Filial: <span style={{ color: "var(--c-text)" }}>{branch.name}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Success */}
            {isSuccess && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col items-center py-4 text-center"
              >
                <div className="mb-4 flex size-16 items-center justify-center rounded-full" style={{ backgroundColor: "var(--c-accent-light)" }}>
                  <Check className="size-8" style={{ color: "var(--c-accent)" }} />
                </div>
                <p className="mb-1 text-lg font-bold" style={{ color: "var(--c-text)" }}>
                  Navbat tasdiqlandi!
                </p>
                <p className="mb-6 text-sm" style={{ color: "var(--c-muted)" }}>
                  SMS xabar yuborildi
                </p>
                <div
                  className="mb-6 w-full rounded-xl border-2 p-6"
                  style={{ borderColor: "var(--c-primary)" }}
                >
                  <p className="text-5xl font-black" style={{ color: "var(--c-primary)" }}>
                    {state.ticketNumber}
                  </p>
                  <p className="mt-2 text-sm font-medium" style={{ color: "var(--c-text)" }}>
                    {state.userName}
                  </p>
                  <p className="mt-1 text-xs" style={{ color: "var(--c-muted)" }}>
                    {state.selectedService?.name} · {state.bookingType === "live" ? "Jonli navbat" : state.selectedSlot}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full rounded-xl py-3 text-sm font-semibold text-white"
                  style={{ backgroundColor: "var(--c-primary)" }}
                >
                  Yopish
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer (not shown on success) */}
        {!isSuccess && (
          <div className="flex items-center justify-between border-t px-6 py-4" style={{ borderColor: "var(--c-border)" }}>
            <button
              onClick={() => {
                if (state.step === 1 || (preSelectedService && state.step === 2)) {
                  handleClose()
                } else {
                  dispatch({ type: "PREV_STEP" })
                }
              }}
              className="flex items-center gap-1 text-sm font-medium transition-colors hover:text-gray-900"
              style={{ color: "var(--c-muted)" }}
            >
              <ChevronLeft className="size-4" />
              {state.step === 1 || (preSelectedService && state.step === 2) ? "Bekor qilish" : "Orqaga"}
            </button>
            <button
              onClick={handleNext}
              disabled={!canNext || loading}
              className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-semibold text-white transition-all disabled:opacity-50"
              style={{ backgroundColor: "var(--c-primary)" }}
            >
              {loading ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Tasdiqlanmoqda...
                </>
              ) : state.step === 3 ? (
                "Tasdiqlash"
              ) : (
                <>
                  Davom
                  <ChevronRight className="size-4" />
                </>
              )}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  )
}
