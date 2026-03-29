"use client"

import { useEffect, useMemo, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  PlusSignIcon,
  PencilEdit01Icon,
  PauseIcon,
  PlayIcon,
  Alert01Icon,
} from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Skeleton } from "@workspace/ui/components/skeleton"
import type { Service } from "@workspace/types"
import { mockBranches as initialBranches, mockBookings } from "@workspace/mock-data"
import { Topbar } from "@/components/topbar"
import { ServiceFormModal } from "@/components/services/service-form-modal"
import { toast } from "sonner"

interface ServiceRow {
  service: Service
  branchName: string
  realAvg: number | null
  diff: number | null
  diffPercent: number | null
}

export default function ServicesPage() {
  const [loading, setLoading] = useState(true)
  const [branches, setBranches] = useState(initialBranches)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const serviceRows: ServiceRow[] = useMemo(() => {
    const rows: ServiceRow[] = []
    for (const branch of branches) {
      for (const service of branch.services) {
        const completed = mockBookings.filter(
          (b) =>
            b.serviceId === service.id &&
            b.status === "completed" &&
            b.actualDurationMin !== undefined
        )
        const realAvg =
          completed.length > 0
            ? Math.round(
                completed.reduce(
                  (sum, b) => sum + (b.actualDurationMin ?? 0),
                  0
                ) / completed.length
              )
            : null
        const diff =
          realAvg !== null ? realAvg - service.estimatedDurationMin : null
        const diffPercent =
          diff !== null
            ? (diff / service.estimatedDurationMin) * 100
            : null

        rows.push({
          service,
          branchName: branch.name.split(" ")[0] ?? "",
          realAvg,
          diff,
          diffPercent,
        })
      }
    }
    return rows
  }, [branches])

  const activeCount = serviceRows.filter((r) => r.service.isAvailable).length
  const pausedCount = serviceRows.length - activeCount

  function handleToggleAvailability(serviceId: string) {
    setBranches((prev) =>
      prev.map((branch) => ({
        ...branch,
        services: branch.services.map((s) =>
          s.id === serviceId ? { ...s, isAvailable: !s.isAvailable } : s
        ),
      }))
    )
    const svc = serviceRows.find((r) => r.service.id === serviceId)
    if (svc?.service.isAvailable) {
      toast.info(`${svc.service.name} to'xtatildi`)
    } else {
      toast.success("Xizmat faollashtirildi")
    }
  }

  function handleSave(service: Service, assignedBranches: string[]) {
    setBranches((prev) =>
      prev.map((branch) => {
        if (!assignedBranches.includes(branch.id)) return branch
        const exists = branch.services.some((s) => s.id === service.id)
        return {
          ...branch,
          services: exists
            ? branch.services.map((s) =>
                s.id === service.id ? { ...service, branchId: branch.id } : s
              )
            : [...branch.services, { ...service, branchId: branch.id }],
        }
      })
    )
    setEditingService(null)
  }

  if (loading) {
    return (
      <>
        <Topbar title="Xizmatlar" />
        <div className="flex-1 overflow-auto p-6">
          <Skeleton className="mb-4 h-9 w-48 rounded-xl" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="mb-2 h-12 w-full rounded-lg" />
          ))}
        </div>
      </>
    )
  }

  return (
    <>
      <Topbar
        title="Xizmatlar"
        subtitle={`${serviceRows.length} ta xizmat · ${activeCount} ta faol · ${pausedCount} ta to'xtatilgan`}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-end border-b bg-white px-6 py-3">
          <Button
            className="gap-1.5 rounded-xl text-xs text-white"
            style={{ backgroundColor: "var(--brand-primary)" }}
            onClick={() => {
              setEditingService(null)
              setModalOpen(true)
            }}
          >
            <HugeiconsIcon icon={PlusSignIcon} size={14} />
            Xizmat qo&apos;shish
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                  Xizmat nomi
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                  Filial
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                  Est. davom.
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                  Real o&apos;rt.
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                  Farq
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                  Soatlik
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                  Holat
                </th>
                <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody>
              {serviceRows.map((row) => {
                const { service, branchName, realAvg, diff, diffPercent } = row

                let diffColor = "var(--brand-accent)"
                let diffIcon = null
                if (diff !== null && diffPercent !== null) {
                  if (diffPercent > 20) {
                    diffColor = "var(--brand-danger)"
                    diffIcon = <HugeiconsIcon icon={Alert01Icon} size={12} className="inline" />
                  } else if (diffPercent > 0) {
                    diffColor = "var(--brand-warning)"
                    diffIcon = <HugeiconsIcon icon={Alert01Icon} size={12} className="inline" />
                  }
                }

                return (
                  <tr
                    key={`${service.id}-${service.branchId}`}
                    className="border-b border-gray-50 transition-colors duration-150 hover:bg-slate-50"
                  >
                    <td className="px-6 py-3.5 text-sm font-semibold text-gray-900">
                      {service.name}
                    </td>
                    <td className="px-3 py-3.5 text-xs text-gray-700">
                      {branchName}
                    </td>
                    <td className="px-3 py-3.5 text-xs text-gray-700">
                      {service.estimatedDurationMin} daq
                    </td>
                    <td className="px-3 py-3.5 text-xs text-gray-700">
                      {realAvg !== null ? `${realAvg} daq` : "—"}
                    </td>
                    <td className="px-3 py-3.5 text-xs font-medium" style={{ color: diffColor }}>
                      {diff !== null ? (
                        <>
                          {diff > 0 ? "+" : ""}
                          {diff} daq {diffIcon}
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-3 py-3.5 text-xs text-gray-700">
                      {service.maxSlotsPerHour}
                    </td>
                    <td className="px-3 py-3.5">
                      {service.isAvailable ? (
                        <Badge className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700">
                          Faol
                        </Badge>
                      ) : (
                        <Badge className="rounded-full bg-gray-200 px-2.5 py-0.5 text-[10px] font-medium text-gray-600">
                          To&apos;xtatilgan
                        </Badge>
                      )}
                    </td>
                    <td className="px-3 py-3.5">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="size-7 rounded-lg p-0"
                          onClick={() => {
                            setEditingService(service)
                            setModalOpen(true)
                          }}
                        >
                          <HugeiconsIcon icon={PencilEdit01Icon} size={14} className="text-gray-500" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="size-7 rounded-lg p-0"
                          onClick={() =>
                            handleToggleAvailability(service.id)
                          }
                        >
                          {service.isAvailable ? (
                            <HugeiconsIcon icon={PauseIcon} size={14} className="text-gray-500" />
                          ) : (
                            <HugeiconsIcon icon={PlayIcon} size={14} style={{ color: "var(--brand-accent)" }} />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <ServiceFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        service={editingService}
        onSave={handleSave}
      />
    </>
  )
}
