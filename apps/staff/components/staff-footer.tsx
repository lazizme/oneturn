"use client"

import { useStaff } from "@/context/staff-context"
import { mockBranches } from "@workspace/mock-data"

export function StaffFooter() {
  const { nextBooking, queueCount, avgWait, branchId } = useStaff()

  function getServiceName(serviceId: string): string {
    const branch = mockBranches.find((b) => b.id === branchId)
    const service = branch?.services.find((s) => s.id === serviceId)
    return service?.name ?? ""
  }

  const nextName = nextBooking
    ? `${nextBooking.ticketNumber} · ${nextBooking.userName?.split(" ")[0] ?? ""} ${(nextBooking.userName?.split(" ")[1] ?? "")[0] ?? ""}. · ${getServiceName(nextBooking.serviceId)}`
    : "—"

  return (
    <div
      className="flex items-center justify-between px-6 py-3"
      style={{
        backgroundColor: "var(--staff-card)",
        borderTop: "1px solid var(--staff-border)",
      }}
    >
      <span className="text-sm" style={{ color: "var(--staff-muted)" }}>
        Keyingi: {nextName}
      </span>
      <span className="text-sm" style={{ color: "var(--staff-muted)" }}>
        Navbatda: {queueCount} kishi · ~{avgWait} daq kutish
      </span>
    </div>
  )
}
