"use client"

import { useScrollReveal } from "@/hooks/use-scroll-reveal"
import { useCountUp } from "@/hooks/use-count-up"

const stats = [
  { value: 3, label: "mahsulot" },
  { value: 48, label: "soat ulash vaqti", suffix: " soat" },
  { value: 1, label: "kod qatori" },
]

export function SocialProof() {
  const { ref, visible } = useScrollReveal()
  const v0 = useCountUp(3, visible)
  const v1 = useCountUp(48, visible)
  const v2 = useCountUp(1, visible)

  const values = [v0, v1, v2]

  return (
    <section ref={ref} className="bg-white py-20">
      <div className="mx-auto flex max-w-4xl items-center justify-center gap-0">
        {stats.map((stat, i) => (
          <div key={stat.label} className="flex items-center">
            {i > 0 && (
              <div className="mx-8 h-16 w-px bg-gray-200 lg:mx-12" />
            )}
            <div className="text-center">
              <div
                className="font-display text-[48px] font-extrabold leading-none lg:text-[64px]"
                style={{ color: "#2563EB" }}
              >
                {values[i]}
              </div>
              <p className="mt-2 text-sm font-medium text-gray-500 lg:text-base">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
