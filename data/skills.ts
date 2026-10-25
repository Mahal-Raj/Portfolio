export interface SkillGroup {
  id: "cloud" | "automation" | "systems" | "networks"
  label: string
  description: string
  skills: Array<{
    name: string
    emphasis: "primary" | "secondary"
    usedIn: string
    projectSlugs: string[]
  }>
}

export const skillGroups: SkillGroup[] = [
  {
    id: "cloud",
    label: "Cloud",
    description: "I use these services and patterns to run observable, repeatable workloads.",
    skills: [
      { name: "AWS", emphasis: "primary", usedIn: "I use it across infrastructure and delivery projects", projectSlugs: ["aws-infrastructure-terraform", "container-delivery-pipeline"] },
      { name: "ECS Fargate", emphasis: "secondary", usedIn: "Container delivery", projectSlugs: ["container-delivery-pipeline"] },
      { name: "ECR", emphasis: "secondary", usedIn: "Container registry", projectSlugs: ["container-delivery-pipeline"] },
      { name: "CloudWatch", emphasis: "secondary", usedIn: "Logs and monitoring", projectSlugs: ["container-delivery-pipeline"] },
      { name: "IAM", emphasis: "secondary", usedIn: "AWS permissions", projectSlugs: ["container-delivery-pipeline"] },
    ],
  },
  {
    id: "automation",
    label: "Automation",
    description: "I turn repeatable operational work into versioned, reviewable systems.",
    skills: [
      { name: "Terraform", emphasis: "primary", usedIn: "Infrastructure as Code", projectSlugs: ["aws-infrastructure-terraform"] },
      { name: "GitHub Actions", emphasis: "primary", usedIn: "Implemented CI and security checks", projectSlugs: ["deployguard-cloud-platform", "customer-application-network-support-lab"] },
      { name: "Shell", emphasis: "secondary", usedIn: "AWS setup and operational scripts", projectSlugs: ["container-delivery-pipeline"] },
      { name: "Git", emphasis: "secondary", usedIn: "Source and delivery workflows", projectSlugs: ["aws-infrastructure-terraform", "container-delivery-pipeline"] },
    ],
  },
  {
    id: "systems",
    label: "Systems",
    description: "I use these operating environments and languages in practical engineering work.",
    skills: [
      { name: "Linux", emphasis: "primary", usedIn: "Cloud and container workflows", projectSlugs: ["aws-infrastructure-terraform", "container-delivery-pipeline"] },
      { name: "Docker", emphasis: "primary", usedIn: "Containerized applications", projectSlugs: ["aws-infrastructure-terraform", "container-delivery-pipeline"] },
      { name: "Python", emphasis: "primary", usedIn: "Incident intelligence, OCR research and test automation", projectSlugs: ["signaldesk-ai", "temporal-consensus-ocr-research"] },
      { name: "Java", emphasis: "secondary", usedIn: "Dependency-aware network diagnostics", projectSlugs: ["customer-application-network-support-lab"] },
      { name: "C++", emphasis: "secondary", usedIn: "Computer science foundations", projectSlugs: [] },
    ],
  },
  {
    id: "networks",
    label: "Networks",
    description: "I use these fundamentals to segment, route, assign and verify traffic.",
    skills: [
      { name: "Cisco", emphasis: "primary", usedIn: "Campus network simulation", projectSlugs: ["segmented-campus-network"] },
      { name: "VLANs", emphasis: "primary", usedIn: "Department segmentation", projectSlugs: ["segmented-campus-network"] },
      { name: "DHCP", emphasis: "secondary", usedIn: "Dynamic addressing", projectSlugs: ["segmented-campus-network"] },
      { name: "Routing", emphasis: "secondary", usedIn: "Inter-VLAN connectivity", projectSlugs: ["segmented-campus-network"] },
    ],
  },
]
