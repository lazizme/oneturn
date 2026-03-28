"use client"

import { use, useMemo, useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { MapPin, Clock, Users, Star, ArrowRight, Navigation } from "lucide-react"
import { citizenOrganizations, generateRatingBreakdown } from "@workspace/mock-data"
import { Navbar } from "@/components/layout/navbar"
import { useLocation } from "@/context/location-context"
import {
  getCategoryColor,
  getCategoryBg,
  getCategoryLabel,
  getCategoryIcon,
  getBusyInfo,
  getDistanceKm,
} from "@/lib/utils"

const OrgMap = dynamic(() => import("./org-map"), { ssr: false })

interface PageProps {
  params: Promise<{ orgId: string }>
}

function formatServed(n: number): string {
  if (n >= 1000) {
    const thousands = Math.floor(n / 1000)
    return `${thousands.toLocaleString("uz-UZ")} 000+`
  }
  return n.toLocaleString("uz-UZ")
}

export default function OrgDetailPage({ params }: PageProps) {
  const { orgId } = use(params)
  const { location } = useLocation()
  const [sortBy, setSortBy] = useState<"distance" | "wait">("distance")

  const org = citizenOrganizations.find((o) => o.id === orgId)

  const uniqueServices = useMemo(() => {
    if (!org) return []
    const names = new Set<string>()
    for (const branch of org.branches) {
      for (const service of branch.services) {
        names.add(service.name)
      }
    }
    return Array.from(names)
  }, [org])

  const sortedBranches = useMemo(() => {
    if (!org) return []
    const branches = [...org.branches]
    if (sortBy === "distance") {
      branches.sort(
        (a, b) =>
          getDistanceKm(location.lat, location.lng, a.lat, a.lng) -
          getDistanceKm(location.lat, location.lng, b.lat, b.lng)
      )
    } else {
      branches.sort((a, b) => a.avgWaitMinutes - b.avgWaitMinutes)
    }
    return branches
  }, [org, sortBy, location])

  const ratingBreakdown = useMemo(() => {
    if (!org?.rating) return [0, 0, 0, 0, 0]
    return generateRatingBreakdown(org.rating)
  }, [org])

  // Find the least busy branch for rerouting hints
  const leastBusyBranch = useMemo(() => {
    if (!org) return null
    return [...org.branches].sort((a, b) => a.busyIndex - b.busyIndex)[0] ?? null
  }, [org])

  if (!org) {
    return (
      <div>
        <Navbar />
        <div className="flex min-h-[60vh] flex-col items-center justify-center px-6">
          <div
            className="mb-4 flex size-20 items-center justify-center rounded-full text-3xl"
            style={{ backgroundColor: "var(--c-surface)" }}
          >
            🔍
          </div>
          <h1 className="mb-2 text-2xl font-bold" style={{ color: "var(--c-text)" }}>
            Tashkilot topilmadi
          </h1>
          <p className="mb-6 text-sm" style={{ color: "var(--c-muted)" }}>
            Bunday tashkilot mavjud emas yoki o&apos;chirilgan
          </p>
          <Link
            href="/"
            className="rounded-xl px-6 py-2.5 text-sm font-medium text-white"
            style={{ backgroundColor: "var(--c-primary)" }}
          >
            Bosh sahifaga qaytish
          </Link>
        </div>
      </div>
    )
  }

  const catColor = getCategoryColor(org.type)
  const catBg = getCategoryBg(org.type)

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 rounded-2xl p-8"
          style={{ backgroundColor: catBg }}
        >
          <div className="flex items-start gap-5">
            <div
              className="flex size-16 shrink-0 items-center justify-center rounded-full text-2xl font-bold text-white"
              style={{ backgroundColor: catColor }}
            >
              {org.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h1 className="mb-2 text-3xl font-bold" style={{ color: "var(--c-text)" }}>
                {org.name}
              </h1>
              <div className="mb-3 flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold"
                  style={{ backgroundColor: catColor, color: "#fff" }}
                >
                  {getCategoryIcon(org.type)} {getCategoryLabel(org.type)}
                </span>
              </div>
              {org.description && (
                <p className="mb-4 text-sm leading-relaxed" style={{ color: "var(--c-muted)" }}>
                  {org.description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: "var(--c-text)" }}>
                {org.rating && (
                  <span className="flex items-center gap-1 font-medium">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    {org.rating.toFixed(1)}
                  </span>
                )}
                {org.totalServed && (
                  <span style={{ color: "var(--c-muted)" }}>
                    {formatServed(org.totalServed)} xizmat ko&apos;rsatilgan
                  </span>
                )}
                <span style={{ color: "var(--c-muted)" }}>
                  {org.branches.length} ta filial
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Services Section */}
        {uniqueServices.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="mb-4 text-xl font-bold" style={{ color: "var(--c-text)" }}>
              Mavjud xizmatlar
            </h2>
            <div className="flex flex-wrap gap-2">
              {uniqueServices.map((name) => (
                <span
                  key={name}
                  className="rounded-full border px-3 py-1.5 text-xs font-semibold"
                  style={{
                    borderColor: catColor,
                    backgroundColor: catBg,
                    color: catColor,
                  }}
                >
                  {name}
                </span>
              ))}
            </div>
          </motion.section>
        )}

        {/* Branches Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold" style={{ color: "var(--c-text)" }}>
              Filiallar &middot; {org.branches.length} ta
            </h2>
            <div
              className="flex overflow-hidden rounded-lg border text-xs font-medium"
              style={{ borderColor: "var(--c-border)" }}
            >
              <button
                onClick={() => setSortBy("distance")}
                className="px-3 py-1.5 transition-colors"
                style={{
                  backgroundColor: sortBy === "distance" ? "var(--c-primary)" : "transparent",
                  color: sortBy === "distance" ? "#fff" : "var(--c-muted)",
                }}
              >
                Yaqinligi
              </button>
              <button
                onClick={() => setSortBy("wait")}
                className="px-3 py-1.5 transition-colors"
                style={{
                  backgroundColor: sortBy === "wait" ? "var(--c-primary)" : "transparent",
                  color: sortBy === "wait" ? "#fff" : "var(--c-muted)",
                }}
              >
                Kutish vaqti
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {sortedBranches.map((branch, i) => {
              const busy = getBusyInfo(branch.busyIndex)
              const dist = getDistanceKm(location.lat, location.lng, branch.lat, branch.lng)
              const branchServices = branch.services.map((s) => s.name)
              const showServices = branchServices.slice(0, 3)
              const extraCount = branchServices.length - 3

              // Smart rerouting hint
              const showReroute =
                branch.busyIndex > 70 &&
                leastBusyBranch &&
                leastBusyBranch.id !== branch.id &&
                branch.avgWaitMinutes - leastBusyBranch.avgWaitMinutes > 15

              return (
                <motion.div
                  key={branch.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.05 * i }}
                  className="relative rounded-2xl border p-5"
                  style={{ borderColor: "var(--c-border)", backgroundColor: "var(--c-bg)" }}
                >
                  {/* Busy badge */}
                  <div className="absolute right-5 top-5 flex items-center gap-1.5">
                    <span
                      className="inline-block size-2 rounded-full"
                      style={{ backgroundColor: busy.dotColor }}
                    />
                    <span className="text-xs font-semibold" style={{ color: busy.dotColor }}>
                      {busy.label}
                    </span>
                  </div>

                  {/* Branch info */}
                  <h3 className="mb-1 text-lg font-semibold" style={{ color: "var(--c-text)" }}>
                    {branch.name}
                  </h3>
                  <div className="mb-3 flex flex-wrap items-center gap-3 text-xs" style={{ color: "var(--c-muted)" }}>
                    <span className="flex items-center gap-1">
                      <MapPin className="size-3.5" />
                      {branch.address} &middot; {dist.toFixed(1)} km
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3.5" />
                      ~{branch.avgWaitMinutes} daq
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="size-3.5" />
                      {branch.currentQueue} navbatda
                    </span>
                    <span>
                      {branch.workingHours.open}–{branch.workingHours.close}
                    </span>
                  </div>

                  {/* Services preview */}
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {showServices.map((name) => (
                      <span
                        key={name}
                        className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                        style={{ backgroundColor: "var(--c-surface)", color: "var(--c-muted)" }}
                      >
                        {name}
                      </span>
                    ))}
                    {extraCount > 0 && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[11px] font-medium"
                        style={{ backgroundColor: "var(--c-surface)", color: "var(--c-muted)" }}
                      >
                        (+{extraCount})
                      </span>
                    )}
                  </div>

                  {/* Smart rerouting hint */}
                  {showReroute && leastBusyBranch && (
                    <div
                      className="mb-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs"
                      style={{ backgroundColor: "#EFF6FF", color: "var(--c-primary)" }}
                    >
                      <span>💡</span>
                      <span className="font-medium">
                        {leastBusyBranch.name} bo&apos;shroq —{" "}
                        {branch.avgWaitMinutes - leastBusyBranch.avgWaitMinutes} daqiqa tejaysiz
                      </span>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="flex items-center gap-3">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${branch.lat},${branch.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50"
                      style={{ borderColor: "var(--c-border)", color: "var(--c-text)" }}
                    >
                      <Navigation className="size-3.5" />
                      Yo&apos;l ko&apos;rsatish
                    </a>
                    <Link
                      href={`/org/${orgId}/${branch.id}`}
                      className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors"
                      style={{ backgroundColor: "var(--c-primary)" }}
                    >
                      Navbat olish
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.section>

        {/* Mini Map */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="mb-4 text-xl font-bold" style={{ color: "var(--c-text)" }}>
            Xaritada
          </h2>
          <div className="overflow-hidden rounded-xl" style={{ height: 250 }}>
            <OrgMap branches={org.branches} />
          </div>
        </motion.section>

        {/* Rating Breakdown */}
        {org.rating && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="mb-8"
          >
            <h2 className="mb-4 text-xl font-bold" style={{ color: "var(--c-text)" }}>
              Baholar
            </h2>
            <div className="rounded-2xl border p-6" style={{ borderColor: "var(--c-border)" }}>
              <div className="flex items-start gap-6">
                <div className="text-center">
                  <div className="text-5xl font-bold" style={{ color: "var(--c-text)" }}>
                    {org.rating.toFixed(1)}
                  </div>
                  <div className="mt-1 flex items-center justify-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="size-4"
                        style={{
                          color: star <= Math.round(org.rating!) ? "#F59E0B" : "#E2E8F0",
                          fill: star <= Math.round(org.rating!) ? "#F59E0B" : "transparent",
                        }}
                      />
                    ))}
                  </div>
                  <div className="mt-1 text-xs" style={{ color: "var(--c-muted)" }}>
                    {formatServed(org.totalServed ?? 0)}
                  </div>
                </div>
                <div className="flex flex-1 flex-col gap-2">
                  {[5, 4, 3, 2, 1].map((star, idx) => (
                    <div key={star} className="flex items-center gap-2">
                      <span className="w-3 text-xs font-medium" style={{ color: "var(--c-muted)" }}>
                        {star}
                      </span>
                      <div
                        className="h-2.5 flex-1 overflow-hidden rounded-full"
                        style={{ backgroundColor: "var(--c-surface)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${ratingBreakdown[idx]}%`,
                            backgroundColor: "var(--c-primary)",
                          }}
                        />
                      </div>
                      <span className="w-8 text-right text-xs" style={{ color: "var(--c-muted)" }}>
                        {ratingBreakdown[idx]}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </main>
    </div>
  )
}
