"use client"

import { motion } from "framer-motion"
import { CheckCircle2 } from "lucide-react"

export function EmptyScreen() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-1 flex-col items-center justify-center"
    >
      <CheckCircle2
        className="mb-4 size-16"
        style={{ color: "var(--staff-green)" }}
      />
      <p
        className="mb-2 text-2xl font-semibold"
        style={{ color: "var(--staff-text)" }}
      >
        Navbat bo&apos;sh
      </p>
      <p
        className="text-base"
        style={{ color: "var(--staff-muted)" }}
      >
        Yangi mijoz kelishini kuting
      </p>
      <p
        className="mt-6 text-sm"
        style={{ color: "var(--staff-muted)" }}
      >
        Navbatda: 0 kishi
      </p>
    </motion.div>
  )
}
