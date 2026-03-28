"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function CtaBanner() {
  const { ref, visible } = useScrollReveal()

  return (
    <section ref={ref} className="bg-[#0A0F1E] py-24">
      <div
        className="mx-auto max-w-3xl px-6 text-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(32px)",
          transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <h2 className="font-display text-3xl font-extrabold text-white lg:text-5xl">
          Bugun boshlang.
        </h2>
        <p className="mt-4 text-lg text-white/50">
          O&apos;rnatish — 2 daqiqa. Birinchi oy — bepul.
        </p>
        <a
          href="#demo"
          className="mt-8 inline-block rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-gray-900 transition-all hover:bg-gray-100"
        >
          Bepul ulang &rarr;
        </a>
      </div>
    </section>
  )
}
