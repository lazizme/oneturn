import type { BookingState, BookingAction, BookingStep } from "./types"

const today = new Date().toISOString().split("T")[0]!

export const initialState: BookingState = {
  step: "service",
  isOpen: false,
  direction: "forward",

  org: null,
  branch: null,
  preSelectedServiceId: null,

  selectedServiceId: null,
  selectedMode: null,
  selectedSlot: null,
  selectedDate: today,

  slots: [],
  slotsLoading: false,

  verifyMethod: "phone",
  phone: "",
  otpSent: false,
  otpValue: "",
  otpError: null,
  otpLoading: false,
  otpAttempts: 0,
  otpCooldown: 0,
  resendCooldown: 0,

  confirmedBooking: null,
  error: null,
  isSubmitting: false,
}

const STEP_ORDER: BookingStep[] = ["service", "slot", "verify", "success"]

function prevStep(current: BookingStep): BookingStep {
  const idx = STEP_ORDER.indexOf(current)
  return STEP_ORDER[Math.max(idx - 1, 0)]!
}

export function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case "OPEN": {
      const hasPreselected = !!action.serviceId
      return {
        ...initialState,
        isOpen: true,
        org: action.org,
        branch: action.branch,
        preSelectedServiceId: action.serviceId ?? null,
        selectedServiceId: action.serviceId ?? null,
        step: hasPreselected ? "slot" : "service",
        direction: "forward",
        selectedDate: today,
      }
    }

    case "CLOSE":
      return { ...initialState }

    case "RESET":
      return { ...initialState }

    case "GO_BACK": {
      if (state.step === "success") return state
      if (state.step === "service") return { ...initialState }
      if (state.step === "slot" && state.preSelectedServiceId) return { ...initialState }
      return {
        ...state,
        step: prevStep(state.step),
        direction: "backward",
        error: null,
        otpError: null,
      }
    }

    case "SELECT_SERVICE":
      return {
        ...state,
        selectedServiceId: action.serviceId,
        step: "slot",
        direction: "forward",
        selectedMode: null,
        selectedSlot: null,
        slots: [],
      }

    case "SELECT_MODE":
      return {
        ...state,
        selectedMode: action.mode,
        selectedSlot: null,
      }

    case "SELECT_DATE":
      return {
        ...state,
        selectedDate: action.date,
        selectedSlot: null,
        slots: [],
        slotsLoading: true,
      }

    case "SELECT_SLOT":
      return {
        ...state,
        selectedSlot: action.slot,
      }

    case "JOIN_LIVE_QUEUE":
      return {
        ...state,
        selectedMode: "live",
        step: "verify",
        direction: "forward",
      }

    case "ADVANCE_TO_VERIFY":
      return {
        ...state,
        selectedMode: "scheduled",
        step: "verify",
        direction: "forward",
      }

    case "SET_VERIFY_METHOD":
      return {
        ...state,
        verifyMethod: action.method,
        otpError: null,
      }

    case "SET_PHONE":
      return {
        ...state,
        phone: action.phone,
        otpError: null,
      }

    case "OTP_SEND_START":
      return {
        ...state,
        otpLoading: true,
        otpError: null,
      }

    case "OTP_SEND_SUCCESS":
      return {
        ...state,
        otpSent: true,
        otpLoading: false,
        otpValue: "",
        resendCooldown: 45,
      }

    case "OTP_SEND_FAIL":
      return {
        ...state,
        otpLoading: false,
        otpError: action.error,
      }

    case "SET_OTP_VALUE":
      return {
        ...state,
        otpValue: action.value,
        otpError: null,
      }

    case "OTP_VERIFY_START":
      return {
        ...state,
        otpLoading: true,
        otpError: null,
      }

    case "OTP_VERIFY_SUCCESS":
      return {
        ...state,
        otpLoading: false,
        confirmedBooking: action.booking,
        step: "success",
        direction: "forward",
      }

    case "OTP_VERIFY_FAIL":
      return {
        ...state,
        otpLoading: false,
        otpError: action.error,
        otpValue: "",
        otpAttempts: state.otpAttempts + 1,
        otpCooldown: state.otpAttempts + 1 >= 3 ? 60 : 0,
      }

    case "ONEID_START":
      return {
        ...state,
        isSubmitting: true,
        error: null,
      }

    case "ONEID_SUCCESS":
      return {
        ...state,
        isSubmitting: false,
        confirmedBooking: action.booking,
        step: "success",
        direction: "forward",
      }

    case "ONEID_FAIL":
      return {
        ...state,
        isSubmitting: false,
        error: action.error,
      }

    case "SET_ERROR":
      return {
        ...state,
        error: action.error,
        isSubmitting: false,
      }

    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
        otpError: null,
      }

    case "SLOTS_LOADING":
      return {
        ...state,
        slotsLoading: true,
      }

    case "SLOTS_LOADED":
      return {
        ...state,
        slotsLoading: false,
        slots: action.slots,
      }

    case "SET_RESEND_COOLDOWN":
      return {
        ...state,
        resendCooldown: action.value,
      }

    case "SET_OTP_COOLDOWN":
      return {
        ...state,
        otpCooldown: action.value,
        otpAttempts: action.value === 0 ? 0 : state.otpAttempts,
      }

    default:
      return state
  }
}
