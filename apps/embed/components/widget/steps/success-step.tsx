"use client"

import { motion } from "framer-motion"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Separator } from "@workspace/ui/components/separator"
import { useBooking, useBookingDispatch } from "../booking-context"

function CheckmarkAnimation() {
  return (
    <motion.div
      className="mx-auto flex size-20 items-center justify-center rounded-full"
      style={{ backgroundColor: "var(--brand-accent)" }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15 }}
    >
      <motion.svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
      >
        <motion.path
          d="M10 20L17 27L30 13"
          stroke="white"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        />
      </motion.svg>
    </motion.div>
  )
}

export function SuccessStep({ onClose }: { onClose: () => void }) {
  const state = useBooking()
  const dispatch = useBookingDispatch()

  function handleClose() {
    dispatch({ type: "RESET" })
    onClose()
  }

  return (
    <div className="flex flex-col items-center gap-5 p-5">
      <CheckmarkAnimation />

      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-lg font-bold text-gray-900">
          Navbatingiz tasdiqlandi!
        </h2>
      </motion.div>

      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="overflow-hidden rounded-xl border-2">
          <div
            className="px-4 py-3 text-center text-sm font-bold text-white"
            style={{ backgroundColor: "var(--brand-primary)" }}
          >
            AGROBANK
          </div>
          <div className="p-4">
            <p className="text-xs text-gray-500">
              {state.selectedBranch?.name}
            </p>

            <Separator className="my-3" />

            <div className="text-center">
              <p className="text-xs text-gray-400">NAVBAT</p>
              <p className="text-3xl font-black text-gray-900">
                {state.ticketNumber}
              </p>
            </div>

            <Separator className="my-3" />

            <div className="space-y-2 text-xs">
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
              <div className="flex justify-between">
                <span className="text-gray-400">Kutish:</span>
                <span className="font-medium text-gray-900">
                  ~{state.selectedBranch?.avgWaitMinutes} daqiqa
                </span>
              </div>
            </div>

            <Separator className="my-3" />

            <p className="text-center text-[10px] text-gray-400">
              SMS tasdiqlash yuborildi
              <br />
              {state.phone}
            </p>
          </div>
        </Card>
      </motion.div>

      <Button
        onClick={handleClose}
        variant="outline"
        className="w-full rounded-xl"
      >
        Yopish
      </Button>
    </div>
  )
}
