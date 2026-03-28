"use client"

import { useEffect, useMemo, useState } from "react"
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  Inbox,
} from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Badge } from "@workspace/ui/components/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import type { Booking, BookingStatus } from "@workspace/types"
import { mockBookings, mockBranches } from "@workspace/mock-data"
import { Topbar } from "@/components/topbar"
import { BookingDetailPanel } from "@/components/bookings/booking-detail-panel"
import { BookingsSkeleton } from "@/components/bookings/bookings-skeleton"
import {
  getServiceName,
  getBranchName,
  formatDate,
  maskPhone,
} from "@/lib/utils"
import { toast } from "sonner"

const PAGE_SIZE = 20

const STATUS_CONFIG: Record<
  BookingStatus,
  { label: string; bg: string; text: string }
> = {
  pending: { label: "Kutmoqda", bg: "bg-slate-100", text: "text-slate-600" },
  arrived: { label: "Keldi", bg: "bg-blue-100", text: "text-blue-700" },
  serving: { label: "Xizmatda", bg: "bg-blue-100", text: "text-blue-700" },
  completed: {
    label: "Yakunlandi",
    bg: "bg-emerald-100",
    text: "text-emerald-700",
  },
  no_show: { label: "No-show", bg: "bg-red-100", text: "text-red-700" },
  cancelled: { label: "Bekor", bg: "bg-amber-100", text: "text-amber-700" },
}

