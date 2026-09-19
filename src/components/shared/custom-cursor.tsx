"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 })

  useEffect(() => {
    function onMove(e: MouseEvent) {
      setPos({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  return (
    <motion.div
      className="pointer-events-none fixed z-50 h-3 w-3 rounded-full bg-emerald-300/90 mix-blend-screen"
      animate={{ x: pos.x - 6, y: pos.y - 6 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
    />
  )
}
