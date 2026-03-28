// Simple seeded random number generator (mulberry32)
export function createRng(seed: number) {
  let s = seed
  return function next(): number {
    s |= 0
    s = (s + 0x6d2b79f5) | 0
    let t = Math.imul(s ^ (s >>> 15), 1 | s)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const rng = createRng(42)

export function seededRandom(): number {
  return rng()
}

export function randomInt(min: number, max: number): number {
  return Math.floor(seededRandom() * (max - min + 1)) + min
}

export function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(seededRandom() * arr.length)]!
}

export const UZBEK_FIRST_NAMES = [
  "Jasur",
  "Malika",
  "Bobur",
  "Dilnoza",
  "Aziz",
  "Kamola",
  "Sherzod",
  "Nilufar",
  "Sardor",
  "Gulnora",
  "Timur",
  "Madina",
  "Rustam",
  "Zulfiya",
  "Otabek",
  "Nargiza",
  "Ulugbek",
  "Sevinch",
  "Nodir",
  "Mohira",
]

export const UZBEK_LAST_INITIALS = [
  "T.",
  "A.",
  "N.",
  "M.",
  "K.",
  "R.",
  "S.",
  "B.",
  "I.",
  "D.",
]

export function generateUzbekName(): { first: string; last: string } {
  return {
    first: pickRandom(UZBEK_FIRST_NAMES),
    last: pickRandom(UZBEK_LAST_INITIALS),
  }
}

export function generatePhone(): string {
  const prefixes = ["90", "91", "93", "94", "95", "97", "98", "99"]
  const prefix = pickRandom(prefixes)
  const n1 = randomInt(100, 999)
  const n2 = randomInt(10, 99)
  const n3 = randomInt(10, 99)
  return `+998 ${prefix} ${n1} ${n2} ${n3}`
}

export function generateTicketNumber(
  prefix: string,
  index: number
): string {
  return `${prefix}-${index.toString().padStart(2, "0")}`
}

export function generateEditToken(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789"
  let token = ""
  for (let i = 0; i < 12; i++) {
    token += chars[Math.floor(seededRandom() * chars.length)]
  }
  return token
}
