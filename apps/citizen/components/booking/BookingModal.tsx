"use client"

import { useEffect, useCallback, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { Cancel01Icon } from "@hugeicons/core-free-icons"
import { useBooking } from "@/lib/booking"
import { BookingStepIndicator } from "./BookingStepIndicator"
import { BookingCard } from "./shared/BookingCard"
import { StepService } from "./steps/StepService"
import { StepSlot } from "./steps/StepSlot"
import { StepVerify } from "./steps/StepVerify"
import { StepSuccess } from "./steps/StepSuccess"

export function BookingModal() {
  const { state, dispatch, closeBooking } = useBooking()
  const triggerRef = useRef<HTMLElement | null>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  // Capture the element that triggered the modal
  useEffect(() => {
    if (state.isOpen) {
      triggerRef.current = document.activeElement as HTMLElement
    }
  }, [state.isOpen])

  // Keyboard handling
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!state.isOpen) return
      if (e.key === "Escape") {
        if (state.step === "success") return
        closeBooking()
      }
      // Focus trap
      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]!
        const last = focusable[focusable.length - 1]!
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    },
    [state.isOpen, state.step, closeBooking]
  )

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  // Return focus on close
  useEffect(() => {
    if (!state.isOpen && triggerRef.current) {
      triggerRef.current.focus()
      triggerRef.current = null
    }
  }, [state.isOpen])

  // Prevent body scroll when open
  useEffect(() => {
    if (state.isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [state.isOpen])

  // Browser back button closes modal
  useEffect(() => {
    if (!state.isOpen) return
    const handlePop = () => {
      if (state.isOpen) closeBooking()
    }
    window.addEventListener("popstate", handlePop)
    return () => window.removeEventListener("popstate", handlePop)
  }, [state.isOpen, closeBooking])

  function handleAdvanceScheduled() {
    dispatch({ type: "ADVANCE_TO_VERIFY" })
  }

  const isSuccess = state.step === "success"

  return (
    <AnimatePresence>
      {state.isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="booking-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              if (!isSuccess) closeBooking()
            }}
          />

          {/* Desktop Modal / Mobile Drawer */}
          <motion.div
            key="booking-modal"
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-modal-title"
            // Desktop: centered modal
            className="fixed z-50 w-full max-w-[520px] overflow-hidden rounded-2xl bg-white shadow-2xl max-md:inset-x-0 max-md:bottom-0 max-md:max-w-none max-md:rounded-b-none max-md:rounded-t-2xl md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2"
            // Desktop animation
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ maxHeight: "90vh" }}
          >
            {/* Header - fixed */}
            {!isSuccess && state.org && state.branch && (
              <div
                className="flex items-center justify-between border-b px-6 py-4"
                style={{ borderColor: "var(--c-border)" }}
              >
                <div id="booking-modal-title">
                  <BookingCard
                    orgName={state.org.name}
                    branchName={state.branch.name}
                    busyIndex={state.branch.busyIndex}
                    isOpen={state.branch.isOpen}
                  />
                </div>
                <button
                  onClick={closeBooking}
                  className="flex size-9 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-gray-100"
                  aria-label="Yopish"
                >
                  <HugeiconsIcon icon={Cancel01Icon} size={16} style={{ color: "var(--c-muted)" }} />
                </button>
              </div>
            )}

            {/* Step indicator */}
            {!isSuccess && (
              <div style={{ borderBottom: "1px solid var(--c-border)" }}>
                <BookingStepIndicator
                  currentStep={state.step}
                  preSelected={!!state.preSelectedServiceId}
                />
              </div>
            )}

            {/* Scrollable content */}
            <div
              className="overflow-y-auto overscroll-contain"
              style={{
                maxHeight: isSuccess ? "90vh" : "calc(90vh - 140px)",
                paddingBottom: "env(safe-area-inset-bottom, 0px)",
              }}
            >
              <div className="p-6">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={state.step}
                    initial={{
                      opacity: 0,
                      x: state.direction === "forward" ? 32 : -32,
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{
                      opacity: 0,
                      x: state.direction === "forward" ? -32 : 32,
                    }}
                    transition={{ duration: 0.22, ease: [0.32, 0.72, 0, 1] }}
                  >
                    {state.step === "service" && <StepService />}
                    {state.step === "slot" && (
                      <StepSlot onAdvanceScheduled={handleAdvanceScheduled} />
                    )}
                    {state.step === "verify" && <StepVerify />}
                    {state.step === "success" && <StepSuccess />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Footer - back button (not on success or service) */}
            {!isSuccess && state.step !== "service" && (
              <div
                className="border-t px-6 py-3"
                style={{ borderColor: "var(--c-border)" }}
              >
                <button
                  onClick={() => dispatch({ type: "GO_BACK" })}
                  className="text-sm font-medium transition-colors hover:opacity-80"
                  style={{ color: "var(--c-muted)" }}
                >
                  ← Orqaga
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
