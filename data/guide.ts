import { resumeHref, socialLinks, siteConfig } from "./site"

export type GuideLink = { label: string; href: string }
export type GuideTopic = {
  id: string
  terms: string[]
  text: string
  bullets?: string[]
  detail?: string
  timeline?: string
  links: GuideLink[]
  suggestions?: string[]
}

const resume = { label: "Read the résumé", href: resumeHref }
const roles = { label: "Experience", href: "/experience" }
const contact = { label: "Contact Sukhraj", href: "/contact" }

// Résumé-specific details checked against public/Sukhraj-Singh-Resume.pdf.
// Keep differing résumé/portfolio timelines explicit when a visitor asks for dates.
export const guideTopics: GuideTopic[] = [
  {
    id: "about", terms: ["about", "who", "introduce", "introduction", "background", "summary", "summarize", "sukhraj"],
    text: "Sukhraj Singh is a Computer Science student at Algoma University, focused on DevOps, cloud and network automation. His work connects telecom labs, IT operations, AI evaluation and practical software projects.",
    detail: "He moved from Punjab to Canada to build a future in technology. Away from the terminal, he paints, writes on Medium and enjoys a good match.",
    links: [{ label: "Meet Sukhraj", href: "/about" }, resume], suggestions: ["Nokia experience", "What has he built?", "His education"],
  },
  {
    id: "experience", terms: ["experience", "career", "employment", "employer", "jobs", "worked", "work history", "companies", "roles"],
    text: "His experience spans engineering, research and student support.",
    bullets: ["Nokia: network lab engineering, student ambassador work and an accepted automation co-op offer.", "Syncrope: AI model evaluation and benchmark development.", "Toys R Us: IT operations and DevOps; Algoma: research and teaching assistance."],
    links: [roles, resume], suggestions: ["Nokia experience", "Toys R Us", "AI evaluation"],
  },
  {
    id: "nokia", terms: ["nokia", "telecom", "network lab", "lab engineer", "ambassador"],
    text: "At Nokia, Sukhraj's portfolio describes network lab engineering and student ambassador work, alongside an accepted automation co-op offer.",
    bullets: ["Supported Ansible deployments of Wazuh and Microsoft Defender across 250+ Windows and Linux lab systems.", "Tested 10+ lab environments and supported 20+ devices, working with VLANs, IP addressing and routing."],
    detail: "The portfolio reports approximately 25% better debugging efficiency through collaboration with engineers. His ambassador work includes Student Ambassador, IDEAL and EQUAL programs.",
    timeline: "The portfolio lists Network Lab Engineer and Student Ambassador from April–December 2026. For the automation role, the résumé starts in December 2026 while the portfolio lists January–April 2027. Sukhraj can confirm the final co-op dates.",
    links: [{ label: "Nokia roles", href: "/experience#nokia" }, resume], suggestions: ["Automation role", "What skills does he use?"],
  },
  {
    id: "automation", terms: ["automation role", "automation engineer", "nokia automation", "nta", "agentic", "co op", "coop"],
    text: "The Nokia automation co-op scope in his résumé covers Python and Bash tooling, approved network diagnostics, automated testing and repeatable troubleshooting on Linux.",
    bullets: ["Agentic workflows and tool-calling interfaces for collecting logs and producing structured reports.", "Regression checks in Docker and CI/CD, plus runbooks and technical documentation."],
    detail: "The résumé describes collaboration with IP, Optical and Fixed Networks engineers, including testing invalid inputs, timeouts and failure scenarios. The accepted role is future-dated relative to the portfolio's October 2026 update.",
    timeline: "The résumé lists December 2026–Present; the portfolio lists January–April 2027. Please confirm the final term directly with Sukhraj.",
    links: [resume, { label: "Nokia roles", href: "/experience#nokia" }],
  },
  {
    id: "toys", terms: ["toys", "toys r us", "devops intern", "it operations", "servicenow"],
    text: "His Toys R Us work combines IT operations with DevOps and automation. The latest résumé describes Python and Shell reporting workflows, application/data troubleshooting, AI-assisted issue summaries and reusable operational documentation.",
    detail: "The portfolio also describes ServiceNow ticket tracking, vendor coordination, infrastructure maintenance and change-management documentation.",
    timeline: "The résumé lists DevOps Intern, January–May 2025. The portfolio separates IT Operations Analyst (September–December 2024) and DevOps Engineer (January–April 2025). Confirm exact employment details with Sukhraj.",
    links: [resume, { label: "Toys R Us experience", href: "/experience#toys-r-us" }],
  },
  {
    id: "evaluation", terms: ["syncrope", "ai evaluation", "llm", "sentinel", "terminus", "expert contributor", "benchmark tasks"],
    text: "At Syncrope, Sukhraj contributes to evaluating LLM coding agents. His portfolio reports 60+ accepted Expert Contributor tasks and contributions to 150+ accepted benchmark tasks.",
    detail: "He builds task specifications, containerized environments, reference solutions and deterministic Python, R and Shell tests, and investigates AutoEval failures.",
    timeline: "The portfolio lists April 2026–Present, remote.", links: [roles],
  },
  {
    id: "teaching", terms: ["teaching", "teaching assistant", "ta role", "taught", "tutor"],
    text: "As a Teaching Assistant at Algoma University, he supported technical coursework, explained complex concepts through practical examples and helped students build confidence in problem solving.",
    timeline: "April–September 2025, Brampton, Ontario.", links: [{ label: "Algoma roles", href: "/experience#algoma-university" }],
  },
  {
    id: "research-role", terms: ["research assistant", "randy lin", "video description", "accessibility research"],
    text: "As a Research Assistant at Algoma, Sukhraj collaborated with Prof. Randy Lin on an AI system for automatically describing video content to improve accessibility. The work combined visual analysis with natural-language processing.",
    timeline: "The experience page lists September 2024–September 2025.", links: [{ label: "Algoma roles", href: "/experience#algoma-university" }, { label: "Research papers", href: "/research" }],
  },
  {
    id: "club", terms: ["cloud club", "aws club", "core team", "amazon employment", "work at amazon"],
    text: "He is a core team member of the AWS Cloud Club at Algoma University, helping with workshops, student outreach and club operations. This is a university cloud-community role.",
    timeline: "December 2025–Present, Brampton, Ontario.", links: [roles],
  },
  {
    id: "education", terms: ["education", "degree", "study", "studied", "studying", "university", "algoma", "college", "gpa", "graduation", "graduate", "coursework"],
    text: "Sukhraj is studying for a Bachelor of Computer Science at Algoma University. His résumé lists a 3.9 / 4.0 GPA, with coursework in programming, cloud computing, networks, operating systems, databases, AI and algorithms.",
    timeline: "The latest downloadable résumé lists expected graduation in December 2028. The education page currently lists December 2027; please confirm the current graduation date with Sukhraj.",
    links: [resume, { label: "Education & awards", href: "/education" }], suggestions: ["Chancellor's Award", "Technical skills", "Research papers"],
  },
  {
    id: "scholarship", terms: ["scholarship", "award", "chancellor", "20000", "20 000"],
    text: "He received Algoma University's Chancellor's Award, valued at CA$20,000 over the four years of his degree.",
    links: [{ label: "Education & awards", href: "/education" }],
  },
  {
    id: "school", terms: ["school", "indian heritage", "dhariwal", "secondary", "physics", "chemistry"],
    text: "He completed senior secondary education at Indian Heritage Public School in Dhariwal, Punjab, studying Mathematics, Physics and Chemistry. The education page includes his school photo and newspaper clipping.",
    links: [{ label: "School & education", href: "/education" }],
  },
  {
    id: "skills", terms: ["skills", "technologies", "tech stack", "tools", "languages", "programming", "technical", "python", "bash", "powershell", "sql", "java", "ansible", "kubernetes", "docker", "helm", "aws", "terraform", "linux", "windows", "devops", "cloud", "networking", "network automation", "ci cd", "github actions", "prometheus", "wazuh"],
    text: "His résumé brings together cloud infrastructure, automation and troubleshooting.",
    bullets: ["Code & automation: Python, Java, SQL, Bash, PowerShell, Ansible and GitHub Actions.", "Cloud & delivery: AWS, Terraform, Docker, Kubernetes and Helm.", "Systems & reliability: Linux, Windows, TCP/IP, DNS, VLANs, Prometheus, Wazuh and Microsoft Defender."],
    links: [{ label: "Skills with project evidence", href: "/skills" }, resume], suggestions: ["Show me his projects", "Nokia experience"],
  },
  {
    id: "certifications", terms: ["certification", "certifications", "certified", "certificate", "oracle", "credentials"],
    text: "The education page lists Oracle Cloud Infrastructure AI Foundations Associate, Foundations Associate and DevOps Professional credentials. It includes links to the Oracle share records.",
    links: [{ label: "View credentials", href: "/education" }],
  },
  {
    id: "projects", terms: ["projects", "project", "built", "build", "portfolio", "github", "repositories", "code", "demo"],
    text: "Start with DeployGuard for canary releases and rollback, SignalDesk AI for incident triage, or the Customer Application Network Support Lab for practical diagnostics. Each case study explains the work, evidence and limitations.",
    links: [{ label: "All projects", href: "/projects" }, { label: "GitHub", href: socialLinks.github }], suggestions: ["Tell me about DeployGuard", "SignalDesk AI", "Network support lab"],
  },
  {
    id: "research", terms: ["research", "papers", "paper", "publication", "published", "ieee"],
    text: "There are two papers to explore: Temporal-Consensus OCR, which combines evidence across video frames, and SCAMPA / ScamShield, a local voice-AI architecture proposal. Both have readable PDFs and interactive book viewers.",
    detail: "The OCR evaluation uses 50 synthetic clips. SCAMPA is an IEEE-formatted course report, not a claim of IEEE publication or a deployed voice system.",
    links: [{ label: "Read the research", href: "/research" }], suggestions: ["OCR research", "SCAMPA"],
  },
  {
    id: "resume", terms: ["resume", "cv", "download", "pdf"],
    text: "Here is Sukhraj's latest downloadable résumé. It covers his education, technical skills, Nokia and Toys R Us experience, and DeployGuard.",
    links: [resume], suggestions: ["Summarize his background", "Technical skills", "Contact Sukhraj"],
  },
  {
    id: "contact", terms: ["contact", "email", "reach", "connect", "linkedin", "phone", "interview", "message him"],
    text: `You can reach Sukhraj at ${siteConfig.email} or through LinkedIn. For a role or collaboration, a little context about the opportunity is a good place to start.`,
    links: [{ label: "Email Sukhraj", href: socialLinks.email }, { label: "LinkedIn", href: socialLinks.linkedin }, contact],
  },
  {
    id: "availability", terms: ["available", "availability", "hiring", "hire", "opportunity", "opportunities", "open to", "relocate", "relocation", "start date", "salary", "visa", "sponsorship", "work authorization", "citizen", "citizenship"],
    text: "The portfolio welcomes opportunities in cloud, DevOps and infrastructure. Please ask Sukhraj directly about start dates, location preferences, compensation or work authorization; those details are not confirmed here.",
    links: [contact, resume],
  },
  {
    id: "location", terms: ["based", "located", "location", "live", "from", "punjab", "canada", "ottawa", "time zone"],
    text: "Sukhraj moved from Punjab, India, to Canada. He is based in Ontario; his Nokia roles are associated with Ottawa. Ontario uses Eastern Time.",
    links: [{ label: "His story", href: "/about" }, contact],
  },
  {
    id: "interests", terms: ["hobbies", "hobby", "interests", "free time", "outside work", "painting", "paint", "sports", "chess", "pickleball", "bowling"],
    text: "Away from work, he paints, writes on Medium and enjoys table tennis, pickleball, chess and bowling. You can see his actual artwork and writing on the Beyond Work page.",
    links: [{ label: "Beyond work", href: "/beyond" }, { label: "Read his writing", href: socialLinks.medium }],
  },
  {
    id: "writing", terms: ["medium", "writing", "articles", "blog"],
    text: "Sukhraj shares what he is learning on Medium. The Beyond Work page features selected articles alongside his paintings and other interests.",
    links: [{ label: "Medium", href: socialLinks.medium }, { label: "Selected writing", href: "/beyond#writing" }],
  },
  {
    id: "privacy", terms: ["privacy", "private", "store messages", "save messages", "chatbot", "helpbot", "real person", "are you ai", "human", "how do you work"],
    text: "I'm a résumé and portfolio guide, not Sukhraj himself. I match your questions to information on this site. This chat runs in your browser; I don't send your messages to an AI service. Refreshing clears the conversation.",
    links: [contact],
  },
]
