import type { Branch } from "./branch"

export type OrgType = "bank" | "clinic" | "government" | "other"

export type StaffRole = "operator" | "manager" | "admin"

export interface StaffMember {
  id: string
  orgId: string
  branchId: string
  name: string
  role: StaffRole
  email: string
}

export interface Organization {
  id: string
  name: string
  nameRu?: string
  type: OrgType
  description?: string
  logoUrl?: string
  embedColor?: string
  rating?: number
  totalServed?: number
  branches: Branch[]
  staff: StaffMember[]
}
