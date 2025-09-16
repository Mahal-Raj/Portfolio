import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award } from "lucide-react"

export function Certificates() {
  return (
    <section id="certificates" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-balance">Certificates & Achievements</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle className="text-lg">Dean's List</CardTitle>
                    <p className="text-muted-foreground">Algoma University</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Achieved exceptional academic performance with a 3.9/4.0 GPA in Computer Science program.
                </p>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Academic Excellence
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle className="text-lg">Research Publication</CardTitle>
                    <p className="text-muted-foreground">Computer Vision Research</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Contributing to cutting-edge research on video-to-text conversion using AI and computer vision
                  technologies.
                </p>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Research & Development
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle className="text-lg">Teaching Excellence</CardTitle>
                    <p className="text-muted-foreground">Algoma University</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Successfully assisted over 100 students in programming, data structures, and machine learning courses.
                </p>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Education & Mentoring
                </Badge>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-primary" />
                  <div>
                    <CardTitle className="text-lg">Outstanding Diploma Graduate</CardTitle>
                    <p className="text-muted-foreground">Zenith Technosoft Institution</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">
                  Graduated with exceptional performance achieving 9.5/10 GPA in Computer Application program.
                </p>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  Academic Achievement
                </Badge>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
