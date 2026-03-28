"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 right-0 left-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-white/10 bg-[#0A0F1E]/90 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="font-display text-xl font-extrabold text-white"
        >
          OneTurn
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            Xususiyatlar
          </a>
          <a
            href="#pricing"
            className="text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            Narxlar
          </a>
          <a
            href="#demo"
            className="text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            Demo
          </a>
          <Link
            href="http://localhost:3002/dashboard"
            className="rounded-xl border border-white/30 px-4 py-2 text-sm font-semibold text-white transition-all hover:border-transparent hover:bg-[#2563EB] hover:text-white"
          >
            Dashboard &rarr;
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[#0A0F1E]/95 px-6 py-4 backdrop-blur-md md:hidden">
          <div className="flex flex-col gap-4">
            <a
              href="#features"
              className="text-sm font-medium text-white/70"
              onClick={() => setMobileOpen(false)}
            >
              Xususiyatlar
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium text-white/70"
              onClick={() => setMobileOpen(false)}
            >
              Narxlar
            </a>
            <a
              href="#demo"
              className="text-sm font-medium text-white/70"
              onClick={() => setMobileOpen(false)}
            >
              Demo
            </a>
            <Link
              href="http://localhost:3002/dashboard"
              className="mt-2 rounded-xl border border-white/30 px-4 py-2 text-center text-sm font-semibold text-white"
              onClick={() => setMobileOpen(false)}
            >
              Dashboard &rarr;
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
