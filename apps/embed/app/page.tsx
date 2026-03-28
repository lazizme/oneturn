import { Widget } from "@/components/widget/widget"

export default function DemoPage() {
  return (
    <div
      className="relative min-h-screen"
      style={{ backgroundColor: "#f0f4f8" }}
    >
      {/* Fake bank website background */}
      <header
        className="border-b px-8 py-4"
        style={{ backgroundColor: "#1a5c2e", color: "white" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-white/20 text-lg font-bold">
              A
            </div>
            <span className="text-xl font-semibold">Agrobank</span>
          </div>
          <nav className="hidden gap-6 text-sm text-white/80 md:flex">
            <span>Bosh sahifa</span>
            <span>Xizmatlar</span>
            <span>Filiallar</span>
            <span>Bog&apos;lanish</span>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-8 py-12">
        <h1 className="mb-4 text-3xl font-bold" style={{ color: "#1a5c2e" }}>
          Agrobank — Ishonchli hamkoringiz
        </h1>
        <p className="mb-8 max-w-2xl text-gray-600">
          Agrobank O&apos;zbekiston Respublikasining yetakchi tijorat
          banklaridan biri. Biz mijozlarimizga yuqori sifatli bank xizmatlarini
          taqdim etamiz.
        </p>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Shaxsiy hisoblar",
              desc: "Omonat va joriy hisoblar",
            },
            {
              title: "Kreditlar",
              desc: "Qulay shartlarda kredit olish",
            },
            {
              title: "Kartalar",
              desc: "HUMO va UZCARD plastik kartalar",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-xl border bg-white p-6 shadow-sm"
            >
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                {card.title}
              </h3>
              <p className="text-sm text-gray-500">{card.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50/50 p-8 text-center">
          <p className="text-lg font-medium text-blue-800">
            OneTurn widget pastki o&apos;ng burchakda ko&apos;rinadi →
          </p>
          <p className="mt-1 text-sm text-blue-600">
            Tugmani bosing va navbat olish jarayonini sinab ko&apos;ring
          </p>
        </div>
      </main>

      {/* OneTurn Widget */}
      <Widget orgId="agrobank-demo" />
    </div>
  )
}
