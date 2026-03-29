"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Notification01Icon } from "@hugeicons/core-free-icons"
import { Badge } from "@workspace/ui/components/badge"

interface TopbarProps {
  title: string
  subtitle?: string
}

export function Topbar({ title, subtitle }: TopbarProps) {
  return (
    <header className="flex items-center justify-between border-b bg-white px-6 py-3">
      <div>
        <h1 className="text-lg font-bold text-gray-900">{title}</h1>
        {subtitle && (
          <p className="text-xs text-gray-500">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button className="relative rounded-xl p-2 transition-colors hover:bg-gray-100">
          <HugeiconsIcon icon={Notification01Icon} size={20} className="text-gray-500" />
          <Badge
            className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full p-0 text-[9px] text-white"
            style={{ backgroundColor: "var(--brand-danger)" }}
          >
            2
          </Badge>
        </button>
      </div>
    </header>
  )
}
