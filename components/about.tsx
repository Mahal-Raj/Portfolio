import { Card, CardContent } from "@/components/ui/card"

export function About() {
  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-balance">About Me</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <p className="text-lg text-muted-foreground leading-relaxed mb-6 text-pretty">
                    I'm Sukhraj Singh, a dedicated Computer Science student at Algoma University with a passion for AI
                    and computer vision technologies. Currently pursuing my Bachelor's degree with a 3.9 GPA, I
                    specialize in developing innovative solutions that bridge the gap between complex algorithms and
                    real-world applications.
                  </p>
                  <p className="text-lg text-muted-foreground leading-relaxed text-pretty">
                    As a Research and Teaching Assistant, I'm actively contributing to cutting-edge computer vision
                    research while helping over 100 students master programming concepts. My expertise spans from Python
                    and Java development to advanced machine learning frameworks like TensorFlow and OpenCV.
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <Card className="text-center p-6 border-0 shadow-lg">
                  <CardContent className="p-0">
                    <div className="text-3xl font-bold text-primary mb-2">3.9</div>
                    <div className="text-sm text-muted-foreground">GPA</div>
                  </CardContent>
                </Card>
                <Card className="text-center p-6 border-0 shadow-lg">
                  <CardContent className="p-0">
                    <div className="text-3xl font-bold text-primary mb-2">100+</div>
                    <div className="text-sm text-muted-foreground">Students Helped</div>
                  </CardContent>
                </Card>
              </div>
              <Card className="text-center p-6 border-0 shadow-lg">
                <CardContent className="p-0">
                  <div className="text-3xl font-bold text-primary mb-2">85%</div>
                  <div className="text-sm text-muted-foreground">AI Model Accuracy</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
