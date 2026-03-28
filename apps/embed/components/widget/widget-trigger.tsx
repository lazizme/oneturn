"use client"

import { motion } from "framer-motion"
import { Building2 } from "lucide-react"

interface WidgetTriggerProps {
  onClick: () => void
}

export function WidgetTrigger({ onClick }: WidgetTriggerProps) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed right-6 bottom-6 z-50 flex items-center gap-2 rounded-full px-5 py-3.5 text-sm font-semibold text-white shadow-lg"
      style={{ backgroundColor: "var(--brand-primary)" }}
      whileHover={{ scale: 1.05, boxShadow: "0 8px 30px rgba(37, 99, 235, 0.4)" }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <Building2 className="size-5" />
      Navbat olish
      <motion.span
        className="absolute -top-1 -right-1 size-3 rounded-full bg-green-400"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ repeat: Infinity, duration: 2 }}
      />
    </motion.button>
  )
}
