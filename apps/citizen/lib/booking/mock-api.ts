import type { Booking } from "@workspace/types"
import { generateTicketNumber, generateUzbekName, generateEditToken } from "@workspace/mock-data"
import { publishBooking, nextTicket } from "@workspace/sync"
import type { TimeSlot } from "./types"

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function sendOtp(phone: string): Promise<void> {
  await delay(1200)
  if (phone.length < 9) throw new Error("Telefon raqam noto'g'ri")
}

export async function verifyOtp(
  phone: string,
  otp: string,
  context: { orgId: string; branchId: string; serviceId: string; mode: "live" | "scheduled"; slot?: string }
): Promise<Booking> {
  await delay(800)
  if (otp !== "1234" && otp !== "0000") {
    throw new Error("Kod noto'g'ri. Qaytadan urinib ko'ring.")
  }
  return generateMockBooking(phone, context)
}

export async function authWithOneId(
  context: { orgId: string; branchId: string; serviceId: string; mode: "live" | "scheduled"; slot?: string }
): Promise<Booking> {
  await delay(1500)
  return generateMockBooking("+998901234567", context)
}

export async function getAvailableSlots(
  _branchId: string,
  _serviceId: string,
  date: Date
): Promise<TimeSlot[]> {
  await delay(400)
  return generateTimeSlots(date)
}

function generateTimeSlots(date: Date): TimeSlot[] {
  const slots: TimeSlot[] = []
  const hours = [9, 10, 11, 12, 14, 15, 16, 17]
  const isToday = date.toDateString() === new Date().toDateString()
  const currentHour = new Date().getHours()

  for (const hour of hours) {
    for (const minute of [0, 30]) {
      const isPast = isToday && (hour < currentHour || (hour === currentHour && minute < new Date().getMinutes()))
      const available = !isPast && Math.random() > 0.3
      const capacity = Math.floor(Math.random() * 3) + 1
      const d = new Date(date)
      d.setHours(hour, minute, 0, 0)

      slots.push({
        time: `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`,
        datetime: d.toISOString(),
        available,
        spotsLeft: available ? capacity : 0,
      })
    }
  }
  return slots
}

function generateMockBooking(
  phone: string,
  context: { orgId: string; branchId: string; serviceId: string; mode: "live" | "scheduled"; slot?: string }
): Booking {
  const name = generateUzbekName()
  const ticket = typeof window !== "undefined"
    ? nextTicket(context.branchId)
    : generateTicketNumber("A", Math.floor(Math.random() * 50) + 10)

  const booking: Booking = {
    id: `bk-${Date.now()}`,
    ticketNumber: ticket,
    orgId: context.orgId,
    branchId: context.branchId,
    serviceId: context.serviceId,
    userPhone: `+998${phone}`,
    userName: `${name.first} ${name.last}`,
    type: context.mode,
    scheduledAt: context.slot ? new Date(context.slot) : undefined,
    status: "pending",
    createdAt: new Date(),
    editToken: generateEditToken(),
  }

  if (typeof window !== "undefined") {
    publishBooking(booking)
  }

  return booking
}
