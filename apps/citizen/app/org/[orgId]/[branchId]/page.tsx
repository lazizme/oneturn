"use client"

import { use, useMemo } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { motion } from "framer-motion"
import { ArrowLeft, MapPin, Clock, CheckCircle, XCircle } from "lucide-react"
import { citizenOrganizations, mockPeakHours } from "@workspace/mock-data"
import { Navbar } from "@/components/layout/navbar"
import { useLocation } from "@/context/location-context"
import { getBusyInfo, getDistanceKm } from "@/lib/utils"

const BranchMap = dynamic(() => import("./branch-map"), { ssr: false })

interface PageProps {
  params: Promise<{ orgId: string; branchId: string }>
}

export default function BranchDetailPage({ params }: PageProps) {
  const { orgId, branchId } = use(params)
  const { location } = useLocation()

  const org = citizenOrganizations.find((o) => o.id === orgId)
  const branch = org?.branches.find((b) => b.id === branchId)

  const otherBranches = useMemo(() => {
    if (!org || !branch) return []
    return org.branches.filter((b) => b.id !== branchId)
  }, [org, branch, branchId])

  const busy = branch ? getBusyInfo(branch.busyIndex) : null
  const dist = branch
    ? getDistanceKm(location.lat, location.lng, branch.lat, branch.lng)
    : 0

  // Peak hours for today
  const todayPeakHours = useMemo(() => {
    // JavaScript: 0=Sunday, 1=Monday ... 6=Saturday
    // mockPeakHours: 0=Monday ... 6=Sunday
    const jsDay = new Date().getDay()
    const peakDay = jsDay === 0 ? 6 : jsDay - 1
    return mockPeakHours.filter((h) => h.day === peakDay && h.hour >= 8 && h.hour <= 18)
  }, [])

  const maxBookings = useMemo(() => {
    return Math.max(...todayPeakHours.map((h) => h.bookings), 1)
  }, [todayPeakHours])

  const currentHour = new Date().getHours()

  if (!org || !branch) {
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
            Filial topilmadi
          </h1>
          <p className="mb-6 text-sm" style={{ color: "var(--c-muted)" }}>
            Bunday filial mavjud emas yoki o&apos;chirilgan
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

  return (
    <div>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <Link
            href={`/org/${orgId}`}
            className="mb-3 inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-80"
            style={{ color: "var(--c-primary)" }}
          >
            <ArrowLeft className="size-4" />
            {org.name}
          </Link>

          <div className="flex items-start justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                {branch.isOpen ? (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{ backgroundColor: "var(--c-accent-light)", color: "var(--c-accent)" }}
                  >
                    <CheckCircle className="size-3" />
                    Ochiq
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{ backgroundColor: "#FEF2F2", color: "var(--c-danger)" }}
                  >
                    <XCircle className="size-3" />
                    Yopiq
                  </span>
                )}
              </div>
              <h1 className="mb-1 text-2xl font-bold" style={{ color: "var(--c-text)" }}>
                {branch.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm" style={{ color: "var(--c-muted)" }}>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" />
                  {branch.address} &middot; {dist.toFixed(1)} km
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" />
                  Dushanba–Shanba {branch.workingHours.open}–{branch.workingHours.close}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Live Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-8 rounded-2xl border-2 p-6"
          style={{ borderColor: busy!.dotColor }}
        >
          <div className="mb-4 flex items-center justify-between">
            <span
              className="text-xs font-bold uppercase tracking-wider"
              style={{ color: "var(--c-muted)" }}
            >
              HOZIRGI HOLAT
            </span>
            <div className="flex items-center gap-1.5">
              <span
                className="inline-block size-2.5 rounded-full"
                style={{ backgroundColor: busy!.dotColor }}
              />
              <span className="text-sm font-semibold" style={{ color: busy!.dotColor }}>
                {busy!.label}
              </span>
            </div>
          </div>

          <div className="mb-4 grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: "var(--c-text)" }}>
                {branch.currentQueue}
              </div>
              <div className="mt-0.5 text-xs" style={{ color: "var(--c-muted)" }}>
                navbatda
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: "var(--c-text)" }}>
                ~{branch.avgWaitMinutes}
              </div>
              <div className="mt-0.5 text-xs" style={{ color: "var(--c-muted)" }}>
                daqiqa kutish
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold" style={{ color: "var(--c-text)" }}>
                {branch.busyIndex}%
              </div>
              <div className="mt-0.5 text-xs" style={{ color: "var(--c-muted)" }}>
                bandlik
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div
            className="mb-3 h-3 w-full overflow-hidden rounded-full"
            style={{ backgroundColor: "var(--c-surface)" }}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${branch.busyIndex}%` }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="h-full rounded-full"
              style={{ backgroundColor: busy!.dotColor }}
            />
          </div>

          <p className="text-xs" style={{ color: "var(--c-muted)" }}>
            So&apos;nggi yangilanish: 2 daqiqa oldin
          </p>
        </motion.div>

        {/* Services List */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="mb-4 text-xl font-bold" style={{ color: "var(--c-text)" }}>
            Xizmatlar
          </h2>
          <div
            className="overflow-hidden rounded-2xl border"
            style={{ borderColor: "var(--c-border)" }}
          >
            {branch.services.map((service, idx) => (
              <div
                key={service.id}
                className="flex items-center justify-between px-5 py-4"
                style={{
                  borderTop: idx > 0 ? "1px solid var(--c-border)" : "none",
                }}
              >
                <div>
                  <div className="text-sm font-semibold" style={{ color: "var(--c-text)" }}>
                    {service.name}
                  </div>
                  <div className="mt-0.5 text-xs" style={{ color: "var(--c-muted)" }}>
                    ~{service.estimatedDurationMin} daq
                  </div>
                </div>
                <a
                  href="#"
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-white transition-colors"
                  style={{ backgroundColor: "var(--c-primary)" }}
                >
                  Navbat olish
                </a>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Peak Hours Chart */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="mb-4 text-xl font-bold" style={{ color: "var(--c-text)" }}>
            Bugungi band vaqtlar
          </h2>
          <div
            className="rounded-2xl border p-6"
            style={{ borderColor: "var(--c-border)" }}
          >
            <div className="flex items-end gap-1.5" style={{ height: 120 }}>
              {todayPeakHours.map((cell) => {
                const pct = (cell.bookings / maxBookings) * 100
                let barColor = "#10B981" // green
                if (cell.bookings >= 40 && cell.bookings <= 70) barColor = "#F59E0B" // amber
                if (cell.bookings > 70) barColor = "#EF4444" // red
                // For proportional coloring based on normalized value
                const normalized = (cell.bookings / maxBookings) * 100
                if (normalized > 70) barColor = "#EF4444"
                else if (normalized >= 40) barColor = "#F59E0B"
                else barColor = "#10B981"

                const isCurrent = cell.hour === currentHour

                return (
                  <div key={cell.hour} className="flex flex-1 flex-col items-center gap-1">
                    <div className="relative w-full" style={{ height: 90 }}>
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${pct}%` }}
                        transition={{ duration: 0.5, delay: 0.05 * (cell.hour - 8) }}
                        className="absolute bottom-0 w-full rounded-t"
                        style={{
                          backgroundColor: barColor,
                          opacity: isCurrent ? 1 : 0.7,
                        }}
                      />
                      {isCurrent && (
                        <div
                          className="absolute -top-2 left-1/2 size-2 -translate-x-1/2 rounded-full"
                          style={{ backgroundColor: "var(--c-primary)" }}
                        />
                      )}
                    </div>
                    <span
                      className="text-[10px]"
                      style={{
                        color: isCurrent ? "var(--c-primary)" : "var(--c-muted)",
                        fontWeight: isCurrent ? 700 : 400,
                      }}
                    >
                      {cell.hour}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.section>

        {/* Map */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="mb-8"
        >
          <h2 className="mb-4 text-xl font-bold" style={{ color: "var(--c-text)" }}>
            Xaritada
          </h2>
          <div className="overflow-hidden rounded-xl" style={{ height: 200 }}>
            <BranchMap branch={branch} otherBranches={otherBranches} />
          </div>
        </motion.section>
      </main>
    </div>
  )
}
