import { guideTopics, type GuideLink, type GuideTopic } from "../data/guide"
import { projects, type Project } from "../data/projects"

export type GuideReply = {
  text: string
  bullets?: string[]
  links?: GuideLink[]
  suggestions?: string[]
  topic?: string
}

export const welcomeReply: GuideReply = {
  text: "Hi, welcome! I’m Sukhraj’s portfolio guide. Ask me about his experience, projects, skills or education, and I’ll help you find the useful bits.",
  suggestions: ["Nokia experience", "What has he built?", "Technical skills", "Get his résumé"],
}

const corrections: Record<string, string> = {
  expereince: "experience", experince: "experience", experiece: "experience", experiances: "experience",
  proejcts: "projects", projcts: "projects", educaton: "education", resme: "resume", linkeidn: "linkedin",
  graduat: "graduate", certs: "certifications", k8s: "kubernetes", uni: "university",
}

export function normalizeQuestion(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, " ").trim().split(/\s+/).map((word) => corrections[word] ?? word).join(" ")
}

const has = (question: string, term: string) => ` ${question} `.includes(` ${normalizeQuestion(term)} `)
const matches = (question: string, terms: string[]) => terms.some((term) => has(question, term))
const findTopic = (id: string) => guideTopics.find((topic) => topic.id === id)!

const projectAliases: Record<string, string[]> = {
  "deployguard-cloud-platform": ["deployguard", "deploy guard", "canary", "rollback"],
  "signaldesk-ai": ["signaldesk", "signal desk", "incident triage"],
  "aws-infrastructure-terraform": ["aws infrastructure", "terraform project", "infrastructure as code", "fargate"],
  "container-delivery-pipeline": ["container delivery", "delivery pipeline", "cicd project", "ci cd project"],
  "segmented-campus-network": ["campus network", "packet tracer", "segmented network"],
  "customer-application-network-support-lab": ["support lab", "network diagnostics", "customer application"],
  "scamshield-local-voice-agent": ["scampa", "scamshield", "scam shield", "voice agent"],
  "moodify-emotion-music-recommender": ["moodify", "music recommender"],
  "temporal-consensus-ocr-research": ["ocr", "temporal consensus", "headline recognition"],
}

const wantsTimeline = (question: string) => matches(question, ["when", "dates", "timeline", "how long", "graduation", "graduate", "graduating", "start date"])
const wantsDetail = (question: string) => matches(question, ["more", "details", "elaborate", "what else", "achievement", "achievements", "impact", "results"])

function topicReply(topic: GuideTopic, question: string): GuideReply {
  return {
    topic: topic.id,
    text: wantsTimeline(question) && topic.timeline ? topic.timeline : wantsDetail(question) && topic.detail ? topic.detail : topic.text,
    bullets: wantsTimeline(question) || (wantsDetail(question) && topic.detail) ? undefined : topic.bullets,
    links: topic.links,
    suggestions: topic.suggestions ?? ["Technical skills", "Show me his projects", "Contact Sukhraj"],
  }
}

function projectReply(project: Project, question: string): GuideReply {
  const links = [{ label: "Read the case study", href: `/projects/${project.slug}` }]
  if (project.repository) links.push({ label: "Source code", href: project.repository })
  if (project.demo) links.push({ label: "Watch the demo", href: `/projects/${project.slug}#demo` })
  const reply: GuideReply = {
    topic: `project:${project.slug}`, text: project.summary,
    bullets: [`Status: ${project.status}`, `Scope: ${project.limitation}`], links,
    suggestions: ["What technologies did he use?", "What was his contribution?", "What is the evidence?"],
  }
  if (matches(question, ["technologies", "technology", "tools", "stack", "skills", "languages"])) {
    reply.text = `${project.title} uses ${project.technologies.join(", ")}.`
    reply.bullets = undefined
  } else if (matches(question, ["contribution", "ownership", "team", "his part", "himself"])) {
    reply.text = `${project.ownership}. Sukhraj describes his contribution as: “${project.contribution}”`
    reply.bullets = undefined
  } else if (matches(question, ["evidence", "tested", "tests", "results", "accuracy", "limitations", "deployed", "production", "more"])) {
    reply.text = project.evidence
    reply.bullets = [`Scope: ${project.limitation}`]
  } else if (wantsTimeline(question)) {
    reply.text = `${project.title} is dated ${project.date}. ${project.status}.`
    reply.bullets = undefined
  }
  return reply
}

