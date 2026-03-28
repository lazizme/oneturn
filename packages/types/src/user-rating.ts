export type AccessLevel = "full" | "restricted" | "blocked"

export interface UserRating {
  phone: string
  score: number
  totalBookings: number
  noShows: number
  accessLevel: AccessLevel
}
