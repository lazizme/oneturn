import type { Organization, Branch, Service } from "@workspace/types"

function createServices(branchId: string, names: { name: string; duration: number }[]): Service[] {
  return names.map((s, i) => ({
    id: `${branchId}-svc-${i}`,
    branchId,
    name: s.name,
    estimatedDurationMin: s.duration,
    maxSlotsPerHour: Math.max(2, Math.floor(60 / s.duration)),
    isAvailable: true,
  }))
}

const govServices = [
  { name: "Pasport almashish", duration: 20 },
  { name: "Ro'yxatga olish", duration: 10 },
  { name: "Guvohnoma olish", duration: 15 },
  { name: "Ma'lumotnoma", duration: 8 },
  { name: "INN olish", duration: 12 },
]

const bankServices = [
  { name: "Hisob ochish", duration: 20 },
  { name: "Kredit ariza", duration: 30 },
  { name: "Karta olish", duration: 15 },
  { name: "Pul o'tkazish", duration: 10 },
  { name: "Konsultatsiya", duration: 15 },
]

const clinicServices = [
  { name: "Terapevt", duration: 15 },
  { name: "Kardiolog", duration: 20 },
  { name: "Nevropatolog", duration: 20 },
  { name: "Stomatolog", duration: 25 },
  { name: "Laboratoriya", duration: 10 },
  { name: "Ultratovush", duration: 15 },
]

const taxServices = [
  { name: "Soliq deklaratsiyasi", duration: 15 },
  { name: "INN olish", duration: 12 },
  { name: "Soliq to'lash", duration: 10 },
  { name: "Konsultatsiya", duration: 20 },
]

const mvrServices = [
  { name: "Pasport almashish", duration: 25 },
  { name: "Haydovchilik guvohnomasi", duration: 20 },
  { name: "Ro'yxatga olish", duration: 15 },
  { name: "Fuqarolik olish", duration: 30 },
]

function makeBranch(
  id: string,
  orgId: string,
  name: string,
  address: string,
  lat: number,
  lng: number,
  busyIndex: number,
  currentQueue: number,
  avgWaitMinutes: number,
  isOpen: boolean,
  services: { name: string; duration: number }[]
): Branch {
  return {
    id,
    orgId,
    name,
    address,
    lat,
    lng,
    workingHours: { open: "09:00", close: "18:00" },
    services: createServices(id, services),
    busyIndex,
    currentQueue,
    avgWaitMinutes,
    isOpen,
  }
}

