import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, Github, Linkedin } from "lucide-react"

export function Contact() {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-balance">Get In Touch</h2>
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Let's work together</h3>
              <p className="text-muted-foreground mb-8 leading-relaxed text-pretty">
                I'm a Computer Science student and Research Assistant passionate about AI and computer vision. Always
                interested in new opportunities, research collaborations, and exciting projects. Whether you have a
                question or just want to connect, I'll get back to you!
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-primary mr-3" />
                  <a href="mailto:mahalraj0001@gmail.com" className="hover:text-primary transition-colors">
                    mahalraj0001@gmail.com
                  </a>
                </div>
                <div className="flex items-center">
                  <Phone className="h-5 w-5 text-primary mr-3" />
                  <a href="tel:+14375563743" className="hover:text-primary transition-colors">
                    +1-437-556-3743
                  </a>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 text-primary mr-3" />
                  <span>Toronto, Canada</span>
                </div>
              </div>

              <div className="flex space-x-4">
                <a
                  href="https://github.com/Mahal-Raj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="h-6 w-6" />
                </a>
                <a
                  href="https://www.linkedin.com/in/sukhraj-singh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
                <a
                  href="mailto:mahalraj0001@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  <Mail className="h-6 w-6" />
                </a>
              </div>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Send me a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Input placeholder="Your Name" />
                    </div>
                    <div>
                      <Input type="email" placeholder="Your Email" />
                    </div>
                  </div>
                  <div>
                    <Input placeholder="Subject" />
                  </div>
                  <div>
                    <Textarea placeholder="Your Message" rows={5} />
                  </div>
                  <Button className="w-full">Send Message</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
