import type { Metadata } from "next"
import { DM_Sans, JetBrains_Mono } from "next/font/google"
import { Toaster } from "sonner"
import "@workspace/ui/globals.css"
import "leaflet/dist/leaflet.css"
import "./globals.css"
import { LocationProvider } from "@/context/location-context"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "OneTurn — Toshkent bo'yicha xizmatlar",
  description: "Eng yaqin va bo'sh filialni toping. Navbat oling.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body
        className={`${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}
        style={{ fontFamily: "var(--font-dm-sans)", backgroundColor: "var(--c-bg)", color: "var(--c-text)" }}
      >
        <LocationProvider>
          {children}
        </LocationProvider>
        <Toaster position="bottom-center" />
      </body>
    </html>
  )
}
