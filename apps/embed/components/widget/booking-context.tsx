"use client"

import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react"
import type { Branch, Service } from "@workspace/types"

export interface BookingState {
  step: number
  location: { lat: number; lng: number; label: string } | null
  selectedBranch: Branch | null
  selectedService: Service | null
  bookingType: "live" | "scheduled" | null
  selectedSlot: string | null
  phone: string
  otpVerified: boolean
  ticketNumber: string | null
  userName: string | null
}

export type BookingAction =
  | { type: "SET_LOCATION"; payload: BookingState["location"] }
  | { type: "SELECT_BRANCH"; payload: Branch }
  | { type: "SELECT_SERVICE"; payload: Service }
  | { type: "SET_BOOKING_TYPE"; payload: "live" | "scheduled" }
  | { type: "SELECT_SLOT"; payload: string }
  | { type: "SET_PHONE"; payload: string }
  | { type: "SET_OTP_VERIFIED"; payload: boolean }
  | { type: "SET_USER_NAME"; payload: string }
  | {
      type: "CONFIRM_BOOKING"
      payload: { ticketNumber: string }
    }
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "RESET" }

const initialState: BookingState = {
  step: 1,
  location: null,
  selectedBranch: null,
  selectedService: null,
  bookingType: null,
  selectedSlot: null,
  phone: "",
  otpVerified: false,
  ticketNumber: null,
  userName: null,
}

function bookingReducer(
  state: BookingState,
  action: BookingAction
): BookingState {
  switch (action.type) {
    case "SET_LOCATION":
      return { ...state, location: action.payload }
    case "SELECT_BRANCH":
      return { ...state, selectedBranch: action.payload }
    case "SELECT_SERVICE":
      return { ...state, selectedService: action.payload }
    case "SET_BOOKING_TYPE":
      return { ...state, bookingType: action.payload }
    case "SELECT_SLOT":
      return { ...state, selectedSlot: action.payload }
    case "SET_PHONE":
      return { ...state, phone: action.payload }
    case "SET_OTP_VERIFIED":
      return { ...state, otpVerified: action.payload }
    case "SET_USER_NAME":
      return { ...state, userName: action.payload }
    case "CONFIRM_BOOKING":
      return {
        ...state,
        ticketNumber: action.payload.ticketNumber,
      }
    case "NEXT_STEP":
      return { ...state, step: Math.min(state.step + 1, 6) }
    case "PREV_STEP":
      return { ...state, step: Math.max(state.step - 1, 1) }
    case "RESET":
      return initialState
    default:
      return state
  }
}

const BookingContext = createContext<BookingState>(initialState)
const BookingDispatchContext = createContext<Dispatch<BookingAction>>(
  () => {}
)

export function BookingProvider({
  children,
}: {
  children: ReactNode
}) {
  const [state, dispatch] = useReducer(bookingReducer, initialState)

  return (
    <BookingContext.Provider value={state}>
      <BookingDispatchContext.Provider value={dispatch}>
        {children}
      </BookingDispatchContext.Provider>
    </BookingContext.Provider>
  )
}

export function useBooking() {
  return useContext(BookingContext)
}

export function useBookingDispatch() {
  return useContext(BookingDispatchContext)
}
