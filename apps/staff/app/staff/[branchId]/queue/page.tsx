"use client"

import { use, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AnimatePresence } from "framer-motion"
import { Badge } from "@workspace/ui/components/badge"
import { StaffProvider, useStaff } from "@/context/staff-context"
import { StaffHeader } from "@/components/staff-header"
import { StaffFooter } from "@/components/staff-footer"
import { WaitingScreen } from "@/components/waiting-screen"
import { ServingScreen } from "@/components/serving-screen"
import { EmptyScreen } from "@/components/empty-screen"

interface PageProps {
  params: Promise<{ branchId: string }>
}

function QueueContent({
  isDemo,
  onLogout,
}: {
  isDemo: boolean
  onLogout: () => void
}) {
  const { currentStatus, dispatch } = useStaff()
  const [dismissed, setDismissed] = useState(false)

  // Auto-request fullscreen on first mount (non-demo)
  useEffect(() => {
    if (!isDemo && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {
        // User may deny, that's fine
      })
    }
  }, [isDemo])

  // Demo auto-advance every 30 seconds
  useEffect(() => {
    if (!isDemo) return
    const interval = setInterval(() => {
      if (currentStatus === "waiting") {
        dispatch({ type: "MARK_ARRIVED" })
      } else if (currentStatus === "serving") {
        dispatch({ type: "MARK_COMPLETE" })
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [isDemo, currentStatus, dispatch])

  return (
    <div
      className="flex h-screen flex-col"
      style={{ backgroundColor: "var(--staff-bg)" }}
    >
      <StaffHeader onLogout={onLogout} />

      {/* Demo badge + fullscreen hint */}
      {(isDemo || !dismissed) && (
        <div className="flex items-center justify-center gap-4 py-1.5">
          {isDemo && (
            <Badge
              className="rounded-full px-3 py-0.5 text-xs font-medium"
              style={{
                backgroundColor: "var(--staff-amber)",
                color: "#000",
              }}
            >
              Demo rejim
            </Badge>
          )}
          {!dismissed && (
            <span className="flex items-center gap-2">
              <span
                className="text-xs"
                style={{ color: "var(--staff-muted)" }}
              >
                Eng yaxshi tajriba uchun to&apos;liq ekranda ishlating.
                [F11]
              </span>
              <button
                onClick={() => setDismissed(true)}
                className="text-xs underline"
                style={{ color: "var(--staff-muted)" }}
              >
                Yashirish
              </button>
            </span>
          )}
        </div>
      )}

      {/* Main content */}
      <AnimatePresence mode="wait">
        {currentStatus === "empty" && <EmptyScreen key="empty" />}
        {currentStatus === "waiting" && <WaitingScreen key="waiting" />}
        {currentStatus === "serving" && <ServingScreen key="serving" />}
      </AnimatePresence>

      <StaffFooter />
    </div>
  )
}

export default function QueuePage({ params }: PageProps) {
  const { branchId } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()

  const isDemo = searchParams.get("demo") === "true"
  const operatorName = isDemo
    ? "Demo Operator"
    : decodeURIComponent(searchParams.get("name") ?? "")
  const operatorInitials = isDemo
    ? "DO"
    : decodeURIComponent(searchParams.get("initials") ?? "")

  // Redirect to login if no operator info
  useEffect(() => {
    if (!operatorName && !isDemo) {
      router.replace(`/staff/${branchId}`)
    }
  }, [operatorName, isDemo, branchId, router])

  if (!operatorName && !isDemo) {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{ backgroundColor: "var(--staff-bg)" }}
      >
        <p style={{ color: "var(--staff-muted)" }}>Yuklanmoqda...</p>
      </div>
    )
  }

  return (
    <StaffProvider branchId={branchId}>
      <QueuePageInner
        branchId={branchId}
        operatorName={operatorName}
        operatorInitials={operatorInitials}
        isDemo={isDemo}
      />
    </StaffProvider>
  )
}

function QueuePageInner({
  branchId,
  operatorName,
  operatorInitials,
  isDemo,
}: {
  branchId: string
  operatorName: string
  operatorInitials: string
  isDemo: boolean
}) {
  const { dispatch } = useStaff()
  const router = useRouter()

  // Login on mount
  useEffect(() => {
    dispatch({
      type: "LOGIN",
      operator: { name: operatorName, initials: operatorInitials },
      branchId,
    })
  }, [dispatch, operatorName, operatorInitials, branchId])

  function handleLogout() {
    dispatch({ type: "LOGOUT" })
    router.replace(`/staff/${branchId}`)
  }

  return <QueueContent isDemo={isDemo} onLogout={handleLogout} />
}
