import { cn } from "@/lib/cn"
interface PageHeroProps {
  eyebrow: string
  title: React.ReactNode
  description?: string
  children?: React.ReactNode
  dark?: boolean
  className?: string
}
export function PageHero({ eyebrow, title, description, children, className }: PageHeroProps) {
  return <section className={cn("p-page-hero", className)}><div className="p-shell"><p className="p-eyebrow">{eyebrow}</p><h1>{title}</h1>{description ? <p className="p-page-description">{description}</p> : null}{children}</div></section>
}
