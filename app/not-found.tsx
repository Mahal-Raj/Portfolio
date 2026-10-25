import Link from "next/link"
export default function NotFound() {
  return <section className="p-shell p-not-found"><p className="p-eyebrow">404</p><h1>This page took<br />a different route.</h1><p>Let&apos;s get you back to the work.</p><Link className="p-button" href="/projects">Explore projects</Link></section>
}
