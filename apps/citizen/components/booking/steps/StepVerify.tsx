"use client"

import { useEffect, useRef, useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon, ClipboardIcon, SmartPhone01Icon, UserIdVerificationIcon, Tick02Icon } from "@hugeicons/core-free-icons"
import { useBooking } from "@/lib/booking"
import { PhoneInput } from "../shared/PhoneInput"
import { OtpInput } from "../shared/OtpInput"

export function StepVerify() {
  const { state, dispatch, sendOtp, verifyOtp, authWithOneId } = useBooking()
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const service = state.branch?.services.find(
    (s) => s.id === state.selectedServiceId,
  )

  // Resend cooldown timer
  useEffect(() => {
    if (state.resendCooldown <= 0) return

    cooldownRef.current = setInterval(() => {
      dispatch({
        type: "SET_RESEND_COOLDOWN",
        value: Math.max(state.resendCooldown - 1, 0),
      })
    }, 1000)

    return () => {
      if (cooldownRef.current) clearInterval(cooldownRef.current)
    }
  }, [state.resendCooldown, dispatch])

  // OTP cooldown timer (too many attempts)
  useEffect(() => {
    if (state.otpCooldown <= 0) return

    const id = setInterval(() => {
      dispatch({
        type: "SET_OTP_COOLDOWN",
        value: Math.max(state.otpCooldown - 1, 0),
      })
    }, 1000)

    return () => clearInterval(id)
  }, [state.otpCooldown, dispatch])

  const handleOtpComplete = useCallback(
    () => {
      verifyOtp()
    },
    [verifyOtp],
  )

  const handleResend = useCallback(() => {
    if (state.resendCooldown > 0) return
    sendOtp()
  }, [state.resendCooldown, sendOtp])

  // Booking summary line
  const summaryTime =
    state.selectedMode === "live"
      ? "Jonli navbat"
      : state.selectedSlot
        ? new Date(state.selectedSlot).toLocaleTimeString("uz-UZ", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : ""

  const summaryDate =
    state.selectedMode === "scheduled" && state.selectedDate
      ? new Date(state.selectedDate).toLocaleDateString("uz-UZ", {
          day: "numeric",
          month: "long",
        })
      : ""

  return (
    <div>
      {/* Booking Summary */}
      <div
        className="mb-5 rounded-xl p-4"
        style={{
          backgroundColor: "var(--c-surface)",
          border: "1px solid var(--c-border)",
        }}
      >
        <p
          className="mb-2 text-xs font-semibold"
          style={{ color: "var(--c-text)" }}
        >
          <span className="inline-flex items-center gap-1.5"><HugeiconsIcon icon={ClipboardIcon} size={14} /> Xulosa</span>
        </p>
        <p className="text-sm font-medium" style={{ color: "var(--c-text)" }}>
          {service?.name ?? ""}
          <span style={{ color: "var(--c-muted)" }}> · </span>
          {state.branch?.name ?? ""}
        </p>
        <p className="mt-1 text-xs" style={{ color: "var(--c-muted)" }}>
          {state.selectedMode === "scheduled"
            ? `${summaryDate}, ${summaryTime}`
            : summaryTime}
        </p>
      </div>

      {/* Verify Method Tabs */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => dispatch({ type: "SET_VERIFY_METHOD", method: "phone" })}
          className="rounded-xl px-3 py-2.5 text-center text-sm font-medium transition-all"
          style={{
            border: state.verifyMethod === "phone"
              ? "2px solid var(--c-primary)"
              : "1px solid var(--c-border)",
            backgroundColor: state.verifyMethod === "phone"
              ? "var(--c-primary-light)"
              : "transparent",
            color: state.verifyMethod === "phone"
              ? "var(--c-primary)"
              : "var(--c-muted)",
          }}
        >
          <span className="inline-flex items-center gap-1.5"><HugeiconsIcon icon={SmartPhone01Icon} size={14} /> Telefon</span>
        </button>
        <button
          onClick={() => dispatch({ type: "SET_VERIFY_METHOD", method: "oneid" })}
          className="rounded-xl px-3 py-2.5 text-center text-sm font-medium transition-all"
          style={{
            border: state.verifyMethod === "oneid"
              ? "2px solid var(--c-primary)"
              : "1px solid var(--c-border)",
            backgroundColor: state.verifyMethod === "oneid"
              ? "var(--c-primary-light)"
              : "transparent",
            color: state.verifyMethod === "oneid"
              ? "var(--c-primary)"
              : "var(--c-muted)",
          }}
        >
          <span className="inline-flex items-center gap-1.5"><HugeiconsIcon icon={UserIdVerificationIcon} size={14} /> OneID</span>
        </button>
      </div>

      {/* Phone Tab */}
      {state.verifyMethod === "phone" && (
        <div>
          {!state.otpSent ? (
            <>
              <PhoneInput
                value={state.phone}
                onChange={(phone) => dispatch({ type: "SET_PHONE", phone })}
              />
              <button
                onClick={sendOtp}
                disabled={state.phone.length < 9 || state.otpLoading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all disabled:opacity-50"
                style={{ backgroundColor: "var(--c-primary)" }}
              >
                {state.otpLoading ? (
                  <>
                    <HugeiconsIcon icon={Loading03Icon} size={16} className="animate-spin" />
                    Yuborilmoqda...
                  </>
                ) : (
                  "SMS kod yuborish"
                )}
              </button>
            </>
          ) : (
            <div>
              <p
                className="mb-3 text-center text-sm"
                style={{ color: "var(--c-muted)" }}
              >
                +998 {state.phone.slice(0, 2)} *** ** {state.phone.slice(7)} raqamga kod yuborildi
              </p>

              {state.otpCooldown > 0 ? (
                <div className="mb-4 text-center">
                  <p className="text-sm font-medium" style={{ color: "var(--c-danger)" }}>
                    Juda ko&apos;p xato. {state.otpCooldown}s kuting.
                  </p>
                </div>
              ) : null}

              <OtpInput
                value={state.otpValue}
                onChange={(val) => dispatch({ type: "SET_OTP_VALUE", value: val })}
                onComplete={handleOtpComplete}
                error={!!state.otpError}
                disabled={state.otpCooldown > 0}
                loading={state.otpLoading}
              />

              {state.otpError && (
                <p
                  className="mt-2 text-center text-xs font-medium"
                  style={{ color: "var(--c-danger)" }}
                >
                  {state.otpError}
                </p>
              )}

              <div className="mt-4 text-center">
                {state.resendCooldown > 0 ? (
                  <span className="text-xs" style={{ color: "var(--c-muted)" }}>
                    Kodni qayta yuborish ({state.resendCooldown}s)
                  </span>
                ) : (
                  <button
                    onClick={handleResend}
                    className="text-xs font-medium underline"
                    style={{ color: "var(--c-primary)" }}
                  >
                    Kodni qayta yuborish
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* OneID Tab */}
      {state.verifyMethod === "oneid" && (
        <div className="flex flex-col items-center">
          <div
            className="mb-4 w-full rounded-xl p-6 text-center"
            style={{
              backgroundColor: "var(--c-surface)",
              border: "1px solid var(--c-border)",
            }}
          >
            <div
              className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full text-lg font-black"
              style={{
                backgroundColor: "var(--c-primary-light)",
                color: "var(--c-primary)",
              }}
            >
              ID
            </div>
            <p
              className="mb-1 text-sm font-semibold"
              style={{ color: "var(--c-text)" }}
            >
              OneID orqali tizimga kirish
            </p>
            <p className="text-xs" style={{ color: "var(--c-muted)" }}>
              Shaxsingiz avtomatik tasdiqlanadi
            </p>
          </div>

          <button
            onClick={authWithOneId}
            disabled={state.isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white transition-all disabled:opacity-50"
            style={{ backgroundColor: "var(--c-primary)" }}
          >
            {state.isSubmitting ? (
              <>
                <HugeiconsIcon icon={Loading03Icon} size={16} className="animate-spin" />
                OneID bilan ulanmoqda...
              </>
            ) : (
              "OneID orqali tasdiqlash \u2192"
            )}
          </button>

          {state.error && (
            <p
              className="mt-2 text-center text-xs font-medium"
              style={{ color: "var(--c-danger)" }}
            >
              {state.error}
            </p>
          )}

          <div className="mt-4 flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-xs" style={{ color: "var(--c-accent)" }}>
              <HugeiconsIcon icon={Tick02Icon} size={12} /> Xavfsiz
            </span>
            <span className="inline-flex items-center gap-1 text-xs" style={{ color: "var(--c-accent)" }}>
              <HugeiconsIcon icon={Tick02Icon} size={12} /> Bir daqiqada
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
