import type { MetadataRoute } from "next"
import { projects } from "@/data/projects"
import { siteConfig } from "@/data/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/about", "/experience", "/projects", "/research", "/skills", "/education", "/beyond", "/contact"]
  const projectRoutes = projects.map((project) => `/projects/${project.slug}`)
  return [...routes, ...projectRoutes].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: route.startsWith("/projects/") ? "monthly" : "weekly",
    priority: route === "" ? 1 : route === "/projects" ? 0.9 : 0.75,
  }))
}
