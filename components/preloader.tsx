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
            <div className="h-24 w-24 sm:h-32 sm:w-32 rounded-full border-4 border-black overflow-hidden flex items-center justify-center shadow-brutal">
              <Image
                src="/OGFooDY логотип.png"
                alt="OGFooDY Logo"
                width={128}
                height={128}
                className="rounded-full object-cover"
                priority
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

