"use client"

import { useEffect, useState } from "react"

interface ServiceTimerProps {
  startedAt: Date
  estimatedMinutes?: number
}

export function ServiceTimer({
  startedAt,
  estimatedMinutes,
}: ServiceTimerProps) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const start = new Date(startedAt).getTime()
    const interval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - start) / 1000))
    }, 1000)
    return () => clearInterval(interval)
  }, [startedAt])

  const minutes = Math.floor(elapsed / 60)
  const seconds = elapsed % 60
  const isOvertime =
    estimatedMinutes !== undefined && minutes >= estimatedMinutes

  return (
    <span
      className="font-mono text-xs font-semibold"
      style={{
        color: isOvertime
          ? "var(--brand-warning)"
          : "var(--brand-muted)",
      }}
    >
      {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
      {isOvertime && " ⚠️"}
    </span>
  )
}
