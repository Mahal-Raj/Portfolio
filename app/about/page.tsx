import Image from "next/image"
import Link from "next/link"
import { ChevronRight, ArrowUpRight } from "lucide-react"
import { PageHero } from "@/components/ui/page-hero"
import { socialLinks } from "@/data/site"
import { pageMetadata } from "@/lib/metadata"
export const metadata = pageMetadata("About", "From Punjab to Ontario: Sukhraj Singh's journey through Computer Science, network engineering, cloud and creative work.", "/about")
export default function AboutPage() {
  return <>
    <PageHero eyebrow="About me" title={<>A curious mind.<br />A hands-on approach.</>} description="I’m Sukhraj, a Computer Science student at Algoma University and a network lab engineer at Nokia." />
    <section className="p-shell p-about-story">
      <figure className="p-about-photo"><Image src="/images/sukhraj-nokia-group-pic2.png" alt="Group photo at Nokia in front of an optical innovation display" fill sizes="(max-width: 760px) 100vw, 45vw" priority /><figcaption>A moment at Nokia.</figcaption></figure>
      <div className="p-prose"><p className="p-eyebrow">Punjab → Ontario</p><h2>A new place.<br />The same curiosity.</h2><p>I moved from Punjab to Canada to build a future in technology. Studying Computer Science gave me the foundations; research, IT operations and telecom labs gave those ideas a real setting.</p><p>Today, I work with networks and lab systems at Nokia, contribute to AI evaluation, and build projects around reliable software and cloud infrastructure.</p><p>I like the moment when a confusing problem becomes understandable. Trace the connection, test an idea, write down what worked. That&apos;s usually where I start.</p><Link className="p-text-link" href="/experience">See my experience <ChevronRight size={17} /></Link></div>
    </section>
    <section className="p-section p-soft"><div className="p-shell p-about-notes">
      <div><p className="p-eyebrow">What matters to me</p><h2>Useful work.<br />Good people.</h2></div>
      <div><article><h3>Build something you can explain.</h3><p>I care about readable code, repeatable checks and documentation that helps the next person.</p></article><article><h3>Keep room for the rest of life.</h3><p>I write on Medium, paint, and play table tennis, pickleball, chess and the occasional game of bowling.</p></article><div className="p-actions"><Link className="p-text-link" href="/beyond">Beyond work <ChevronRight size={17} /></Link><a className="p-text-link" href={socialLinks.linkedin} target="_blank" rel="noreferrer">Find me on LinkedIn <ArrowUpRight size={17} /></a></div></div>
    </div></section>
  </>
}
