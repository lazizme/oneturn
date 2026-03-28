import type { Service } from "@workspace/types"

export function createBranchServices(branchId: string): Service[] {
  return [
    {
      id: `${branchId}-hisob`,
      branchId,
      name: "Hisob ochish",
      estimatedDurationMin: 20,
      maxSlotsPerHour: 3,
      isAvailable: true,
    },
    {
      id: `${branchId}-kredit`,
      branchId,
      name: "Kredit rasmiylashtirish",
      estimatedDurationMin: 30,
      maxSlotsPerHour: 2,
      isAvailable: true,
    },
    {
      id: `${branchId}-karta`,
      branchId,
      name: "Karta olish",
      estimatedDurationMin: 15,
      maxSlotsPerHour: 4,
      isAvailable: true,
    },
    {
      id: `${branchId}-transfer`,
      branchId,
      name: "Pul o'tkazish",
      estimatedDurationMin: 10,
      maxSlotsPerHour: 6,
      isAvailable: true,
    },
    {
      id: `${branchId}-konsultatsiya`,
      branchId,
      name: "Konsultatsiya",
      estimatedDurationMin: 15,
      maxSlotsPerHour: 4,
      isAvailable: true,
    },
  ]
}
