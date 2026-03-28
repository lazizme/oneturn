export type BookingStatus =
  | "pending"
  | "arrived"
  | "serving"
  | "completed"
  | "no_show"
  | "cancelled"

export type BookingType = "scheduled" | "live"

export interface Booking {
  id: string
  ticketNumber: string
  orgId: string
  branchId: string
  serviceId: string
  userPhone: string
  userName?: string
  type: BookingType
  scheduledAt?: Date
  status: BookingStatus
  createdAt: Date
  arrivedAt?: Date
  serviceStartedAt?: Date
  serviceEndedAt?: Date
  actualDurationMin?: number
  editToken: string
}
