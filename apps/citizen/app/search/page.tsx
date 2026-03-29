"use client"

import { useSearchParams } from "next/navigation"
import { useMemo, Suspense } from "react"
import Link from "next/link"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon, StarIcon, Building02Icon, ArrowRight02Icon } from "@hugeicons/core-free-icons"
import { motion } from "framer-motion"
import { citizenOrganizations } from "@workspace/mock-data"
import type { Organization, Branch } from "@workspace/types"
import { Navbar } from "@/components/layout/navbar"
import { useBooking } from "@/lib/booking"
import { getCategoryColor, getCategoryBg, getBusyInfo } from "@/lib/utils"

interface OrgMatch {
  org: Organization
  matchedName: string
}

interface ServiceMatch {
  org: Organization
  branch: Branch
  serviceName: string
}

function highlightMatch(text: string, query: string) {
  if (!query.trim()) return <>{text}</>
  const lower = text.toLowerCase()
  const qLower = query.toLowerCase()
  const idx = lower.indexOf(qLower)
  if (idx === -1) return <>{text}</>
  const before = text.slice(0, idx)
  const match = text.slice(idx, idx + query.length)
  const after = text.slice(idx + query.length)
  return (
    <>
      {before}
      <strong className="font-bold" style={{ color: "var(--c-primary)" }}>{match}</strong>
      {after}
    </>
  )
}

