import Link from "next/link"

const columns = [
  {
    title: "Mahsulot",
    links: [
      { label: "Xususiyatlar", href: "#features" },
      { label: "Narxlar", href: "#pricing" },
      { label: "Demo", href: "#demo" },
    ],
  },
  {
    title: "Tashkilotlar uchun",
    links: [
      { label: "Boshlash", href: "#" },
      { label: "Dashboard", href: "http://localhost:3002/dashboard" },
      { label: "Widget sozlash", href: "#" },
    ],
  },
  {
    title: "Yordam",
    links: [
      { label: "Qo'llanma", href: "#" },
      { label: "Aloqa", href: "#" },
      { label: "Maxfiylik siyosati", href: "#" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#0A0F1E]">
      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8">
        <div className="grid gap-12 lg:grid-cols-4">
          {/* Brand column */}
          <div>
            <Link
              href="/"
              className="font-display text-xl font-extrabold text-white"
            >
              Uz<span style={{ color: "#2563EB" }}>Queue</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-white/40">
              Navbat olish — bir marta bosish.
            </p>
            <p className="mt-4 text-xs text-white/30">
              Toshkent, O&apos;zbekiston &middot; 2024
            </p>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-xs font-bold tracking-wider text-white/60 uppercase">
                {col.title}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-white/40 transition-colors hover:text-white/70"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom strip */}
        <div className="mt-12 border-t border-white/10 pt-6">
          <p className="text-center text-xs text-white/30">
            &copy; 2024 OneTurn &middot; Barcha huquqlar himoyalangan &middot;
            &#127482;&#127487; O&apos;zbekistonda qurilgan
          </p>
        </div>
      </div>
    </footer>
  )
}
