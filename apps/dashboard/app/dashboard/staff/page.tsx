"use client"

import { useEffect, useMemo, useState } from "react"
import { Plus, Pencil, Trash2 } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { Skeleton } from "@workspace/ui/components/skeleton"
import type { StaffMember } from "@workspace/types"
import { mockStaff as initialStaff, mockBranches } from "@workspace/mock-data"
import { Topbar } from "@/components/topbar"
import { StaffFormModal } from "@/components/staff/staff-form-modal"
import { DeleteStaffDialog } from "@/components/staff/delete-staff-dialog"

const LAST_ACTIVITY: Record<string, { text: string; isOnline?: boolean }> = {
  "staff-1": { text: "Hozir faol", isOnline: true },
  "staff-3": { text: "2 soat oldin" },
  "staff-2": { text: "Kecha" },
  "staff-4": { text: "3 kun oldin" },
  "staff-5": { text: "5 kun oldin" },
  "staff-6": { text: "—" },
}

const INVITED_IDS = new Set(["staff-6"])

function getBranchName(branchId: string): string {
  const branch = mockBranches.find((b) => b.id === branchId)
  return branch ? branch.name : "—"
}

function getRoleBadge(role: string) {
  switch (role) {
    case "admin":
      return (
        <Badge className="rounded-full bg-purple-100 px-2.5 py-0.5 text-[10px] font-medium text-purple-700">
          Admin
        </Badge>
      )
    case "manager":
      return (
        <Badge className="rounded-full bg-blue-100 px-2.5 py-0.5 text-[10px] font-medium text-blue-700">
          Menejer
        </Badge>
      )
    default:
      return (
        <Badge className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-600">
          Operator
        </Badge>
      )
  }
}

export default function StaffPage() {
  const [loading, setLoading] = useState(true)
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [deleteStaff, setDeleteStaff] = useState<StaffMember | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const counts = useMemo(() => {
    const total = staff.length
    const operators = staff.filter((s) => s.role === "operator").length
    const managers = staff.filter((s) => s.role === "manager").length
    const admins = staff.filter((s) => s.role === "admin").length
    return { total, operators, managers, admins }
  }, [staff])

  function handleSave(saved: StaffMember) {
    setStaff((prev) => {
      const exists = prev.some((s) => s.id === saved.id)
      if (exists) {
        return prev.map((s) => (s.id === saved.id ? saved : s))
      }
      return [...prev, saved]
    })
    setEditingStaff(null)
  }

  function handleDelete() {
    if (!deleteStaff) return
    setStaff((prev) => prev.filter((s) => s.id !== deleteStaff.id))
    setDeleteStaff(null)
  }

  if (loading) {
    return (
      <>
        <Topbar title="Xodimlar" />
        <div className="flex-1 overflow-auto p-6">
          <Skeleton className="mb-4 h-9 w-48 rounded-xl" />
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="mb-2 h-12 w-full rounded-lg" />
          ))}
        </div>
      </>
    )
  }

  return (
    <>
      <Topbar
        title="Xodimlar"
        subtitle={`${counts.total} ta xodim · ${counts.operators} ta operator · ${counts.managers} ta menejer · ${counts.admins} ta admin`}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-end border-b bg-white px-6 py-3">
          <Button
            className="gap-1.5 rounded-xl text-xs text-white"
            style={{ backgroundColor: "var(--brand-primary)" }}
            onClick={() => {
              setEditingStaff(null)
              setModalOpen(true)
            }}
          >
            <Plus className="size-3.5" />
            Xodim qo&apos;shish
          </Button>
        </div>

        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10 bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Ism
                </th>
                <th
                  className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Filial
                </th>
                <th
                  className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Rol
                </th>
                <th
                  className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Email
                </th>
                <th
                  className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--brand-muted)" }}
                >
                  So&apos;nggi faollik
                </th>
                <th
                  className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Holat
                </th>
                <th
                  className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--brand-muted)" }}
                >
                  Amallar
                </th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => {
                const activity = LAST_ACTIVITY[member.id] ?? {
                  text: "—",
                }
                const isInvited = INVITED_IDS.has(member.id)
                const isAdmin = member.role === "admin"
                const isOnlineRow = activity.isOnline

                return (
                  <tr
                    key={member.id}
                    className={`border-b border-gray-50 transition-colors duration-150 hover:bg-slate-50 ${
                      isOnlineRow ? "bg-emerald-50/40" : ""
                    }`}
                  >
                    <td className="px-6 py-3.5 text-sm font-semibold text-gray-900">
                      {member.name}
                    </td>
                    <td className="px-3 py-3.5 text-xs text-gray-700">
                      {member.branchId ? getBranchName(member.branchId) : "Barcha filiallar"}
                    </td>
                    <td className="px-3 py-3.5">
                      {getRoleBadge(member.role)}
                    </td>
                    <td className="px-3 py-3.5 text-xs text-gray-700">
                      {member.email}
                    </td>
                    <td className="px-3 py-3.5 text-xs text-gray-700">
                      <span className="flex items-center gap-1.5">
                        {activity.isOnline && (
                          <span className="inline-block size-2 rounded-full bg-emerald-500" />
                        )}
                        {activity.text}
                      </span>
                    </td>
                    <td className="px-3 py-3.5">
                      {isInvited ? (
                        <Badge className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-medium text-amber-700">
                          <span className="mr-1.5 inline-block size-1.5 animate-pulse rounded-full bg-amber-500" />
                          Taklif yuborildi
                        </Badge>
                      ) : (
                        <Badge className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-medium text-emerald-700">
                          Faol
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
                            setEditingStaff(member)
                            setModalOpen(true)
                          }}
                        >
                          <Pencil className="size-3.5 text-gray-500" />
                        </Button>
                        {!isAdmin && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="size-7 rounded-lg p-0"
                            onClick={() => setDeleteStaff(member)}
                          >
                            <Trash2 className="size-3.5 text-gray-500" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      <StaffFormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        staff={editingStaff}
        onSave={handleSave}
      />

      <DeleteStaffDialog
        open={!!deleteStaff}
        onOpenChange={(open) => {
          if (!open) setDeleteStaff(null)
        }}
        staff={deleteStaff}
        onConfirm={handleDelete}
      />
    </>
  )
}
