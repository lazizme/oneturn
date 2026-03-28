"use client"

import { Check } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0A0F1E]">
      {/* Background grid + gradient */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 60% 50% at 70% 20%, rgba(37, 99, 235, 0.08) 0%, transparent 70%),
            url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23ffffff' stroke-width='0.3' stroke-opacity='0.04'%3E%3Cpath d='M60 0H0v60'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
          `,
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 pt-24 pb-16 lg:flex-row lg:items-center lg:gap-16 lg:pt-0 lg:pb-0">
        {/* Left — content */}
        <div className="flex-1">
          {/* Badge */}
          <div className="animate-fade-up mb-8 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2">
            <span className="text-base">&#127482;&#127487;</span>
            <span className="text-sm font-medium text-white/70">
              O&apos;zbekiston uchun qurilgan
            </span>
            <span className="text-white/30">&middot;</span>
            <span className="text-sm text-white/50">Toshkent, 2024</span>
          </div>

          {/* H1 */}
          <h1 className="mb-6 font-display text-[56px] leading-[1.08] font-extrabold tracking-tight text-white lg:text-[72px]">
            <span className="animate-fade-up block">Navbat olish —</span>
            <span className="animate-fade-up delay-1 block">bir marta</span>
            <span className="animate-fade-up delay-2 block" style={{ color: "#2563EB" }}>
              bosish.
            </span>
          </h1>

          {/* Subtext */}
          <p className="animate-fade-up delay-3 mb-8 max-w-[480px] text-[17px] leading-[1.7] text-white/60">
            Tashkilotingiz saytiga bir qator kod qo&apos;shing.
            Navbat, bron, SMS — qolganini biz boshqaramiz.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up delay-4 mb-8 flex flex-wrap items-center gap-4">
            <a
              href="#demo"
              className="rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all hover:brightness-110"
              style={{ backgroundColor: "#2563EB" }}
            >
              Bepul boshlash &rarr;
            </a>
            <a
              href="#demo"
              className="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10"
            >
              Demo ko&apos;rish
            </a>
          </div>

          {/* Trust row */}
          <div className="animate-fade-up delay-5 flex flex-wrap items-center gap-6">
            {[
              "OneID integratsiya",
              "SMS tasdiqlash",
              "48 soatda ulaning",
            ].map((item) => (
              <span
                key={item}
                className="flex items-center gap-1.5 text-sm text-white/40"
              >
                <Check className="size-3.5" style={{ color: "#10B981" }} />
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Right — browser mockup */}
        <div className="mt-12 flex-1 lg:mt-0">
          <div className="animate-float rounded-2xl border border-white/10 shadow-2xl">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 rounded-t-2xl border-b border-white/10 bg-white/5 px-4 py-3">
              <div className="flex gap-1.5">
                <span className="size-3 rounded-full bg-white/20" />
                <span className="size-3 rounded-full bg-white/20" />
                <span className="size-3 rounded-full bg-white/20" />
              </div>
              <div className="ml-4 flex-1 rounded-lg bg-white/10 px-3 py-1">
                <span className="text-xs text-white/50">agrobank.uz</span>
              </div>
            </div>

            {/* Content */}
            <div className="relative rounded-b-2xl bg-white p-6" style={{ minHeight: "320px" }}>
              {/* Fake bank header */}
              <div className="mb-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-green-600 text-xs font-bold text-white">
                    A
                  </div>
                  <span className="text-sm font-bold text-gray-900">Agrobank</span>
                </div>
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>Bosh sahifa</span>
                  <span>Xizmatlar</span>
                  <span>Aloqa</span>
                </div>
              </div>

              {/* Fake hero */}
              <div className="mb-6">
                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  Xush kelibsiz
                </h3>
                <p className="text-sm text-gray-500">
                  Agrobank — sizning ishonchli hamkoringiz
                </p>
              </div>

              <div className="flex gap-3">
                <div className="h-16 flex-1 rounded-lg bg-gray-100" />
                <div className="h-16 flex-1 rounded-lg bg-gray-100" />
              </div>

              {/* Widget button */}
              <div className="absolute right-4 bottom-4">
                <div
                  className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-lg"
                  style={{ backgroundColor: "#2563EB" }}
                >
                  <span>&#127963;</span>
                  Navbat olish
                  <span className="text-white/70">&nearr;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ticker strip */}
      <div className="border-t border-[#2563EB]/30 bg-[#2563EB]/10 py-3">
        <div className="overflow-hidden">
          <div className="animate-marquee flex whitespace-nowrap">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex items-center gap-8 pr-8">
                {[
                  { icon: "\u26A1", text: "Real vaqt navbat" },
                  { icon: "\uD83D\uDDFA\uFE0F", text: "Xaritada filiallar" },
                  { icon: "\u2B50", text: "Ishonch reytingi" },
                  { icon: "\uD83D\uDD04", text: "Smart yo'naltirish" },
                  { icon: "\uD83D\uDCC5", text: "Bron + jonli navbat" },
                  { icon: "\uD83D\uDCF1", text: "SMS tasdiqlash" },
                ].map((item) => (
                  <span key={`${i}-${item.text}`} className="flex items-center gap-2 text-sm font-medium text-white/60">
                    <span>{item.icon}</span>
                    {item.text}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
