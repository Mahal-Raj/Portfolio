import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ArrowUpRight, ChevronRight, Play } from "lucide-react"
import { ProjectDemo } from "@/components/projects/project-demo"
import { projects, getProject } from "@/data/projects"
import { projectPresentation } from "@/data/presentation"
import { siteConfig } from "@/data/site"
export function generateStaticParams() { return projects.map((project) => ({ slug: project.slug })) }
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return {}
  const title = `${projectPresentation[project.visual].title} — Case Study`
  const url = `${siteConfig.url}/projects/${project.slug}`
  return { title, description: project.summary, alternates: { canonical: url }, openGraph: { title, description: project.summary, url, type: "article" }, twitter: { card: "summary_large_image", title, description: project.summary } }
}
export default async function ProjectCaseStudy({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()
  const presentation = projectPresentation[project.visual]
  const index = projects.findIndex((item) => item.slug === slug)
  const nextProject = projects[(index + 1) % projects.length]
  return <article className="p-case">
    <header className="p-shell p-case-header">
      <Link className="p-case-back" href="/projects"><ArrowLeft size={16} /> All projects</Link>
      <p className="p-eyebrow">{presentation.category} · {project.date}</p>
      <h1>{presentation.title}</h1><p className="p-case-lead">{presentation.line}</p>
      <div className="p-actions">{project.demo ? <a className="p-button" href="#demo"><Play size={15} /> Watch demo</a> : null}<a className={project.demo ? "p-text-link" : "p-button"} href={project.repository} target="_blank" rel="noreferrer">View code <ArrowUpRight size={16} /></a>{project.report ? <a className="p-text-link" href={project.report} target="_blank" rel="noreferrer">Read paper <ArrowUpRight size={16} /></a> : null}</div>
      <div className="p-case-meta"><span>{presentation.status}</span><span>{project.ownership}</span></div>
    </header>
    <div className="p-shell p-case-body">
      <section className="p-case-summary" aria-label="Project summary">
        <div><h2>My contribution</h2><p>{project.contribution}</p></div>
        <div><h2>Evidence</h2><p>{project.evidence}</p></div>
        <div className="p-case-limit"><h2>Scope & limitations</h2><p>{project.limitation}</p></div>
      </section>
      <ul className="p-tech-list" aria-label="Technologies">{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
      {project.demo ? <ProjectDemo demo={project.demo} /> : <section className="p-research-summary"><h2>The research, briefly.</h2><p>{project.overview}</p><dl>{project.facts.map((fact) => <div key={fact.label}><dt>{fact.label}</dt><dd>{fact.value}</dd></div>)}</dl></section>}
      <section className="p-case-details" aria-label="More project details">
        <details><summary>The problem & approach<span aria-hidden="true">+</span></summary><div className="p-detail-content"><h3>The problem</h3><p>{project.problem}</p><h3>The approach</h3><p>{project.overview}</p></div></details>
        <details><summary>How it works<span aria-hidden="true">+</span></summary><div className="p-detail-content"><ol className="p-flow">{project.architecture.map((step, i) => <li key={step}><span>{String(i + 1).padStart(2, "0")}</span>{step}</li>)}</ol><ul>{project.built.map((item) => <li key={item}>{item}</li>)}</ul></div></details>
        <details><summary>Technical decisions & lessons<span aria-hidden="true">+</span></summary><div className="p-detail-content"><div className="p-decisions">{project.choices.map((choice) => <article key={choice.name}><h3>{choice.name}</h3><p>{choice.reason}</p></article>)}</div><h3>Challenges</h3><ul>{project.challenges.map((item) => <li key={item}>{item}</li>)}</ul><h3>What I learned</h3><ul>{project.learned.map((item) => <li key={item}>{item}</li>)}</ul>{project.snippet ? <div className="p-code"><p>{project.snippet.label} · {project.snippet.language}</p><pre><code>{project.snippet.code}</code></pre></div> : null}</div></details>
      </section>
      <nav className="p-case-next" aria-label="More projects"><Link className="p-text-link" href="/projects"><ArrowLeft size={16} /> All projects</Link><Link href={`/projects/${nextProject.slug}`}><span>Next project</span><strong>{projectPresentation[nextProject.visual].title}<ChevronRight size={20} /></strong></Link></nav>
    </div>
  </article>
}
