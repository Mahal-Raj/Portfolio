import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Skills } from "@/components/skills"
import { Projects } from "@/components/projects"
import { Experience } from "@/components/experience"
import { Contact } from "@/components/contact"
import { Navigation } from "@/components/navigation"
import { Education } from "@/components/education"
import { Certificates } from "@/components/certificates"
import { ThemeSwitcher } from "@/components/theme-switcher"

export default function Home() {
  return (
    <main className="min-h-screen">
      <ThemeSwitcher />
      <Navigation />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Education />
      <Certificates />
      <Contact />

      <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border/50 py-2 px-4">
        <p className="text-sm text-center text-muted-foreground">
          Don't like the color palette? Just refresh the page until you find one you love! 🎨
        </p>
      </div>
    </main>
  )
}
