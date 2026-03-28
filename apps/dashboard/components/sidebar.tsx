"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Building2,
  BarChart3,
  ClipboardList,
  MapPin,
  Wrench,
  Users,
  LineChart,
  Settings,
  LogOut,
} from "lucide-react"
import { cn } from "@workspace/ui/lib/utils"

const navItems = [
  {
    label: "Umumiy ko'rinish",
    href: "/dashboard",
    icon: BarChart3,
  },
  {
    label: "Bronlar tarixi",
    href: "/dashboard/bookings",
    icon: ClipboardList,
  },
  {
    label: "Filiallar",
    href: "/dashboard/branches",
    icon: MapPin,
  },
  {
    label: "Xizmatlar",
    href: "/dashboard/services",
    icon: Wrench,
  },
  {
    label: "Xodimlar",
    href: "/dashboard/staff",
    icon: Users,
  },
  {
    label: "Analitika",
    href: "/dashboard/analytics",
    icon: LineChart,
  },
  {
    label: "Sozlamalar",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-60 flex-col border-r bg-white">
      {/* Logo */}
      <div className="flex items-center gap-2 border-b px-5 py-4">
        <div
          className="flex size-8 items-center justify-center rounded-lg text-white"
          style={{ backgroundColor: "var(--brand-primary)" }}
        >
          <Building2 className="size-4" />
        </div>
        <span className="text-lg font-bold text-gray-900">OneTurn</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 overflow-auto px-3 py-3">
        {navItems.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                isActive
                  ? "text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
              style={
                isActive
                  ? { backgroundColor: "var(--brand-primary)" }
                  : undefined
              }
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User section */}
      <div className="border-t px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-8 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-600">
            AN
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-900">Aziz N.</p>
            <p className="text-[10px] text-gray-400">Admin</p>
          </div>
          <Link
            href="/login"
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          >
            <LogOut className="size-4" />
          </Link>
        </div>
      </div>
    </aside>
  )
}
