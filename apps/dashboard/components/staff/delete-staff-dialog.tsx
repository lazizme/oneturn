"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"
import type { StaffMember } from "@workspace/types"
import { toast } from "sonner"

interface DeleteStaffDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  staff: StaffMember | null
  onConfirm: () => void
}

export function DeleteStaffDialog({
  open,
  onOpenChange,
  staff,
  onConfirm,
}: DeleteStaffDialogProps) {
  function handleDelete() {
    onConfirm()
    toast.success(`${staff?.name ?? "Xodim"} o'chirildi`)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">
            {staff?.name}ni o&apos;chirmoqchimisiz?
          </DialogTitle>
          <DialogDescription className="text-sm" style={{ color: "var(--brand-muted)" }}>
            Bu xodim tizimga kirish imkoniyatini yo&apos;qotadi. Uning barcha
            faollik tarixi saqlanib qoladi.
          </DialogDescription>
        </DialogHeader>

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
            style={{ backgroundColor: "var(--brand-danger)" }}
            onClick={handleDelete}
          >
            Ha, o&apos;chirish
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
