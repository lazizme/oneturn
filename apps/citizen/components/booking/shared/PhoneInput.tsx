"use client"

import { useCallback } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Tick02Icon, CallIcon } from "@hugeicons/core-free-icons"

interface PhoneInputProps {
  value: string
  onChange: (rawDigits: string) => void
  error?: string
}

function formatPhone(digits: string): string {
  const d = digits.slice(0, 9)
  let result = ""
  for (let i = 0; i < d.length; i++) {
    if (i === 2 || i === 5 || i === 7) {
      result += " "
    }
    result += d[i]
  }
  return result
}

export function PhoneInput({ value, onChange, error }: PhoneInputProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value.replace(/\D/g, "").slice(0, 9)
      onChange(raw)
    },
    [onChange],
  )

  const isComplete = value.length === 9
  const hasError = !!error

  return (
    <div>
      <div
        className="flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 transition-colors"
        style={{
          borderColor: hasError
            ? "var(--c-danger)"
            : isComplete
              ? "var(--c-accent)"
              : "var(--c-border)",
        }}
      >
        <HugeiconsIcon icon={CallIcon} size={16} className="shrink-0" style={{ color: "var(--c-muted)" }} />
        <span
          className="text-sm font-semibold select-none shrink-0"
          style={{ color: "var(--c-text)" }}
        >
          +998
        </span>
        <input
          type="tel"
          inputMode="numeric"
          value={formatPhone(value)}
          onChange={handleChange}
          placeholder="90 123 45 67"
          className="flex-1 bg-transparent text-sm font-medium outline-none min-w-0"
          style={{ color: "var(--c-text)" }}
        />
        {isComplete && !hasError && (
          <HugeiconsIcon icon={Tick02Icon} size={16} className="shrink-0" style={{ color: "var(--c-accent)" }} />
        )}
      </div>
      {hasError && (
        <p className="mt-1.5 text-xs font-medium" style={{ color: "var(--c-danger)" }}>
          {error}
        </p>
      )}
    </div>
  )
}
