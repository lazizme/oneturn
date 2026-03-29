"use client"

import { type ReactNode, useState, useMemo, useRef, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { HugeiconsIcon } from "@hugeicons/react"
import { StarIcon, UserGroupIcon, Clock01Icon, ArrowRight01Icon, ArrowRight02Icon, Building02Icon, BankIcon, Hospital01Icon, ClipboardIcon } from "@hugeicons/core-free-icons"
import { Navbar } from "@/components/layout/navbar"
import { useLocation } from "@/context/location-context"
import { useBooking } from "@/lib/booking"
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

type CategoryFilter = "all" | OrgType

const categoryPills: { value: CategoryFilter; label: ReactNode }[] = [
  { value: "all", label: "Barchasi" },
  { value: "government", label: <><HugeiconsIcon icon={Building02Icon} size={14} /> Davlat</> },
  { value: "bank", label: <><HugeiconsIcon icon={BankIcon} size={14} /> Banklar</> },
  { value: "clinic", label: <><HugeiconsIcon icon={Hospital01Icon} size={14} /> Klinikalar</> },
  { value: "other", label: <><HugeiconsIcon icon={ClipboardIcon} size={14} /> Boshqa</> },
]

const categoryTypes: OrgType[] = ["government", "bank", "clinic", "other"]

function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
  return n.toString()
}