export const citizenOrganizations: Organization[] = [
  // Government
  {
    id: "yagona-darcha",
    name: "Yagona Darcha",
    nameRu: "Единое окно",
    type: "government",
    description: "Davlat xizmatlarini bir joyda. Pasport, ro'yxatga olish, guvohnomalar.",
    rating: 4.2,
    totalServed: 128400,
    branches: [
      makeBranch("yd-yunusobod", "yagona-darcha", "Yunusobod MFY", "Amir Temur 108", 41.3425, 69.3044, 82, 31, 24, true, govServices),
      makeBranch("yd-chilonzor", "yagona-darcha", "Chilonzor MFY", "Chilonzor 45", 41.2995, 69.2401, 45, 14, 11, true, govServices),
      makeBranch("yd-mirzo-ulugbek", "yagona-darcha", "Mirzo Ulug'bek MFY", "Bog'ishamol 56", 41.3211, 69.3150, 23, 7, 6, true, govServices),
    ],
    staff: [],
  },
  {
    id: "soliq-komitasi",
    name: "Soliq Qo'mitasi",
    type: "government",
    description: "Soliq to'lash, deklaratsiya topshirish, INN olish.",
    rating: 3.8,
    totalServed: 89200,
    branches: [
      makeBranch("sq-mirzo", "soliq-komitasi", "Mirzo Ulug'bek inspeksiyasi", "Mirzo Ulug'bek 19", 41.3190, 69.3100, 91, 44, 35, true, taxServices),
      makeBranch("sq-shayx", "soliq-komitasi", "Shayxontohur inspeksiyasi", "Shayxontohur 7", 41.3050, 69.2650, 58, 19, 16, true, taxServices),
    ],
    staff: [],
  },
  {
    id: "ichki-ishlar",
    name: "Ichki Ishlar Vazirligi",
    type: "government",
    description: "Pasport almashish, haydovchilik guvohnomasi, ro'yxatga olish.",
    rating: 3.5,
    totalServed: 204000,
    branches: [
      makeBranch("iiv-main", "ichki-ishlar", "Markaziy IIIB", "Toshkent sh. 1", 41.3000, 69.2400, 88, 52, 41, true, mvrServices),
    ],
    staff: [],
  },
  // Banks
  {
    id: "agrobank",
    name: "Agrobank",
    type: "bank",
    description: "Hisob ochish, kredit, karta, pul o'tkazmalar.",
    rating: 4.4,
    totalServed: 312000,
    branches: [
      makeBranch("ab-chilonzor", "agrobank", "Chilonzor filiali", "Chilonzor ko'chasi 45", 41.2995, 69.2401, 78, 23, 18, true, bankServices),
      makeBranch("ab-yunusobod", "agrobank", "Yunusobod filiali", "Amir Temur 108", 41.3425, 69.3044, 42, 11, 9, true, bankServices),
      makeBranch("ab-mirobod", "agrobank", "Mirobod filiali", "Mirobod 12", 41.3111, 69.2833, 15, 4, 5, true, bankServices),
    ],
    staff: [],
  },
  {
    id: "kapitalbank",
    name: "Kapitalbank",
    type: "bank",
    description: "Depozit, kredit, online banking, valyuta operatsiyalari.",
    rating: 4.6,
    totalServed: 198000,
    branches: [
      makeBranch("kb-broadway", "kapitalbank", "Broadway filiali", "Broadway 22", 41.2980, 69.2800, 61, 17, 13, true, bankServices),
      makeBranch("kb-sergeli", "kapitalbank", "Sergeli filiali", "Sergeli 8", 41.2400, 69.2100, 29, 8, 7, false, bankServices),
    ],
    staff: [],
  },
  {
    id: "uzpromstroybank",
    name: "Uzpromstroybank",
    type: "bank",
    description: "Qurilish kreditlari, ipoteka, biznes kreditlash.",
    rating: 4.1,
    totalServed: 87000,
    branches: [
      makeBranch("upsb-main", "uzpromstroybank", "Bosh ofis filiali", "Amir Temur 4", 41.3020, 69.2750, 44, 12, 10, true, bankServices),
    ],
    staff: [],
  },
  // Clinics
  {
    id: "toshkent-tibbiyot",
    name: "1-son Shahar Klinik Kasalxonasi",
    type: "clinic",
    description: "Terapevt, kardiolog, nevropatolog, laboratoriya tahlillari.",
    rating: 4.0,
    totalServed: 445000,
    branches: [
      makeBranch("ttk-main", "toshkent-tibbiyot", "Asosiy bino", "Farg'ona yo'li 1", 41.3100, 69.2600, 95, 67, 48, true, clinicServices),
      makeBranch("ttk-filial", "toshkent-tibbiyot", "Qabul bo'limi", "Farg'ona yo'li 3", 41.3105, 69.2610, 71, 28, 22, true, clinicServices),
    ],
    staff: [],
  },
  {
    id: "poliklinika-12",
    name: "12-son Shahar Poliklinikasi",
    type: "clinic",
    description: "Oilaviy shifokor, bolalar shifokori, stomatolog.",
    rating: 4.3,
    totalServed: 167000,
    branches: [
      makeBranch("p12-main", "poliklinika-12", "Asosiy bino", "Chilonzor 89", 41.2900, 69.2300, 53, 16, 14, true, clinicServices),
    ],
    staff: [],
  },
]

/** All branches across all citizen organizations, flattened */
export const allCitizenBranches: Branch[] = citizenOrganizations.flatMap(
  (org) => org.branches
)

export const servicesByOrgType = {
  government: ["Pasport almashish", "Ro'yxatga olish", "Guvohnoma olish", "Ma'lumotnoma", "INN olish"],
  bank: ["Hisob ochish", "Kredit ariza", "Karta olish", "Pul o'tkazish", "Konsultatsiya"],
  clinic: ["Terapevt", "Kardiolog", "Nevropatolog", "Stomatolog", "Laboratoriya", "Ultratovush"],
  other: [],
}

/** Tashkent districts for the location picker */
export const tashkentDistricts = [
  { id: "chilonzor", name: "Chilonzor tumani", lat: 41.2880, lng: 69.2200 },
  { id: "yunusobod", name: "Yunusobod tumani", lat: 41.3560, lng: 69.2900 },
  { id: "mirzo-ulugbek", name: "Mirzo Ulug'bek tumani", lat: 41.3300, lng: 69.3200 },
  { id: "shayxontohur", name: "Shayxontohur tumani", lat: 41.3150, lng: 69.2550 },
  { id: "sergeli", name: "Sergeli tumani", lat: 41.2350, lng: 69.2000 },
  { id: "mirobod", name: "Mirobod tumani", lat: 41.3050, lng: 69.2800 },
  { id: "uchtepa", name: "Uchtepa tumani", lat: 41.3050, lng: 69.2100 },
  { id: "olmazor", name: "Olmazor tumani", lat: 41.3300, lng: 69.2200 },
  { id: "bektemir", name: "Bektemir tumani", lat: 41.2650, lng: 69.3100 },
  { id: "yakkasaroy", name: "Yakkasaroy tumani", lat: 41.2950, lng: 69.2700 },
]

/** Rating breakdown generator */
export function generateRatingBreakdown(rating: number): number[] {
  const five = Math.round(rating * 14)
  const four = Math.round((5 - rating) * 8 + 10)
  const three = Math.round((5 - rating) * 6 + 5)
  const two = Math.max(2, Math.round((5 - rating) * 3))
  const one = Math.max(1, Math.round((5 - rating) * 2))
  const total = five + four + three + two + one
  return [five, four, three, two, one].map((v) => Math.round((v / total) * 100))
}
