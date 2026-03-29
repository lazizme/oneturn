"use client"

import { useEffect, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Label } from "@workspace/ui/components/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@workspace/ui/components/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import type { StaffMember, StaffRole } from "@workspace/types"
import { mockBranches } from "@workspace/mock-data"
import { toast } from "sonner"

interface StaffFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  staff?: StaffMember | null
  onSave: (staff: StaffMember) => void
}

const ROLE_OPTIONS: { value: StaffRole; label: string; description: string }[] =
  [
    {
      value: "operator",
      label: "Operator",
      description: "Faqat o'z filialining navbatini boshqaradi",
    },
    {
      value: "manager",
      label: "Menejer",
      description: "Filial statistikasini ko'ra oladi",
    },
    {
      value: "admin",
      label: "Admin",
      description: "Barcha filiallarga to'liq kirish",
    },
  ]

const DEFAULT_INVITE_MESSAGE =
  "Siz OneTurn tizimiga taklif qilindingiz. Iltimos, quyidagi havola orqali tizimga kiring va parolingizni o'rnating."

export function StaffFormModal({
  open,
  onOpenChange,
  staff,
  onSave,
}: StaffFormModalProps) {
  const isEdit = !!staff
  const isSelf = staff?.id === "staff-1"

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<StaffRole>("operator")
  const [branchId, setBranchId] = useState("")
  const [inviteMessage, setInviteMessage] = useState(DEFAULT_INVITE_MESSAGE)
  const [saving, setSaving] = useState(false)

  /* eslint-disable react-hooks/set-state-in-effect -- reset form when dialog opens */
  useEffect(() => {
    if (open) {
      setName(staff?.name ?? "")
      setEmail(staff?.email ?? "")
      setRole(staff?.role ?? "operator")
      setBranchId(staff?.branchId ?? mockBranches[0]?.id ?? "")
      setInviteMessage(DEFAULT_INVITE_MESSAGE)
      setSaving(false)
    }
  }, [open, staff])
  /* eslint-enable react-hooks/set-state-in-effect */

  const showBranch = role !== "admin"

  function handleSave() {
    if (!name.trim() || !email.trim()) return
    if (showBranch && !branchId) return

    setSaving(true)
    setTimeout(() => {
      const saved: StaffMember = {
        id: staff?.id ?? `staff-${Date.now()}`,
        orgId: staff?.orgId ?? "agrobank-demo",
        branchId: role === "admin" ? "" : branchId,
        name: name.trim(),
        role,
        email: email.trim(),
      }
      onSave(saved)
      toast.success(
        isEdit ? `${saved.name} yangilandi` : `${saved.name}ga taklif yuborildi`
      )
      setSaving(false)
      onOpenChange(false)
    }, 800)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {isEdit ? "Xodimni tahrirlash" : "Yangi xodim qo'shish"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Name */}
          <div>
            <Label className="mb-1.5 text-xs font-medium">
              To&apos;liq ismi
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Alisher Navoiy"
              className="rounded-xl"
            />
          </div>

          {/* Email */}
          <div>
            <Label className="mb-1.5 text-xs font-medium">Email</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="masalan@agrobank.uz"
              className="rounded-xl"
            />
          </div>

          {/* Role — Radio Group */}
          <div>
            <Label className="mb-2 text-xs font-medium">Rol</Label>
            <div className="space-y-2">
              {ROLE_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors ${
                    role === opt.value
                      ? "border-blue-300 bg-blue-50/50"
                      : "border-gray-200 hover:bg-gray-50"
                  } ${isSelf ? "pointer-events-none opacity-60" : ""}`}
                >
                  <input
                    type="radio"
                    name="staff-role"
                    value={opt.value}
                    checked={role === opt.value}
                    onChange={() => setRole(opt.value)}
                    disabled={isSelf}
                    className="mt-0.5 size-4 accent-blue-600"
                  />
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {opt.label}
                    </span>
                    <p
                      className="mt-0.5 text-xs"
                      style={{ color: "var(--brand-muted)" }}
                    >
                      {opt.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Branch — Select (hidden for admin) */}
          {showBranch && (
            <div>
              <Label className="mb-1.5 text-xs font-medium">Filial</Label>
              <Select value={branchId} onValueChange={setBranchId}>
                <SelectTrigger className="w-full rounded-xl">
                  <SelectValue placeholder="Filialni tanlang" />
                </SelectTrigger>
                <SelectContent>
                  {mockBranches.map((branch) => (
                    <SelectItem key={branch.id} value={branch.id}>
                      {branch.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Invite message — Textarea */}
          <div>
            <Label className="mb-1.5 text-xs font-medium">Taklif xabari</Label>
            <textarea
              value={inviteMessage}
              onChange={(e) => setInviteMessage(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => onOpenChange(false)}
          >
            Bekor qilish
          </Button>
          <Button
            className="rounded-xl text-white"
            style={{ backgroundColor: "var(--brand-primary)" }}
            onClick={handleSave}
            disabled={saving || !name.trim() || !email.trim()}
          >
            {saving ? (
              <>
                <HugeiconsIcon icon={Loading03Icon} size={14} className="mr-2 animate-spin" />
                Saqlanmoqda...
              </>
            ) : isEdit ? (
              "Saqlash →"
            ) : (
              "Taklif yuborish →"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
