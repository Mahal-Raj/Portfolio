import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/cn"

interface ArrowLinkProps {
  href: string
  children: React.ReactNode
  className?: string
  external?: boolean
}

export function ArrowLink({ href, children, className, external = false }: ArrowLinkProps) {
  const content = (
    <>
      <span>{children}</span>
      {external ? <ArrowUpRight aria-hidden="true" /> : <ArrowRight aria-hidden="true" />}
    </>
  )

  const styles = cn("arrow-link", className)

  if (external) {
    return <a className={styles} href={href} target="_blank" rel="noreferrer">{content}</a>
  }

  return <Link className={styles} href={href}>{content}</Link>
}
