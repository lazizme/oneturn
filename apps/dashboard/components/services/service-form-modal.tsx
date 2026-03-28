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
import type { Service } from "@workspace/types"
import { mockBranches } from "@workspace/mock-data"
import { toast } from "sonner"

interface ServiceFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  service?: Service | null
  onSave: (service: Service, assignedBranches: string[]) => void
}

export function ServiceFormModal({
  open,
  onOpenChange,
  service,
  onSave,
}: ServiceFormModalProps) {
  const isEdit = !!service
  const [name, setName] = useState(service?.name ?? "")
  const [duration, setDuration] = useState(service?.estimatedDurationMin ?? 20)
  const [maxSlots, setMaxSlots] = useState(
    service?.maxSlotsPerHour ?? Math.floor(60 / 20)
  )
  const [isAvailable, setIsAvailable] = useState(service?.isAvailable ?? true)
  const [selectedBranches, setSelectedBranches] = useState<string[]>(
    service ? [service.branchId] : mockBranches.map((b) => b.id)
  )
  const [saving, setSaving] = useState(false)

  const autoSlots = Math.floor(60 / duration)

  function handleDurationChange(val: number) {
    setDuration(val)
    setMaxSlots(Math.floor(60 / val))
  }

  function handleToggleBranch(branchId: string) {
    setSelectedBranches((prev) =>
      prev.includes(branchId)
        ? prev.filter((id) => id !== branchId)
        : [...prev, branchId]
    )
  }

  function handleSave() {
    if (!name.trim()) return
    setSaving(true)
    setTimeout(() => {
      const newService: Service = {
        id: service?.id ?? `service-${Date.now()}`,
        branchId: selectedBranches[0] ?? "",
        name: name.trim(),
        estimatedDurationMin: duration,
        maxSlotsPerHour: maxSlots,
        isAvailable,
      }
      onSave(newService, selectedBranches)
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
            {isEdit ? "Xizmatni tahrirlash" : "Yangi xizmat qo'shish"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          <div>
            <Label className="mb-1.5 text-xs font-medium">
              Xizmat nomi
            </Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Hisob ochish"
              className="rounded-xl"
            />
          </div>

          <div>
            <Label className="mb-1.5 text-xs font-medium">
              Taxminiy davomiyligi: {duration} daqiqa
            </Label>
            <input
              type="range"
              min={5}
              max={60}
              step={5}
              value={duration}
              onChange={(e) => handleDurationChange(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <p className="mt-1 text-xs" style={{ color: "var(--brand-muted)" }}>
              Soatiga {autoSlots} ta mijoz qabul qilish mumkin
            </p>
          </div>

          <div>
            <Label className="mb-1.5 text-xs font-medium">
              Soatlik maksimal slot
            </Label>
            <Input
              type="number"
              min={1}
              max={12}
              value={maxSlots}
              onChange={(e) => setMaxSlots(Number(e.target.value))}
              className="w-24 rounded-xl"
            />
          </div>

          <div>
            <Label className="mb-2 text-xs font-medium">
              Filiallar
            </Label>
            <div className="space-y-2">
              {mockBranches.map((branch) => (
                <label
                  key={branch.id}
                  className="flex cursor-pointer items-center gap-2.5 rounded-lg p-1.5 text-sm transition-colors hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedBranches.includes(branch.id)}
                    onChange={() => handleToggleBranch(branch.id)}
                    className="size-4 rounded"
                  />
                  <span className="text-gray-700">{branch.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium">Holati</Label>
            <button
              onClick={() => setIsAvailable(!isAvailable)}
              className={`relative h-6 w-11 rounded-full transition-colors ${
                isAvailable ? "" : "bg-gray-300"
              }`}
              style={isAvailable ? { backgroundColor: "var(--brand-accent)" } : undefined}
            >
              <span
                className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform ${
                  isAvailable ? "translate-x-5" : "translate-x-0.5"
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
            disabled={saving || !name.trim()}
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
