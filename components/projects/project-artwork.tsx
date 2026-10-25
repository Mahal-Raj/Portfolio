import { Activity, AudioLines, Box, Check, Cloud, FileScan, GitBranch, Layers, LockKeyhole, Network, ShieldCheck, Terminal } from "lucide-react"
import type { ProjectVisual } from "@/data/projects"
const systemFlows = {
  infrastructure: { icon: Cloud, label: "Infrastructure as code", nodes: ["Terraform", "VPC", "ECS Fargate"], note: "Plan → review → provision" },
  pipeline: { icon: Box, label: "Container delivery", nodes: ["Source", "Docker", "Registry"], note: "Build once. Run consistently." },
  network: { icon: Network, label: "Campus connectivity", nodes: ["Core", "VLANs", "Endpoints"], note: "Separate traffic. Connect people." },
  scamshield: { icon: ShieldCheck, label: "Controlled voice research", nodes: ["Speech", "Policy", "Response"], note: "Local processing · Research proposal" },
  moodify: { icon: AudioLines, label: "Music for the moment", nodes: ["Mood", "Discover", "Listen"], note: "A team-built listening experience" },
  research: { icon: FileScan, label: "Temporal-consensus OCR", nodes: ["Frames", "OCR", "Consensus"], note: "Read across frames. Reduce noise." },
}
export function ProjectArtwork({ type }: { type: ProjectVisual }) {
  if (type === "deployguard") return (
    <div className="p-art p-art-deployguard" role="img" aria-label="DeployGuard workflow illustration: four canary stages with health checks before promotion">
      <div className="p-art-top"><span><GitBranch size={16} /> deployguard</span><span>Release workflow</span></div>
      <div className="p-release-heading"><ShieldCheck size={28} /><span>Confidence at every stage.</span></div>
      <div className="p-release-stages">{["10%", "25%", "50%", "100%"].map((stage) => <div key={stage}><span><Check size={15} /></span><strong>{stage}</strong><small>Traffic</small></div>)}</div>
      <div className="p-art-bottom"><span><Activity size={14} /> Health gate</span><span>Promote or roll back ↗</span></div>
    </div>
  )
  if (type === "signaldesk") return (
    <div className="p-art p-art-signaldesk" role="img" aria-label="SignalDesk workflow illustration: redact sensitive data, classify locally, and send to a human for review">
      <div className="p-art-top"><span><Layers size={16} /> signaldesk</span><span>Local incident triage</span></div>
      <div className="p-alert"><span className="p-alert-dot" /><div><strong>A noisy alert.<br />A clearer next step.</strong><div className="p-redacted"><i /><i /><i /></div></div></div>
      <div className="p-ai-path"><span><LockKeyhole size={14} /> Redact</span><span>Classify</span><span>Human review <Check size={14} /></span></div>
    </div>
  )
  if (type === "support") return (
    <div className="p-art p-art-support" role="img" aria-label="Support lab workflow illustration: check DNS, TCP, TLS and HTTP in dependency order">
      <div className="p-art-top"><span><Terminal size={16} /> support lab</span><span>Dependency-aware checks</span></div>
      <div className="p-network-path">{["DNS", "TCP", "TLS", "HTTP"].map((label) => <div key={label}><span><Check size={18} /></span><strong>{label}</strong></div>)}</div>
      <div className="p-art-bottom"><span>One readable support report.</span><span>Java · CLI</span></div>
    </div>
  )
  const flow = systemFlows[type]
  const Icon = flow.icon
  return <div className={`p-art p-art-${type} p-art-system`} role="img" aria-label={`${flow.label}: ${flow.nodes.join(" to ")}`}><div className="p-art-top"><span>{flow.label}</span><Icon size={20} /></div><div className="p-system-nodes">{flow.nodes.map((node, i) => <div key={node}><span>{String(i + 1).padStart(2, "0")}</span><strong>{node}</strong></div>)}</div><p>{flow.note}</p></div>
}
