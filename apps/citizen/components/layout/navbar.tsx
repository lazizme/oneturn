"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MapPin, Search, ChevronDown, TrendingUp, X } from "lucide-react"
import { useLocation } from "@/context/location-context"
import { tashkentDistricts, citizenOrganizations } from "@workspace/mock-data"
import type { LocationData } from "@/context/location-context"

const popularServices = [
  "Soliq deklaratsiyasi",
  "Terapevt",
  "Hisob ochish",
  "Pasport almashish",
]

export function Navbar({ isDemo }: { isDemo?: boolean }) {
  const { location, setLocation } = useLocation()
  const router = useRouter()

  const [showLocationPicker, setShowLocationPicker] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const locationRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setShowLocationPicker(false)
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSearch(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  // Search results filtered
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return null
    const q = searchQuery.toLowerCase()
    const orgs = citizenOrganizations.filter(
      (o) => o.name.toLowerCase().includes(q) || o.description?.toLowerCase().includes(q)
    ).slice(0, 3)
    const services: { orgName: string; branchName: string; serviceName: string; orgId: string; branchId: string }[] = []
    for (const org of citizenOrganizations) {
      for (const branch of org.branches) {
        for (const service of branch.services) {
          if (service.name.toLowerCase().includes(q)) {
            services.push({
              orgName: org.name,
              branchName: branch.name,
              serviceName: service.name,
              orgId: org.id,
              branchId: branch.id,
            })
          }
        }
      }
    }
    return { orgs, services: services.slice(0, 5) }
  }, [searchQuery])

  function handleLocationSelect(d: typeof tashkentDistricts[0]) {
    setLocation(d as LocationData)
    setShowLocationPicker(false)
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setShowSearch(false)
    }
  }

  function handleSearchResultClick(path: string) {
    setShowSearch(false)
    setSearchQuery("")
    router.push(path)
  }

  return (
    <header className="sticky top-0 z-50 bg-white">
      {/* Row 1: Primary nav */}
      <div className="flex items-center justify-between border-b px-6 py-3" style={{ borderColor: "var(--c-border)" }}>
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-1.5">
            <span className="text-xl font-bold" style={{ color: "var(--c-primary)" }}>
              OneTurn
            </span>
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            <Link href="/explore" className="text-sm font-medium transition-colors hover:text-gray-900" style={{ color: "var(--c-muted)" }}>
              Tashkilotlar
            </Link>
            <Link href="/explore?view=map" className="text-sm font-medium transition-colors hover:text-gray-900" style={{ color: "var(--c-muted)" }}>
              Xarita
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {isDemo && (
            <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ backgroundColor: "var(--c-warning)", color: "#000" }}>
              Demo rejim
            </span>
          )}
          <button className="rounded-xl border px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50" style={{ borderColor: "var(--c-border)", color: "var(--c-text)" }}>
            Kirish
          </button>
          <button className="rounded-xl px-4 py-2 text-sm font-medium text-white" style={{ backgroundColor: "var(--c-primary)" }}>
            Ro&apos;yxatdan o&apos;tish
          </button>
        </div>
      </div>

      {/* Row 2: Location + Search */}
      <div className="flex items-stretch border-b" style={{ borderColor: "var(--c-border)", backgroundColor: "var(--c-surface)" }}>
        {/* Location picker */}
        <div className="relative" ref={locationRef}>
          <button
            onClick={() => setShowLocationPicker(!showLocationPicker)}
            className="flex h-full items-center gap-2 border-r px-4 py-3 text-sm font-medium transition-colors hover:bg-gray-100"
            style={{ borderColor: "var(--c-border)", color: "var(--c-text)", minWidth: "220px" }}
          >
            <MapPin className="size-4 shrink-0" style={{ color: "var(--c-primary)" }} />
            <span className="truncate">Toshkent, {location.name}</span>
            <ChevronDown className="size-3.5 shrink-0" style={{ color: "var(--c-muted)" }} />
          </button>

          {showLocationPicker && (
            <div className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border bg-white p-2 shadow-lg" style={{ borderColor: "var(--c-border)" }}>
              <div className="mb-2 px-2 py-1.5">
                <p className="text-xs font-semibold" style={{ color: "var(--c-muted)" }}>
                  Tuman tanlang
                </p>
              </div>
              {tashkentDistricts.map((d) => (
                <button
                  key={d.id}
                  onClick={() => handleLocationSelect(d)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-50"
                  style={{ color: location.id === d.id ? "var(--c-primary)" : "var(--c-text)" }}
                >
                  <span className="font-medium">{d.name}</span>
                  {location.id === d.id && (
                    <span className="text-xs" style={{ color: "var(--c-primary)" }}>✓</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search bar */}
        <div className="relative flex-1" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="flex h-full items-center">
            <Search className="ml-4 size-4 shrink-0" style={{ color: "var(--c-muted)" }} />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSearch(true)}
              placeholder="Tashkilot yoki xizmat qidiring..."
              className="h-full flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-gray-400"
              style={{ color: "var(--c-text)" }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => { setSearchQuery(""); searchInputRef.current?.focus() }}
                className="mr-3 rounded-full p-1 hover:bg-gray-200"
              >
                <X className="size-3.5" style={{ color: "var(--c-muted)" }} />
              </button>
            )}
          </form>

          {showSearch && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 rounded-xl border bg-white p-2 shadow-lg" style={{ borderColor: "var(--c-border)" }}>
              {searchResults && searchQuery.trim() ? (
                <>
                  {searchResults.orgs.length > 0 && (
                    <div className="mb-2">
                      <p className="px-2 py-1 text-xs font-semibold" style={{ color: "var(--c-muted)" }}>Tashkilotlar</p>
                      {searchResults.orgs.map((org) => (
                        <button
                          key={org.id}
                          onClick={() => handleSearchResultClick(`/org/${org.id}`)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-50"
                        >
                          <span className="font-medium" style={{ color: "var(--c-text)" }}>{org.name}</span>
                          <span className="text-xs" style={{ color: "var(--c-muted)" }}>{org.branches.length} filial</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults.services.length > 0 && (
                    <div>
                      <p className="px-2 py-1 text-xs font-semibold" style={{ color: "var(--c-muted)" }}>Xizmatlar bo&apos;yicha</p>
                      {searchResults.services.map((s, i) => (
                        <button
                          key={i}
                          onClick={() => handleSearchResultClick(`/org/${s.orgId}/${s.branchId}`)}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-50"
                        >
                          <span className="font-semibold" style={{ color: "var(--c-text)" }}>{s.serviceName}</span>
                          <span className="text-xs" style={{ color: "var(--c-muted)" }}>· {s.orgName} · {s.branchName}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {searchResults.orgs.length === 0 && searchResults.services.length === 0 && (
                    <p className="px-3 py-4 text-center text-sm" style={{ color: "var(--c-muted)" }}>
                      &ldquo;{searchQuery}&rdquo; bo&apos;yicha natija topilmadi
                    </p>
                  )}
                </>
              ) : (
                <>
                  <p className="px-2 py-1 text-xs font-semibold" style={{ color: "var(--c-muted)" }}>Mashhur xizmatlar</p>
                  {popularServices.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSearchQuery(s); searchInputRef.current?.focus() }}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-50"
                      style={{ color: "var(--c-text)" }}
                    >
                      <TrendingUp className="size-3.5" style={{ color: "var(--c-warning)" }} />
                      {s}
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
