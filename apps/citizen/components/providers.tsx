"use client"

import type { ReactNode } from "react"
import { LocationProvider } from "@/context/location-context"
import { BookingProvider } from "@/lib/booking"
import { BookingModal } from "@/components/booking/BookingModal"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LocationProvider>
      <BookingProvider>
        {children}
        <BookingModal />
      </BookingProvider>
    </LocationProvider>
  )
}