export function answerPortfolioQuestion(input: string, previousTopic?: string): GuideReply {
  const question = normalizeQuestion(input.slice(0, 600))
  if (!question || /^(hi|hello|hey|hey there|hi there|good morning|good evening|namaste|sat sri akal)$/.test(question)) return welcomeReply
  if (/^(thanks|thank you|thank you so much|thanks a lot|great thanks|awesome thanks|bye|goodbye)$/.test(question)) {
    return { text: "You’re welcome. Glad I could help you get to know Sukhraj a little better!", suggestions: ["Get his résumé", "Contact Sukhraj"] }
  }
  if (matches(question, ["who are you", "what can you do", "how do you work", "are you ai", "are you a bot"])) return topicReply(findTopic("privacy"), question)
  if (matches(question, ["who is he", "who is sukhraj", "tell me about yourself", "introduce him"])) return topicReply(findTopic("about"), question)
  if (matches(question, ["his name", "where is he from", "where is sukhraj from"])) return topicReply(findTopic(has(question, "name") ? "about" : "location"), question)
  if (matches(question, ["salary", "compensation", "visa", "sponsorship", "work authorization", "citizenship"])) return topicReply(findTopic("availability"), question)
  if (matches(question, ["years of experience", "how many years", "expert level", "senior engineer"])) {
    return { text: "I don’t have a verified total or seniority rating to give you. His dated roles and project evidence are the best starting point for assessing fit.", links: [{ label: "Experience", href: "/experience" }, { label: "Project evidence", href: "/projects" }] }
  }
  if (matches(question, ["quote", "encouragement", "motivate me"])) {
    return { text: "There’s a little encouragement waiting on the homepage. Tap the quote card for a fresh thought to take with you.", links: [{ label: "A moment for you", href: "/#encouragement" }] }
  }

  const namedProject = projects.find((project) => matches(question, projectAliases[project.slug] ?? [project.title]))
  if (namedProject) return projectReply(namedProject, question)

  // Resolve short follow-ups without allowing a previous topic to swallow a new named subject.
  const namedRole = guideTopics.filter((topic) => ["nokia", "automation", "toys", "evaluation", "teaching", "research-role", "club", "school", "scholarship"].includes(topic.id))
    .map((topic) => ({ topic, score: topic.terms.filter((term) => has(question, term)).reduce((score, term) => score + term.split(" ").length, 0) }))
    .sort((a, b) => b.score - a.score)[0]
  if (namedRole?.score) return topicReply(namedRole.topic, question)
  if (has(question, "algoma") && has(question, "research")) return topicReply(findTopic("research-role"), question)
  if (has(question, "amazon")) return topicReply(findTopic("club"), question)

  const followUp = /^(and |what |which |tell me |can you |could you )?(more|else|technologies|tools|stack|skills|evidence|results|limitations|contribution|dates|when|how long)/.test(question)
    || /^(what was his contribution|what is the evidence|what did he use|when was that|where was that)$/.test(question)
  if (previousTopic && followUp) {
    const project = projects.find((item) => `project:${item.slug}` === previousTopic)
    if (project) return projectReply(project, question)
    const topic = guideTopics.find((item) => item.id === previousTopic)
    if (topic && (wantsDetail(question) || wantsTimeline(question))) return topicReply(topic, question)
  }

  const generic = new Set(["about", "who", "from", "code", "sukhraj", "build", "live"])
  const ranked = guideTopics.map((topic) => ({
    topic,
    score: topic.terms.reduce((score, term) => score + (has(question, term) ? generic.has(term) ? 1 : term.includes(" ") ? 5 : 3 : 0), 0),
  })).sort((a, b) => b.score - a.score)
  if (ranked[0]?.score >= 3) return topicReply(ranked[0].topic, question)
  return {
    text: "I don’t have that detail in Sukhraj’s résumé or portfolio. I can help with his experience, projects, skills and education—or point you to him for a direct answer.",
    links: [{ label: "Ask Sukhraj directly", href: "/contact" }],
    suggestions: ["Nokia experience", "What has he built?", "Get his résumé"],
  }
}
