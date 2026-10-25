"use client"

import { motion, useReducedMotion } from "framer-motion"
import { MOTION } from "@/lib/motion"
import { cn } from "@/lib/cn"

export function Reveal({
  children,
  className,
  delay = 0,
  variant = "up",
  amount = 0.22,
}: {
  children: React.ReactNode
  className?: string
  delay?: number
  variant?: "up" | "left" | "right" | "scale" | "blur"
  amount?: number
}) {
  const reduceMotion = useReducedMotion()
  const initial = {
    up: { opacity: 0, y: 36 },
    left: { opacity: 0, x: -42 },
    right: { opacity: 0, x: 42 },
    scale: { opacity: 0, y: 18, scale: 0.965 },
    blur: { opacity: 0, y: 24, filter: "blur(12px)" },
  }[variant]

  return (
    <motion.div
      className={cn(className)}
      initial={reduceMotion ? false : initial}
      whileInView={reduceMotion ? undefined : { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, amount, margin: "0px 0px -6%" }}
      transition={{ duration: MOTION.slow, delay, ease: MOTION.ease }}
    >
      {children}
    </motion.div>
  )
}
