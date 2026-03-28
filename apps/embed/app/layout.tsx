import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"

import "@workspace/ui/globals.css"
import "leaflet/dist/leaflet.css"
import { cn } from "@workspace/ui/lib/utils"
import { Toaster } from "@workspace/ui/components/sonner"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "OneTurn Widget Demo",
  description:
    "Navbat olish — bir marta bosish. Smart queue widget for Uzbekistan.",
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
        inter.variable,
        jetbrainsMono.variable,
        "font-sans"
      )}
    >
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  )
}
