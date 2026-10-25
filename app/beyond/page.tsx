import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, ChevronRight } from "lucide-react"
import { PageHero } from "@/components/ui/page-hero"
import { articles } from "@/data/presentation"
import { socialLinks } from "@/data/site"
import { pageMetadata } from "@/lib/metadata"
export const metadata = pageMetadata("Beyond Work", "Writing, paintings and the things Sukhraj Singh enjoys away from the terminal.", "/beyond")
const art = [
  { src: "/images/paintings/paint1.png", title: "Blue texture study", medium: "Mixed media" },
  { src: "/images/paintings/paint2.png", title: "Red tulips", medium: "Textured painting" },
  { src: "/images/paintings/paint3.png", title: "Hedgehog study", medium: "Pencil drawing" },
]
export default function BeyondPage() {
  return <>
    <PageHero eyebrow="Beyond work" title="A little less screen time." description="Writing to make sense of things. Painting to slow down. A good game whenever there’s a chance." />
    <section className="p-shell p-section p-writing" id="writing"><div className="p-section-head"><div><p className="p-eyebrow">On Medium</p><h2>Notes from the journey.</h2></div><a className="p-text-link" href={socialLinks.medium} target="_blank" rel="noreferrer">All writing <ArrowUpRight size={16} /></a></div><div className="p-article-list">{articles.map((article) => <a key={article.href} href={article.href} target="_blank" rel="noreferrer"><span>{article.tag}</span><h3>{article.title}</h3><time>{article.date}</time><ArrowUpRight size={20} /></a>)}</div></section>
    <section className="p-section p-soft" id="painting"><div className="p-shell"><div className="p-section-head"><div><p className="p-eyebrow">Things I make by hand</p><h2>A different kind of creating.</h2></div><p>Colour, texture and a little patience.</p></div><div className="p-art-gallery">{art.map((piece) => <figure key={piece.src}><a href={piece.src} target="_blank" rel="noreferrer" aria-label={`Enlarge ${piece.title}`}><Image src={piece.src} alt={piece.title} fill sizes="(max-width: 600px) 100vw, 33vw" /></a><figcaption><strong>{piece.title}</strong><span>{piece.medium} · Undated</span></figcaption></figure>)}</div></div></section>
    <section className="p-shell p-section p-play" id="play"><figure><Image src="/images/intro-story/story-15.webp" alt="Sukhraj at a bowling alley" fill sizes="(max-width: 760px) 100vw, 45vw" /></figure><div><p className="p-eyebrow">Off the clock</p><h2>Always up<br />for a match.</h2><p>Table tennis, pickleball, chess, bowling. I like a little friendly competition and a good reason to step away from the keyboard.</p><Link className="p-text-link" href="/contact?subject=match">Challenge accepted <ChevronRight size={17} /></Link></div></section>
  </>
}
