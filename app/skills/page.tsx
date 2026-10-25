import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { PageHero } from "@/components/ui/page-hero"
import { skillGroups } from "@/data/skills"
import { projectPresentation } from "@/data/presentation"
import { projects } from "@/data/projects"
import { pageMetadata } from "@/lib/metadata"
export const metadata = pageMetadata("Skills", "Cloud, automation, systems and networking skills connected to Sukhraj Singh's project work.", "/skills")
export default function SkillsPage() {
  return <><PageHero eyebrow="Skills" title="Tools I put to work." description="Organized by what they help me do, with project links you can explore." />
    <section className="p-shell p-section p-skills-grid">{skillGroups.map((group) => {
      const related = [...new Set(group.skills.flatMap((skill) => skill.projectSlugs))].slice(0, 3)
      return <article className="p-skill-group" key={group.id}><h2>{group.label}</h2><ul className="p-skill-list">{group.skills.map((skill) => <li key={skill.name}>{skill.name}</li>)}</ul><p className="p-eyebrow">In practice</p><div className="p-evidence-links">{related.map((slug) => { const project = projects.find((item) => item.slug === slug)!; return <Link key={slug} href={`/projects/${slug}`}>{projectPresentation[project.visual].title}<ArrowUpRight size={16} /></Link> })}</div></article>
    })}</section>
    <div className="p-shell p-small-note">Project pages distinguish implemented tools from infrastructure designs and experiments.</div>
  </>
}
