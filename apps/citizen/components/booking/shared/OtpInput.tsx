"use client"

import { useRef, useEffect, useCallback, useState } from "react"

interface OtpInputProps {
  value: string
  onChange: (val: string) => void
  onComplete: (val: string) => void
  error?: boolean
  disabled?: boolean
  loading?: boolean
}

export function OtpInput({
  value,
  onChange,
  onComplete,
  error = false,
  disabled = false,
  loading = false,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const [shaking, setShaking] = useState(false)
  const [focused, setFocused] = useState<number | null>(null)

  const digits = value.padEnd(4, "").slice(0, 4).split("")

  useEffect(() => {
    if (error) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShaking(true)
      const timer = setTimeout(() => {
        setShaking(false)
        onChange("")
        inputRefs.current[0]?.focus()
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [error, onChange])

  const handleChange = useCallback(
    (index: number, inputValue: string) => {
      const digit = inputValue.replace(/\D/g, "").slice(-1)
      if (!digit) return

      const newDigits = [...digits]
      newDigits[index] = digit
      const newValue = newDigits.join("").replace(/ /g, "")
      onChange(newValue)

      if (index < 3) {
        inputRefs.current[index + 1]?.focus()
      }

      if (index === 3 && newValue.length === 4) {
        onComplete(newValue)
      }
    },
    [digits, onChange, onComplete],
  )

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        e.preventDefault()
        const newDigits = [...digits]
        if (digits[index] && digits[index] !== " ") {
          newDigits[index] = " "
          onChange(newDigits.join("").trimEnd())
        } else if (index > 0) {
          newDigits[index - 1] = " "
          onChange(newDigits.join("").trimEnd())
          inputRefs.current[index - 1]?.focus()
        }
      }
    },
    [digits, onChange],
  )

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault()
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4)
      if (!pasted) return
      onChange(pasted)
      const nextIndex = Math.min(pasted.length, 3)
      inputRefs.current[nextIndex]?.focus()
      if (pasted.length === 4) {
        onComplete(pasted)
      }
    },
    [onChange, onComplete],
  )

  const getBorderColor = (index: number) => {
    if (error) return "var(--c-danger)"
    if (digits[index] && digits[index] !== " " && !error) return "var(--c-accent)"
    if (focused === index) return "var(--c-primary)"
    return "var(--c-border)"
  }

  return (
    <div style={{ position: "relative" }}>
      <style>{`
        @keyframes otp-shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-3px); }
          80% { transform: translateX(3px); }
          100% { transform: translateX(0); }
        }
      `}</style>
      <div
        className="flex items-center justify-center gap-3"
        style={{
          animation: shaking ? "otp-shake 300ms ease-in-out" : "none",
        }}
      >
        {[0, 1, 2, 3].map((index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            disabled={disabled || loading}
            value={digits[index] === " " ? "" : digits[index]}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => setFocused(index)}
            onBlur={() => setFocused(null)}
            aria-label={`Tasdiqlash kodi, ${index + 1}-raqam`}
            className="w-12 h-12 text-center text-xl font-bold rounded-xl border-2 outline-none transition-colors"
            style={{
              borderColor: getBorderColor(index),
              color: "var(--c-text)",
              backgroundColor: disabled ? "var(--c-surface)" : "white",
            }}
          />
        ))}
      </div>

      {loading && (
        <div
          className="absolute inset-0 flex items-center justify-center rounded-xl"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.7)" }}
        >
          <div
            className="h-6 w-6 animate-spin rounded-full border-2 border-t-transparent"
            style={{ borderColor: "var(--c-primary)", borderTopColor: "transparent" }}
          />
        </div>
      )}
    </div>
  )
}