export default function BookingsPage() {
  const [loading, setLoading] = useState(true)
  const [branchFilter, setBranchFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [serviceFilter, setServiceFilter] = useState("all")
  const [phoneSearch, setPhoneSearch] = useState("")
  const [page, setPage] = useState(1)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600)
    return () => clearTimeout(t)
  }, [])

  const allServices = useMemo(() => {
    const set = new Map<string, string>()
    for (const branch of mockBranches) {
      for (const service of branch.services) {
        set.set(service.id, service.name)
      }
    }
    return Array.from(set.entries())
  }, [])

  const filtered = useMemo(() => {
    let result = [...mockBookings]

    if (branchFilter !== "all") {
      result = result.filter((b) => b.branchId === branchFilter)
    }
    if (statusFilter !== "all") {
      result = result.filter((b) => b.status === statusFilter)
    }
    if (serviceFilter !== "all") {
      result = result.filter((b) => b.serviceId === serviceFilter)
    }
    if (phoneSearch) {
      result = result.filter((b) =>
        b.userPhone.replace(/\s/g, "").includes(phoneSearch.replace(/\s/g, ""))
      )
    }

    return result.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [branchFilter, statusFilter, serviceFilter, phoneSearch])

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const activeFilters: { label: string; onClear: () => void }[] = []
  if (branchFilter !== "all") {
    activeFilters.push({
      label: getBranchName(branchFilter, mockBranches),
      onClear: () => setBranchFilter("all"),
    })
  }
  if (statusFilter !== "all") {
    activeFilters.push({
      label: STATUS_CONFIG[statusFilter as BookingStatus]?.label ?? statusFilter,
      onClear: () => setStatusFilter("all"),
    })
  }
  if (serviceFilter !== "all") {
    const svc = allServices.find(([id]) => id === serviceFilter)
    activeFilters.push({
      label: svc?.[1] ?? serviceFilter,
      onClear: () => setServiceFilter("all"),
    })
  }

  function clearAllFilters() {
    setBranchFilter("all")
    setStatusFilter("all")
    setServiceFilter("all")
    setPhoneSearch("")
    setPage(1)
  }

  function handleExport() {
    toast.info("Excel fayl tayyorlanmoqda...")
    setTimeout(() => toast.success("Yuklandi"), 1500)
  }

  if (loading) {
    return (
      <>
        <Topbar title="Bronlar tarixi" />
        <BookingsSkeleton />
      </>
    )
  }

  return (
    <>
      <Topbar title="Bronlar tarixi" subtitle={`${filtered.length} ta natija`} />

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center gap-3 border-b bg-white px-6 py-3">
          <Select value={branchFilter} onValueChange={(v) => { setBranchFilter(v); setPage(1) }}>
            <SelectTrigger className="h-9 w-40 rounded-xl text-xs">
              <SelectValue placeholder="Filial" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha filiallar</SelectItem>
              {mockBranches.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={serviceFilter} onValueChange={(v) => { setServiceFilter(v); setPage(1) }}>
            <SelectTrigger className="h-9 w-40 rounded-xl text-xs">
              <SelectValue placeholder="Xizmat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha xizmatlar</SelectItem>
              {allServices.map(([id, name]) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setPage(1) }}>
            <SelectTrigger className="h-9 w-36 rounded-xl text-xs">
              <SelectValue placeholder="Holat" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha holatlar</SelectItem>
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                <SelectItem key={key} value={key}>
                  {cfg.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative">
            <Search className="absolute top-2.5 left-3 size-3.5 text-gray-400" />
            <Input
              placeholder="Telefon raqam..."
              value={phoneSearch}
              onChange={(e) => { setPhoneSearch(e.target.value); setPage(1) }}
              className="h-9 w-44 rounded-xl pl-8 text-xs"
            />
          </div>

          <div className="ml-auto">
            <Button
              variant="outline"
              size="sm"
              className="h-9 gap-1.5 rounded-xl text-xs"
              onClick={handleExport}
            >
              <FileSpreadsheet className="size-3.5" />
              Excel
            </Button>
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilters.length > 0 && (
          <div className="flex items-center gap-2 bg-gray-50 px-6 py-2">
            {activeFilters.map((f) => (
              <Badge
                key={f.label}
                className="flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-700 shadow-sm"
              >
                {f.label}
                <button onClick={f.onClear} className="ml-0.5 rounded-full p-0.5 hover:bg-gray-100">
                  <X className="size-2.5" />
                </button>
              </Badge>
            ))}
            <button
              onClick={clearAllFilters}
              className="text-xs font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--brand-primary)" }}
            >
              Barchasini tozalash
            </button>
          </div>
        )}

        {/* Table */}
        <div className="flex-1 overflow-auto">
          {paginated.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Inbox className="mb-3 size-12 text-gray-300" />
              <p className="text-sm font-semibold text-gray-900">
                Natija topilmadi
              </p>
              <p className="mt-1 text-xs" style={{ color: "var(--brand-muted)" }}>
                Filtr shartlarini o&apos;zgartiring yoki tozalang.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-4 rounded-xl text-xs"
                onClick={clearAllFilters}
              >
                Filterni tozalash
              </Button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="sticky top-0 z-10 bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                    #
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                    Navbat
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                    Ism
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                    Telefon
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                    Filial
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                    Xizmat
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                    Turi
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                    Vaqt
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                    Davom.
                  </th>
                  <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--brand-muted)" }}>
                    Holat
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((booking, idx) => {
                  const status = STATUS_CONFIG[booking.status]
                  return (
                    <tr
                      key={booking.id}
                      className="cursor-pointer border-b border-gray-50 transition-colors duration-150 hover:bg-slate-50"
                      onClick={() => setSelectedBooking(booking)}
                    >
                      <td className="px-6 py-3 text-xs" style={{ color: "var(--brand-muted)" }}>
                        {(page - 1) * PAGE_SIZE + idx + 1}
                      </td>
                      <td className="px-3 py-3 font-mono text-xs font-bold text-gray-900">
                        {booking.ticketNumber}
                      </td>
                      <td className="px-3 py-3 text-sm font-medium text-gray-900">
                        {booking.userName}
                      </td>
                      <td className="px-3 py-3 font-mono text-xs" style={{ color: "var(--brand-muted)" }}>
                        {maskPhone(booking.userPhone)}
                      </td>
                      <td className="px-3 py-3 text-xs text-gray-700">
                        {getBranchName(booking.branchId, mockBranches).split(" ")[0]}
                      </td>
                      <td className="px-3 py-3 text-xs text-gray-700">
                        {getServiceName(booking.serviceId, mockBranches)}
                      </td>
                      <td className="px-3 py-3">
                        <Badge
                          className="rounded-full px-2 py-0.5 text-[10px] font-medium text-white"
                          style={{
                            backgroundColor:
                              booking.type === "live"
                                ? "var(--brand-accent)"
                                : "var(--brand-primary)",
                          }}
                        >
                          {booking.type === "live" ? "Jonli" : "Bron"}
                        </Badge>
                      </td>
                      <td className="px-3 py-3 text-xs text-gray-700">
                        {formatDate(booking.createdAt)}
                      </td>
                      <td className="px-3 py-3 text-xs" style={{ color: "var(--brand-muted)" }}>
                        {booking.actualDurationMin
                          ? `${booking.actualDurationMin} daq`
                          : "—"}
                      </td>
                      <td className="px-3 py-3">
                        <Badge
                          className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${status.bg} ${status.text}`}
                        >
                          {booking.status === "serving" && (
                            <span className="mr-1 inline-block size-1.5 animate-pulse rounded-full bg-blue-500" />
                          )}
                          {status.label}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="flex items-center justify-between border-t bg-white px-6 py-3">
            <span className="text-xs" style={{ color: "var(--brand-muted)" }}>
              Jami: {filtered.length} ta bron · Sahifada: {PAGE_SIZE} ta
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 rounded-xl text-xs"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft className="size-3" />
                Oldingi
              </Button>
              <span className="text-xs font-medium text-gray-700">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1 rounded-xl text-xs"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Keyingi
                <ChevronRight className="size-3" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Detail panel */}
      <BookingDetailPanel
        booking={selectedBooking}
        branches={mockBranches}
        onClose={() => setSelectedBooking(null)}
      />
    </>
  )
}
