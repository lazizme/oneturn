"use client"

import { useState, useMemo, useCallback } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import {
  Star,
  Clock,
  List,
  Map,
  ChevronDown,
  SlidersHorizontal,
  ArrowRight,
  X,
} from "lucide-react"
import { Navbar } from "@/components/layout/navbar"
import { useLocation } from "@/context/location-context"
import { citizenOrganizations, allCitizenBranches } from "@workspace/mock-data"
import type { OrgType } from "@workspace/types"
import {
  getCategoryColor,
  getCategoryBg,
  getCategoryLabel,
  getCategoryIcon,
  getBusyInfo,
  getDistanceKm,
} from "@/lib/utils"

const LeafletMap = dynamic(() => import("./leaflet-map"), { ssr: false })

type SortOption = "distance" | "wait" | "rating" | "name"
type StatusFilter = "all" | "open" | "free"
type WaitFilter = "all" | "10" | "30" | "60"
type ViewMode = "list" | "map"

const sortLabels: Record<SortOption, string> = {
  distance: "Yaqinligi",
  wait: "Kutish vaqti",
  rating: "Reyting",
  name: "Nomi",
}

const orgTypes: OrgType[] = ["government", "bank", "clinic", "other"]

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
  return n.toString()
}

export default function ExplorePage() {
  const searchParams = useSearchParams()
  const isDemo = searchParams.get("demo") === "true"
  const typeParam = searchParams.get("type") as OrgType | null
  const viewParam = searchParams.get("view") as ViewMode | null
  const { location } = useLocation()

  // Filter state
  const [categoryFilters, setCategoryFilters] = useState<Record<OrgType, boolean>>(() => {
    if (typeParam && orgTypes.includes(typeParam)) {
      const init: Record<OrgType, boolean> = { government: false, bank: false, clinic: false, other: false }
      init[typeParam] = true
      return init
    }
    return { government: true, bank: true, clinic: true, other: true }
  })
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [waitFilter, setWaitFilter] = useState<WaitFilter>("all")
  const [sortBy, setSortBy] = useState<SortOption>("distance")
  const [viewMode, setViewMode] = useState<ViewMode>(viewParam === "map" ? "map" : "list")
  const [showSortDropdown, setShowSortDropdown] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Toggle category
  const toggleCategory = useCallback((type: OrgType) => {
    setCategoryFilters((prev) => ({ ...prev, [type]: !prev[type] }))
  }, [])

  // Reset filters
  const resetFilters = useCallback(() => {
    setCategoryFilters({ government: true, bank: true, clinic: true, other: true })
    setStatusFilter("all")
    setWaitFilter("all")
    setSortBy("distance")
  }, [])

  // Active category list
  const activeCategories = useMemo(() => {
    return orgTypes.filter((t) => categoryFilters[t])
  }, [categoryFilters])

  // Filtered and sorted organizations
  const filteredOrgs = useMemo(() => {
    let orgs = citizenOrganizations.filter((o) => activeCategories.includes(o.type))

    // Apply status filter at org level (has at least one matching branch)
    if (statusFilter === "open") {
      orgs = orgs.filter((o) => o.branches.some((b) => b.isOpen))
    } else if (statusFilter === "free") {
      orgs = orgs.filter((o) => o.branches.some((b) => b.isOpen && b.busyIndex < 40))
    }

    // Apply wait filter
    if (waitFilter !== "all") {
      const maxWait = parseInt(waitFilter)
      orgs = orgs.filter((o) =>
        o.branches.some((b) => b.avgWaitMinutes <= maxWait)
      )
    }

    // Sort
    const sorted = [...orgs]
    switch (sortBy) {
      case "distance":
        sorted.sort((a, b) => {
          const aDist = Math.min(...a.branches.map((br) => getDistanceKm(location.lat, location.lng, br.lat, br.lng)))
          const bDist = Math.min(...b.branches.map((br) => getDistanceKm(location.lat, location.lng, br.lat, br.lng)))
          return aDist - bDist
        })
        break
      case "wait":
        sorted.sort((a, b) => {
          const aWait = Math.min(...a.branches.map((br) => br.avgWaitMinutes))
          const bWait = Math.min(...b.branches.map((br) => br.avgWaitMinutes))
          return aWait - bWait
        })
        break
      case "rating":
        sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        break
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name, "uz"))
        break
    }
    return sorted
  }, [activeCategories, statusFilter, waitFilter, sortBy, location])

  // Filtered branches for map view
  const filteredBranches = useMemo(() => {
    let branches = allCitizenBranches.filter((b) => {
      const org = citizenOrganizations.find((o) => o.id === b.orgId)
      if (!org) return false
      if (!activeCategories.includes(org.type)) return false
      return true
    })

    if (statusFilter === "open") {
      branches = branches.filter((b) => b.isOpen)
    } else if (statusFilter === "free") {
      branches = branches.filter((b) => b.isOpen && b.busyIndex < 40)
    }

    if (waitFilter !== "all") {
      const maxWait = parseInt(waitFilter)
      branches = branches.filter((b) => b.avgWaitMinutes <= maxWait)
    }

    return branches.sort((a, b) => {
      const aDist = getDistanceKm(location.lat, location.lng, a.lat, a.lng)
      const bDist = getDistanceKm(location.lat, location.lng, b.lat, b.lng)
      return aDist - bDist
    })
  }, [activeCategories, statusFilter, waitFilter, location])

  const resultCount = viewMode === "list" ? filteredOrgs.length : filteredBranches.length

  // Sidebar filter content (shared between desktop and mobile)
  const filterContent = (
    <div className="space-y-5">
      {/* Category checkboxes */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--c-muted)" }}>
          Kategoriya
        </p>
        <div className="space-y-2">
          {orgTypes.map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={categoryFilters[type]}
                onChange={() => toggleCategory(type)}
                className="size-4 rounded accent-(--c-primary)"
              />
              <span className="text-sm" style={{ color: "var(--c-text)" }}>
                {getCategoryIcon(type)} {getCategoryLabel(type)}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "var(--c-border)" }} />

      {/* Status radio */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--c-muted)" }}>
          Holat
        </p>
        <div className="space-y-2">
          {([
            { value: "all", label: "Barchasi" },
            { value: "open", label: "Faqat ochiq" },
            { value: "free", label: "Bo'sh (<40%)" },
          ] as const).map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={statusFilter === opt.value}
                onChange={() => setStatusFilter(opt.value)}
                className="size-4 accent-(--c-primary)"
              />
              <span className="text-sm" style={{ color: "var(--c-text)" }}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-t" style={{ borderColor: "var(--c-border)" }} />

      {/* Wait time radio */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: "var(--c-muted)" }}>
          Kutish vaqti
        </p>
        <div className="space-y-2">
          {([
            { value: "all", label: "Barchasi" },
            { value: "10", label: "10 daqiqagacha" },
            { value: "30", label: "30 daqiqagacha" },
            { value: "60", label: "1 soatgacha" },
          ] as const).map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="wait"
                checked={waitFilter === opt.value}
                onChange={() => setWaitFilter(opt.value)}
                className="size-4 accent-(--c-primary)"
              />
              <span className="text-sm" style={{ color: "var(--c-text)" }}>
                {opt.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--c-bg)" }}>
      <Navbar isDemo={isDemo} />

      <div className="flex">
        {/* Desktop sidebar */}
        <aside
          className="sticky top-[105px] hidden h-[calc(100vh-105px)] shrink-0 overflow-y-auto border-r p-5 lg:block"
          style={{ width: "240px", borderColor: "var(--c-border)", backgroundColor: "var(--c-surface)" }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold" style={{ color: "var(--c-text)" }}>
              Filtrlar
            </p>
            <button
              onClick={resetFilters}
              className="text-xs font-medium"
              style={{ color: "var(--c-primary)" }}
            >
              Tozalash
            </button>
          </div>
          {filterContent}
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {/* Top bar */}
          <div
            className="sticky top-[105px] z-10 flex items-center justify-between border-b px-5 py-3"
            style={{ borderColor: "var(--c-border)", backgroundColor: "var(--c-bg)" }}
          >
            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium lg:hidden"
                style={{ borderColor: "var(--c-border)", color: "var(--c-text)" }}
              >
                <SlidersHorizontal className="size-3.5" />
                Filtrlar
              </button>
              <p className="text-sm" style={{ color: "var(--c-muted)" }}>
                <span className="font-semibold" style={{ color: "var(--c-text)" }}>
                  {resultCount}
                </span>{" "}
                {viewMode === "list" ? "tashkilot" : "filial"} · {location.name}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* View toggle */}
              <div className="flex rounded-lg border overflow-hidden" style={{ borderColor: "var(--c-border)" }}>
                <button
                  onClick={() => setViewMode("list")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: viewMode === "list" ? "var(--c-primary)" : "transparent",
                    color: viewMode === "list" ? "white" : "var(--c-muted)",
                  }}
                >
                  <List className="size-3.5" />
                  Ro&apos;yxat
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors"
                  style={{
                    backgroundColor: viewMode === "map" ? "var(--c-primary)" : "transparent",
                    color: viewMode === "map" ? "white" : "var(--c-muted)",
                  }}
                >
                  <Map className="size-3.5" />
                  Xarita
                </button>
              </div>

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium"
                  style={{ borderColor: "var(--c-border)", color: "var(--c-text)" }}
                >
                  {sortLabels[sortBy]}
                  <ChevronDown className="size-3" />
                </button>
                {showSortDropdown && (
                  <div
                    className="absolute right-0 top-full z-20 mt-1 w-40 rounded-xl border bg-white p-1 shadow-lg"
                    style={{ borderColor: "var(--c-border)" }}
                  >
                    {(Object.keys(sortLabels) as SortOption[]).map((key) => (
                      <button
                        key={key}
                        onClick={() => {
                          setSortBy(key)
                          setShowSortDropdown(false)
                        }}
                        className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-50"
                        style={{ color: sortBy === key ? "var(--c-primary)" : "var(--c-text)" }}
                      >
                        {sortLabels[key]}
                        {sortBy === key && <span className="text-xs">✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Content area */}
          {viewMode === "list" ? (
            <div className="p-5">
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredOrgs.map((org, index) => {
                  const bestBranch = [...org.branches].sort(
                    (a, b) => a.busyIndex - b.busyIndex
                  )[0]
                  const bestBusy = bestBranch ? getBusyInfo(bestBranch.busyIndex) : null

                  return (
                    <motion.div
                      key={org.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.3 }}
                    >
                      <Link href={`/org/${org.id}`} className="block">
                        <div
                          className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow p-5 h-full"
                          style={{ borderColor: "var(--c-border)" }}
                        >
                          {/* Header */}
                          <div className="flex items-start justify-between">
                            <div
                              className="flex size-11 items-center justify-center rounded-full text-white text-lg font-bold"
                              style={{ backgroundColor: getCategoryColor(org.type) }}
                            >
                              {org.name.charAt(0)}
                            </div>
                            <span
                              className="text-xs font-semibold px-2.5 py-1 rounded-full"
                              style={{
                                backgroundColor: getCategoryBg(org.type),
                                color: getCategoryColor(org.type),
                              }}
                            >
                              {getCategoryLabel(org.type)}
                            </span>
                          </div>

                          {/* Name + description */}
                          <p className="mt-3 text-base font-bold leading-tight" style={{ color: "var(--c-text)" }}>
                            {org.name}
                          </p>
                          {org.description && (
                            <p className="mt-1 text-sm line-clamp-2 leading-relaxed" style={{ color: "var(--c-muted)" }}>
                              {org.description}
                            </p>
                          )}

                          {/* Stats row */}
                          <div className="mt-3 flex items-center gap-3 text-xs" style={{ color: "var(--c-muted)" }}>
                            {org.rating && (
                              <span className="flex items-center gap-1">
                                <Star className="size-3 fill-amber-400 text-amber-400" />
                                {org.rating.toFixed(1)}
                              </span>
                            )}
                            <span>{org.branches.length} filial</span>
                            {org.totalServed && (
                              <span>{formatNumber(org.totalServed)} xizmat</span>
                            )}
                          </div>

                          {/* Best branch */}
                          {bestBranch && bestBusy && (
                            <div
                              className="mt-3 rounded-xl p-3 text-xs"
                              style={{ backgroundColor: "var(--c-surface)" }}
                            >
                              <p className="text-xs font-medium mb-1" style={{ color: "var(--c-muted)" }}>
                                Eng tezkor filial:
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="font-semibold" style={{ color: "var(--c-text)" }}>
                                  {bestBranch.name}
                                </span>
                                <div className="flex items-center gap-2">
                                  <span style={{ color: "var(--c-muted)" }}>
                                    ~{bestBranch.avgWaitMinutes} daq
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <span
                                      className="inline-block size-2 rounded-full"
                                      style={{ backgroundColor: bestBusy.dotColor }}
                                    />
                                    <span style={{ color: bestBusy.color }}>
                                      {bestBusy.label}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  )
                })}
              </div>

              {filteredOrgs.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-base font-medium" style={{ color: "var(--c-muted)" }}>
                    Filtr bo&apos;yicha natija topilmadi
                  </p>
                  <button
                    onClick={resetFilters}
                    className="mt-3 text-sm font-semibold"
                    style={{ color: "var(--c-primary)" }}
                  >
                    Filtrlarni tozalash
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Map view */
            <div className="flex" style={{ height: "calc(100vh - 105px - 49px)" }}>
              {/* Branch sidebar */}
              <div
                className="hidden shrink-0 overflow-y-auto border-r md:block"
                style={{ width: "300px", borderColor: "var(--c-border)" }}
              >
                <div className="p-3 space-y-1">
                  {filteredBranches.map((branch) => {
                    const org = citizenOrganizations.find((o) => o.id === branch.orgId)
                    const busy = getBusyInfo(branch.busyIndex)
                    return (
                      <div
                        key={branch.id}
                        className="rounded-xl border p-3 transition-colors hover:bg-gray-50"
                        style={{ borderColor: "var(--c-border)" }}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <p className="text-sm font-bold leading-tight" style={{ color: "var(--c-text)" }}>
                            {branch.name}
                          </p>
                          <span className="flex items-center gap-1 text-xs shrink-0 ml-2">
                            <span
                              className="inline-block size-2 rounded-full"
                              style={{ backgroundColor: busy.dotColor }}
                            />
                            <span style={{ color: busy.color }}>{busy.label}</span>
                          </span>
                        </div>
                        <p className="text-xs" style={{ color: "var(--c-muted)" }}>
                          {org?.name}
                        </p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="flex items-center gap-1 text-xs" style={{ color: "var(--c-muted)" }}>
                            <Clock className="size-3" />
                            ~{branch.avgWaitMinutes} daq
                          </span>
                          <Link
                            href={`/org/${branch.orgId}/${branch.id}`}
                            className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-white"
                            style={{ backgroundColor: "var(--c-primary)" }}
                          >
                            Navbat <ArrowRight className="size-3" />
                          </Link>
                        </div>
                      </div>
                    )
                  })}

                  {filteredBranches.length === 0 && (
                    <div className="py-10 text-center">
                      <p className="text-sm" style={{ color: "var(--c-muted)" }}>
                        Natija topilmadi
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Map */}
              <div className="flex-1">
                <LeafletMap branches={filteredBranches} />
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Mobile filter drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setShowMobileFilters(false)}
          />
          <div
            className="absolute bottom-0 left-0 right-0 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold" style={{ color: "var(--c-text)" }}>
                Filtrlar
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={resetFilters}
                  className="text-xs font-medium"
                  style={{ color: "var(--c-primary)" }}
                >
                  Tozalash
                </button>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X className="size-5" style={{ color: "var(--c-muted)" }} />
                </button>
              </div>
            </div>
            {filterContent}
            <button
              onClick={() => setShowMobileFilters(false)}
              className="mt-5 w-full rounded-xl py-3 text-sm font-semibold text-white"
              style={{ backgroundColor: "var(--c-primary)" }}
            >
              Natijalarni ko&apos;rsatish ({resultCount})
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
