"use client"

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion"
import { MOTION } from "@/lib/motion"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.25 })

  return (
    <>
      <motion.div className="site-reading-progress" style={{ scaleX: reduceMotion ? 1 : progress }} aria-hidden="true" />
      <motion.div
        initial={false}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: MOTION.default, ease: MOTION.ease }}
      >
        {children}
      </motion.div>
    </>
  )
}
