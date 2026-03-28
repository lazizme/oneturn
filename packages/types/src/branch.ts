export interface Service {
  id: string
  branchId: string
  name: string
  estimatedDurationMin: number
  maxSlotsPerHour: number
  isAvailable: boolean
}

export interface WorkingHours {
  open: string
  close: string
}

export interface Branch {
  id: string
  orgId: string
  name: string
  address: string
  lat: number
  lng: number
  workingHours: WorkingHours
  services: Service[]
  busyIndex: number
  currentQueue: number
  avgWaitMinutes: number
  isOpen: boolean
}
