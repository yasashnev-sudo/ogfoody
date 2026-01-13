import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
// ✅ ИСПРАВЛЕНО 2026-01-13: Убран Vercel Analytics (проект не на Vercel, вызывает Script error)
// import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SWITCH — доставка домашней еды",
  description: "SWITCH — сервис доставки домашней еды на каждый день. Свежие блюда с доставкой на 2 дня.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

// ✅ Настройка viewport для мобильных устройств
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        {children}
        {/* ✅ ИСПРАВЛЕНО 2026-01-13: Убран Vercel Analytics (проект не на Vercel) */}
        {/* <Analytics /> */}
      </body>
    </html>
  )
}
