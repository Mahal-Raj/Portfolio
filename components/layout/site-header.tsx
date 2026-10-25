"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { Menu, X } from "lucide-react"
import { navigation, resumeHref, siteConfig } from "@/data/site"
const primaryLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/research", label: "Research" },
  { href: "/experience", label: "Experience" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
]
export function SiteHeader() {
  const pathname = usePathname()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const previousOverflow = useRef("")
  const closeMenu = () => dialogRef.current?.close()
  const openMenu = () => {
    previousOverflow.current = document.body.style.overflow
    document.body.style.overflow = "hidden"
    dialogRef.current?.showModal()
  }
  useEffect(() => {
    const dialog = dialogRef.current
    const restore = () => {
      document.body.style.overflow = previousOverflow.current
      triggerRef.current?.focus()
    }
    dialog?.addEventListener("close", restore)
    return () => {
      dialog?.removeEventListener("close", restore)
      if (dialog?.open) document.body.style.overflow = previousOverflow.current
    }
  }, [])
  return (
    <header className="p-header">
      <div className="p-shell p-nav">
        <Link className="p-wordmark" href="/" aria-label={`${siteConfig.name}, home`}>Sukhraj Singh<span aria-hidden="true">.</span></Link>
        <nav className="p-desktop-nav" aria-label="Main navigation">
          {primaryLinks.map((link) => <Link key={link.href} href={link.href} aria-current={pathname.startsWith(link.href) ? "page" : undefined}>{link.label}</Link>)}
        </nav>
        <div className="p-nav-actions">
          <a href={resumeHref} className="p-resume" target="_blank" rel="noreferrer">Résumé <span aria-hidden="true">↗</span></a>
          <button ref={triggerRef} className="p-menu-button" type="button" onClick={openMenu} aria-label="Open navigation" aria-haspopup="dialog"><Menu size={22} /></button>
        </div>
      </div>
      <dialog ref={dialogRef} className="p-menu" aria-label="Navigation" onClick={(event) => { if (event.target === event.currentTarget) closeMenu() }}>
        <div className="p-menu-inner">
          <div className="p-menu-top"><span>Sukhraj Singh.</span><button type="button" onClick={closeMenu} aria-label="Close navigation"><X /></button></div>
          <nav aria-label="Mobile navigation">{navigation.map((link) => <Link key={link.href} href={link.href} aria-current={pathname === link.href ? "page" : undefined} onClick={closeMenu}>{link.label}<span aria-hidden="true">›</span></Link>)}</nav>
          <p>DevOps, cloud & networks.<br />Based in Ontario, Canada.</p>
        </div>
      </dialog>
    </header>
  )
}
