"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

const steps = [
  {
    num: "01",
    time: "2 daqiqa",
    title: "Kodni saytingizga qo'shing",
    type: "code" as const,
  },
  {
    num: "02",
    time: "5 daqiqa",
    title: "Filiallar va xizmatlarni kiriting",
    type: "dashboard" as const,
  },
  {
    num: "03",
    time: "Doimiy",
    title: "Navbatni biz boshqaramiz",
    type: "stats" as const,
  },
]

export function HowItWorksOrg() {
  const { ref, visible } = useScrollReveal()
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(
      '<script src="https://cdn.oneturn.uz/widget.js" data-org-id="YOUR_ID"></script>'
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section ref={ref} className="bg-[#F8FAFC] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-16 lg:flex-row lg:gap-20">
          {/* Left — decorative */}
          <div className="flex-shrink-0 lg:w-[280px]">
            <div
              className="font-display text-[120px] leading-none font-extrabold text-slate-100 lg:text-[160px]"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(32px)",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            >
              01
            </div>
            <h2
              className="mt-4 text-2xl font-bold text-gray-900 lg:text-3xl"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(32px)",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 100ms",
              }}
            >
              Tashkilotlar uchun
            </h2>
            <p
              className="mt-2 text-base text-gray-500"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(32px)",
                transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1) 200ms",
              }}
            >
              3 ta qadam — navbat muammosi hal.
            </p>
          </div>

          {/* Right — steps */}
          <div className="relative flex-1">
            {/* Connecting line */}
            <div className="absolute top-0 left-6 hidden h-full w-0.5 bg-gray-200 lg:block" />

            <div className="space-y-6">
              {steps.map((step, i) => (
                <div
                  key={step.num}
                  className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm lg:ml-12"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(32px)",
                    transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${200 + i * 100}ms`,
                  }}
                >
                  {/* Step dot */}
                  <div
                    className="absolute top-8 -left-[30px] hidden size-4 rounded-full border-4 border-[#F8FAFC] lg:block"
                    style={{ backgroundColor: "#2563EB" }}
                  />

                  <div className="mb-3 flex items-center justify-between">
                    <span
                      className="font-display text-lg font-extrabold"
                      style={{ color: "#2563EB" }}
                    >
                      {step.num}
                    </span>
                    <span className="text-xs font-medium text-gray-400">
                      {step.time}
                    </span>
                  </div>

                  <h3 className="mb-3 text-base font-bold text-gray-900">
                    {step.title}
                  </h3>

                  {step.type === "code" && (
                    <div className="relative rounded-xl bg-gray-900 p-4">
                      <code className="block font-mono text-xs leading-relaxed text-gray-300">
                        <span className="text-gray-500">&lt;</span>
                        <span className="text-blue-400">script</span>
                        {"\n  "}
                        <span className="text-gray-400">src</span>
                        <span className="text-gray-500">=</span>
                        <span className="text-amber-300">
                          &quot;cdn.oneturn.uz/widget.js&quot;
                        </span>
                        {"\n  "}
                        <span className="text-gray-400">data-org-id</span>
                        <span className="text-gray-500">=</span>
                        <span className="text-amber-300">
                          &quot;YOUR_ID&quot;
                        </span>
                        <span className="text-gray-500">&gt;&lt;/</span>
                        <span className="text-blue-400">script</span>
                        <span className="text-gray-500">&gt;</span>
                      </code>
                      <button
                        onClick={handleCopy}
                        className="absolute top-3 right-3 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-white/70 transition-colors hover:bg-white/10"
                      >
                        {copied ? (
                          <span className="flex items-center gap-1">
                            <Check className="size-3" /> Nusxalandi
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <Copy className="size-3" /> Nusxa
                          </span>
                        )}
                      </button>
                    </div>
                  )}

                  {step.type === "dashboard" && (
                    <div className="rounded-xl bg-gray-50 p-4">
                      <div className="mb-3 flex gap-2">
                        <div className="h-8 w-24 rounded-lg bg-gray-200" />
                        <div className="h-8 w-24 rounded-lg bg-gray-200" />
                      </div>
                      <div className="flex gap-2">
                        <div className="h-20 flex-1 rounded-lg bg-gray-200" />
                        <div className="h-20 flex-1 rounded-lg bg-gray-200" />
                        <div className="h-20 flex-1 rounded-lg bg-gray-200" />
                      </div>
                    </div>
                  )}

                  {step.type === "stats" && (
                    <div className="flex items-center gap-6 rounded-xl bg-gray-50 p-4">
                      <div>
                        <div className="text-2xl font-bold text-gray-900">
                          142
                        </div>
                        <div className="text-xs text-gray-500">
                          ta bron bugun
                        </div>
                      </div>
                      <div>
                        <div
                          className="flex items-center gap-1 text-2xl font-bold"
                          style={{ color: "#10B981" }}
                        >
                          8.3%
                          <span className="text-sm">&darr;</span>
                        </div>
                        <div className="text-xs text-gray-500">no-show</div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
