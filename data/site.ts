export const siteConfig = {
  name: "Sukhraj Singh",
  title: "Sukhraj Singh — DevOps, Cloud & Network Engineer",
  description:
    "I explore DevOps, cloud infrastructure, networking, automation and systems engineering through practical work.",
  url: "https://portfolio-singhsukhraj.vercel.app",
  email: "mahalraj0001@gmail.com",
}

export const socialLinks = {
  github: "https://github.com/Mahal-Raj",
  linkedin: "https://www.linkedin.com/in/sukhrajsingh0001/",
  medium: "https://medium.com/@mahalraj0001",
  email: `mailto:${siteConfig.email}`,
} as const

export const resumeHref = "/Sukhraj-Singh-Resume.pdf"

export const desktopNavigation = [
  { label: "Projects", href: "/projects", external: false },
  { label: "Research", href: "/research", external: false },
  { label: "Experience", href: "/experience", external: false },
  { label: "Resume", href: resumeHref, external: true },
  { label: "Contact", href: "/contact", external: false },
] as const

export const navigation = [
  { number: "01", label: "Home", href: "/" },
  { number: "02", label: "About", href: "/about" },
  { number: "03", label: "Experience", href: "/experience" },
  { number: "04", label: "Projects", href: "/projects" },
  { number: "05", label: "Research", href: "/research" },
  { number: "06", label: "Skills", href: "/skills" },
  { number: "07", label: "Education", href: "/education" },
  { number: "08", label: "Beyond the Terminal", href: "/beyond" },
  { number: "09", label: "Contact", href: "/contact" },
] as const
