export interface ExperienceItem {
  company: string
  role: string
  team?: string
  employment: string
  period: string
  location: string
  highlights: [string, string, string]
  skills: string[]
  skillsLabel?: string
  plannedUntil?: string
}

export const experience: ExperienceItem[] = [
  {
    company: "Nokia",
    role: "Automation Engineer",
    employment: "Co-op",
    period: "Jan 2027 - Apr 2027",
    location: "Ottawa, Canada",
    // Draft scope based on Nokia's matching Jan–Apr 2027 posting, job 40892:
    // https://jobs.nokia.com/en/sites/CX_1/job/40892/
    // Keep this proposed scope labelled until the accepted co-op term ends.
    highlights: [
      "Developed Python and Ansible scripts to support IP network automation and customer deployments.",
      "Worked with senior engineers on custom tools and orchestration workflows for Nokia's data centre solutions.",
      "Supported automation projects involving OpenStack and Kubernetes, building practical experience with cloud infrastructure.",
    ],
    skills: ["Python", "Ansible", "Network Automation", "OpenStack", "Kubernetes"],
    skillsLabel: "Role focus",
    plannedUntil: "2027-05-01T00:00:00-04:00",
  },
  {
    company: "Nokia",
    role: "Network Lab Engineer",
    employment: "Co-op",
    period: "Apr 2026 - Dec 2026",
    location: "Ottawa, Ontario, Canada · On-site",
    highlights: [
      "Supported Ansible deployments of Wazuh and Microsoft Defender across 250+ Windows and Linux lab systems.",
      "Tested 10+ telecom lab environments and supported 20+ devices, configuring VLANs, IP addressing and routing.",
      "Collaborated with engineers to resolve network issues, improving debugging efficiency by approximately 25%.",
    ],
    skills: ["Nokia SR OS", "Ansible", "Wazuh", "Microsoft Defender", "VLANs", "IP Routing"],
  },
  {
    company: "Nokia",
    role: "Student Ambassador",
    employment: "Co-op",
    period: "Apr 2026 - Dec 2026",
    location: "Kanata, Ontario, Canada · On-site",
    highlights: [
      "Represent Nokia through 3 ambassador programs: Student Ambassador, IDEAL and EQUAL.",
      "Connect students with Nokia's technology initiatives and career opportunities through campus events and outreach.",
      "Support accessibility and gender-equality initiatives, bringing inclusion and equal opportunity into student conversations.",
    ],
    skills: ["Technology Outreach", "Accessibility", "Community Engagement", "Leadership"],
  },
  {
    company: "Syncrope",
    role: "AI Model Evaluation - Expert Contributor",
    employment: "Permanent · Full-time",
    period: "Apr 2026 - Present",
    location: "Remote",
    highlights: [
      "Earned Expert Contributor status and completed 60+ accepted EC tasks for LLM coding-agent evaluation.",
      "Contributed to 150+ accepted benchmark tasks across Sentinel and Terminus projects, building specifications, containers and reference solutions.",
      "Debugged AutoEval failures and built deterministic Python, R and Shell tests for reproducible, offline evaluation with clear pass/fail results.",
    ],
    skills: ["LLM Evaluation", "Python", "R", "Shell", "Containerized Testing"],
  },
  {
    company: "Amazon",
    role: "Core Team Member",
    team: "AWS Cloud Club · Algoma University",
    employment: "Contract · Part-time",
    period: "Dec 2025 - Present",
    location: "Brampton, Ontario, Canada · On-site",
    highlights: [
      "Help plan AWS Cloud Club workshops and events that introduce students to cloud computing and practical AWS learning.",
      "Coordinate club operations and student outreach with the core team to keep community activities organized.",
      "Contribute session ideas and support community initiatives that connect students with cloud technology and each other.",
    ],
    skills: ["Amazon Web Services", "Cloud Computing", "Event Coordination", "Community Building"],
  },
  {
    company: "Algoma University",
    role: "Teaching Assistant",
    employment: "Teaching",
    period: "Apr 2025 - Sep 2025",
    location: "Brampton, Ontario, Canada",
    highlights: [
      "Supported students with technical coursework, helping them connect classroom concepts to practical problems.",
      "Broke down complex ideas into clear explanations and step-by-step examples students could work through.",
      "Helped students reason through coursework questions and build confidence in their own problem-solving approach.",
    ],
    skills: ["Teaching", "Student Support", "Technical Communication"],
  },
  {
    company: "Algoma University",
    role: "Research Assistant",
    employment: "Apprenticeship",
    period: "Sep 2024 - Sep 2025",
    location: "Brampton, Ontario, Canada · Hybrid",
    highlights: [
      "Collaborated with Prof. Randy Lin on an AI system for automatically describing video content to improve accessibility.",
      "Worked on visual analysis of objects, actions and scene transitions to capture information beyond a single video frame.",
      "Connected video analysis with natural-language processing to produce coherent descriptions for people who rely on auditory information.",
    ],
    skills: ["Artificial Intelligence", "Computer Vision", "NLP", "Research", "Accessibility"],
  },
  {
    company: "Toys R Us",
    role: "DevOps Engineer",
    employment: "Apprenticeship",
    period: "Jan 2025 - Apr 2025",
    location: "Vaughan, Ontario, Canada · On-site",
    highlights: [
      "Assisted with infrastructure maintenance and automation to support reliable day-to-day IT operations.",
      "Explored Git, Jenkins, Terraform, Docker and Kubernetes for automating repetitive infrastructure and delivery workflows.",
      "Documented and standardized change-management procedures around ITIL and company policies to make operational handoffs clearer.",
    ],
    skills: ["Git", "Jenkins", "Terraform", "Docker", "Kubernetes", "ITIL"],
  },
  {
    company: "Toys R Us",
    role: "IT Operations Analyst",
    employment: "IT Operations",
    period: "Sep 2024 - Dec 2024",
    location: "Vaughan, Ontario, Canada · On-site",
    highlights: [
      "Supported network connectivity, server health and hardware provisioning to keep essential IT services running.",
      "Used ServiceNow to track support tickets and coordinate issue resolution with internal teams and vendors.",
      "Maintained clear operational documentation and handoffs so colleagues could follow issues, changes and next steps.",
    ],
    skills: ["IT Operations", "ServiceNow", "Troubleshooting", "Hardware Provisioning", "Documentation"],
  },
]

const companyLogos: Record<string, string> = {
  Nokia: "/images/companies/nokia.svg",
  Syncrope: "/images/companies/syncrope.svg",
  Amazon: "/images/companies/amazon.png",
  "Algoma University": "/images/companies/algoma.jpg",
  "Toys R Us": "/images/companies/toys-r-us.svg",
}

export interface ExperienceGroup {
  id: string
  company: string
  logo: string
  roles: ExperienceItem[]
}

export const experienceGroups = experience.reduce<ExperienceGroup[]>((groups, role) => {
  const company = groups.find((group) => group.company === role.company)
  if (company) {
    company.roles.push(role)
  } else {
    groups.push({
      id: role.company.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, ""),
      company: role.company,
      logo: companyLogos[role.company],
      roles: [role],
    })
  }
  return groups
}, [])
