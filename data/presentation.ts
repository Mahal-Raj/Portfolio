import type { ProjectVisual } from "@/data/projects"
export const projectPresentation: Record<ProjectVisual, { title: string; line: string; status: string; category: string }> = {
  deployguard: { title: "DeployGuard", line: "Safer releases. Automatic rollbacks. A clear audit trail.", status: "Local controller · Cloud blueprint", category: "DevOps & reliability" },
  signaldesk: { title: "SignalDesk AI", line: "Turn noisy alerts into clear next steps. Keep the data local.", status: "Local prototype · 60-incident evaluation", category: "AI & operations" },
  infrastructure: { title: "AWS Infrastructure", line: "A repeatable container platform, defined in Terraform.", status: "Validated plan · Not deployed", category: "Cloud infrastructure" },
  pipeline: { title: "Container Delivery", line: "From application source to a reproducible container.", status: "Local demo · CI work in progress", category: "DevOps" },
  network: { title: "Campus Network", line: "Connecting departments with a segmented network design.", status: "Network simulation", category: "Networking" },
  support: { title: "Network Support Lab", line: "Find the failed connection. Explain what to check next.", status: "Working local application", category: "Networking & Java" },
  scamshield: { title: "SCAMPA / ScamShield", line: "Research into local voice agents for controlled scam defence.", status: "Research proposal + separate demo", category: "AI research" },
  moodify: { title: "Moodify", line: "A team-built music experience with mood at its centre.", status: "Team project · Controlled local demo", category: "Software" },
  research: { title: "Temporal-Consensus OCR", line: "More reliable video headlines by reading across frames.", status: "Research · Controlled benchmark", category: "Computer vision" },
}
export const articles = [
  { title: "Chef Notes Every DevOps Engineer Should Master", date: "Oct 12, 2025", href: "https://medium.com/@mahalraj0001/chef-notes-every-devops-engineer-should-master-6b436832fd11", tag: "Automation" },
  { title: "Git Notes Every DevOps Engineer Should Master", date: "Oct 9, 2025", href: "https://medium.com/@mahalraj0001/git-notes-every-devops-engineer-should-master-1f70daf09ec6", tag: "Git" },
  { title: "Advanced Linux Notes Every DevOps Engineer Should Master", date: "Sep 26, 2025", href: "https://medium.com/@mahalraj0001/advanced-linux-notes-every-devops-engineer-should-master-ab75109d0f76", tag: "Linux" },
]
