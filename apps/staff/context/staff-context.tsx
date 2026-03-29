"use client"

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import type { Booking } from "@workspace/types"
import {
  mockBranches,
  mockBookings,
  generateUzbekName,
  generatePhone,
  generateEditToken,
} from "@workspace/mock-data"
import { getQueue, seedIfEmpty, subscribe, updateBookingStatus } from "@workspace/sync"
import { toast } from "sonner"

export interface Operator {
  name: string
  initials: string
}

interface StaffState {
  operator: Operator | null
  branchId: string
  branchName: string
  orgName: string
  queue: Booking[]
  currentStatus: "waiting" | "serving" | "empty"
  serviceStartedAt: Date | null
  elapsedSeconds: number
}

type StaffAction =
  | { type: "LOGIN"; operator: Operator; branchId: string }
  | { type: "LOGOUT" }
  | { type: "MARK_ARRIVED" }
  | { type: "MARK_NO_SHOW" }
  | { type: "MARK_COMPLETE" }
  | { type: "UNDO_ARRIVED" }
  | { type: "ADD_TO_QUEUE"; booking: Booking }
  | { type: "TICK" }
  | { type: "SET_QUEUE"; queue: Booking[] }

function getBranchInfo(branchId: string) {
  const branch = mockBranches.find((b) => b.id === branchId)
  return {
    branchName: branch?.name ?? branchId,
    orgName: "AGROBANK",
  }
}

function getQueueStatus(queue: Booking[]): "waiting" | "serving" | "empty" {
  if (queue.length === 0) return "empty"
  return "waiting"
}

function createInitialQueue(branchId: string): Booking[] {
  const branchBookings = mockBookings
    .filter((b) => b.branchId === branchId && b.status === "pending")
    .slice(0, 12)
    .map((b, i) => ({
      ...b,
      status: "pending" as const,
      ticketNumber: `A-${(i + 10).toString().padStart(2, "0")}`,
    }))
  return branchBookings
}

function reducer(state: StaffState, action: StaffAction): StaffState {
  switch (action.type) {
    case "LOGIN": {
      const { branchName, orgName } = getBranchInfo(action.branchId)
      const queue = createInitialQueue(action.branchId)
      return {
        ...state,
        operator: action.operator,
        branchId: action.branchId,
        branchName,
        orgName,
        queue,
        currentStatus: getQueueStatus(queue),
        serviceStartedAt: null,
        elapsedSeconds: 0,
      }
    }

    case "LOGOUT":
      return {
        ...state,
        operator: null,
        queue: [],
        currentStatus: "empty",
        serviceStartedAt: null,
        elapsedSeconds: 0,
      }

    case "MARK_ARRIVED": {
      if (state.queue.length === 0) return state
      return {
        ...state,
        currentStatus: "serving",
        serviceStartedAt: new Date(),
        elapsedSeconds: 0,
      }
    }

    case "MARK_NO_SHOW": {
      const newQueue = state.queue.slice(1)
      return {
        ...state,
        queue: newQueue,
        currentStatus: getQueueStatus(newQueue),
        serviceStartedAt: null,
        elapsedSeconds: 0,
      }
    }

    case "MARK_COMPLETE": {
      const newQueue = state.queue.slice(1)
      return {
        ...state,
        queue: newQueue,
        currentStatus: getQueueStatus(newQueue),
        serviceStartedAt: null,
        elapsedSeconds: 0,
      }
    }

    case "UNDO_ARRIVED":
      return {
        ...state,
        currentStatus: "waiting",
        serviceStartedAt: null,
        elapsedSeconds: 0,
      }

    case "ADD_TO_QUEUE":
      return {
        ...state,
        queue: [...state.queue, action.booking],
        currentStatus: state.currentStatus === "empty" ? "waiting" : state.currentStatus,
      }

    case "TICK":
      if (!state.serviceStartedAt) return state
      return {
        ...state,
        elapsedSeconds: Math.floor(
          (Date.now() - state.serviceStartedAt.getTime()) / 1000
        ),
      }

    case "SET_QUEUE":
      return {
        ...state,
        queue: action.queue,
        currentStatus: getQueueStatus(action.queue),
      }

    default:
      return state
  }
}

const initialState: StaffState = {
  operator: null,
  branchId: "",
  branchName: "",
  orgName: "",
  queue: [],
  currentStatus: "empty",
  serviceStartedAt: null,
  elapsedSeconds: 0,
}

interface StaffContextValue extends StaffState {
  dispatch: React.Dispatch<StaffAction>
  currentBooking: Booking | null
  nextBooking: Booking | null
  estimatedDuration: number | undefined
  queueCount: number
  avgWait: number
  markArrived: () => void
  markNoShow: () => void
  markComplete: () => void
}

const StaffContext = createContext<StaffContextValue | null>(null)

let ticketCounter = 30

