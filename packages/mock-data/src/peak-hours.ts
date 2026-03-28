import { randomInt } from "./helpers"

export interface PeakHourCell {
  day: number
  dayName: string
  hour: number
  bookings: number
}

const DAY_NAMES = [
  "Dushanba",
  "Seshanba",
  "Chorshanba",
  "Payshanba",
  "Juma",
  "Shanba",
  "Yakshanba",
]

function generatePeakHoursData(): PeakHourCell[] {
  const data: PeakHourCell[] = []

  for (let day = 0; day < 7; day++) {
    for (let hour = 8; hour <= 19; hour++) {
      const isWeekend = day >= 5
      const isMorningRush = hour >= 9 && hour <= 11
      const isAfternoonRush = hour >= 14 && hour <= 16
      const isLunchTime = hour >= 12 && hour <= 13

      let base: number
      if (isWeekend) {
        base = randomInt(2, 8)
      } else if (isMorningRush) {
        base = randomInt(12, 22)
      } else if (isAfternoonRush) {
        base = randomInt(10, 18)
      } else if (isLunchTime) {
        base = randomInt(4, 10)
      } else {
        base = randomInt(3, 12)
      }

      data.push({
        day,
        dayName: DAY_NAMES[day]!,
        hour,
        bookings: base,
      })
    }
  }

  return data
}

export const mockPeakHours: PeakHourCell[] = generatePeakHoursData()
