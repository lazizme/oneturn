import type { OrgType } from "@workspace/types"
import { Building02Icon, BankIcon, Hospital01Icon, ClipboardIcon } from "@hugeicons/core-free-icons"

/** Category color based on org type */
export function getCategoryColor(type: OrgType): string {
  switch (type) {
    case "government": return "var(--c-gov)"
    case "bank": return "var(--c-bank)"
    case "clinic": return "var(--c-clinic)"
    default: return "var(--c-other)"
  }
}

/** Category light background */
export function getCategoryBg(type: OrgType): string {
  switch (type) {
    case "government": return "var(--c-gov-light)"
    case "bank": return "var(--c-bank-light)"
    case "clinic": return "var(--c-clinic-light)"
    default: return "var(--c-other-light)"
  }
}

/** Category label in Uzbek */
export function getCategoryLabel(type: OrgType): string {
  switch (type) {
    case "government": return "Davlat"
    case "bank": return "Bank"
    case "clinic": return "Klinika"
    default: return "Boshqa"
  }
}

/** Category icon definition (hugeicons) */
export function getCategoryIcon(type: OrgType) {
  switch (type) {
    case "government": return Building02Icon
    case "bank": return BankIcon
    case "clinic": return Hospital01Icon
    default: return ClipboardIcon
  }
}

/** Busy badge: color + label based on busyIndex */
export function getBusyInfo(busyIndex: number): { color: string; label: string; dotColor: string } {
  if (busyIndex < 40) return { color: "var(--c-accent)", label: "Bo'sh", dotColor: "#10B981" }
  if (busyIndex <= 70) return { color: "var(--c-warning)", label: "Band", dotColor: "#F59E0B" }
  return { color: "var(--c-danger)", label: "Juda band", dotColor: "#EF4444" }
}

/** Simple distance calculation (Haversine approximation for Tashkent's latitude) */
export function getDistanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}
