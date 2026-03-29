"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import type { Booking } from "@workspace/types"
import {
  mockBookings,
  mockBranches,
  generateUzbekName,
  generatePhone,
  generateTicketNumber,
  generateEditToken,
} from "@workspace/mock-data"
import { subscribe, updateBookingStatus } from "@workspace/sync"
import { toast } from "sonner"

interface QueueState {
  bookings: Booking[]
  selectedBranch: string
}

interface QueueContextValue extends QueueState {
  setSelectedBranch: (branchId: string) => void
  markArrived: (bookingId: string) => void
  markCompleted: (bookingId: string) => void
  markNoShow: (bookingId: string) => void
  addSimulatedBooking: () => void
}

const DEMO_ORG_ID = "agrobank-demo"

const QueueContext = createContext<QueueContextValue | null>(null)

function createTodayBookings(branchId: string): Booking[] {
  const now = new Date()
  const branchBookings = mockBookings
    .filter((b) => b.branchId === branchId)
    .map((b) => ({
      ...b,
      createdAt: new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
        new Date(b.createdAt).getHours(),
        new Date(b.createdAt).getMinutes()
      ),
    }))

  // Ensure a mix of statuses for demo
  const result: Booking[] = []
  const statuses = [
    "pending",
    "pending",
    "pending",
    "pending",
    "pending",
    "arrived",
    "serving",
    "serving",
    "completed",
    "completed",
    "completed",
    "completed",
    "completed",
  ] as const

  branchBookings.slice(0, 15).forEach((b, i) => {
    const status = statuses[i % statuses.length] ?? "pending"
    const arrivedAt =
      status !== "pending"
        ? new Date(now.getTime() - Math.random() * 3600000)
        : undefined
    const serviceStartedAt =
      status === "serving" || status === "completed"
        ? new Date(
            (arrivedAt ?? now).getTime() + Math.random() * 600000
          )
        : undefined
    const serviceEndedAt =
      status === "completed" && serviceStartedAt
        ? new Date(
            serviceStartedAt.getTime() +
              Math.random() * 1200000
          )
        : undefined

    result.push({
      ...b,
      status,
      arrivedAt,
      serviceStartedAt,
      serviceEndedAt,
      actualDurationMin:
        serviceStartedAt && serviceEndedAt
          ? Math.round(
              (serviceEndedAt.getTime() -
                serviceStartedAt.getTime()) /
                60000
            )
          : undefined,
    })
  })

  return result
}

let ticketCounter = 50

export function QueueProvider({ children }: { children: ReactNode }) {
  const [selectedBranch, setSelectedBranch] = useState(
    mockBranches[0]?.id ?? ""
  )
  const [bookings, setBookings] = useState<Booking[]>(() =>
    createTodayBookings(mockBranches[0]?.id ?? "")
  )

  // Re-generate bookings when branch changes
  useEffect(() => {
    setBookings(createTodayBookings(selectedBranch))
  }, [selectedBranch])

  // Subscribe to sync events (bookings from citizen app)
  useEffect(() => {
    if (typeof window === "undefined") return
    return subscribe({ branchId: selectedBranch }, (event) => {
      if (event.type === "NEW_BOOKING") {
        setBookings((prev) => [event.booking, ...prev])
        toast.success(`Yangi bron: ${event.booking.ticketNumber} · ${event.booking.userName}`)
      }
      if (event.type === "BOOKING_UPDATED") {
        setBookings((prev) =>
          prev.map((b) => (b.id === event.booking.id ? event.booking : b))
        )
      }
    })
  }, [selectedBranch])

  const markArrived = useCallback((bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id !== bookingId) return b
        if (b.status === "pending") {
          const updated = { ...b, status: "arrived" as const, arrivedAt: new Date() }
          if (typeof window !== "undefined") updateBookingStatus(b, "arrived", { arrivedAt: new Date() })
          return updated
        }
        if (b.status === "arrived") {
          const updated = { ...b, status: "serving" as const, serviceStartedAt: new Date() }
          if (typeof window !== "undefined") updateBookingStatus(b, "serving", { serviceStartedAt: new Date() })
          return updated
        }
        return b
      })
    )
  }, [])

  const markCompleted = useCallback((bookingId: string) => {
    setBookings((prev) => {
      const booking = prev.find((b) => b.id === bookingId)
      if (booking && typeof window !== "undefined") {
        updateBookingStatus(booking, "completed", {
          serviceEndedAt: new Date(),
          actualDurationMin: booking.serviceStartedAt
            ? Math.round((Date.now() - new Date(booking.serviceStartedAt).getTime()) / 60000)
            : undefined,
        })
      }
      const updated = prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: "completed" as const,
              serviceEndedAt: new Date(),
              actualDurationMin: b.serviceStartedAt
                ? Math.round(
                    (Date.now() -
                      new Date(b.serviceStartedAt).getTime()) /
                      60000
                  )
                : undefined,
            }
          : b
      )

      // Notify next in line
      const waiting = updated.filter(
        (b) =>
          b.status === "pending" &&
          b.branchId === booking?.branchId
      )
      if (waiting[0]) {
        toast.success(
          `${waiting[0].ticketNumber} ${waiting[0].userName}ga SMS yuborildi`
        )
      }

      return updated
    })
  }, [])

  const markNoShow = useCallback((bookingId: string) => {
    setBookings((prev) => {
      const booking = prev.find((b) => b.id === bookingId)
      if (booking && typeof window !== "undefined") {
        updateBookingStatus(booking, "no_show")
      }
      return prev.map((b) =>
        b.id === bookingId ? { ...b, status: "no_show" as const } : b
      )
    })
    toast.error("Foydalanuvchi reytingi kamaytirildi")
  }, [])

  const addSimulatedBooking = useCallback(() => {
    ticketCounter++
    const name = generateUzbekName()
    const branch = mockBranches.find(
      (b) => b.id === selectedBranch
    )
    const service = branch?.services[
      Math.floor(Math.random() * (branch?.services.length ?? 1))
    ]

    const newBooking: Booking = {
      id: `sim-${ticketCounter}`,
      ticketNumber: generateTicketNumber(
        "A",
        ticketCounter
      ),
      orgId: "agrobank-demo",
      branchId: selectedBranch,
      serviceId: service?.id ?? "",
      userPhone: generatePhone(),
      userName: `${name.first} ${name.last}`,
      type: Math.random() > 0.5 ? "scheduled" : "live",
      status: "pending",
      createdAt: new Date(),
      editToken: generateEditToken(),
    }

    setBookings((prev) => [newBooking, ...prev])
    toast.info(
      `Yangi bron: ${newBooking.ticketNumber} ${newBooking.userName}`
    )
  }, [selectedBranch])

  return (
    <QueueContext.Provider
      value={{
        bookings,
        selectedBranch,
        setSelectedBranch,
        markArrived,
        markCompleted,
        markNoShow,
        addSimulatedBooking,
      }}
    >
      {children}
    </QueueContext.Provider>
  )
}

export function useQueue() {
  const ctx = useContext(QueueContext)
  if (!ctx)
    throw new Error("useQueue must be used within QueueProvider")
  return ctx
}
