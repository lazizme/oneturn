"use client"

import { useState } from "react"
import { Check, X } from "lucide-react"
import { useScrollReveal } from "@/hooks/use-scroll-reveal"

interface Plan {
  name: string
  priceMonthly: string
  priceYearly: string
  description: string
  features: { name: string; included: boolean }[]
  cta: string
  popular?: boolean
}

const plans: Plan[] = [
  {
    name: "Bepul",
    priceMonthly: "0",
    priceYearly: "0",
    description: "Kichik tashkilotlar uchun",
    features: [
      { name: "1 ta filial", included: true },
      { name: "50 ta navbat/kun", included: true },
      { name: "Basic dashboard", included: true },
      { name: "SMS xabarnoma", included: true },
      { name: "Analitika", included: false },
      { name: "API kirish", included: false },
    ],
    cta: "Bepul boshlash \u2192",
  },
  {
    name: "Pro",
    priceMonthly: "99 000",
    priceYearly: "79 000",
    description: "O'sib borayotgan tashkilotlar uchun",
    features: [
      { name: "10 ta filial", included: true },
      { name: "Cheksiz navbat", included: true },
      { name: "To'liq dashboard", included: true },
      { name: "SMS xabarnoma", included: true },
      { name: "Analitika", included: true },
      { name: "API kirish", included: true },
    ],
    cta: "Pro boshlash \u2192",
    popular: true,
  },
  {
    name: "Enterprise",
    priceMonthly: "Muzokarali",
    priceYearly: "Muzokarali",
    description: "Yirik tashkilotlar uchun",
    features: [
      { name: "Cheksiz filiallar", included: true },
      { name: "Cheksiz navbat", included: true },
      { name: "White-label widget", included: true },
      { name: "Maxsus integratsiya", included: true },
      { name: "Dedicated support", included: true },
      { name: "SLA kafolati", included: true },
    ],
    cta: "Bog\u2018lanish \u2192",
  },
]

export function Pricing() {
  const [yearly, setYearly] = useState(false)
  const { ref, visible } = useScrollReveal()

  return (
    <section ref={ref} id="pricing" className="bg-white py-24">
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
            Narxlar — tushunarli va adolatli
          </h2>
        </div>

        {/* Toggle */}
        <div className="mb-12 flex items-center justify-center gap-3">
          <button
            onClick={() => setYearly(false)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              !yearly
                ? "text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
            style={!yearly ? { backgroundColor: "#2563EB" } : undefined}
          >
            Oylik
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
              yearly
                ? "text-white"
                : "text-gray-500 hover:text-gray-700"
            }`}
            style={yearly ? { backgroundColor: "#2563EB" } : undefined}
          >
            Yillik
            <span className="ml-1.5 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              -20%
            </span>
          </button>
        </div>

        {/* Cards */}
        <div className="grid gap-8 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? "border-2 shadow-xl"
                  : "border border-gray-200"
              }`}
              style={{
                borderColor: plan.popular ? "#2563EB" : undefined,
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(32px)",
                transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${100 + i * 100}ms`,
              }}
            >
              {plan.popular && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold text-white"
                  style={{ backgroundColor: "#2563EB" }}
                >
                  Eng mashhur
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span
                    className="font-display text-4xl font-extrabold transition-opacity duration-150"
                    style={{ color: plan.popular ? "#2563EB" : "#0F172A" }}
                  >
                    {yearly ? plan.priceYearly : plan.priceMonthly}
                  </span>
                  {plan.priceMonthly !== "Muzokarali" && plan.priceMonthly !== "0" && (
                    <span className="text-sm text-gray-400">so&apos;m/oy</span>
                  )}
                  {plan.priceMonthly === "0" && (
                    <span className="text-sm text-gray-400">so&apos;m</span>
                  )}
                </div>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f.name} className="flex items-center gap-2.5 text-sm">
                    {f.included ? (
                      <Check className="size-4 flex-shrink-0" style={{ color: "#10B981" }} />
                    ) : (
                      <X className="size-4 flex-shrink-0 text-gray-300" />
                    )}
                    <span className={f.included ? "text-gray-700" : "text-gray-400"}>
                      {f.name}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full rounded-xl px-6 py-3 text-sm font-semibold transition-all ${
                  plan.popular
                    ? "text-white hover:brightness-110"
                    : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
                style={plan.popular ? { backgroundColor: "#2563EB" } : undefined}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
