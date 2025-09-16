import { GraduationCap, Calendar, Award } from "lucide-react"

export function Education() {
  return (
    <section id="education" className="py-20 bg-secondary/5">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Education</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My academic journey in computer science and technology
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Current Education */}
          <div className="bg-background rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="text-xl font-semibold">Bachelor of Computer Science</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    2023 - 2025 (Expected)
                  </div>
                </div>
                <p className="text-primary font-medium mb-2">Algoma University, Sault Ste. Marie, ON</p>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-primary mr-1" />
                    <span className="text-sm font-medium">GPA: 3.9/4.0</span>
                  </div>
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">Current</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Focusing on software engineering, artificial intelligence, and computer vision. Active in research
                  projects and maintaining excellent academic standing.
                </p>
              </div>
            </div>
          </div>

          {/* Completed Education */}
          <div className="bg-background rounded-lg p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                  <h3 className="text-xl font-semibold">Computer Programming Diploma</h3>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    Graduated 2023
                  </div>
                </div>
                <p className="text-primary font-medium mb-2">Lambton College, Sarnia, ON</p>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center">
                    <Award className="h-4 w-4 text-primary mr-1" />
                    <span className="text-sm font-medium">GPA: 9.5/10.0</span>
                  </div>
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Completed</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  Comprehensive program covering programming fundamentals, web development, database management, and
                  software development methodologies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
