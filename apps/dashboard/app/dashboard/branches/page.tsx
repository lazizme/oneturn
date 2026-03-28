"use client"

import { useEffect, useState } from "react"
import {
  Plus,
  MapPin,
  Clock,
  Users,
  Pencil,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Separator } from "@workspace/ui/components/separator"
import { Skeleton } from "@workspace/ui/components/skeleton"
import type { Branch } from "@workspace/types"
import { mockBranches as initialBranches } from "@workspace/mock-data"
import { Topbar } from "@/components/topbar"
import { BranchFormModal } from "@/components/branches/branch-form-modal"
import { getBusyColor, getBusyLabel } from "@/lib/utils"
import { useInterval } from "@/hooks/use-interval"

export default function BranchesPage() {
  const [loading, setLoading] = useState(true)
  const [branches, setBranches] = useState<Branch[]>(initialBranches)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  // Live busy index drift
  useInterval(() => {
    setBranches((prev) =>
      prev.map((b) => ({
        ...b,
        busyIndex: Math.max(0, Math.min(100, b.busyIndex + Math.floor(Math.random() * 5) - 2)),
      }))
    )
  }, 10000)

  function handleSave(branch: Branch) {
    setBranches((prev) => {
      const idx = prev.findIndex((b) => b.id === branch.id)
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = branch
        return updated
      }
      return [...prev, branch]
    })
    setEditingBranch(null)
  }

  function handleEdit(branch: Branch) {
    setEditingBranch(branch)
    setModalOpen(true)
  }

  function handleAdd() {
    setEditingBranch(null)
    setModalOpen(true)
  }

  const openCount = branches.filter((b) => b.isOpen).length
  const closedCount = branches.length - openCount

  if (loading) {
    return (
      <>
        <Topbar title="Filiallar" />
        <div className="flex-1 overflow-auto p-6">
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-6 w-64 rounded-lg" />
            <Skeleton className="h-9 w-40 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-[280px] rounded-xl" />
            ))}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Topbar
        title="Filiallar"
        subtitle={`${branches.length} ta filial · ${openCount} ta ochiq · ${closedCount} ta yopiq`}
      />

      <div className="flex-1 overflow-auto p-6">
        <div className="mb-6 flex items-center justify-end">
          <Button
            className="gap-1.5 rounded-xl text-xs text-white"
            style={{ backgroundColor: "var(--brand-primary)" }}
            onClick={handleAdd}
          >
            <Plus className="size-3.5" />
            Filial qo&apos;shish
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {branches.map((branch) => {
            const busyColor = getBusyColor(branch.busyIndex)
            const busyLabel = getBusyLabel(branch.busyIndex)

            return (
              <Card key={branch.id} className="rounded-xl p-5">
                {/* Header */}
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      {branch.name}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1 text-xs" style={{ color: "var(--brand-muted)" }}>
                      <MapPin className="size-3" />
                      {branch.address}
                    </p>
                  </div>
                  <Badge
                    className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
                    style={{ backgroundColor: busyColor }}
                  >
                    {busyLabel}
                  </Badge>
                </div>

                {/* Stats row */}
                <div className="mb-4 flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5 text-xs">
                    <Clock className="size-3" style={{ color: "var(--brand-muted)" }} />
                    <span className="font-medium text-gray-700">
                      {branch.workingHours.open}–{branch.workingHours.close}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5 text-xs">
                    <span
                      className="size-2 rounded-full"
                      style={{
                        backgroundColor: branch.isOpen
                          ? "var(--brand-accent)"
                          : "var(--brand-danger)",
                      }}
                    />
                    <span className="font-medium text-gray-700">
                      {branch.isOpen ? "Ochiq" : "Yopiq"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1.5 text-xs">
                    <span className="font-medium text-gray-700">
                      {branch.busyIndex}% band
                    </span>
                  </div>
                </div>

                {/* Queue stats */}
                <div className="mb-4 flex items-center gap-6">
                  <div className="flex items-center gap-1.5 text-sm">
                    <Users className="size-3.5" style={{ color: "var(--brand-muted)" }} />
                    <span className="font-semibold text-gray-900">
                      {branch.currentQueue}
                    </span>
                    <span className="text-xs" style={{ color: "var(--brand-muted)" }}>
                      kutmoqda
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Clock className="size-3.5" style={{ color: "var(--brand-muted)" }} />
                    <span className="font-semibold text-gray-900">
                      ~{branch.avgWaitMinutes}
                    </span>
                    <span className="text-xs" style={{ color: "var(--brand-muted)" }}>
                      daq o&apos;rtacha
                    </span>
                  </div>
                </div>

                {/* Busy bar */}
                <div className="mb-4 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${branch.busyIndex}%`,
                      backgroundColor: busyColor,
                    }}
                  />
                </div>

                {/* Services */}
                <div className="mb-4">
                  <p className="mb-2 text-xs font-medium" style={{ color: "var(--brand-muted)" }}>
                    Xizmatlar:
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {branch.services.map((s) => (
                      <span
                        key={s.id}
                        className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                      >
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>

                <Separator className="mb-4" />

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <span className="flex flex-1 items-center justify-center gap-1 rounded-xl border border-dashed border-gray-200 px-2 py-1.5 text-[10px] text-gray-400">
                    Operator paneli orqali boshqariladi
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 gap-1.5 rounded-xl text-xs"
                    onClick={() => handleEdit(branch)}
                  >
                    <Pencil className="size-3" />
                    Tahrirlash
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      <BranchFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        branch={editingBranch}
        onSave={handleSave}
      />
    </>
  )
}
