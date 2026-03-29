"use client"

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
  type Dispatch,
} from "react"
import type { Organization, Branch } from "@workspace/types"
import type { BookingState, BookingAction } from "./types"
import { bookingReducer, initialState } from "./reducer"
import * as api from "./mock-api"

interface BookingContextValue {
  state: BookingState
  dispatch: Dispatch<BookingAction>
  openBooking: (org: Organization, branch: Branch, serviceId?: string) => void
  closeBooking: () => void
  sendOtp: () => Promise<void>
  verifyOtp: () => Promise<void>
  authWithOneId: () => Promise<void>
  advanceToVerify: () => void
}

const BookingContext = createContext<BookingContextValue | null>(null)

export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState)

  const openBooking = useCallback(
    (org: Organization, branch: Branch, serviceId?: string) => {
      dispatch({ type: "OPEN", org, branch, serviceId })
    },
    []
  )

  const closeBooking = useCallback(() => {
    dispatch({ type: "CLOSE" })
  }, [])

  const sendOtpAction = useCallback(async () => {
    dispatch({ type: "OTP_SEND_START" })
    try {
      await api.sendOtp(state.phone)
      dispatch({ type: "OTP_SEND_SUCCESS" })
    } catch (err) {
      dispatch({
        type: "OTP_SEND_FAIL",
        error: err instanceof Error ? err.message : "SMS yuborishda xatolik",
      })
    }
  }, [state.phone])

  const verifyOtpAction = useCallback(async () => {
    if (!state.org || !state.branch || !state.selectedServiceId) return
    dispatch({ type: "OTP_VERIFY_START" })
    try {
      const booking = await api.verifyOtp(state.phone, state.otpValue, {
        orgId: state.org.id,
        branchId: state.branch.id,
        serviceId: state.selectedServiceId,
        mode: state.selectedMode === "live" ? "live" : "scheduled",
        slot: state.selectedSlot ?? undefined,
      })
      dispatch({ type: "OTP_VERIFY_SUCCESS", booking })
    } catch (err) {
      dispatch({
        type: "OTP_VERIFY_FAIL",
        error: err instanceof Error ? err.message : "Tasdiqlashda xatolik",
      })
    }
  }, [state.phone, state.otpValue, state.org, state.branch, state.selectedServiceId, state.selectedMode, state.selectedSlot])

  const authWithOneIdAction = useCallback(async () => {
    if (!state.org || !state.branch || !state.selectedServiceId) return
    dispatch({ type: "ONEID_START" })
    try {
      const booking = await api.authWithOneId({
        orgId: state.org.id,
        branchId: state.branch.id,
        serviceId: state.selectedServiceId,
        mode: state.selectedMode === "live" ? "live" : "scheduled",
        slot: state.selectedSlot ?? undefined,
      })
      dispatch({ type: "ONEID_SUCCESS", booking })
    } catch (err) {
      dispatch({
        type: "ONEID_FAIL",
        error: err instanceof Error ? err.message : "OneID xatolik",
      })
    }
  }, [state.org, state.branch, state.selectedServiceId, state.selectedMode, state.selectedSlot])

  const advanceToVerify = useCallback(() => {
    if (state.selectedMode === "scheduled" && state.selectedSlot) {
      dispatch({ type: "SELECT_SLOT", slot: state.selectedSlot })
      // Manually transition to verify
      dispatch({ type: "JOIN_LIVE_QUEUE" }) // reuses transition logic
    }
  }, [state.selectedMode, state.selectedSlot])

  return (
    <BookingContext.Provider
      value={{
        state,
        dispatch,
        openBooking,
        closeBooking,
        sendOtp: sendOtpAction,
        verifyOtp: verifyOtpAction,
        authWithOneId: authWithOneIdAction,
        advanceToVerify,
      }}
    >
      {children}
    </BookingContext.Provider>
  )
}

export function useBooking() {
  const ctx = useContext(BookingContext)
  if (!ctx) throw new Error("useBooking must be used within BookingProvider")
  return ctx
}
