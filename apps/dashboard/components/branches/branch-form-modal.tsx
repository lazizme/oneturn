"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"
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
import type { Branch } from "@workspace/types"
import { createBranchServices } from "@workspace/mock-data"
import { toast } from "sonner"

const ALL_SERVICES = [
  "Hisob ochish",
  "Kredit rasmiylashtirish",
  "Karta olish",
  "Pul o'tkazish",
  "Konsultatsiya",
]

interface BranchFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  branch?: Branch | null
  onSave: (branch: Branch) => void
}

export function BranchFormModal({
  open,
  onOpenChange,
  branch,
  onSave,
}: BranchFormModalProps) {
  const isEdit = !!branch
  const [name, setName] = useState(branch?.name ?? "")
  const [address, setAddress] = useState(branch?.address ?? "")
  const [openTime, setOpenTime] = useState(
    branch?.workingHours.open ?? "09:00"
  )
  const [closeTime, setCloseTime] = useState(
    branch?.workingHours.close ?? "18:00"
  )
  const [isOpen, setIsOpen] = useState(branch?.isOpen ?? true)
  const [selectedServices, setSelectedServices] = useState<string[]>(
    branch?.services.map((s) => s.name) ?? ALL_SERVICES.slice(0, 3)
  )
  const [saving, setSaving] = useState(false)

  function handleToggleService(service: string) {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    )
  }

  function handleSave() {
    if (!name.trim() || !address.trim()) return

    setSaving(true)
    setTimeout(() => {
      const id = branch?.id ?? `branch-${Date.now()}`
      const newBranch: Branch = {
        id,
        orgId: "agrobank-demo",
        name: name.trim(),
        address: address.trim(),
        lat: branch?.lat ?? 41.311 + (Math.random() - 0.5) * 0.05,
        lng: branch?.lng ?? 69.279 + (Math.random() - 0.5) * 0.05,
        workingHours: { open: openTime, close: closeTime },
        services: createBranchServices(id).filter((s) =>
          selectedServices.includes(s.name)
        ),
        busyIndex: branch?.busyIndex ?? Math.floor(Math.random() * 60),
        currentQueue: branch?.currentQueue ?? Math.floor(Math.random() * 15),
        avgWaitMinutes: branch?.avgWaitMinutes ?? Math.floor(Math.random() * 15) + 5,
        isOpen,
      }
      onSave(newBranch)
      toast.success(`${name.trim()} saqlandi`)
      setSaving(false)
      onOpenChange(false)
    }, 800)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {isEdit ? "Filialni tahrirlash" : "Yangi filial qo'shish"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div>
            <Label className="mb-1.5 text-xs font-medium">
              Filial nomi
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Yunusobod filiali"
              className="rounded-xl"
            />
          </div>

          <div>
            <Label className="mb-1.5 text-xs font-medium">Manzil</Label>
            <Input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ko'cha, uy, shahar"
              className="rounded-xl"
            />
          </div>

          <div>
            <Label className="mb-1.5 text-xs font-medium">
              Ish vaqti
            </Label>
            <div className="flex items-center gap-3">
              <Input
                type="time"
                value={openTime}
                onChange={(e) => setOpenTime(e.target.value)}
                className="flex-1 rounded-xl"
              />
              <span className="text-sm" style={{ color: "var(--brand-muted)" }}>
                —
              </span>
              <Input
                type="time"
                value={closeTime}
                onChange={(e) => setCloseTime(e.target.value)}
                className="flex-1 rounded-xl"
              />
            </div>
          </div>

          <div>
            <Label className="mb-2 text-xs font-medium">
              Xizmatlar
            </Label>
            <div className="space-y-2">
              {ALL_SERVICES.map((service) => (
                <label
                  key={service}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg p-1.5 text-sm transition-colors hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(service)}
                    onChange={() => handleToggleService(service)}
                    className="size-4 rounded"
                  />
                  <span className="text-gray-700">{service}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Holati</Label>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                isOpen ? "" : "bg-gray-300"
              }`}
              style={isOpen ? { backgroundColor: "var(--brand-accent)" } : undefined}
            >
              <span
                className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform ${
                  isOpen ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
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
            disabled={saving || !name.trim() || !address.trim()}
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 size-3.5 animate-spin" />
                Saqlanmoqda...
              </>
            ) : (
              "Saqlash →"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
