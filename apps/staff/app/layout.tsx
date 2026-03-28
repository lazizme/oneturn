import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { Toaster } from "sonner"
import "@workspace/ui/globals.css"
import "./globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "OneTurn — Operator paneli",
  description: "Staff kiosk for queue management",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="uz">
      <body
        className={`${dmSans.variable} font-sans antialiased`}
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        {children}
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: "var(--staff-card)",
              color: "var(--staff-text)",
              border: "1px solid var(--staff-border)",
            },
          }}
        />
      </body>
    </html>
  )
}