export function StaffProvider({
  children,
  branchId,
}: {
  children: ReactNode
  branchId: string
}) {
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    branchId,
  })

  const currentBooking = state.queue.length > 0 ? state.queue[0]! : null
  const nextBooking = state.queue.length > 1 ? state.queue[1]! : null

  const getEstimatedDuration = useCallback(() => {
    if (!currentBooking) return undefined
    const branch = mockBranches.find((b) => b.id === state.branchId)
    const service = branch?.services.find(
      (s) => s.id === currentBooking.serviceId
    )
    return service?.estimatedDurationMin
  }, [currentBooking, state.branchId])

  // ── Sync: seed localStorage on login & load synced queue ───────────────
  useEffect(() => {
    if (!state.operator || !state.branchId) return
    // Seed localStorage with the initial mock queue if it's empty
    seedIfEmpty("agrobank-demo", state.branchId, state.queue)
    // Load from localStorage (may have more bookings from citizen app)
    const syncedQueue = getQueue(state.branchId)
    if (syncedQueue.length > 0) {
      dispatch({ type: "SET_QUEUE", queue: syncedQueue })
    }
  }, [state.operator, state.branchId]) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Sync: subscribe to cross-tab events ────────────────────────────────
  useEffect(() => {
    if (!state.operator || !state.branchId) return
    return subscribe({ branchId: state.branchId }, (event) => {
      if (event.type === "NEW_BOOKING") {
        dispatch({ type: "ADD_TO_QUEUE", booking: event.booking })
        toast.success(`Yangi navbat: ${event.booking.ticketNumber} · ${event.booking.userName}`)
      }
      if (event.type === "BOOKING_UPDATED") {
        // Reload full queue to stay in sync
        dispatch({ type: "SET_QUEUE", queue: getQueue(state.branchId) })
      }
    })
  }, [state.operator, state.branchId])

  // ── Sync: write-through wrappers for status changes ────────────────────
  const handleMarkArrived = useCallback(() => {
    const booking = state.queue[0]
    if (booking && typeof window !== "undefined") {
      updateBookingStatus(booking, "arrived", { arrivedAt: new Date() })
    }
    dispatch({ type: "MARK_ARRIVED" })
  }, [state.queue])

  const handleMarkNoShow = useCallback(() => {
    const booking = state.queue[0]
    if (booking && typeof window !== "undefined") {
      updateBookingStatus(booking, "no_show")
    }
    dispatch({ type: "MARK_NO_SHOW" })
  }, [state.queue])

  const handleMarkComplete = useCallback(() => {
    const booking = state.queue[0]
    if (booking && typeof window !== "undefined") {
      updateBookingStatus(booking, "completed", { serviceEndedAt: new Date() })
    }
    dispatch({ type: "MARK_COMPLETE" })
  }, [state.queue])

  // Timer tick every second when serving
  useEffect(() => {
    if (state.currentStatus !== "serving") return
    const interval = setInterval(() => {
      dispatch({ type: "TICK" })
    }, 1000)
    return () => clearInterval(interval)
  }, [state.currentStatus])

  // Simulate incoming bookings every 90 seconds
  useEffect(() => {
    if (!state.operator) return
    const interval = setInterval(() => {
      ticketCounter++
      const name = generateUzbekName()
      const branch = mockBranches.find((b) => b.id === state.branchId)
      const service =
        branch?.services[
          Math.floor(Math.random() * (branch?.services.length ?? 1))
        ]

      const booking: Booking = {
        id: `sim-${ticketCounter}`,
        ticketNumber: `A-${ticketCounter}`,
        orgId: "agrobank-demo",
        branchId: state.branchId,
        serviceId: service?.id ?? "",
        userPhone: generatePhone(),
        userName: `${name.first} ${name.last}`,
        type: Math.random() > 0.5 ? "scheduled" : "live",
        status: "pending",
        createdAt: new Date(),
        editToken: generateEditToken(),
      }

      dispatch({ type: "ADD_TO_QUEUE", booking })
      toast.info(`Yangi navbat: ${booking.ticketNumber} qo'shildi`)
    }, 90000)
    return () => clearInterval(interval)
  }, [state.operator, state.branchId])

  const branch = mockBranches.find((b) => b.id === state.branchId)
  const avgWait = branch?.avgWaitMinutes ?? 18

  return (
    <StaffContext.Provider
      value={{
        ...state,
        dispatch,
        currentBooking,
        nextBooking,
        estimatedDuration: getEstimatedDuration(),
        queueCount: state.queue.length,
        avgWait,
        markArrived: handleMarkArrived,
        markNoShow: handleMarkNoShow,
        markComplete: handleMarkComplete,
      }}
    >
      {children}
    </StaffContext.Provider>
  )
}

export function useStaff() {
  const ctx = useContext(StaffContext)
  if (!ctx) throw new Error("useStaff must be used within StaffProvider")
  return ctx
}
