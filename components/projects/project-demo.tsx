import type { Project } from "@/data/projects"
import { ArrowUpRight } from "lucide-react"
type ProjectDemoData = NonNullable<Project["demo"]>
export function ProjectDemo({ demo }: { demo: ProjectDemoData }) {
  return <section className="p-demo" id="demo">
    <div className="p-demo-heading"><h2>See it in action.</h2><span>{demo.duration} · {demo.label?.includes("WALKTHROUGH") ? "Visual walkthrough" : "Local recording"}</span></div>
    <figure><video aria-label={demo.title} controls playsInline poster={demo.poster} preload="none"><source src={demo.src} type="video/mp4" />Your browser cannot play this video. <a href={demo.src}>Open the MP4.</a></video><figcaption>{demo.sequence}</figcaption></figure>
    {demo.interactive ? <a className="p-text-link" href={demo.interactive.href} target="_blank" rel="noreferrer">{demo.interactive.label}<ArrowUpRight size={16} /></a> : null}
    <details className="p-demo-notes"><summary>About this demonstration</summary><p>{demo.caption}</p><p>{demo.sequence}</p></details>
  </section>
}
