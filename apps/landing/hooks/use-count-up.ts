"use client"

import { useEffect, useState } from "react"

export function useCountUp(target: number, shouldStart: boolean, duration = 1000) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!shouldStart) return
    const start = performance.now()
    function step(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, shouldStart, duration])

  return value
}
