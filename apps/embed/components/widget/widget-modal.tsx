"use client"

import { AnimatePresence, motion } from "framer-motion"
import { useBooking } from "./booking-context"
import { WidgetHeader } from "./widget-header"
import { LocationStep } from "./steps/location-step"
import { BranchStep } from "./steps/branch-step"
import { ServiceStep } from "./steps/service-step"
import { SlotStep } from "./steps/slot-step"
import { VerificationStep } from "./steps/verification-step"
import { SuccessStep } from "./steps/success-step"
interface WidgetModalProps {
  onClose: () => void
}

const stepVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
  }),
}

export function WidgetModal({ onClose }: WidgetModalProps) {
  const { step } = useBooking()

  function renderStep() {
    switch (step) {
      case 1:
        return <LocationStep />
      case 2:
        return <BranchStep />
      case 3:
        return <ServiceStep />
      case 4:
        return <SlotStep />
      case 5:
        return <VerificationStep />
      case 6:
        return <SuccessStep onClose={onClose} />
      default:
        return null
    }
  }

  return (
    <motion.div
      className="fixed right-6 bottom-20 z-50 flex w-[380px] flex-col overflow-hidden rounded-2xl border bg-white shadow-2xl"
      style={{ maxHeight: "min(600px, calc(100vh - 120px))" }}
      initial={{ scale: 0.8, opacity: 0, originX: 1, originY: 1 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <WidgetHeader onClose={onClose} />

      {/* Step progress bar */}
      {step < 6 && (
        <div className="px-4 pt-2">
          <div className="h-1 overflow-hidden rounded-full bg-gray-100">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: "var(--brand-primary)" }}
              initial={{ width: 0 }}
              animate={{ width: `${(step / 5) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait" custom={1}>
          <motion.div
            key={step}
            custom={1}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Branding footer */}
      <div className="border-t px-4 py-2 text-center">
        <span className="text-[10px] text-gray-300">
          Powered by{" "}
          <span
            className="font-semibold"
            style={{ color: "var(--brand-primary)" }}
          >
            OneTurn
          </span>
        </span>
      </div>
    </motion.div>
  )
}
