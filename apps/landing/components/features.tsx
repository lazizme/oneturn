"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import {
  MapPin,
  Clock,
  ArrowRightLeft,
  Star,
  CalendarDays,
  MessageSquare,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: MapPin,
    title: "Xaritada filiallar",
    description:
      "Band indeks bilan. Qaysi filial bo'sh ekanligini bir ko'rishda biling.",
  },
  {
    icon: Clock,
    title: "Kutish vaqti",
    description: "O'tgan ma'lumotlar asosida aniq hisoblangan kutish vaqti.",
  },
  {
    icon: ArrowRightLeft,
    title: "Smart yo'naltirish",
    description:
      '"A filial band. B filial 11 daq uzoqroq, lekin 26 daq tejaysiz."',
  },
  {
    icon: Star,
    title: "Ishonch reytingi",
    description:
      "Vaqtida kelganlar yuqori reyting oladi. Tizim ikkala tomon uchun adolatli.",
  },
  {
    icon: CalendarDays,
    title: "Bron + jonli navbat",
    description:
      "Oldindan rejalash yoki hozir borish — ikki model, bir platforma.",
  },
  {
    icon: MessageSquare,
    title: "SMS va eslatmalar",
    description: "30 daqiqa oldin eslatma. O'zgartirish uchun bir tap.",
  },
]

export function Features() {
  const { ref, visible } = useScrollReveal()

  return (
    <section ref={ref} id="features" className="bg-[#0A0F1E] py-24">
      <div className="mx-auto max-w-7xl px-6">
        <h2
          className="font-display mb-16 text-center text-3xl font-extrabold text-white lg:text-4xl"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(32px)",
            transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        >
          Nima uchun OneTurn?
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition-all duration-200 hover:-translate-y-1 hover:bg-white/10 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(32px)",
                transition: `all 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${100 + i * 80}ms`,
              }}
            >
              <feature.icon className="mb-4 size-6 text-white transition-colors group-hover:text-[#10B981]" />
              <h3 className="mb-2 text-base font-bold text-white">
                {feature.title}
              </h3>
              <p className="text-sm leading-relaxed text-white/50">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
