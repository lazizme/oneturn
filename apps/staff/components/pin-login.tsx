"use client"

import { useState, useCallback, useEffect } from "react"
import { motion } from "framer-motion"
import { Building2, Delete } from "lucide-react"

const VALID_PINS: Record<
  string,
  { name: string; branchId: string; role: string }
> = {
  "1234": {
    name: "Aziz Nazarov",
    branchId: "branch-chilonzor",
    role: "operator",
  },
  "5678": {
    name: "Dilnoza Mirzayeva",
    branchId: "branch-yunusobod",
    role: "operator",
  },
  "0000": {
    name: "Demo Operator",
    branchId: "branch-chilonzor",
    role: "operator",
  },
}

interface PinLoginProps {
  branchName: string
  onLogin: (operator: { name: string; initials: string }) => void
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

export function PinLogin({ branchName, onLogin }: PinLoginProps) {
  const [pin, setPin] = useState("")
  const [error, setError] = useState(false)

  const handleDigit = useCallback(
    (digit: string) => {
      if (pin.length >= 4 || error) return
      const next = pin + digit
      setPin(next)

      if (next.length === 4) {
        const match = VALID_PINS[next]
        if (match) {
          setTimeout(() => {
            onLogin({
              name: match.name,
              initials: getInitials(match.name),
            })
          }, 200)
        } else {
          setError(true)
          setTimeout(() => {
            setError(false)
            setPin("")
          }, 400)
        }
      }
    },
    [pin, error, onLogin]
  )

  const handleDelete = useCallback(() => {
    if (error) return
    setPin((prev) => prev.slice(0, -1))
  }, [error])

  // Keyboard support
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key >= "0" && e.key <= "9") {
        handleDigit(e.key)
      } else if (e.key === "Backspace") {
        handleDelete()
      }
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [handleDigit, handleDelete])

  const numpadRows = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "del"],
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="flex h-screen w-screen flex-col items-center justify-center"
      style={{ backgroundColor: "var(--staff-bg)" }}
    >
      {/* Logo */}
      <div className="mb-2 flex items-center gap-2">
        <div
          className="flex size-10 items-center justify-center rounded-xl text-white"
          style={{ backgroundColor: "var(--staff-blue)" }}
        >
          <Building2 className="size-5" />
        </div>
        <span
          className="text-2xl font-bold"
          style={{ color: "var(--staff-text)" }}
        >
          OneTurn
        </span>
      </div>
      <p
        className="mb-1 text-sm font-medium"
        style={{ color: "var(--staff-muted)" }}
      >
        Operator paneli
      </p>
      <p className="mb-10 text-sm" style={{ color: "var(--staff-muted)" }}>
        {branchName}
      </p>

      {/* PIN dots */}
      <div className={`mb-10 flex gap-4 ${error ? "animate-shake" : ""}`}>
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="size-4 rounded-full transition-all duration-150"
            style={{
              backgroundColor:
                i < pin.length
                  ? error
                    ? "var(--staff-red)"
                    : "var(--staff-text)"
                  : "transparent",
              border: `2px solid ${
                i < pin.length
                  ? error
                    ? "var(--staff-red)"
                    : "var(--staff-text)"
                  : "var(--staff-border)"
              }`,
            }}
          />
        ))}
      </div>

      {/* Numpad */}
      <div className="flex flex-col gap-3">
        {numpadRows.map((row, ri) => (
          <div key={ri} className="flex justify-center gap-3">
            {row.map((key, ki) => {
              if (key === "") {
                return <div key={ki} className="size-[72px]" />
              }
              if (key === "del") {
                return (
                  <button
                    key={ki}
                    onClick={handleDelete}
                    className="flex size-[72px] items-center justify-center rounded-2xl transition-all duration-75 active:scale-95"
                    style={{
                      backgroundColor: "var(--staff-card)",
                      color: "var(--staff-muted)",
                    }}
                  >
                    <Delete className="size-6" />
                  </button>
                )
              }
              return (
                <button
                  key={ki}
                  onClick={() => handleDigit(key)}
                  className="flex size-[72px] items-center justify-center rounded-2xl text-2xl font-semibold transition-all duration-75 hover:brightness-125 active:scale-95"
                  style={{
                    backgroundColor: "var(--staff-card)",
                    color: "var(--staff-text)",
                  }}
                >
                  {key}
                </button>
              )
            })}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
