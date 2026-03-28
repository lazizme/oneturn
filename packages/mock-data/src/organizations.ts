import type { Branch, Organization, StaffMember } from "@workspace/types"
import { createBranchServices } from "./services"

const chilonzorServices = createBranchServices("branch-chilonzor")
const yunusobodServices = createBranchServices("branch-yunusobod")
const mirobodServices = createBranchServices("branch-mirobod")

export const mockBranches: Branch[] = [
  {
    id: "branch-chilonzor",
    orgId: "agrobank-demo",
    name: "Chilonzor filiali",
    address: "Chilonzor ko'chasi 45, Toshkent",
    lat: 41.2995,
    lng: 69.2401,
    workingHours: { open: "09:00", close: "18:00" },
    services: chilonzorServices,
    busyIndex: 78,
    currentQueue: 23,
    avgWaitMinutes: 18,
    isOpen: true,
  },
  {
    id: "branch-yunusobod",
    orgId: "agrobank-demo",
    name: "Yunusobod filiali",
    address: "Amir Temur shoh ko'chasi 108, Toshkent",
    lat: 41.3425,
    lng: 69.3044,
    workingHours: { open: "09:00", close: "18:00" },
    services: yunusobodServices,
    busyIndex: 42,
    currentQueue: 11,
    avgWaitMinutes: 9,
    isOpen: true,
  },
  {
    id: "branch-mirobod",
    orgId: "agrobank-demo",
    name: "Mirobod filiali",
    address: "Mirobod ko'chasi 12, Toshkent",
    lat: 41.3111,
    lng: 69.2833,
    workingHours: { open: "09:00", close: "18:00" },
    services: mirobodServices,
    busyIndex: 15,
    currentQueue: 4,
    avgWaitMinutes: 5,
    isOpen: true,
  },
]

export const mockStaff: StaffMember[] = [
  {
    id: "staff-1",
    orgId: "agrobank-demo",
    branchId: "branch-chilonzor",
    name: "Aziz Normatov",
    role: "admin",
    email: "aziz@agrobank.uz",
  },
  {
    id: "staff-2",
    orgId: "agrobank-demo",
    branchId: "branch-chilonzor",
    name: "Jasur Toshmatov",
    role: "operator",
    email: "jasur@agrobank.uz",
  },
  {
    id: "staff-3",
    orgId: "agrobank-demo",
    branchId: "branch-yunusobod",
    name: "Dilnoza Mirzayeva",
    role: "manager",
    email: "dilnoza@agrobank.uz",
  },
  {
    id: "staff-4",
    orgId: "agrobank-demo",
    branchId: "branch-yunusobod",
    name: "Sardor Karimov",
    role: "operator",
    email: "sardor@agrobank.uz",
  },
  {
    id: "staff-5",
    orgId: "agrobank-demo",
    branchId: "branch-mirobod",
    name: "Kamola Rahimova",
    role: "manager",
    email: "kamola@agrobank.uz",
  },
  {
    id: "staff-6",
    orgId: "agrobank-demo",
    branchId: "branch-mirobod",
    name: "Bobur Ismoilov",
    role: "operator",
    email: "bobur@agrobank.uz",
  },
]

export const mockOrg: Organization = {
  id: "agrobank-demo",
  name: "Agrobank",
  type: "bank",
  logoUrl: undefined,
  embedColor: "#2563EB",
  branches: mockBranches,
  staff: mockStaff,
}
