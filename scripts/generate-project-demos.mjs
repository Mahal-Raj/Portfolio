import { execFileSync } from "node:child_process"
import { existsSync, mkdirSync, mkdtempSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { basename, join, resolve } from "node:path"
import { createRequire } from "node:module"

const root = resolve(import.meta.dirname, "..")
const toolingRoot = process.env.PORTFOLIO_VIDEO_TOOLING_ROOT

if (!toolingRoot) {
  throw new Error("Set PORTFOLIO_VIDEO_TOOLING_ROOT to a folder containing sharp and ffmpeg-static.")
}

const require = createRequire(import.meta.url)
const sharp = require(join(toolingRoot, "node_modules", "sharp"))
const ffmpeg = require(join(toolingRoot, "node_modules", "ffmpeg-static"))

const width = 1920
const height = 1080
const slideDuration = 5.5
const transitionDuration = 0.8
const frameRoot = mkdtempSync(join(tmpdir(), "sukhraj-project-demos-"))
const videoRoot = join(root, "public", "video")
const posterRoot = join(root, "public", "images", "projects")

mkdirSync(videoRoot, { recursive: true })
mkdirSync(posterRoot, { recursive: true })

const palette = {
  dark: "#08090b",
  panel: "#121419",
  panelSoft: "#191c22",
  ink: "#f7f7f3",
  muted: "#9da2aa",
  blue: "#4e7bff",
  green: "#6ee7a8",
  amber: "#f6c667",
  red: "#ff7a7a",
  paper: "#f3f3ef",
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function wrapText(value, maxCharacters = 42) {
  const words = String(value).split(/\s+/)
  const lines = []
  let line = ""
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (candidate.length > maxCharacters && line) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  return lines
}

function textBlock(value, x, y, options = {}) {
  const {
    size = 34,
    lineHeight = Math.round(size * 1.3),
    color = palette.muted,
    weight = 400,
    maxCharacters = 48,
    family = "Arial, Helvetica, sans-serif",
    letterSpacing = 0,
  } = options
  return wrapText(value, maxCharacters)
    .map(
      (line, index) =>
        `<text x="${x}" y="${y + index * lineHeight}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" letter-spacing="${letterSpacing}">${escapeXml(line)}</text>`,
    )
    .join("")
}

function flowDiagram(items, y = 625) {
  const gap = 24
  const available = width - 208
  const nodeWidth = Math.min(248, (available - gap * (items.length - 1)) / items.length)
  const nodeHeight = 146
  return items
    .map((item, index) => {
      const x = 104 + index * (nodeWidth + gap)
      const labelLines = wrapText(item, 14)
      const text = labelLines
        .map(
          (line, lineIndex) =>
            `<text x="${x + nodeWidth / 2}" y="${y + 80 + lineIndex * 28}" text-anchor="middle" fill="${palette.ink}" font-family="Arial, Helvetica, sans-serif" font-size="22" font-weight="650">${escapeXml(line)}</text>`,
        )
        .join("")
      const connector =
        index < items.length - 1
          ? `<line x1="${x + nodeWidth}" y1="${y + nodeHeight / 2}" x2="${x + nodeWidth + gap}" y2="${y + nodeHeight / 2}" stroke="${palette.blue}" stroke-width="3"/><circle cx="${x + nodeWidth + gap / 2}" cy="${y + nodeHeight / 2}" r="5" fill="${palette.blue}"/>`
          : ""
      return `<g><rect x="${x}" y="${y}" width="${nodeWidth}" height="${nodeHeight}" rx="18" fill="${palette.panel}" stroke="#2b3039"/><text x="${x + 22}" y="${y + 34}" fill="${palette.blue}" font-family="Consolas, monospace" font-size="14">${String(index + 1).padStart(2, "0")}</text>${text}${connector}</g>`
    })
    .join("")
}

function metricCards(items, y = 630) {
  const columns = items.length
  const gap = 24
  const cardWidth = (width - 208 - gap * (columns - 1)) / columns
  return items
    .map((item, index) => {
      const x = 104 + index * (cardWidth + gap)
      return `<g><rect x="${x}" y="${y}" width="${cardWidth}" height="206" rx="22" fill="${palette.panel}" stroke="#292e37"/><text x="${x + 28}" y="${y + 52}" fill="${palette.muted}" font-family="Consolas, monospace" font-size="16" letter-spacing="1.5">${escapeXml(item.label.toUpperCase())}</text>${textBlock(item.value, x + 28, y + 112, { size: 34, lineHeight: 40, color: item.color || palette.ink, weight: 650, maxCharacters: 18 })}</g>`
    })
    .join("")
}

function codePanel(lines, y = 548) {
  const lineHeight = 48
  return `<g><rect x="104" y="${y}" width="1712" height="${Math.max(260, lines.length * lineHeight + 88)}" rx="24" fill="#050607" stroke="#272b32"/><circle cx="144" cy="${y + 34}" r="7" fill="#ff6b6b"/><circle cx="168" cy="${y + 34}" r="7" fill="#f6c667"/><circle cx="192" cy="${y + 34}" r="7" fill="#6ee7a8"/>${lines
    .map(
      (line, index) =>
        `<text x="148" y="${y + 92 + index * lineHeight}" fill="${index === lines.length - 1 ? palette.green : palette.ink}" font-family="Consolas, monospace" font-size="28">${escapeXml(line)}</text>`,
    )
    .join("")}</g>`
}

function slideSvg(project, slide, index, total) {
  const titleSize = slide.title.length > 44 ? 64 : slide.title.length > 28 ? 76 : 90
  const titleWidth = slide.image ? 24 : 36
  const titleLines = wrapText(slide.title, titleWidth)
  const title = titleLines
    .map(
      (line, lineIndex) =>
        `<text x="104" y="${250 + lineIndex * Math.round(titleSize * 0.98)}" fill="${palette.ink}" font-family="Arial, Helvetica, sans-serif" font-size="${titleSize}" font-weight="650" letter-spacing="-3">${escapeXml(line)}</text>`,
    )
    .join("")
  const bodyY = 250 + titleLines.length * Math.round(titleSize * 0.98) + 48
  const body = slide.body
    ? textBlock(slide.body, 108, bodyY, {
        size: slide.image ? 29 : 31,
        lineHeight: 43,
        maxCharacters: slide.image ? 35 : 58,
      })
    : ""
  const content = slide.flow
    ? flowDiagram(slide.flow, slide.flowY)
    : slide.metrics
      ? metricCards(slide.metrics, slide.metricsY)
      : slide.code
        ? codePanel(slide.code, slide.codeY)
        : ""

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <radialGradient id="glow" cx="80%" cy="12%" r="70%"><stop offset="0" stop-color="${project.glow}" stop-opacity=".26"/><stop offset="1" stop-color="${palette.dark}" stop-opacity="0"/></radialGradient>
      <linearGradient id="rule" x1="0" x2="1"><stop offset="0" stop-color="${palette.blue}"/><stop offset="1" stop-color="${project.glow}" stop-opacity="0"/></linearGradient>
    </defs>
    <rect width="1920" height="1080" fill="${palette.dark}"/>
    <rect width="1920" height="1080" fill="url(#glow)"/>
    <path d="M0 1000H1920M0 920H1920M0 840H1920M0 760H1920" stroke="#ffffff" stroke-opacity=".025"/>
    <text x="104" y="86" fill="${palette.blue}" font-family="Consolas, monospace" font-size="17" letter-spacing="2.6">${escapeXml(project.kicker)}</text>
    <text x="1816" y="86" text-anchor="end" fill="${palette.muted}" font-family="Consolas, monospace" font-size="15">${String(index + 1).padStart(2, "0")} / ${String(total).padStart(2, "0")}</text>
    <rect x="104" y="116" width="1712" height="2" fill="url(#rule)"/>
    ${title}${body}${content}
    <text x="104" y="1018" fill="${palette.muted}" font-family="Consolas, monospace" font-size="14" letter-spacing="1.4">SUKHRAJ SINGH / PROJECT WALKTHROUGH</text>
    <rect x="104" y="1040" width="1712" height="3" rx="2" fill="#262a31"/>
    <rect x="104" y="1040" width="${1712 * ((index + 1) / total)}" height="3" rx="2" fill="${palette.blue}"/>
  </svg>`
}

async function renderSlide(project, slide, index, directory) {
  const slidePath = join(directory, `${String(index + 1).padStart(2, "0")}.png`)
  let image = sharp(Buffer.from(slideSvg(project, slide, index, project.slides.length))).png()

  if (slide.image) {
    const imageWidth = slide.imageWidth || 1020
    const imageHeight = slide.imageHeight || 720
    const imageLeft = slide.imageLeft || 780
    const imageTop = slide.imageTop || 188
    const sourceImage = await sharp(join(root, slide.image))
      .resize(imageWidth, imageHeight, { fit: "contain", background: "#f7f7f3" })
      .extend({ top: 16, bottom: 16, left: 16, right: 16, background: "#ffffff" })
      .png()
      .toBuffer()
    image = image.composite([{ input: sourceImage, left: imageLeft, top: imageTop }])
  }

  await image.toFile(slidePath)
  return slidePath
}

function encodeVideo(slides, outputPath) {
  const inputArgs = slides.flatMap((slide) => ["-loop", "1", "-framerate", "30", "-t", String(slideDuration), "-i", slide])
  const filters = slides.map(
    (_, index) =>
      `[${index}:v]scale=${width}:${height},zoompan=z='min(zoom+0.00022,1.032)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=${width}x${height}:fps=30,format=yuv420p,setpts=PTS-STARTPTS[v${index}]`,
  )
  let previous = "v0"
  for (let index = 1; index < slides.length; index += 1) {
    const output = index === slides.length - 1 ? "outv" : `x${index}`
    const offset = ((slideDuration - transitionDuration) * index).toFixed(1)
    filters.push(`[${previous}][v${index}]xfade=transition=fade:duration=${transitionDuration}:offset=${offset}[${output}]`)
    previous = output
  }
  execFileSync(
    ffmpeg,
    [
      "-y",
      "-hide_banner",
      "-loglevel",
      "warning",
      ...inputArgs,
      "-filter_complex",
      filters.join(";"),
      "-map",
      "[outv]",
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "22",
      "-pix_fmt",
      "yuv420p",
      "-movflags",
      "+faststart",
      "-an",
      outputPath,
    ],
    { stdio: "inherit" },
  )
}

const projects = [
  {
    slug: "aws-infrastructure-terraform",
    kicker: "01 / AWS INFRASTRUCTURE WITH TERRAFORM",
    glow: "#234fbd",
    slides: [
      {
        title: "One command. Six connected AWS resources.",
        body: "A compact infrastructure-as-code walkthrough built from the repository's Terraform configuration.",
        metrics: [
          { label: "Network", value: "VPC + subnet" },
          { label: "Compute", value: "ECS Fargate" },
          { label: "Workload", value: "NGINX :80" },
          { label: "Region", value: "us-east-1" },
        ],
      },
      {
        title: "The dependency path is the design.",
        body: "Terraform references connect the network, security boundary, task definition and service before anything is applied.",
        flow: ["Terraform", "VPC", "Subnet", "Security group", "ECS Fargate", "NGINX :80"],
      },
      {
        title: "The runtime profile stays explicit.",
        body: "The task uses awsvpc networking, Fargate compatibility and a deliberately small CPU and memory footprint.",
        code: [
          'network_mode             = "awsvpc"',
          'requires_compatibilities = ["FARGATE"]',
          'cpu                      = "256"',
          'memory                   = "512"',
          'image                    = "nginx:latest"',
        ],
      },
      {
        title: "Review. Apply. Verify. Destroy.",
        body: "The point is not a one-off console build. The intended state can be inspected, recreated and removed through the same versioned workflow.",
        flow: ["terraform init", "terraform plan", "terraform apply", "HTTP :80", "terraform destroy"],
      },
      {
        title: "Infrastructure I can reason about before it exists.",
        body: "The project connects configuration, AWS networking and a managed container runtime in one readable dependency graph.",
        metrics: [
          { label: "Source", value: "HCL" },
          { label: "Resources", value: "6 declared" },
          { label: "Desired tasks", value: "1" },
          { label: "Delivery", value: "Repeatable" },
        ],
      },
    ],
  },
  {
    slug: "container-delivery-pipeline",
    kicker: "02 / CONTAINER DELIVERY PIPELINE",
    glow: "#315f8f",
    slides: [
      {
        title: "From an Express service to a Fargate workload.",
        body: "A walkthrough of the repository's application, container contract and AWS bootstrap path.",
        metrics: [
          { label: "Runtime", value: "Node 18" },
          { label: "Service", value: "Express 4" },
          { label: "Port", value: "3001" },
          { label: "Routes", value: "3 endpoints" },
        ],
      },
      {
        title: "The application exposes a health contract.",
        body: "The root route shows runtime context, while /health and /api/info provide machine-readable evidence for operations.",
        code: [
          "GET /             -> runtime and container identity",
          "GET /health       -> 200 { status: 'healthy' }",
          "GET /api/info     -> app, version, environment",
          "PORT              -> 3001 by default",
        ],
      },
      {
        title: "The container moves through a complete cloud path.",
        body: "The bootstrap script prepares the registry, identity, network, task, service and logs that surround the image.",
        flow: ["Express", "Docker", "ECR", "IAM", "Task definition", "Fargate", "CloudWatch"],
      },
      {
        title: "Provisioning is staged and observable.",
        body: "The setup checks AWS identity first, stops on errors, enables image scanning and sends runtime logs to CloudWatch.",
        metrics: [
          { label: "Registry", value: "ECR scan-on-push" },
          { label: "Network", value: "awsvpc" },
          { label: "Logging", value: "CloudWatch" },
          { label: "Compute", value: "Fargate" },
        ],
      },
      {
        title: "Application and infrastructure share one delivery story.",
        body: "The repository proves the service and AWS bootstrap path. A committed, verified GitHub workflow remains the next automation milestone.",
        flow: ["Commit", "Test", "Build", "Push", "Deploy", "Observe"],
      },
    ],
  },
  {
    slug: "segmented-campus-network",
    kicker: "03 / SEGMENTED CAMPUS NETWORK",
    glow: "#18564d",
    slides: [
      {
        title: "One campus system. Two connected sites.",
        body: "The repository topology connects a main campus, a branch campus, shared services and a simulated external network.",
        image: "public/images/projects/campus-network/full-topology.png",
        imageWidth: 1030,
        imageHeight: 650,
        imageLeft: 760,
        imageTop: 190,
      },
      {
        title: "Eight VLANs shape the main campus.",
        body: "Admin, HR, Finance, Business, IT and Engineering, Arts, Student Lab and IT share a hierarchical switching path without becoming one flat broadcast domain.",
        image: "public/images/projects/campus-network/main-campus.png",
        imageWidth: 1050,
        imageHeight: 690,
        imageLeft: 740,
        imageTop: 172,
      },
      {
        title: "The branch keeps staff and students separate.",
        body: "A branch router and Layer 3 switch extend the design to VLAN 90 for staff and VLAN 100 for students.",
        image: "public/images/projects/campus-network/branch-campus.png",
        imageWidth: 820,
        imageHeight: 650,
        imageLeft: 900,
        imageTop: 188,
      },
      {
        title: "Traffic crosses clear service boundaries.",
        body: "WAN links join both sites while email, web and FTP services sit on explicit network paths that can be tested hop by hop.",
        flow: ["Email cloud", "Main router", "L3 core", "Campus VLANs", "Branch router", "Branch VLANs"],
      },
      {
        title: "Complex enough to troubleshoot by layers.",
        body: "The visual evidence covers the hierarchy and segmentation. Configuration excerpts document VLANs, trunks, DHCP and inter-VLAN routing; the Packet Tracer source remains the next reproducibility step.",
        metrics: [
          { label: "Sites", value: "2 campuses" },
          { label: "Segments", value: "10 VLANs" },
          { label: "Services", value: "Email / Web / FTP" },
          { label: "Validation", value: "Packet paths" },
        ],
      },
    ],
  },
  {
    slug: "scamshield-local-voice-agent",
    kicker: "05 / SCAMPA - SCAMSHIELD RESEARCH",
    glow: "#592e82",
    slides: [
      {
        title: "A local voice-agent architecture for defensive research.",
        body: "This demo walks through the team's Phase 1 research report and proposed system boundary.",
        image: "public/images/projects/scamshield/report-page-1.png",
        imageWidth: 520,
        imageHeight: 720,
        imageLeft: 1180,
        imageTop: 170,
      },
      {
        title: "The hard requirement is safe, controlled engagement.",
        body: "The research question combines low-latency conversation with local processing, explicit policy enforcement and strict ethical limits.",
        metrics: [
          { label: "Operation", value: "Local-first" },
          { label: "Use", value: "Defensive research" },
          { label: "Testing", value: "Controlled callers" },
          { label: "Boundary", value: "Inbound only" },
        ],
      },
      {
        title: "Speech becomes a governed response path.",
        body: "Narrow adapters keep the platform-independent engine separate from ASR, local inference, audio I/O and optional GPU acceleration.",
        flow: ["Audio in", "Whisper ASR", "Policy engine", "Local LLM", "TTS", "Audio out"],
      },
      {
        title: "Evaluation is designed into the architecture.",
        body: "The proposed instrumentation records latency, ASR accuracy, model response time, policy triggers and engagement duration for controlled experiments.",
        image: "public/images/projects/scamshield/report-page-6.png",
        imageWidth: 660,
        imageHeight: 720,
        imageLeft: 1080,
        imageTop: 170,
      },
      {
        title: "Phase 1 defines the system. Phase 2 tests it.",
        body: "The repository contains the architecture and research report. Engine implementation, model integration and measured latency remain explicitly planned work.",
        metrics: [
          { label: "Language", value: "C++20" },
          { label: "Inference", value: "llama.cpp" },
          { label: "GPU", value: "Vulkan optional" },
          { label: "Status", value: "Phase 1 design", color: palette.amber },
        ],
      },
    ],
  },
]

try {
  for (const project of projects) {
    const projectFrames = join(frameRoot, project.slug)
    mkdirSync(projectFrames, { recursive: true })
    const slides = []
    for (let index = 0; index < project.slides.length; index += 1) {
      slides.push(await renderSlide(project, project.slides[index], index, projectFrames))
    }
    const outputPath = join(videoRoot, `${project.slug}-demo.mp4`)
    encodeVideo(slides, outputPath)
    await sharp(slides[0]).webp({ quality: 88 }).toFile(join(posterRoot, `${project.slug}-demo.webp`))
    console.log(`${basename(outputPath)} generated`)
  }
} finally {
  if (existsSync(frameRoot) && frameRoot.startsWith(tmpdir())) {
    rmSync(frameRoot, { recursive: true, force: true })
  }
}
