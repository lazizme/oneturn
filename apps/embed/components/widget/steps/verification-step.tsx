"use client"

import { useRef, useState } from "react"
import { Phone, Shield, Loader2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Card } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { useBooking, useBookingDispatch } from "../booking-context"
import { generateTicketNumber, randomInt } from "@workspace/mock-data"

export function VerificationStep() {
  const state = useBooking()
  const dispatch = useBookingDispatch()
  const [phone, setPhone] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otp, setOtp] = useState(["", "", "", ""])
  const [verifying, setVerifying] = useState(false)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "")
    if (digits.length <= 2) return digits
    if (digits.length <= 5) return `${digits.slice(0, 2)} ${digits.slice(2)}`
    if (digits.length <= 7)
      return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5)}`
    return `${digits.slice(0, 2)} ${digits.slice(2, 5)} ${digits.slice(5, 7)} ${digits.slice(7, 9)}`
  }

  function handlePhoneChange(value: string) {
    const digits = value.replace(/\D/g, "")
    if (digits.length <= 9) {
      setPhone(digits)
    }
  }

  function handleSendOtp() {
    if (phone.length < 9) return
    setOtpSent(true)
    dispatch({ type: "SET_PHONE", payload: `+998 ${formatPhone(phone)}` })
  }

  function handleOtpInput(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus()
    }

    if (newOtp.every((d) => d !== "")) {
      handleVerify(newOtp)
    }
  }

  function handleVerify(otpDigits: string[]) {
    setVerifying(true)
    // Simulate verification
    setTimeout(() => {
      dispatch({ type: "SET_OTP_VERIFIED", payload: true })
      const ticket = generateTicketNumber("A", randomInt(1, 50))
      dispatch({ type: "CONFIRM_BOOKING", payload: { ticketNumber: ticket } })
      dispatch({ type: "NEXT_STEP" })
      setVerifying(false)
    }, 1500)
  }

  function handleOneId() {
    setVerifying(true)
    // Simulate OneID auth
    setTimeout(() => {
      dispatch({ type: "SET_USER_NAME", payload: "Jasur Toshmatov" })
      dispatch({ type: "SET_PHONE", payload: "+998 90 123 45 67" })
      dispatch({ type: "SET_OTP_VERIFIED", payload: true })
      const ticket = generateTicketNumber("A", randomInt(1, 50))
      dispatch({ type: "CONFIRM_BOOKING", payload: { ticketNumber: ticket } })
      dispatch({ type: "NEXT_STEP" })
      setVerifying(false)
    }, 2000)
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Summary card */}
      <Card className="rounded-xl bg-gray-50 p-3">
        <div className="space-y-1 text-xs text-gray-600">
          <div className="flex justify-between">
            <span className="text-gray-400">Filial:</span>
            <span className="font-medium text-gray-900">
              {state.selectedBranch?.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Xizmat:</span>
            <span className="font-medium text-gray-900">
              {state.selectedService?.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Vaqt:</span>
            <span className="font-medium text-gray-900">
              {state.bookingType === "live"
                ? "Hozir (jonli navbat)"
                : `Bugun ${state.selectedSlot}`}
            </span>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="phone" className="w-full">
        <TabsList className="grid w-full grid-cols-2 rounded-xl">
          <TabsTrigger value="phone" className="rounded-lg text-xs">
            <Phone className="mr-1 size-3" />
            Telefon raqam
          </TabsTrigger>
          <TabsTrigger value="oneid" className="rounded-lg text-xs">
            <Shield className="mr-1 size-3" />
            OneID
          </TabsTrigger>
        </TabsList>

        <TabsContent value="phone" className="mt-3">
          {!otpSent ? (
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Telefon raqam
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">
                    +998
                  </span>
                  <Input
                    type="tel"
                    placeholder="90 123 45 67"
                    value={formatPhone(phone)}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className="rounded-xl"
                  />
                </div>
              </div>
              <Button
                onClick={handleSendOtp}
                disabled={phone.length < 9}
                className="w-full rounded-xl"
                style={{ backgroundColor: "var(--brand-primary)" }}
              >
                SMS kod yuborish
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-center text-xs text-gray-500">
                +998 {formatPhone(phone)} ga kod yuborildi
              </p>
              <div className="flex justify-center gap-2">
                {[0, 1, 2, 3].map((i) => (
                  <Input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={otp[i]}
                    onChange={(e) => handleOtpInput(i, e.target.value)}
                    className="size-12 rounded-xl text-center text-lg font-bold"
                  />
                ))}
              </div>
              {verifying && (
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <Loader2 className="size-3 animate-spin" />
                  Tasdiqlanmoqda...
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="oneid" className="mt-3">
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-blue-50">
              <Shield className="size-8" style={{ color: "var(--brand-primary)" }} />
            </div>
            <p className="text-center text-xs text-gray-500">
              OneID tizimi orqali shaxsingizni tasdiqlang
            </p>
            <Button
              onClick={handleOneId}
              disabled={verifying}
              className="w-full rounded-xl"
              style={{ backgroundColor: "var(--brand-primary)" }}
            >
              {verifying ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Tasdiqlanmoqda...
                </>
              ) : (
                "OneID tizimiga kirish →"
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
