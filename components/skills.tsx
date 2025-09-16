import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export function Skills() {
  const skillCategories = [
    {
      title: "Programming Languages",
      skills: [
        { name: "Java 8+", level: 90 },
        { name: "Python", level: 85 },
        { name: "JavaScript ES6", level: 80 },
        { name: "SQL", level: 75 },
      ],
    },
    {
      title: "Frameworks & Libraries",
      skills: [
        { name: "Spring Boot", level: 85 },
        { name: "React.js", level: 80 },
        { name: "Node.js", level: 75 },
        { name: "Express", level: 70 },
        { name: "TensorFlow", level: 80 },
        { name: "OpenCV", level: 85 },
      ],
    },
    {
      title: "Tools & Technologies",
      skills: [
        { name: "Git", level: 90 },
        { name: "AWS", level: 70 },
        { name: "Docker", level: 65 },
        { name: "IntelliJ/Eclipse", level: 85 },
        { name: "Unix/Linux", level: 75 },
        { name: "Maven", level: 70 },
      ],
    },
  ]

  const softSkills = [
    "Communication",
    "Teamwork",
    "Problem Solver",
    "Adaptability",
    "Collaborative",
    "Critical Thinking",
  ]

  return (
    <section id="skills" className="py-20 bg-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-balance">Skills & Expertise</h2>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {skillCategories.map((category, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl text-center">{category.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skillIndex} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-muted-foreground">{skill.level}%</span>
                      </div>
                      <Progress value={skill.level} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl text-center">Soft Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 justify-center">
                {softSkills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm py-2 px-4">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
