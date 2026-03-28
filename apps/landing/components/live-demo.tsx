"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"

export function LiveDemo() {
  const { ref, visible } = useScrollReveal()

  return (
    <section ref={ref} id="demo" className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-12 text-center">
          <h2
            className="font-display text-3xl font-extrabold text-gray-900 lg:text-4xl"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(32px)",
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            O&apos;zingiz sinab ko&apos;ring — hoziroq
          </h2>
          <p
            className="mx-auto mt-4 max-w-lg text-base text-gray-500"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(32px)",
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 100ms",
            }}
          >
            Quyidagi demo — haqiqiy widget. Agrobank demo filiali bilan ishlang.
          </p>
        </div>

        <div
          className="mx-auto max-w-4xl"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(32px)",
            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
          }}
        >
          {/* Browser frame */}
          <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-xl">
            {/* Chrome */}
            <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-100 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="size-3 rounded-full bg-red-400" />
                <span className="size-3 rounded-full bg-amber-400" />
                <span className="size-3 rounded-full bg-green-400" />
              </div>
              <div className="ml-4 flex-1 rounded-lg bg-white px-3 py-1 shadow-sm">
                <span className="text-xs text-gray-500">demo.agrobank.uz</span>
              </div>
            </div>

            {/* Iframe with embed app */}
            <div className="relative bg-white" style={{ height: "560px" }}>
              <iframe
                src="http://localhost:3001"
                className="size-full border-0"
                title="OneTurn Widget Demo"
              />
            </div>
          </div>
        </div>

        {/* CTA below */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Foydalanuvchi bron qildi. Endi tashkilot tomonini ko&apos;ring
            &rarr;{" "}
            <a
              href="http://localhost:3002/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold underline underline-offset-2"
              style={{ color: "#2563EB" }}
            >
              Dashboard
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
