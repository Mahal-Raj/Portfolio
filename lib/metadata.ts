import type { Metadata } from "next"
import { siteConfig } from "@/data/site"

export function pageMetadata(title: string, description: string, path: string): Metadata {
  const url = new URL(path, siteConfig.url).toString()
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  }
}
