"use client"

import { useRef } from "react"
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion"
import { Cloud, Container, Gauge, Monitor, Network, Workflow } from "lucide-react"

const steps = [
  { label: "Interface", detail: "What a person sees", icon: Monitor },
  { label: "Application", detail: "What the software decides", icon: Workflow },
  { label: "Container", detail: "How the workload travels", icon: Container },
  { label: "Network", detail: "How every request finds a path", icon: Network },
  { label: "Cloud", detail: "Where infrastructure carries it", icon: Cloud },
  { label: "Signal", detail: "How I know the system is healthy", icon: Gauge },
]

export function SystemStory() {
  const ref = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const line = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.35 })
  const rotate = useTransform(scrollYProgress, [0, 1], [-9, 9])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.94, 1, 0.94])

  return (
    <section className="system-story" ref={ref} id="system-path">
      <div className="site-shell system-story-layout">
        <div className="system-story-copy">
          <p className="section-label"><span>02</span> / ONE REQUEST, END TO END</p>
          <h2>I follow the signal<br />all the way through.</h2>
          <p>A polished interface is only the visible edge. I&apos;m interested in everything that must stay connected behind it—from a commit and container to the network, cloud runtime and evidence that the system is healthy.</p>
          <p className="system-story-note">That end-to-end view is what connects my projects, skills and the kind of engineering work I want to keep doing.</p>
        </div>

        <div className="system-story-sticky" aria-label="The system path from interface to operational signal">
          <motion.div className="system-core" style={reduceMotion ? undefined : { rotate, scale }}>
            <span>THE SYSTEM</span>
            <strong>One path.<br />Six layers.</strong>
          </motion.div>
          <div className="system-path-line"><motion.i style={{ scaleY: reduceMotion ? 1 : line }} /></div>
          <ol>
            {steps.map(({ label, detail, icon: Icon }, index) => (
              <motion.li
                key={label}
                initial={reduceMotion ? false : { opacity: 0.25, x: 22 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, x: 0 }}
                viewport={{ amount: 0.8 }}
                transition={{ duration: 0.45, delay: index * 0.025 }}
              >
                <Icon aria-hidden="true" />
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div><strong>{label}</strong><small>{detail}</small></div>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