function SearchPageContent() {
  const searchParams = useSearchParams()
  const { openBooking } = useBooking()
  const q = searchParams.get("q") || ""

  const { orgResults, serviceResults } = useMemo(() => {
    if (!q.trim()) return { orgResults: [] as OrgMatch[], serviceResults: [] as ServiceMatch[] }
    const qLower = q.toLowerCase()

    const orgResults: OrgMatch[] = citizenOrganizations
      .filter(
        (org) =>
          org.name.toLowerCase().includes(qLower) ||
          org.description?.toLowerCase().includes(qLower)
      )
      .map((org) => ({ org, matchedName: org.name }))

    const serviceResults: ServiceMatch[] = []
    for (const org of citizenOrganizations) {
      for (const branch of org.branches) {
        for (const service of branch.services) {
          if (service.name.toLowerCase().includes(qLower)) {
            serviceResults.push({
              org,
              branch,
              serviceName: service.name,
            })
          }
        }
      }
    }

    return { orgResults, serviceResults }
  }, [q])

  const totalCount = orgResults.length + serviceResults.length
  const hasResults = totalCount > 0

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--c-bg)" }}>
      <Navbar />

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold" style={{ color: "var(--c-text)" }}>
            &ldquo;{q}&rdquo; bo&apos;yicha natijalar
          </h1>
          {hasResults && (
            <p className="mt-1 text-sm" style={{ color: "var(--c-muted)" }}>
              {totalCount} ta natija topildi
            </p>
          )}
        </motion.div>

        {hasResults ? (
          <div className="space-y-10">
            {/* Org results */}
            {orgResults.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--c-text)" }}>
                  Tashkilotlar ({orgResults.length})
                </h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {orgResults.map(({ org }, i) => (
                    <motion.div
                      key={org.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: 0.05 * i }}
                    >
                      <Link
                        href={`/org/${org.id}`}
                        className="flex gap-3 rounded-xl border p-4 transition-all hover:shadow-md"
                        style={{
                          borderColor: "var(--c-border)",
                          backgroundColor: "white",
                        }}
                      >
                        {/* Initial circle */}
                        <div
                          className="flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
                          style={{ backgroundColor: getCategoryColor(org.type) }}
                        >
                          {org.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold" style={{ color: "var(--c-text)" }}>
                            {highlightMatch(org.name, q)}
                          </p>
                          {org.description && (
                            <p
                              className="mt-0.5 truncate text-xs"
                              style={{ color: "var(--c-muted)" }}
                            >
                              {org.description}
                            </p>
                          )}
                          <div className="mt-2 flex items-center gap-3">
                            {org.rating && (
                              <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "var(--c-warning)" }}>
                                <HugeiconsIcon icon={StarIcon} size={12} className="fill-current" />
                                {org.rating.toFixed(1)}
                              </span>
                            )}
                            <span className="flex items-center gap-1 text-xs" style={{ color: "var(--c-muted)" }}>
                              <HugeiconsIcon icon={Building02Icon} size={12} />
                              {org.branches.length} filial
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Service results */}
            {serviceResults.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <h2 className="mb-4 text-lg font-semibold" style={{ color: "var(--c-text)" }}>
                  Xizmatlar bo&apos;yicha ({serviceResults.length})
                </h2>
                <div className="space-y-3">
                  {serviceResults.map(({ org, branch, serviceName }, i) => {
                    const busy = getBusyInfo(branch.busyIndex)
                    return (
                      <motion.div
                        key={`${branch.id}-${serviceName}-${i}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.04 * i }}
                      >
                        <Link
                          href={`/org/${org.id}/${branch.id}`}
                          className="flex items-center justify-between rounded-xl border p-4 transition-all hover:shadow-md"
                          style={{
                            borderColor: "var(--c-border)",
                            backgroundColor: "white",
                          }}
                        >
                          <div className="min-w-0 flex-1">
                            <p className="text-sm" style={{ color: "var(--c-muted)" }}>
                              {org.name} &middot; {branch.name}
                            </p>
                            <p className="mt-1 text-base font-semibold" style={{ color: "var(--c-text)" }}>
                              {highlightMatch(serviceName, q)}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-3">
                              {/* Busy badge */}
                              <span
                                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                                style={{
                                  backgroundColor: getCategoryBg(org.type),
                                  color: busy.color,
                                }}
                              >
                                <span
                                  className="size-1.5 rounded-full"
                                  style={{ backgroundColor: busy.dotColor }}
                                />
                                {busy.label}
                              </span>
                              <span className="text-xs" style={{ color: "var(--c-muted)" }}>
                                ~{branch.avgWaitMinutes} min kutish
                              </span>
                              <span className="text-xs" style={{ color: "var(--c-muted)" }}>
                                {branch.currentQueue} kishi navbatda
                              </span>
                            </div>
                          </div>
                          <button
                            className="ml-4 shrink-0 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors hover:opacity-90"
                            style={{ backgroundColor: "var(--c-primary)" }}
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              openBooking(org, branch)
                            }}
                          >
                            Navbat olish <HugeiconsIcon icon={ArrowRight02Icon} size={14} className="ml-1 inline" />
                          </button>
                        </Link>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.section>
            )}
          </div>
        ) : (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center py-20 text-center"
          >
            <div
              className="mb-6 flex size-16 items-center justify-center rounded-full"
              style={{ backgroundColor: "var(--c-surface)" }}
            >
              <HugeiconsIcon icon={Search01Icon} size={28} style={{ color: "var(--c-muted)" }} />
            </div>
            <h2 className="text-xl font-semibold" style={{ color: "var(--c-text)" }}>
              &ldquo;{q}&rdquo; bo&apos;yicha natija topilmadi.
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--c-muted)" }}>
              Quyidagi maslahatlarni sinab ko&apos;ring:
            </p>
            <ul className="mt-4 space-y-2 text-sm" style={{ color: "var(--c-muted)" }}>
              <li className="flex items-center gap-2">
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: "var(--c-primary)" }}
                />
                To&apos;liq nom kiriting
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: "var(--c-primary)" }}
                />
                O&apos;zbek tilida yozing
              </li>
              <li className="flex items-center gap-2">
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: "var(--c-primary)" }}
                />
                Tashkilot nomi yoki xizmat turi kiriting
              </li>
            </ul>
          </motion.div>
        )}
      </main>
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchPageContent />
    </Suspense>
  )
}
