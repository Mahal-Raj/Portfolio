import Image from "next/image"
import Link from "next/link"
import { ChevronRight, ArrowUpRight } from "lucide-react"
import { IntroStory } from "@/components/media/intro-story"
import { ProjectCard } from "@/components/projects/project-card"
import { projects } from "@/data/projects"
import { resumeHref, socialLinks } from "@/data/site"
const featured = ["deployguard-cloud-platform", "signaldesk-ai", "customer-application-network-support-lab"].map((slug) => projects.find((project) => project.slug === slug)!)
export default function HomePage() {
  return <>
    <section className="p-hero"><div className="p-shell p-hero-grid">
      <div className="p-hero-copy"><p className="p-eyebrow">Hi, I&apos;m Sukhraj.</p><h1>DevOps&nbsp;· Cloud&nbsp;· <span>Network Automation</span></h1><p className="p-hero-intro">Automation engineer at Nokia.</p><div className="p-actions"><Link className="p-button" href="#work">Explore my work</Link><a className="p-text-link" href={resumeHref} target="_blank" rel="noreferrer">View résumé <ArrowUpRight size={17} /></a></div><p className="p-hero-location"><span />Ontario, Canada · Computer Science at Algoma</p></div>
      <div className="p-hero-story"><IntroStory /></div>
    </div></section>
    <section className="p-section p-work-section" id="work"><div className="p-shell">
      <div className="p-section-head"><div><p className="p-eyebrow">Selected work</p><h2>Built to solve something.</h2></div><Link className="p-text-link" href="/projects">All {projects.length} projects <ChevronRight size={17} /></Link></div>
      <div className="p-featured-grid">{featured.map((project, index) => <ProjectCard key={project.slug} project={project} featured={index === 0} />)}</div>
    </div></section>
    <section className="p-section"><div className="p-shell p-experience-preview">
      <div><p className="p-eyebrow">Experience</p><h2>Learning in<br />the real world.</h2><p>From telecom labs to AI evaluation.<br />Hands-on work with people who depend on it.</p><Link className="p-text-link" href="/experience">View all experience <ChevronRight size={17} /></Link></div>
      <div className="p-home-roles">
        <Link href="/experience#nokia"><div><strong>Nokia</strong><span>Network Lab Engineer · Student Ambassador</span><span>Automation Engineer Co-op · Jan–Apr 2027</span></div><div><small>Apr–Dec 2026</small><ChevronRight size={19} /></div></Link>
        <Link href="/experience"><div><strong>Syncrope</strong><span>AI Evaluation · Expert Contributor</span></div><div><small>Apr 2026 — Present</small><ChevronRight size={19} /></div></Link>
        <Link href="/experience#algoma-university"><div><strong>Algoma University</strong><span>Research Assistant · Teaching Assistant</span></div><div><small>Sep 2024 — Sep 2025</small><ChevronRight size={19} /></div></Link>
      </div>
    </div></section>
    <section className="p-personal-section" id="my-story"><div className="p-shell p-personal-grid">
      <figure className="p-personal-photo"><Image src="/images/sukhraj-speaking-pic1.png" alt="Sukhraj speaking at an event" fill sizes="(max-width: 760px) 100vw, 45vw" /></figure>
      <div className="p-personal-copy"><p className="p-eyebrow">A little more human.</p><h2>From Punjab.<br />With curiosity.</h2><p>I moved to Canada to build a future in technology. Outside work, you&apos;ll find me painting, writing on Medium, or looking for someone to play a match with.</p><div className="p-actions"><Link className="p-text-link" href="/about">My story <ChevronRight size={17} /></Link><Link className="p-text-link" href="/beyond">Beyond work <ChevronRight size={17} /></Link></div></div>
    </div></section>
    <section className="p-contact-banner p-shell"><p className="p-eyebrow">Good work starts with a conversation.</p><h2>Let&apos;s build what&apos;s next.</h2><p>Open to opportunities in cloud, DevOps and infrastructure.</p><div className="p-actions"><Link className="p-button" href="/contact">Get in touch</Link><a className="p-text-link" href={socialLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={17} /></a></div></section>
  </>
}
