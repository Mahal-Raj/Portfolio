import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Github } from "lucide-react"

export function Projects() {
  const projects = [
    {
      title: "Video-to-Headline Extractor",
      description:
        "An innovative AI system that processes news videos and extracts headlines using advanced computer vision and natural language processing techniques. Designed as an accessibility tool for visually impaired individuals and older adults.",
      image: "/ai-video-processing-interface-with-headlines.jpg",
      technologies: ["Python", "OpenCV", "TensorFlow", "NLP", "Audio Processing"],
      liveUrl: "#",
      githubUrl: "https://github.com/Mahal-Raj",
      achievements: [
        "85% accuracy in text recognition across diverse video formats",
        "Integrated audio playback for hands-free experience",
        "Optimized for fast-moving visual content processing",
      ],
    },
  ]

  return (
    <section id="projects" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-balance">Featured Projects</h2>
          <div className="grid md:grid-cols-1 lg:grid-cols-1 gap-8 max-w-2xl mx-auto">
            {projects.map((project, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg overflow-hidden group hover:shadow-xl transition-shadow duration-300"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <CardTitle className="text-xl">{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed text-pretty">{project.description}</p>

                  {project.achievements && (
                    <div className="mb-4">
                      <h4 className="font-semibold mb-2 text-sm">Key Achievements:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {project.achievements.map((achievement, achIndex) => (
                          <li key={achIndex} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Live Demo
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        Code
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
