"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export function Preloader() {
  const [currentText, setCurrentText] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  const texts = ["ГРЕЕМ СКОВОРОДКИ...", "УПАКОВЫВАЕМ...", "OGFOODY"]

  useEffect(() => {
    // Cycle through texts quickly
    const textInterval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length)
    }, 500)

    // After 2.5 seconds, start slide up animation
    const hideTimeout = setTimeout(() => {
      setIsVisible(false)
    }, 2500)

    return () => {
      clearInterval(textInterval)
      clearTimeout(hideTimeout)
    }
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{
            duration: 0.6,
            ease: [0.4, 0, 0.2, 1], // bezier curve
          }}
          className="fixed inset-0 bg-[#FFEA00] z-[9999] flex flex-col items-center justify-center"
        >
          {/* Pulsing Logo */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="mb-8"
          >
            <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-black overflow-hidden flex items-center justify-center shadow-brutal bg-white">
              {/* ✅ ИСПРАВЛЕНО 2026-01-14: Добавлен placeholder для логотипа, чтобы не было пустого места при загрузке */}
              <Image
                src="/logo-small.png"
                alt="OGFooDY Logo"
                width={128}
                height={128}
                className="rounded-full object-cover"
                priority
                placeholder="blur"
                blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRkZFRUEwIi8+CjxwYXRoIGQ9Ik02NCAzMkM0OC41MzYgMzIgMzYgNDQuNTM2IDM2IDYwQzM2IDc1LjQ2NCA0OC41MzYgODggNjQgODhDNzkuNDY0IDg4IDkyIDc1LjQ2NCA5MiA2MEM5MiA0NC41MzYgNzkuNDY0IDMyIDY0IDMyWiIgZmlsbD0iIzlEMDBGRiIvPgo8L3N2Zz4="
              />
            </div>
          </motion.div>

          {/* Cycling Text */}
          <motion.div
            key={currentText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-black font-black text-xl sm:text-2xl tracking-tight"
          >
            {texts[currentText]}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}






