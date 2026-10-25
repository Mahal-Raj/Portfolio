"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/cn"

export function ParallaxMedia({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
  const rawY = useTransform(scrollYProgress, [0, 1], [34, -34])
  const rawScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.055, 1, 1.035])
  const y = useSpring(rawY, { stiffness: 120, damping: 28, mass: 0.35 })
  const scale = useSpring(rawScale, { stiffness: 120, damping: 28, mass: 0.35 })

  return (
    <div ref={ref} className={cn("parallax-media", className)}>
      <motion.div style={reduceMotion ? undefined : { y, scale }}>{children}</motion.div>
    </div>
  )
}
