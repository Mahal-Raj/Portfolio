import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, PlayCircle } from "lucide-react"

const projects = [
  {
    title: "DeployGuard Cloud Platform",
    eyebrow: "FLAGSHIP · DEVOPS / CLOUD",
    description: "An SLO-driven progressive delivery control plane that promotes canaries through staged traffic gates and automatically rolls back unhealthy releases.",
    video: "/demos/deployguard-demo.mp4",
    poster: "/demos/source/deployguard-01.png",
    technologies: ["AWS EKS", "Terraform", "Kubernetes", "Helm", "Docker", "Prometheus", "GitHub Actions"],
    githubUrl: "https://github.com/Mahal-Raj/deployguard-cloud-platform",
    achievements: [
      "Working 10% → 25% → 50% → 100% canary controller with SLO gates",
      "Automatic rollback, Prometheus metrics, and an auditable release timeline",
      "Non-root container, probes, limits, HPA, PDB, NetworkPolicy, policy checks, and Trivy CI",
    ],
  },
  {
    title: "SignalDesk AI",
    eyebrow: "FLAGSHIP · APPLIED AI",
    description: "A privacy-first incident intelligence system that classifies alerts, routes responders, explains each prediction, and retrieves similar resolved cases.",
    video: "/demos/signaldesk-demo.mp4",
    poster: "/demos/source/signaldesk-01.png",
    technologies: ["Python", "scikit-learn", "NLP", "Explainable AI", "Vector Retrieval", "Docker", "CI/CD"],
    githubUrl: "https://github.com/Mahal-Raj/signaldesk-ai",
    achievements: [
      "81.7% accuracy and 81.7% macro-F1 under 5-fold cross-validation",
      "Redacts emails, IP addresses, and common secret formats before inference",
      "Combines statistical NLP, auditable domain signals, runbooks, and similar-incident retrieval",
    ],
  },
  {
    title: "Video-to-Headline Extractor",
    eyebrow: "COMPUTER VISION / ACCESSIBILITY",
    description: "An accessibility-focused system that extracts news headlines from video using computer vision and natural-language processing.",
    image: "/ai-video-processing-interface-with-headlines.jpg",
    technologies: ["Python", "OpenCV", "TensorFlow", "NLP", "Audio Processing"],
    githubUrl: "https://github.com/Mahal-Raj/NewsHeadlinesExtractor_OCR",
    achievements: ["Extracts text from fast-moving visual content", "Provides audio playback for a hands-free experience"],
  },
]

export function Projects() {
  return (
    <section id="projects" className="bg-secondary/20 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <p className="mb-3 text-xs font-semibold tracking-[0.24em] text-primary">ENGINEERED, TESTED, DOCUMENTED</p>
            <h2 className="text-balance text-3xl font-bold sm:text-4xl">Featured Projects</h2>
            <p className="mt-4 text-muted-foreground">Real systems with measurable behavior—not tutorial clones. Play each flagship demo to see the workflow.</p>
          </div>
          <div className="grid gap-8 lg:grid-cols-2">
            {projects.map((project, index) => (
              <Card key={project.title} className={`group overflow-hidden border shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${index === 2 ? "lg:col-span-2 lg:grid lg:grid-cols-[.75fr_1.25fr]" : ""}`}>
                <div className="relative overflow-hidden bg-black">
                  {project.video ? (
                    <video className="aspect-video h-full w-full object-cover" controls muted playsInline preload="metadata" poster={project.poster} aria-label={`${project.title} working demo`}>
                      <source src={project.video} type="video/mp4" />
                      Your browser does not support embedded video.
                    </video>
                  ) : (
                    <img src={project.image || "/placeholder.svg"} alt={project.title} className="aspect-video h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]" />
                  )}
                  <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-[10px] font-bold tracking-[0.16em] text-foreground backdrop-blur">{project.eyebrow}</div>
                </div>
                <div>
                  <CardHeader><CardTitle className="text-2xl">{project.title}</CardTitle></CardHeader>
                  <CardContent>
                    <p className="mb-5 leading-relaxed text-muted-foreground">{project.description}</p>
                    <ul className="mb-5 space-y-2 text-sm text-muted-foreground">
                      {project.achievements.map((achievement) => <li key={achievement} className="flex items-start gap-2"><span className="mt-1 text-primary">●</span><span>{achievement}</span></li>)}
                    </ul>
                    <div className="mb-5 flex flex-wrap gap-2">{project.technologies.map((technology) => <Badge key={technology} variant="secondary">{technology}</Badge>)}</div>
                    <div className="flex flex-wrap gap-3">
                      {project.video && <Button size="sm" variant="secondary" asChild><a href={project.video} target="_blank" rel="noopener noreferrer"><PlayCircle className="mr-2 h-4 w-4" /> Full Demo</a></Button>}
                      <Button size="sm" variant="outline" className="bg-transparent" asChild><a href={project.githubUrl} target="_blank" rel="noopener noreferrer"><Github className="mr-2 h-4 w-4" /> Source Code</a></Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
