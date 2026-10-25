import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { SiteHeader } from "@/components/layout/site-header"
import { SiteFooter } from "@/components/layout/site-footer"
import { PortfolioHelp } from "@/components/help/portfolio-help"
import { siteConfig, socialLinks } from "@/data/site"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: siteConfig.title, template: "%s · Sukhraj Singh" },
  description: siteConfig.description,
  keywords: ["Sukhraj Singh", "DevOps", "Cloud Infrastructure", "Network Engineering", "Automation", "AWS", "Terraform", "Docker"],
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    locale: "en_CA",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: siteConfig.title, description: siteConfig.description },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  colorScheme: "light",
  themeColor: "#fbfbfd",
}

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  url: siteConfig.url,
  email: siteConfig.email,
  sameAs: [socialLinks.github, socialLinks.linkedin, socialLinks.medium],
  knowsAbout: ["DevOps", "Cloud infrastructure", "Network engineering", "Automation", "Linux", "Containers"],
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.variable} ${GeistMono.variable}`}>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <SiteHeader />
        <main id="main-content">{children}</main>
        <SiteFooter />
        <PortfolioHelp />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }} />
        {process.env.VERCEL ? <Analytics /> : null}
      </body>
    </html>
  )
}
