import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, MapPin } from "lucide-react"

export function Experience() {
  const experiences = [
    {
      title: "Research and Teaching Assistant",
      company: "Algoma University",
      location: "Brampton, ON",
      period: "Mar 2023 – Present",
      description:
        "Conducting cutting-edge computer vision research on converting video content into text descriptions, focusing on processing scenes without visible cues. Developing and fine-tuning algorithms using Python, OpenCV, and TensorFlow for accurate video-to-text transformations. Assisting over 100 undergraduate students in programming, data structures, and machine learning courses while collaborating with faculty to publish research findings.",
      technologies: ["Python", "OpenCV", "TensorFlow", "Computer Vision", "AI", "Machine Learning"],
    },
    {
      title: "Store Planning and Fixture Clerk",
      company: 'Toys"R"Us',
      location: "Brampton, ON",
      period: "July 2023 – Present",
      description:
        "Coordinated layout and setup of 20+ store sections, ensuring optimal space utilization and customer flow in compliance with corporate standards. Managed inventory and fixture installation for new and remodeled stores, achieving 15% faster setup times by streamlining workflows. Collaborated with cross-functional teams to execute promotional displays, leading to a 10% increase in seasonal sales.",
      technologies: ["Project Management", "Inventory Management", "Process Optimization", "Team Collaboration"],
    },
  ]

  return (
    <section id="experience" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-balance">Work Experience</h2>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl mb-2">{exp.title}</CardTitle>
                      <div className="text-lg font-semibold text-primary">{exp.company}</div>
                    </div>
                    <div className="flex flex-col sm:items-end gap-2">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4 mr-2" />
                        {exp.period}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {exp.location}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed text-pretty">{exp.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, techIndex) => (
                      <Badge key={techIndex} variant="secondary">
                        {tech}
                      </Badge>
                    ))}
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
