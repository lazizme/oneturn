"use client"

import { use, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AnimatePresence } from "framer-motion"
import { mockBranches } from "@workspace/mock-data"
import { PinLogin } from "@/components/pin-login"

interface PageProps {
  params: Promise<{ branchId: string }>
}

function StaffLoginContent({ branchId }: { branchId: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isDemo = searchParams.get("demo") === "true"

  const branch = mockBranches.find((b) => b.id === branchId)
  const branchName = branch?.name ?? branchId

  // Demo mode: skip PIN, go directly to queue
  useEffect(() => {
    if (isDemo) {
      router.replace(`/staff/${branchId}/queue?demo=true`)
    }
  }, [isDemo, branchId, router])

  function handleLogin(operator: { name: string; initials: string }) {
    // Store operator info in URL state (session param)
    const encodedName = encodeURIComponent(operator.name)
    const encodedInitials = encodeURIComponent(operator.initials)
    router.push(
      `/staff/${branchId}/queue?name=${encodedName}&initials=${encodedInitials}`
    )
  }

  if (isDemo) {
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
    <AnimatePresence mode="wait">
      <PinLogin branchName={branchName} onLogin={handleLogin} />
    </AnimatePresence>
  )
}

export default function StaffLoginPage({ params }: PageProps) {
  const { branchId } = use(params)
  return (
    <Suspense>
      <StaffLoginContent branchId={branchId} />
    </Suspense>
  )
}
