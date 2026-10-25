import { Suspense } from "react"
import { ArrowUpRight, Mail } from "lucide-react"
import { PageHero } from "@/components/ui/page-hero"
import { CopyEmail } from "@/components/contact/copy-email"
import { ContactForm } from "@/components/contact/contact-form"
import { resumeHref, siteConfig, socialLinks } from "@/data/site"
import { pageMetadata } from "@/lib/metadata"
export const metadata = pageMetadata("Contact", "Contact Sukhraj Singh for DevOps, cloud, networking and infrastructure opportunities.", "/contact")
export default function ContactPage() {
  return <><PageHero eyebrow="Contact" title="Let’s talk." description="An opportunity, a project, or a good technical conversation. I’d love to hear from you." />
    <section className="p-shell p-contact-grid">
      <div><a className="p-email" href={socialLinks.email}><Mail size={25} /><span>{siteConfig.email}</span></a><div className="p-actions"><CopyEmail email={siteConfig.email} /><a className="p-text-link" href={resumeHref} target="_blank" rel="noreferrer">Download résumé <ArrowUpRight size={16} /></a></div>
        <dl className="p-contact-facts"><div><dt>Based in</dt><dd>Ontario, Canada · Eastern Time</dd></div><div><dt>Interested in</dt><dd>Cloud, DevOps, network and infrastructure roles.</dd></div></dl>
        <div className="p-contact-profiles"><a href={socialLinks.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={17} /></a><a href={socialLinks.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={17} /></a><a href={socialLinks.medium} target="_blank" rel="noreferrer">Medium <ArrowUpRight size={17} /></a></div>
      </div>
      <div className="p-message"><h2>Start a conversation.</h2><Suspense fallback={<p>Loading email composer…</p>}><ContactForm /></Suspense></div>
    </section>
  </>
}
