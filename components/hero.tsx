"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown, Github, Linkedin, Mail, Download } from "lucide-react"

export function Hero() {
  const scrollToProjects = () => {
    const projectsSection = document.getElementById("projects")
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const downloadCV = () => {
    // Create a simple CV content
    const cvContent = `
SUKHRAJ SINGH
Computer Science Student & Research Assistant

Contact Information:
Phone: +1-437-556-3743
Email: mahalraj0001@gmail.com
LinkedIn: https://www.linkedin.com/in/sukhraj-singh
GitHub: https://github.com/Mahal-Raj

Education:
Bachelor of Computer Science (Current)
Algoma University, Sault Ste. Marie, ON
GPA: 3.9/4.0
Expected Graduation: 2025

Computer Programming Diploma (Completed)
Lambton College, Sarnia, ON
GPA: 9.5/10.0
Graduated: 2023

Experience:
Research and Teaching Assistant
Algoma University (Mar 2023 – Present)
- Conduct computer vision research using OpenCV and TensorFlow
- Assist 100+ students with programming concepts and debugging
- Collaborate on AI projects with 85% accuracy improvements

Store Planning and Fixture Clerk
Toys"R"Us (July 2023 – Present)
- Manage inventory and store layout optimization
- Coordinate with teams to improve operational efficiency

Projects:
Video-to-Headline Extractor (Jan 2024)
- Developed AI system for news video processing
- Technologies: Python, OpenCV, TensorFlow
- Achieved 85% accuracy in text recognition
- Designed for accessibility (visually impaired users)

Skills:
Programming: Java, Python, JavaScript, SQL
Frameworks: Spring Boot, React.js, TensorFlow, OpenCV
Tools: Git, AWS, Docker, IntelliJ IDEA
Soft Skills: Communication, Teamwork, Problem-solving
    `

    const blob = new Blob([cvContent], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "Sukhraj_Singh_CV.txt"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-background to-secondary/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-balance mb-6">
            Hi, I'm <span className="text-primary">Sukhraj Singh</span>
          </h1>
          <p className="text-xl sm:text-2xl text-muted-foreground mb-8 text-pretty">
            A passionate DevOps engineer and CS student creating scalable and efficient digital solutions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="min-w-[160px]" onClick={scrollToProjects}>
              View My Work
            </Button>
            <Button variant="outline" size="lg" className="min-w-[160px] bg-transparent" onClick={downloadCV}>
              <Download className="mr-2 h-4 w-4" />
              Download CV
            </Button>
          </div>
          <div className="flex justify-center space-x-6">
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
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="h-6 w-6 text-muted-foreground" />
      </div>
    </section>
  )
}
