import type { Booking } from "@workspace/types"

// ── Storage keys ──────────────────────────────────────────────────────────

const QUEUE_KEY = (branchId: string) => `ot_queue_${branchId}`
const BOOKING_KEY = (id: string) => `ot_booking_${id}`
const HISTORY_KEY = (orgId: string) => `ot_history_${orgId}`
const STATS_KEY = (orgId: string) => `ot_stats_${orgId}`
const EVENT_KEY = "ot_event"

// ── Types ─────────────────────────────────────────────────────────────────

export interface OrgStats {
  todayTotal: number
  currentQueue: number
  noShowCount: number
  avgWaitMin: number
}

export type SyncEvent = {
  type: "NEW_BOOKING" | "BOOKING_UPDATED" | "BOOKING_CANCELLED"
  booking: Booking
  timestamp: number
}

// ── Helpers ───────────────────────────────────────────────────────────────

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function fire(event: SyncEvent) {
  localStorage.setItem(EVENT_KEY, JSON.stringify(event))
  window.dispatchEvent(new CustomEvent("ot_sync", { detail: event }))
}

// ── Ticket counter (sequential across all apps) ──────────────────────────

export function nextTicket(branchId: string): string {
  const key = `ot_ticket_${branchId}`
  const n = parseInt(localStorage.getItem(key) ?? "10", 10) + 1
  localStorage.setItem(key, String(n))
  return `A-${n}`
}

// ── Write ─────────────────────────────────────────────────────────────────

const DEFAULT_STATS: OrgStats = {
  todayTotal: 142,
  currentQueue: 4,
  noShowCount: 12,
  avgWaitMin: 14,
}

export function publishBooking(booking: Booking) {
  localStorage.setItem(BOOKING_KEY(booking.id), JSON.stringify(booking))

  // Add to branch queue (staff)
  const queue: Booking[] = read(QUEUE_KEY(booking.branchId), [])
  localStorage.setItem(
    QUEUE_KEY(booking.branchId),
    JSON.stringify([...queue, booking])
  )

  // Add to org history (dashboard)
  const history: Booking[] = read(HISTORY_KEY(booking.orgId), [])
  localStorage.setItem(
    HISTORY_KEY(booking.orgId),
    JSON.stringify([booking, ...history])
  )

  // Increment stats (dashboard)
  const stats: OrgStats = read(STATS_KEY(booking.orgId), DEFAULT_STATS)
  localStorage.setItem(
    STATS_KEY(booking.orgId),
    JSON.stringify({
      ...stats,
      todayTotal: stats.todayTotal + 1,
      currentQueue: stats.currentQueue + 1,
    })
  )

  fire({ type: "NEW_BOOKING", booking, timestamp: Date.now() })
}

export function updateBookingStatus(
  booking: Booking,
  status: Booking["status"],
  extra?: Partial<Booking>
) {
  const updated: Booking = { ...booking, ...extra, status }
  localStorage.setItem(BOOKING_KEY(booking.id), JSON.stringify(updated))

  // Update in queue
  const queue: Booking[] = read(QUEUE_KEY(booking.branchId), [])
  localStorage.setItem(
    QUEUE_KEY(booking.branchId),
    JSON.stringify(queue.map((b) => (b.id === booking.id ? updated : b)))
  )

  // Update in history
  const history: Booking[] = read(HISTORY_KEY(booking.orgId), [])
  localStorage.setItem(
    HISTORY_KEY(booking.orgId),
    JSON.stringify(history.map((b) => (b.id === booking.id ? updated : b)))
  )

  // Update stats
  const stats: OrgStats = read(STATS_KEY(booking.orgId), DEFAULT_STATS)
  const delta: Partial<OrgStats> = {}
  if (status === "completed" || status === "no_show") {
    delta.currentQueue = Math.max(0, stats.currentQueue - 1)
  }
  if (status === "no_show") {
    delta.noShowCount = stats.noShowCount + 1
  }
  localStorage.setItem(
    STATS_KEY(booking.orgId),
    JSON.stringify({ ...stats, ...delta })
  )

  fire({ type: "BOOKING_UPDATED", booking: updated, timestamp: Date.now() })
}

// ── Read ──────────────────────────────────────────────────────────────────

export function getQueue(branchId: string): Booking[] {
  return read<Booking[]>(QUEUE_KEY(branchId), []).filter((b) =>
    ["pending", "arrived", "serving"].includes(b.status)
  )
}

export function getHistory(orgId: string): Booking[] {
  return read<Booking[]>(HISTORY_KEY(orgId), [])
}

export function getStats(orgId: string): OrgStats {
  return read<OrgStats>(STATS_KEY(orgId), DEFAULT_STATS)
}

// ── Subscribe ─────────────────────────────────────────────────────────────

export function subscribe(
  filter: { orgId?: string; branchId?: string },
  cb: (e: SyncEvent) => void
): () => void {
  function matches(e: SyncEvent) {
    if (filter.orgId && e.booking.orgId !== filter.orgId) return false
    if (filter.branchId && e.booking.branchId !== filter.branchId) return false
    return true
  }

  function onStorage(e: StorageEvent) {
    if (e.key !== EVENT_KEY || !e.newValue) return
    try {
      const ev = JSON.parse(e.newValue) as SyncEvent
      if (matches(ev)) cb(ev)
    } catch {
      // ignore malformed events
    }
  }

  function onCustom(e: Event) {
    const ev = (e as CustomEvent<SyncEvent>).detail
    if (matches(ev)) cb(ev)
  }

  window.addEventListener("storage", onStorage)
  window.addEventListener("ot_sync", onCustom)

  return () => {
    window.removeEventListener("storage", onStorage)
    window.removeEventListener("ot_sync", onCustom)
  }
}

// ── Seed + Reset ──────────────────────────────────────────────────────────

export function seedIfEmpty(
  orgId: string,
  branchId: string,
  bookings: Booking[]
) {
  if (read(QUEUE_KEY(branchId), []).length > 0) return
  for (const b of bookings) {
    localStorage.setItem(BOOKING_KEY(b.id), JSON.stringify(b))
  }
  localStorage.setItem(
    QUEUE_KEY(branchId),
    JSON.stringify(bookings.filter((b) => b.status === "pending"))
  )
  localStorage.setItem(HISTORY_KEY(orgId), JSON.stringify(bookings))
}

export function resetDemo() {
  const keys = Object.keys(localStorage).filter((k) => k.startsWith("ot_"))
  for (const k of keys) {
    localStorage.removeItem(k)
  }
  window.location.reload()
}
