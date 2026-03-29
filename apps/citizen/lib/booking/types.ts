import type { Organization, Branch, Booking } from "@workspace/types"

export type BookingStep = "service" | "slot" | "verify" | "success"

export type BookingMode = "scheduled" | "live"

export type VerifyMethod = "phone" | "oneid"

export interface TimeSlot {
  time: string
  datetime: string
  available: boolean
  spotsLeft: number
}

export interface BookingState {
  // Navigation
  step: BookingStep
  isOpen: boolean
  direction: "forward" | "backward"

  // Context
  org: Organization | null
  branch: Branch | null
  preSelectedServiceId: string | null

  // User selections
  selectedServiceId: string | null
  selectedMode: BookingMode | null
  selectedSlot: string | null
  selectedDate: string // ISO date string (YYYY-MM-DD)

  // Slot data
  slots: TimeSlot[]
  slotsLoading: boolean

  // Verification
  verifyMethod: VerifyMethod
  phone: string
  otpSent: boolean
  otpValue: string
  otpError: string | null
  otpLoading: boolean
  otpAttempts: number
  otpCooldown: number
  resendCooldown: number

  // Result
  confirmedBooking: Booking | null
  error: string | null
  isSubmitting: boolean
}

export type BookingAction =
  | { type: "OPEN"; org: Organization; branch: Branch; serviceId?: string }
  | { type: "CLOSE" }
  | { type: "RESET" }
  | { type: "GO_BACK" }
  | { type: "SELECT_SERVICE"; serviceId: string }
  | { type: "SELECT_MODE"; mode: BookingMode }
  | { type: "SELECT_SLOT"; slot: string }
  | { type: "SELECT_DATE"; date: string }
  | { type: "JOIN_LIVE_QUEUE" }
  | { type: "ADVANCE_TO_VERIFY" }
  | { type: "SET_VERIFY_METHOD"; method: VerifyMethod }
  | { type: "SET_PHONE"; phone: string }
  | { type: "OTP_SEND_START" }
  | { type: "OTP_SEND_SUCCESS" }
  | { type: "OTP_SEND_FAIL"; error: string }
  | { type: "SET_OTP_VALUE"; value: string }
  | { type: "OTP_VERIFY_START" }
  | { type: "OTP_VERIFY_SUCCESS"; booking: Booking }
  | { type: "OTP_VERIFY_FAIL"; error: string }
  | { type: "ONEID_START" }
  | { type: "ONEID_SUCCESS"; booking: Booking }
  | { type: "ONEID_FAIL"; error: string }
  | { type: "SET_ERROR"; error: string }
  | { type: "CLEAR_ERROR" }
  | { type: "SLOTS_LOADING" }
  | { type: "SLOTS_LOADED"; slots: TimeSlot[] }
  | { type: "SET_RESEND_COOLDOWN"; value: number }
  | { type: "SET_OTP_COOLDOWN"; value: number }
