import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
// ✅ ИСПРАВЛЕНО 2026-01-13: Убран Vercel Analytics (проект не на Vercel, вызывает Script error)
// import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Footer } from "@/components/footer"
import { InstallPrompt } from "@/components/pwa/InstallPrompt"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OGFooDY — Доставка домашней еды в Санкт-Петербурге",
  description: "Сервис доставки готовых домашних обедов на 2 дня. Сбалансированное питание, бесплатная доставка в синей зоне, заказ через удобный календарь. ИП Ясашнев.",
  keywords: "доставка еды спб, домашняя еда, готовые обеды, доставка обедов, огфуди, ogfoody",
  generator: "v0.app",
  applicationName: "OGFooDY",
  referrer: "origin-when-cross-origin",
  authors: [{ name: "ИП Ясашнев Сергей Владимирович" }],
  creator: "OGFooDY",
  publisher: "OGFooDY",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://ogfoody.ru"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://ogfoody.ru",
    siteName: "OGFooDY",
    title: "OGFooDY — Доставка домашней еды в Санкт-Петербурге",
    description: "Сервис доставки готовых домашних обедов на 2 дня. Сбалансированное питание, бесплатная доставка в синей зоне, заказ через удобный календарь.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "OGFooDY — Доставка домашней еды",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "OGFooDY — Доставка домашней еды в Санкт-Петербурге",
    description: "Сервис доставки готовых домашних обедов на 2 дня. Сбалансированное питание, бесплатная доставка в синей зоне.",
    images: ["/og-image.png"],
  },
  // Favicon - Next.js автоматически обработает файлы из app/ (favicon.ico, icon.png, apple-icon.png)
  // Простая конфигурация - только apple-touch-icon.png для телефонов и закладок
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "OGFooDY",
  },
}

// ✅ Настройка viewport для мобильных устройств и PWA
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FFEA00', // Brand Yellow для PWA
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <body className={`font-sans antialiased flex flex-col min-h-screen`}>
        <div className="flex-1">
          {children}
        </div>
        <Footer />
        {/* PWA Install Prompt */}
        <InstallPrompt />
        {/* ✅ ИСПРАВЛЕНО 2026-01-13: Убран Vercel Analytics (проект не на Vercel) */}
        {/* <Analytics /> */}
      </body>
    </html>
  )
}
