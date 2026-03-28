import type { Metadata } from "next"
import { DM_Sans, JetBrains_Mono, Inter } from "next/font/google"

import "@workspace/ui/globals.css"
import "./globals.css"
import { cn } from "@workspace/ui/lib/utils"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700", "800", "900"],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "OneTurn — Navbat olish, bir marta bosish",
  description:
    "Tashkilotingiz saytiga bir qator kod qo'shing. Navbat, bron, SMS — qolganini biz boshqaramiz.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="uz"
      className={cn(
        "antialiased",
        dmSans.variable,
        inter.variable,
        jetbrainsMono.variable
      )}
    >
      <body className="font-body">{children}</body>
    </html>
  )
}
