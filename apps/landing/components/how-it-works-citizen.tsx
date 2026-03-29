"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  GlobeIcon,
  Mouse01Icon,
  Location01Icon,
  Calendar01Icon,
  SmartPhone01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons"

interface Step {
  icon: any
  title: string
  description: string
}

const steps: Step[] = [
  {
    icon: GlobeIcon,
    title: "Saytga kiring",
    description: "Bank, klinika yoki davlat idorasi saytiga kiring",
  },
  {
    icon: Mouse01Icon,
    title: "Tugmani bosing",
    description: "\"Navbat olish\" tugmasi siz uchun mavjud",
  },
  {
    icon: Location01Icon,
    title: "Filialni tanlang",
    description: "Xaritada eng yaqin va bo'sh filialni ko'ring",
  },
  {
    icon: Calendar01Icon,
    title: "Vaqt band qiling",
    description: "Bron yoki jonli navbat — siz tanlaysiz",
  },
  {
    icon: SmartPhone01Icon,
    title: "SMS tasdiqlash",
    description: "OneID yoki telefon raqam orqali bir daqiqada",
  },
  {
    icon: UserIcon,
    title: "Xizmat oling",
    description: "Kutmasdan, bilasiz qachon borish kerakligini",
  },
]

export function HowItWorksCitizen() {
  const { ref, visible } = useScrollReveal()

  return (
    <section ref={ref} className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 text-center">
          <h2
            className="font-display text-3xl font-extrabold text-gray-900 lg:text-4xl"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(32px)",
              transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            Fuqarolar uchun — oddiy va tez
          </h2>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-gray-100 bg-white p-6"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(32px)",
                transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${100 + i * 80}ms`,
              }}
            >
              <div className="mb-4 flex items-center gap-3">
                <div
                  className="flex size-10 items-center justify-center rounded-xl"
                  style={{ backgroundColor: "rgba(37, 99, 235, 0.08)" }}
                >
                  <HugeiconsIcon icon={step.icon} size={20} style={{ color: "#2563EB" }} />
                </div>
                <span className="font-display text-2xl font-extrabold text-gray-200">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mb-1.5 text-base font-bold text-gray-900">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-500">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
