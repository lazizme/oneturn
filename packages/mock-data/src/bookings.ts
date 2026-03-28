import type { Booking, BookingStatus, BookingType } from "@workspace/types"
import {
  generateEditToken,
  generatePhone,
  generateTicketNumber,
  generateUzbekName,
  pickRandom,
  randomInt,
  seededRandom,
} from "./helpers"
import { mockBranches } from "./organizations"

const STATUSES_HISTORICAL: BookingStatus[] = [
  "completed",
  "completed",
  "completed",
  "completed",
  "completed",
  "completed",
  "no_show",
  "cancelled",
]

function generateMockBookings(count: number): Booking[] {
  const bookings: Booking[] = []
  const now = new Date()
  const ticketPrefixes = ["A", "B", "C"]

  for (let i = 0; i < count; i++) {
    const branch = pickRandom(mockBranches)
    const service = pickRandom(branch.services)
    const name = generateUzbekName()
    const daysAgo = randomInt(0, 30)
    const hour = randomInt(9, 17)
    const minute = pickRandom([0, 15, 30, 45])

    const createdAt = new Date(now)
    createdAt.setDate(createdAt.getDate() - daysAgo)
    createdAt.setHours(hour, minute, 0, 0)

    const isToday = daysAgo === 0
    const status: BookingStatus = isToday
      ? pickRandom(["pending", "arrived", "serving", "completed"])
      : pickRandom(STATUSES_HISTORICAL)

    const type: BookingType =
      seededRandom() > 0.4 ? "scheduled" : "live"

    const scheduledAt =
      type === "scheduled" ? new Date(createdAt) : undefined
    if (scheduledAt) {
      scheduledAt.setMinutes(
        scheduledAt.getMinutes() + randomInt(10, 60)
      )
    }

    const arrivedAt =
      status !== "pending" &&
      status !== "cancelled" &&
      status !== "no_show"
        ? new Date(
            createdAt.getTime() + randomInt(5, 30) * 60 * 1000
          )
        : undefined

    const serviceStartedAt =
      status === "serving" || status === "completed"
        ? new Date(
            (arrivedAt ?? createdAt).getTime() +
              randomInt(1, 10) * 60 * 1000
          )
        : undefined

    const serviceEndedAt =
      status === "completed" && serviceStartedAt
        ? new Date(
            serviceStartedAt.getTime() +
              randomInt(
                service.estimatedDurationMin - 5,
                service.estimatedDurationMin + 10
              ) *
                60 *
                1000
          )
        : undefined

    const actualDurationMin =
      serviceStartedAt && serviceEndedAt
        ? Math.round(
            (serviceEndedAt.getTime() - serviceStartedAt.getTime()) /
              60000
          )
        : undefined

    bookings.push({
      id: `booking-${i + 1}`,
      ticketNumber: generateTicketNumber(
        pickRandom(ticketPrefixes),
        randomInt(1, 50)
      ),
      orgId: "agrobank-demo",
      branchId: branch.id,
      serviceId: service.id,
      userPhone: generatePhone(),
      userName: `${name.first} ${name.last}`,
      type,
      scheduledAt,
      status,
      createdAt,
      arrivedAt,
      serviceStartedAt,
      serviceEndedAt,
      actualDurationMin,
      editToken: generateEditToken(),
    })
  }

  return bookings
}

export const mockBookings: Booking[] = generateMockBookings(100)

export function getTodayBookings(): Booking[] {
  const today = new Date()
  return mockBookings.filter((b) => {
    const d = new Date(b.createdAt)
    return (
      d.getFullYear() === today.getFullYear() &&
      d.getMonth() === today.getMonth() &&
      d.getDate() === today.getDate()
    )
  })
}

export function getBranchBookings(branchId: string): Booking[] {
  return mockBookings.filter((b) => b.branchId === branchId)
}

export function getLiveQueueBookings(branchId: string): Booking[] {
  return mockBookings.filter(
    (b) =>
      b.branchId === branchId &&
      (b.status === "pending" ||
        b.status === "arrived" ||
        b.status === "serving" ||
        b.status === "completed")
  )
}
