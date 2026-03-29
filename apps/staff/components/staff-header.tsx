"use client"

import { useState, useEffect, useRef } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Maximize01Icon, Minimize01Icon, Logout01Icon } from "@hugeicons/core-free-icons"
import { useStaff } from "@/context/staff-context"

interface StaffHeaderProps {
  onLogout: () => void
}

export function StaffHeader({ onLogout }: StaffHeaderProps) {
  const { operator, orgName, branchName, currentStatus } = useStaff()
  const [time, setTime] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [showLogoutWarning, setShowLogoutWarning] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function updateTime() {
      const now = new Date()
      setTime(
        now.toLocaleTimeString("uz-UZ", {
          hour: "2-digit",
          minute: "2-digit",
        })
      )
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    function onFsChange() {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener("fullscreenchange", onFsChange)
    return () => document.removeEventListener("fullscreenchange", onFsChange)
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false)
        setShowLogoutWarning(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  function handleLogoutClick() {
    if (currentStatus === "serving") {
      setShowLogoutWarning(true)
    } else {
      onLogout()
    }
  }

  if (!operator) return null

  return (
    <div
      className="flex items-center justify-between px-6 py-3"
      style={{
        backgroundColor: "var(--staff-card)",
        borderBottom: "1px solid var(--staff-border)",
      }}
    >
      {/* Left: org + branch */}
      <span
        className="text-sm font-medium"
        style={{ color: "var(--staff-muted)" }}
      >
        {orgName} · {branchName}
      </span>

      {/* Center: clock */}
      <span
        className="font-mono text-sm"
        style={{ color: "var(--staff-muted)" }}
      >
        {time}
      </span>

      {/* Right: fullscreen + avatar */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggleFullscreen}
          className="rounded-lg p-1.5 transition-colors hover:bg-white/10"
          style={{ color: "var(--staff-muted)" }}
          title={isFullscreen ? "Kichiklashtirish" : "To'liq ekran"}
        >
          {isFullscreen ? (
            <HugeiconsIcon icon={Minimize01Icon} size={16} />
          ) : (
            <HugeiconsIcon icon={Maximize01Icon} size={16} />
          )}
        </button>

        {/* Avatar + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex size-7 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: "var(--staff-blue)" }}
          >
            {operator.initials}
          </button>

          {showDropdown && (
            <div
              className="absolute right-0 top-10 z-50 w-56 rounded-xl p-3 shadow-lg"
              style={{
                backgroundColor: "var(--staff-card)",
                border: "1px solid var(--staff-border)",
              }}
            >
              <div className="mb-2">
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--staff-text)" }}
                >
                  {operator.name}
                </p>
                <p
                  className="text-xs"
                  style={{ color: "var(--staff-muted)" }}
                >
                  Operator · {branchName}
                </p>
              </div>
              <div
                className="my-2 h-px"
                style={{ backgroundColor: "var(--staff-border)" }}
              />

              {showLogoutWarning ? (
                <div>
                  <p
                    className="mb-2 text-xs"
                    style={{ color: "var(--staff-amber)" }}
                  >
                    Hozir mijoz xizmat olmoqda. Chiqishni tasdiqlaysizmi?
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={onLogout}
                      className="flex-1 rounded-lg px-2 py-1.5 text-xs font-medium text-white"
                      style={{ backgroundColor: "var(--staff-red)" }}
                    >
                      Ha
                    </button>
                    <button
                      onClick={() => setShowLogoutWarning(false)}
                      className="flex-1 rounded-lg px-2 py-1.5 text-xs font-medium"
                      style={{
                        color: "var(--staff-muted)",
                        border: "1px solid var(--staff-border)",
                      }}
                    >
                      Yo&apos;q
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleLogoutClick}
                  className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-white/5"
                  style={{ color: "var(--staff-red)" }}
                >
                  <HugeiconsIcon icon={Logout01Icon} size={16} />
                  Chiqish
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