function HomePageContent() {
  const searchParams = useSearchParams()
  const isDemo = searchParams.get("demo") === "true"
  const { location } = useLocation()
  const { openBooking } = useBooking()
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all")
  const nearYouRef = useRef<HTMLDivElement>(null)

  // Near you branches sorted by distance
  const nearBranches = useMemo(() => {
    return [...allCitizenBranches]
      .map((branch) => ({
        branch,
        distance: getDistanceKm(location.lat, location.lng, branch.lat, branch.lng),
        org: citizenOrganizations.find((o) => o.id === branch.orgId),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 8)
  }, [location])

  // Filtered organizations
  const filteredOrgs = useMemo(() => {
    if (activeCategory === "all") return citizenOrganizations
    return citizenOrganizations.filter((o) => o.type === activeCategory)
  }, [activeCategory])

  // Category stats
  const categoryStats = useMemo(() => {
    return categoryTypes.map((type) => {
      const orgs = citizenOrganizations.filter((o) => o.type === type)
      const branches = orgs.reduce((sum, o) => sum + o.branches.length, 0)
      return { type, orgCount: orgs.length, branchCount: branches }
    })
  }, [])

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--c-bg)" }}>
      <Navbar isDemo={isDemo} />

      {/* Hero */}
      <section
        className="bg-gradient-to-b from-[var(--c-primary-light)] to-white py-12 px-6"
      >
        <div className="mx-auto max-w-6xl">
          <h1
            className="text-4xl font-bold"
            style={{ color: "var(--c-text)" }}
          >
            Toshkent bo&apos;yicha xizmatlar
          </h1>
          <p
            className="mt-2 text-base"
            style={{ color: "var(--c-muted)" }}
          >
            Eng yaqin va bo&apos;sh filialni toping. Navbat oling.
          </p>

          {/* Category pills */}
          <div className="mt-6 flex flex-wrap gap-2">
            {categoryPills.map((pill) => (
              <button
                key={pill.value}
                onClick={() => setActiveCategory(pill.value)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  activeCategory === pill.value
                    ? "bg-[var(--c-primary)] text-white"
                    : "bg-white border border-[var(--c-border)] text-[var(--c-muted)] hover:shadow-sm"
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Near You */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-xl font-bold" style={{ color: "var(--c-text)" }}>
            Sizga yaqin{" "}
            <span className="font-normal" style={{ color: "var(--c-muted)" }}>
              · {location.name}
            </span>
          </h2>

          <div
            ref={nearYouRef}
            className="mt-4 flex gap-4 overflow-x-auto pb-4"
            style={{ scrollbarWidth: "thin" }}
          >
            {nearBranches.map(({ branch, distance, org }) => {
              const busy = getBusyInfo(branch.busyIndex)
              return (
                <Link
                  key={branch.id}
                  href={`/org/${branch.orgId}/${branch.id}`}
                  className="block shrink-0"
                  style={{ width: "260px" }}
                >
                  <div className="rounded-2xl border bg-white shadow-sm hover:shadow-md transition-shadow p-4 h-full flex flex-col" style={{ borderColor: "var(--c-border)" }}>
                    {/* Top row: org type + busy */}
                    <div className="flex items-start justify-between mb-3">
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: org ? getCategoryBg(org.type) : "var(--c-surface)",
                          color: org ? getCategoryColor(org.type) : "var(--c-muted)",
                        }}
                      >
                        {org ? getCategoryLabel(org.type) : ""}
                      </span>
                      <span className="flex items-center gap-1.5 text-xs font-medium">
                        <span
                          className="inline-block size-2 rounded-full"
                          style={{ backgroundColor: busy.dotColor }}
                        />
                        <span style={{ color: busy.color }}>{busy.label}</span>
                      </span>
                    </div>

                    {/* Org + branch name */}
                    <p className="text-sm font-bold leading-tight" style={{ color: "var(--c-text)" }}>
                      {org?.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--c-muted)" }}>
                      {branch.name}
                    </p>

                    {/* Stats */}
                    <div className="mt-3 flex items-center gap-3 text-xs" style={{ color: "var(--c-muted)" }}>
                      <span>{distance.toFixed(1)} km</span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <HugeiconsIcon icon={Clock01Icon} size={12} />
                        ~{branch.avgWaitMinutes} daq
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <HugeiconsIcon icon={UserGroupIcon} size={12} />
                        {branch.currentQueue}
                      </span>
                    </div>

                    {/* Button */}
                    <div className="mt-auto pt-3">
                      <button
                        className="inline-flex items-center gap-1 bg-[var(--c-primary)] text-white rounded-xl px-4 py-2 text-sm font-semibold"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          if (org) openBooking(org, branch)
                        }}
                      >
                        Navbat olish <HugeiconsIcon icon={ArrowRight02Icon} size={14} />
                      </button>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="px-6 py-10" style={{ backgroundColor: "var(--c-surface)" }}>
        <div className="mx-auto max-w-6xl">
          <h2 className="text-xl font-bold" style={{ color: "var(--c-text)" }}>
            Kategoriya bo&apos;yicha
          </h2>

          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categoryStats.map(({ type, orgCount, branchCount }) => (
              <Link key={type} href={`/explore?type=${type}`}>
                <div
                  className="rounded-2xl p-6 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5"
                  style={{ backgroundColor: getCategoryBg(type) }}
                >
                  <HugeiconsIcon icon={getCategoryIcon(type)} size={32} />
                  <p
                    className="mt-3 text-lg font-bold"
                    style={{ color: "var(--c-text)" }}
                  >
                    {getCategoryLabel(type)}
                  </p>
                  <p className="mt-1 text-sm" style={{ color: "var(--c-muted)" }}>
                    {orgCount} tashkilot · {branchCount} filial
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Organizations */}
      <section className="px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ color: "var(--c-text)" }}>
              Barcha tashkilotlar
            </h2>
            <Link
              href="/explore"
              className="flex items-center gap-1 text-sm font-medium"
              style={{ color: "var(--c-primary)" }}
            >
              Barchasini ko&apos;rish <HugeiconsIcon icon={ArrowRight01Icon} size={16} />
            </Link>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                      {/* Header: icon + type badge */}
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
                      <p
                        className="mt-3 text-base font-bold leading-tight"
                        style={{ color: "var(--c-text)" }}
                      >
                        {org.name}
                      </p>
                      {org.description && (
                        <p
                          className="mt-1 text-sm line-clamp-2 leading-relaxed"
                          style={{ color: "var(--c-muted)" }}
                        >
                          {org.description}
                        </p>
                      )}

                      {/* Stats row */}
                      <div
                        className="mt-3 flex items-center gap-3 text-xs"
                        style={{ color: "var(--c-muted)" }}
                      >
                        {org.rating && (
                          <span className="flex items-center gap-1">
                            <HugeiconsIcon icon={StarIcon} size={12} className="fill-amber-400 text-amber-400" />
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
                          <p
                            className="text-xs font-medium mb-1"
                            style={{ color: "var(--c-muted)" }}
                          >
                            Eng tezkor filial:
                          </p>
                          <div className="flex items-center justify-between">
                            <span
                              className="font-semibold"
                              style={{ color: "var(--c-text)" }}
                            >
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
        </div>
      </section>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense>
      <HomePageContent />
    </Suspense>
  )
}
