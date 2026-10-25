"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/cn"

export interface ChapterLink {
  id: string
  label: string
}

export function ChapterNav({ title, items, dark = false }: { title: string; items: ChapterLink[]; dark?: boolean }) {
  const [active, setActive] = useState(items[0]?.id ?? "")

  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: "-30% 0px -58%", threshold: [0.05, 0.3, 0.6] },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [items])

  return (
    <nav className={cn("chapter-nav", dark && "chapter-nav-dark")} aria-label={`${title} page chapters`}>
      <div className="site-shell chapter-nav-inner">
        <strong>{title}</strong>
        <div>
          {items.map((item) => (
            <a key={item.id} href={`#${item.id}`} className={active === item.id ? "is-active" : undefined} aria-current={active === item.id ? "location" : undefined}>
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
