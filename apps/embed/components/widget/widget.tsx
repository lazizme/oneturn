"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { BookingProvider } from "./booking-context"
import { WidgetTrigger } from "./widget-trigger"
import { WidgetModal } from "./widget-modal"

interface WidgetProps {
  orgId: string
}

export function Widget({ orgId }: WidgetProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <BookingProvider>
      <AnimatePresence>
        {isOpen ? (
          <WidgetModal onClose={() => setIsOpen(false)} />
        ) : (
          <WidgetTrigger onClick={() => setIsOpen(true)} />
        )}
      </AnimatePresence>
    </BookingProvider>
  )
}
