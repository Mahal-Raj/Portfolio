import Link from "next/link"
import { resumeHref, siteConfig, socialLinks } from "@/data/site"
export function SiteFooter() {
  return (
    <footer className="p-footer"><div className="p-shell">
      <div className="p-footer-top">
        <div><Link className="p-wordmark" href="/">Sukhraj Singh<span>.</span></Link><p>Building a career in cloud, DevOps and networks.</p></div>
        <nav aria-label="Explore the portfolio"><Link href="/research">Research</Link><Link href="/skills">Skills</Link><Link href="/education">Education</Link><Link href="/beyond">Beyond work</Link><Link href="/contact">Contact</Link></nav>
        <nav aria-label="Profiles and résumé"><a href={socialLinks.github} target="_blank" rel="noreferrer">GitHub ↗</a><a href={socialLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={socialLinks.medium} target="_blank" rel="noreferrer">Medium ↗</a><a href={resumeHref} target="_blank" rel="noreferrer">Download résumé ↗</a></nav>
      </div>
      <div className="p-footer-bottom"><span>© {new Date().getFullYear()} {siteConfig.name}</span><span>Ontario, Canada</span><a href={socialLinks.email}>Say hello ↗</a></div>
    </div></footer>
  )
}
