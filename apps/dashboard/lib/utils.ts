import type { Branch } from "@workspace/types"

export function getBusyColor(busyIndex: number): string {
  if (busyIndex <= 40) return "var(--brand-accent)"
  if (busyIndex <= 70) return "var(--brand-warning)"
  return "var(--brand-danger)"
}

export function getBusyLabel(busyIndex: number): string {
  if (busyIndex <= 40) return "Bo'sh"
  if (busyIndex <= 70) return "O'rtacha"
  return "Band"
}

export function getServiceName(
  serviceId: string,
  branches: Branch[]
): string {
  for (const branch of branches) {
    const service = branch.services.find((s) => s.id === serviceId)
    if (service) return service.name
  }
  return serviceId
}

export function getBranchName(
  branchId: string,
  branches: Branch[]
): string {
  const branch = branches.find((b) => b.id === branchId)
  return branch?.name ?? branchId
}

export function formatDate(date: Date): string {
  const d = new Date(date)
  const months = [
    "yan",
    "fev",
    "mar",
    "apr",
    "may",
    "iyn",
    "iyl",
    "avg",
    "sen",
    "okt",
    "noy",
    "dek",
  ]
  return `${d.getDate()} ${months[d.getMonth()]}, ${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`
}

export function maskPhone(phone: string): string {
  // "+998 90 123 45 67" → "+998 90 ••• •• 67"
  const parts = phone.split(" ")
  if (parts.length >= 5) {
    return `${parts[0]} ${parts[1]} ••• •• ${parts[4]}`
  }
  return phone
}
