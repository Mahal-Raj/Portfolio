"use client"
import { useState } from "react"
import { projects } from "@/data/projects"
import { ProjectCard } from "@/components/projects/project-card"
const filters = ["All work", "Cloud & DevOps", "AI & Research", "Networking", "Software"] as const
type Filter = typeof filters[number]
export function ProjectFilterGrid() {
  const [active, setActive] = useState<Filter>("All work")
  const filtered = projects.filter((project) => {
    if (active === "Cloud & DevOps") return project.categories.some((category) => category === "Cloud" || category === "DevOps")
    if (active === "AI & Research") return project.categories.includes("AI")
    if (active === "Networking") return project.categories.includes("Networking")
    if (active === "Software") return project.categories.includes("Software")
    return true
  })
  return <><div className="p-filter-row"><div className="p-filters" role="group" aria-label="Filter projects">{filters.map((filter) => <button key={filter} type="button" aria-pressed={active === filter} onClick={() => setActive(filter)}>{filter}</button>)}</div><p className="p-count" role="status">{filtered.length} projects</p></div><div className="p-project-grid">{filtered.map((project) => <ProjectCard key={project.slug} project={project} />)}</div></>
}
