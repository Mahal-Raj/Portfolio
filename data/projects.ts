export type ProjectCategory = "Cloud" | "DevOps" | "Networking" | "Automation" | "Software" | "AI" | "Security"
export type ProjectVisual = "deployguard" | "signaldesk" | "infrastructure" | "pipeline" | "network" | "support" | "scamshield" | "moodify" | "research"

export interface Project {
  number: string
  slug: string
  title: string
  type: string
  date: string
  ownership: string
  status: string
  contribution: string
  evidence: string
  limitation: string
  summary: string
  repository: string
  report?: string
  technologies: string[]
  categories: ProjectCategory[]
  visual: ProjectVisual
  overview: string
  facts: Array<{ label: string; value: string }>
  problem: string
  architecture: string[]
  built: string[]
  choices: Array<{ name: string; reason: string }>
  challenges: string[]
  learned: string[]
  snippet?: { label: string; language: string; code: string }
  demo?: {
    src: string
    poster: string
    duration: string
    title: string
    heading: string
    caption: string
    sequence: string
    label?: string
    interactive?: { href: string; label: string }
  }
}

export const projectCategories: Array<"All" | ProjectCategory> = [
  "All",
  "Cloud",
  "DevOps",
  "Networking",
  "Automation",
  "Software",
  "AI",
  "Security",
]

export const projects: Project[] = [
  {
    number: "01",
    slug: "deployguard-cloud-platform",
    title: "DeployGuard Cloud Platform",
    type: "Progressive Delivery & Reliability",
    date: "2026",
    ownership: "Independent project",
    status: "Working local controller + infrastructure blueprints",
    contribution: "I designed and implemented the release controller, SLO gates, rollback behavior, audit trail, tests and infrastructure blueprints.",
    evidence: "Repository, automated checks, Prometheus output, audit records and a 61-second application walkthrough.",
    limitation: "The AWS EKS and Kubernetes blueprints are reviewable but have not been provisioned in a live cloud account.",
    summary:
      "I built an SLO-driven progressive delivery control plane that promotes healthy canaries and automatically rolls back unsafe releases.",
    repository: "https://github.com/Mahal-Raj/deployguard-cloud-platform",
    technologies: ["AWS", "Kubernetes", "Terraform", "Helm", "Prometheus", "Docker"],
    categories: ["DevOps", "Cloud", "Automation", "Security"],
    visual: "deployguard",
    overview:
      "DeployGuard is a working release-control application backed by production-oriented infrastructure blueprints. It moves a canary through 10%, 25%, 50% and 100% traffic stages, evaluates p95 latency and error-rate SLOs before every promotion, and records an automatic rollback with the reason when a gate fails.",
    facts: [
      { label: "Release strategy", value: "4-stage canary" },
      { label: "Quality gates", value: "p95 latency + error rate" },
      { label: "Failure response", value: "Automatic rollback" },
      { label: "Operations", value: "Metrics + audit trail" },
    ],
    problem:
      "A deployment can be technically successful and still damage reliability. I wanted promotion to depend on observable service health instead of a manual guess, while keeping the release decision, rollback reason and infrastructure controls easy to inspect.",
    architecture: [
      "Release dashboard",
      "Deployment controller",
      "SLO analysis gate",
      "Traffic promotion or rollback",
      "Prometheus metrics",
      "GitHub Actions security checks",
      "AWS EKS via Terraform + Helm",
    ],
    built: [
      "I implemented a working release controller that advances canary traffic through 10%, 25%, 50% and 100% stages.",
      "I added p95 latency and error-rate gates so every promotion has an explicit reliability contract.",
      "I made failed gates trigger an automatic rollback and persist the reason in a production-style audit trail.",
      "I exposed Prometheus-format metrics so release state and gate outcomes can be observed outside the dashboard.",
      "I created hardened Kubernetes resources with non-root execution, a read-only filesystem, probes, limits, HPA, PDB and NetworkPolicy.",
      "I modelled a private-subnet AWS EKS control plane, ECR image scanning, IAM and audit logging with Terraform and Helm.",
      "I added unit tests, policy-as-code validation, Trivy scanning and container builds to the GitHub Actions path.",
    ],
    choices: [
      { name: "SLO gates", reason: "I used measurable latency and error-rate thresholds to decide whether a release deserves more traffic." },
      { name: "Automatic rollback", reason: "I made the safest response deterministic when a canary violates its reliability contract." },
      { name: "Prometheus", reason: "I exposed release decisions as operational data instead of leaving them only in the interface." },
      { name: "Kubernetes + Helm", reason: "I modelled the workload, scaling and disruption controls as repeatable platform configuration." },
      { name: "Terraform on AWS", reason: "I kept the EKS, ECR, IAM and audit-log blueprint reviewable before any billable deployment." },
    ],
    challenges: [
      "I had to keep promotion state deterministic while still making latency and error injection useful for an interactive local demo.",
      "I separated the fully working local controller from the AWS and Kubernetes blueprints, which require a real account and billable resources to deploy.",
      "The security path needed to cover application tests, policy checks, repository scanning and the final image without treating one green check as complete assurance.",
    ],
    learned: [
      "I learned to treat deployment as a sequence of evidence-based decisions rather than one binary event.",
      "I learned how SLOs, observability and rollback logic become part of the delivery platform itself.",
      "I learned to pair a working local control plane with honest boundaries around cloud infrastructure that has not been provisioned.",
      "I learned how runtime hardening, policy-as-code and image scanning support—but do not replace—reliability gates.",
    ],
    snippet: {
      label: "Progressive delivery contract",
      language: "release model",
      code: "10% -> 25% -> 50% -> 100%\n\nfor each stage:\n  evaluate p95 latency + error rate\n  pass -> promote\n  fail -> rollback + audit reason",
    },
    demo: {
      src: "/video/deployguard-cloud-platform-demo.mp4?v=soothing-beat-2",
      poster: "/images/projects/deployguard-demo-poster.png",
      duration: "01:01",
      title: "DeployGuard progressive delivery walkthrough",
      heading: "Watch a canary move from verification to promotion—and see an automatic rollback.",
      caption:
        "A concise visual walkthrough built from the repository's verified release stages, SLO thresholds, security checks, rollback behavior and audit model. On-screen subtitles explain every decision, accompanied by a soft motivational beat.",
      sequence:
        "Start canary -> verify delivery path -> evaluate SLOs -> promote healthy stages -> roll back a breach -> inspect the audit trail.",
      label: "SUBTITLED SYSTEM WALKTHROUGH / 01:01",
    },
  },
  {
    number: "02",
    slug: "signaldesk-ai",
    title: "SignalDesk AI",
    type: "Privacy-First Incident Intelligence",
    date: "2026",
    ownership: "Independent project",
    status: "Working local prototype · evaluated on 60 incidents",
    contribution: "I built the redaction, classification, explanation, routing, retrieval, container and test path.",
    evidence: "60-incident controlled corpus, 81.7% macro-F1 cross-validation result, repository and 61-second walkthrough.",
    limitation: "The dataset is intentionally small; predictions are advisory and require human confirmation.",
    summary:
      "I built an explainable incident-triage system that redacts sensitive data, routes alerts, recommends runbooks and retrieves similar resolved cases locally.",
    repository: "https://github.com/Mahal-Raj/signaldesk-ai",
    technologies: ["Python", "NLP", "scikit-learn", "Docker", "GitHub Actions", "Trivy"],
    categories: ["AI", "DevOps", "Security", "Software"],
    visual: "signaldesk",
    overview:
      "SignalDesk converts an unstructured incident alert into an explainable category, responder team, severity, runbook and set of similar resolved cases. It removes emails, IP addresses and common secret formats before inference, processes requests in memory, and keeps the complete decision path local rather than sending operational text to an external model.",
    facts: [
      { label: "Routing", value: "6 incident classes" },
      { label: "Controlled evaluation", value: "81.7% macro-F1 · 60 incidents" },
      { label: "Privacy", value: "Redaction before inference" },
      { label: "Model", value: "TF-IDF + logistic regression" },
    ],
    problem:
      "Operational alerts arrive as messy text and may contain data that should not be copied into an external AI service. I wanted a local system that could accelerate the first triage decision while showing responders why it suggested a route and where human confirmation is still required.",
    architecture: [
      "Incident text",
      "PII and secret redaction",
      "TF-IDF classifier",
      "Feature-level explanation",
      "Team + runbook routing",
      "Similar-case retrieval",
      "Human confirmation",
    ],
    built: [
      "I trained a six-class NLP model across authentication, compute, database, deployment, network and security incidents.",
      "I added deterministic redaction for emails, IP addresses and common secret formats before text reaches vectorization.",
      "I exposed positively weighted input features so the routing decision can be inspected instead of presented as a black box.",
      "I connected every category to a responder team, severity and runbook while retaining human confirmation before operational action.",
      "I implemented similar-case retrieval so responders can compare an alert with historical incidents and their resolutions.",
      "I added health, model-metadata and feedback endpoints around the responsive incident workspace.",
      "I containerized the service as a non-root, health-checked workload and added CI tests, image builds and blocking Trivy repository scans.",
    ],
    choices: [
      { name: "Local inference", reason: "I kept incident text on the host and avoided an external model boundary for operational data." },
      { name: "Deterministic redaction", reason: "I removed known sensitive patterns before any model feature is created." },
      { name: "TF-IDF + logistic regression", reason: "I chose a transparent baseline whose weighted features can support an explanation." },
      { name: "Similar-case retrieval", reason: "I paired classification with concrete historical context a responder can evaluate." },
      { name: "Human confirmation", reason: "I kept the model advisory because the bundled corpus is intentionally small and unfamiliar incidents need caution." },
    ],
    challenges: [
      "The bundled 60-incident corpus is intentionally small, so I report cross-validation results without presenting them as production-scale accuracy.",
      "Redaction must happen before vectorization and retrieval; applying it only to the displayed output would leave the sensitive processing boundary unchanged.",
      "The interface needed to show evidence and uncertainty clearly enough that a responder can disagree with the route.",
    ],
    learned: [
      "I learned that privacy architecture is about data flow order, not just masking text at the end.",
      "I learned how interpretable features and similar cases can make a small classical model more operationally useful.",
      "I learned to report evaluation and dataset limits beside the metric instead of hiding them behind a confident interface.",
      "I learned how model checks, container hardening and dependency scanning fit into one delivery path.",
    ],
    snippet: {
      label: "Privacy-first triage path",
      language: "system flow",
      code: "alert -> redact PII + secrets\n      -> classify + explain\n      -> route team + runbook\n      -> retrieve similar cases\n      -> human confirmation",
    },
    demo: {
      src: "/video/signaldesk-ai-demo.mp4?v=soothing-beat-2",
      poster: "/images/projects/signaldesk-demo-poster.png",
      duration: "01:01",
      title: "SignalDesk AI privacy-first incident triage walkthrough",
      heading: "Watch one incident move from redaction to an explainable, human-confirmed response.",
      caption:
        "A concise visual walkthrough built from the repository's verified privacy boundary, six-class model, explanation features, runbook routing and similar-case retrieval. On-screen subtitles explain every step, accompanied by a soft motivational beat.",
      sequence:
        "Receive alert -> redact private data -> classify locally -> explain evidence -> route team and runbook -> retrieve similar cases -> confirm as a human.",
      label: "SUBTITLED SYSTEM WALKTHROUGH / 01:01",
    },
  },
  {
    number: "03",
    slug: "aws-infrastructure-terraform",
    title: "AWS Infrastructure with Terraform",
    type: "Infrastructure as Code",
    date: "2025",
    ownership: "Independent project",
    status: "Validated Terraform plan · not applied",
    contribution: "I authored the VPC, subnet, security group, ECS cluster, task and service configuration.",
    evidence: "Repository plus an uncut initialize, validate and six-resource plan recording.",
    limitation: "The demonstration stops before terraform apply, so it does not claim a live AWS deployment.",
    summary:
      "I used Terraform to define an NGINX workload on AWS ECS Fargate together with its network, security and runtime resources.",
    repository: "https://github.com/Mahal-Raj/Project-1-Infrastructure_AWSandTerraform",
    technologies: ["Terraform", "AWS", "ECS Fargate", "HCL", "NGINX"],
    categories: ["Cloud", "Automation", "DevOps"],
    visual: "infrastructure",
    overview:
      "I built a compact Terraform implementation that declares an AWS VPC, subnet, HTTP security group, ECS cluster, Fargate task definition and single-service NGINX workload. I kept the region and cluster name variable while expressing the resource dependency chain directly in HCL.",
    facts: [
      { label: "Region", value: "us-east-1" },
      { label: "Compute", value: "ECS Fargate" },
      { label: "Task size", value: "256 CPU units / 512 MiB" },
      { label: "Workload", value: "NGINX on port 80" },
    ],
    problem:
      "I wanted to replace a console-built environment with something I could review and recreate consistently. I moved the network and container runtime into versioned configuration so I could inspect the intended state before Terraform applied it.",
    architecture: [
      "Terraform configuration",
      "AWS provider",
      "VPC 10.0.0.0/16",
      "Subnet 10.0.1.0/24",
      "Security group :80",
      "ECS Fargate + NGINX",
    ],
    built: [
      "I configured an AWS provider whose region is controlled by a variable with a us-east-1 default.",
      "I defined a 10.0.0.0/16 VPC and a 10.0.1.0/24 subnet in the first availability zone of the selected region.",
      "I created a security group that accepts TCP traffic on port 80 and permits outbound traffic for the workload.",
      "I declared an awsvpc Fargate task using nginx:latest with 256 CPU units and 512 MiB of memory.",
      "I created an ECS service with one desired task, the project subnet and security group, and public IP assignment enabled.",
    ],
    choices: [
      { name: "Terraform", reason: "I used it to keep the infrastructure declarative, reviewable and reproducible." },
      { name: "ECS Fargate", reason: "I used it to run the container task without adding EC2 host management." },
      { name: "awsvpc networking", reason: "I used it to give the Fargate task its own network interface inside the selected subnet." },
      { name: "NGINX", reason: "I used a small, recognizable HTTP workload to validate the infrastructure path." },
    ],
    challenges: [
      "I had to align the subnet, security group and public-address path before I could reach the Fargate workload.",
      "I documented a troubleshooting flow that starts with AWS identity, then checks the port 80 rule and the task's assigned address.",
    ],
    learned: [
      "I learned how Terraform references turn a set of resources into an ordered dependency graph.",
      "I learned how Fargate task sizing, network mode and service configuration work together.",
      "I learned why identity checks and network reachability belong in the same infrastructure troubleshooting process.",
    ],
    snippet: {
      label: "Fargate task profile",
      language: "hcl",
      code: "network_mode             = \"awsvpc\"\nrequires_compatibilities = [\"FARGATE\"]\ncpu                      = \"256\"\nmemory                   = \"512\"",
    },
    demo: {
      src: "/video/aws-infrastructure-terraform-demo.mp4",
      poster: "/images/projects/aws-infrastructure-terraform-demo.webp",
      duration: "00:28",
      title: "AWS Infrastructure with Terraform live local run",
      heading: "Watch the real configuration initialize, validate and plan.",
      caption: "This is an uncut screen recording of Terraform 1.15.9 using the repository's HCL and the real AWS provider. It initializes successfully, validates the configuration and produces a six-resource plan. I stop before apply so the demo creates no billable resources.",
      sequence: "Terraform version -> provider initialization -> configuration validation -> real six-resource plan.",
    },
  },
  {
    number: "04",
    slug: "container-delivery-pipeline",
    title: "Container Delivery Pipeline",
    type: "Container Delivery Foundations",
    date: "2025",
    ownership: "Independent project",
    status: "Working local container · cloud automation incomplete",
    contribution: "I built the Express service, Docker image and AWS bootstrap path across ECR, ECS, IAM, networking and logs.",
    evidence: "Repository and an uncut local build, container start and live endpoint recording.",
    limitation: "The GitHub Actions workflow is not committed, npm test is a placeholder and the Node 18 runtime is end-of-life.",
    summary:
      "I built a Dockerized Express service and AWS bootstrap workflow around ECR, ECS Fargate, IAM, networking and CloudWatch.",
    repository: "https://github.com/Mahal-Raj/Project2-MyWeb_CICD",
    technologies: ["Node.js", "Express", "Docker", "ECR", "ECS Fargate", "CloudWatch"],
    categories: ["DevOps", "Automation", "Cloud", "Software"],
    visual: "pipeline",
    overview:
      "I combined a small Express service, a Docker image and a nine-stage AWS setup script. I exposed a home page, health contract and information endpoint, then prepared the registry, runtime identity, cluster, networking, logging and Fargate service around them.",
    facts: [
      { label: "Application", value: "Express 4 / Node.js" },
      { label: "Runtime", value: "Node 18 Alpine · end-of-life" },
      { label: "Service port", value: "3001" },
      { label: "App surface", value: "3 HTTP routes" },
    ],
    problem:
      "I wanted to understand everything around the container, not just the image. I had to prepare the registry, permissions, network access, task definition, service and logs consistently before the application could run on AWS.",
    architecture: ["Express service", "Docker image", "Amazon ECR", "ECS task definition", "Fargate service", "CloudWatch logs"],
    built: [
      "I built an Express application with /, /health and /api/info routes plus environment and container identity output.",
      "I created a Node 18 Alpine image that installs the application, exposes port 3001 and starts it through npm.",
      "I wrote an AWS CLI setup script that stops on errors and verifies the active AWS identity before provisioning.",
      "I prepared an ECR repository with scan-on-push, an ECS execution role, an ECS cluster and a CloudWatch log group.",
      "I defined a Fargate task and service on the default VPC with a port 3001 security rule and public IP assignment.",
      "I created a dedicated IAM user and documented the repository-secret handoff for the planned GitHub automation path.",
    ],
    choices: [
      { name: "Express", reason: "I kept the service small while still exposing runtime and health information." },
      { name: "Docker", reason: "I used it to turn the application and Node runtime into one repeatable deployment unit." },
      { name: "ECR", reason: "I used it to store versioned container images inside the AWS delivery path." },
      { name: "ECS Fargate", reason: "I used it to run the workload without managing EC2 hosts directly." },
      { name: "CloudWatch", reason: "I used it for runtime logs and deployment investigation." },
    ],
    challenges: [
      "I had to align IAM, ECR, the default VPC, port 3001 access, the task definition and CloudWatch before the service could settle.",
      "I documented a GitHub Actions test-build-deploy flow, but the current main branch does not contain that workflow file; adding and verifying it remains my clearest next implementation step.",
      "The current npm test command is a placeholder, so I still need real endpoint tests before I would call the pipeline production-ready.",
    ],
    learned: [
      "I learned how application code, a container image, a registry and a managed runtime form one delivery path.",
      "I learned why a stable health endpoint is the simplest contract between an application and deployment tooling.",
      "I learned how IAM, network access and centralized logs surround the visible application deployment.",
      "I learned to evaluate documented automation separately from committed, executable automation.",
    ],
    snippet: {
      label: "Runtime contract",
      language: "http",
      code: "GET /health\n\n{\n  status: \"healthy\",\n  environment: process.env.ENVIRONMENT\n}",
    },
    demo: {
      src: "/video/container-delivery-pipeline-demo.mp4",
      poster: "/images/projects/container-delivery-pipeline-demo.webp",
      duration: "00:36",
      title: "Container Delivery Pipeline live local run",
      heading: "Watch the actual image build, container start and service respond.",
      caption: "This is an uncut local run from the repository: npm executes, Docker builds the image, a container starts on port 3001, and the live /health and /api/info endpoints return their runtime JSON.",
      sequence: "npm test -> Docker build -> container start -> live health and information responses.",
    },
  },
  {
    number: "05",
    slug: "segmented-campus-network",
    title: "Segmented Campus Network",
    type: "Network Engineering",
    date: "2025",
    ownership: "Independent project",
    status: "Documented network design · partial reproducibility",
    contribution: "I designed the two-site topology, segmentation, service paths and validation plan.",
    evidence: "Five topology views, configuration excerpts and packet-level validation guidance in the repository.",
    limitation: "The Packet Tracer source is not published, and the four-VLAN summary does not yet match the ten-VLAN diagrams.",
    summary:
      "I designed a two-site Cisco campus system with hierarchical switching, ten VLANs, WAN links, shared services and packet-level validation.",
    repository: "https://github.com/Mahal-Raj/campus-network-design-packet-tracer",
    technologies: ["Cisco Packet Tracer", "VLANs", "Layer 3 Switching", "WAN", "DHCP", "Routing"],
    categories: ["Networking"],
    visual: "network",
    overview:
      "I documented a Cisco Packet Tracer design that connects a main campus, a branch campus and external services through explicit routing and switching boundaries. The repository topology shows eight main-campus VLANs, two branch VLANs, main and branch routers, multilayer switching, WAN point-to-point links and email, web and FTP services.",
    facts: [
      { label: "Sites", value: "Main + branch campus" },
      { label: "Segmentation", value: "10 documented VLANs" },
      { label: "Services", value: "Email, web and FTP" },
      { label: "Repository evidence", value: "5 topology images" },
    ],
    problem:
      "I wanted to move beyond a flat departmental LAN and reason about a campus as a connected system. The design needed to separate users by role, preserve access to shared services and extend the same structure across a second site without making every failure look the same.",
    architecture: [
      "Email service + cloud edge",
      "Main-campus router",
      "Main-campus multilayer core",
      "Eight building and service VLANs",
      "Web + FTP services",
      "Point-to-point WAN",
      "Branch router + multilayer switch",
      "Staff VLAN 90 + student VLAN 100",
    ],
    built: [
      "I separated the main campus into VLANs 10 through 80 for Admin, HR, Finance, Business, IT and Engineering, Arts, Student Lab and IT services.",
      "I extended the design to a branch campus with VLAN 90 for staff and VLAN 100 for students behind a branch router and multilayer switch.",
      "I connected the two campuses through a point-to-point WAN path and documented a separate cloud-facing email service path.",
      "I placed web and FTP services on explicit main-campus network paths instead of treating every endpoint as an undifferentiated client.",
      "I documented VLAN creation, access-port membership, 802.1Q trunking, inter-VLAN routing and DHCP configuration patterns.",
      "I created a validation plan covering same-VLAN reachability, cross-VLAN paths, address assignment, end-to-end pings and simulation-mode packet tracking.",
      "I added five topology views so the whole system, main campus, branch campus, buildings and cloud edge can be inspected separately.",
    ],
    choices: [
      { name: "Hierarchical campus design", reason: "I used it to separate edge routing, campus distribution and end-device access responsibilities." },
      { name: "Ten VLANs", reason: "I used role-based segments to create intentional broadcast and troubleshooting boundaries across both sites." },
      { name: "Multilayer switching", reason: "I centralized the campus distribution path instead of sending every department directly to the WAN routers." },
      { name: "Point-to-point WAN links", reason: "I used explicit inter-site networks to make the main, branch and cloud paths visible." },
      { name: "DHCP and service networks", reason: "I separated client addressing from the web, FTP and email service paths the clients depend on." },
    ],
    challenges: [
      "I had to keep VLAN membership, trunk carriage, gateway addressing, DHCP scopes and routed WAN networks consistent across far more than one department.",
      "The repository's topology evidence is richer than its four-VLAN summary table, so I distinguish what the diagrams show from what the configuration excerpts document.",
      "ACLs, STP tuning, EtherChannel, full OSPF and firewall policy remain future enhancements rather than completed claims.",
      "The repository currently contains topology images and configuration excerpts but not the Packet Tracer source file, which is the clearest remaining reproducibility gap.",
    ],
    learned: [
      "I learned how a second site changes addressing, routing and failure-domain decisions that look simple inside one building.",
      "I learned how hierarchical switching and role-based VLANs keep a larger topology understandable.",
      "I learned to validate shared services and WAN paths separately from local switching behavior.",
      "I learned why packet-level evidence and reproducible source files matter as much as a convincing topology image.",
    ],
    snippet: {
      label: "Branch segmentation",
      language: "cisco",
      code: "vlan 90\n name STAFF\n\nvlan 100\n name STUDENTS\n\n! branch networks: 192.168.9.0/24 + 192.168.10.0/24",
    },
  },
  {
    number: "06",
    slug: "customer-application-network-support-lab",
    title: "Customer Application Network Support Lab",
    type: "Customer Application Engineering",
    date: "2026",
    ownership: "Independent project",
    status: "Working local diagnostic · automated scenarios passing",
    contribution: "I implemented the Java diagnostic path, dependency-aware failure handling and JSON/Markdown support reports.",
    evidence: "Repository, generated support artifacts, 13 assertions and an uncut 36-second local run.",
    limitation: "The lab uses controlled targets and remains intentionally read-only; it does not claim production customer access.",
    summary:
      "I built a Java support workflow that follows a customer application path from the local interface through DNS, TCP and HTTP, then turns the evidence into a clear fault-domain assessment.",
    repository: "https://github.com/Mahal-Raj/customer-application-network-support-lab",
    technologies: ["Java 17", "Linux", "TCP/IP", "PowerShell", "Python", "GitHub Actions"],
    categories: ["Networking", "Automation", "Software", "DevOps"],
    visual: "support",
    overview:
      "I built a dependency-aware diagnostic tool for a customer-reported network management application problem. It validates the incident input, checks the local interface, DNS, TCP connectivity and HTTP health in order, isolates the first failing layer, and produces both machine-readable evidence and a customer-ready report.",
    facts: [
      { label: "Runtime", value: "Java 17 / JVM" },
      { label: "Diagnostic path", value: "Interface to HTTP" },
      { label: "Verification", value: "13 assertions" },
      { label: "Outputs", value: "JSON + Markdown" },
    ],
    problem:
      "A customer may report that a network management application is unavailable, but that symptom alone does not identify whether the problem begins on the diagnostic host, in DNS, at the network transport layer or inside the application. I wanted a repeatable workflow that collects evidence in dependency order and communicates a bounded next step without overstating the root cause.",
    architecture: [
      "Incident properties",
      "Local interface",
      "DNS resolution",
      "TCP connection",
      "HTTP health",
      "Assessment + reports",
    ],
    built: [
      "I created a validated properties input for the customer, application, target host, service port, health path and timeouts without storing credentials.",
      "I implemented ordered Java checks for active local interfaces, hostname resolution, TCP connectivity and the HTTP health response.",
      "I marked dependent checks as skipped after a lower-layer failure so one broken dependency does not appear as several unrelated incidents.",
      "I classified the first failing layer as local host, DNS, network transport or application, with a healthy baseline when the complete path succeeds.",
      "I generated a structured JSON support bundle and a readable Markdown report, then added a Python helper for concise support handoffs.",
      "I added PowerShell and Bash build paths, a Linux network-state collector, and GitHub Actions checks for the Java, Python and shell workflow.",
      "I verified healthy, HTTP 503, DNS failure, closed-port, skipped-dependency, validation and report-generation scenarios with 13 assertions.",
    ],
    choices: [
      { name: "Java 17", reason: "I used the JVM to model typed configuration, diagnostic results, fault domains and report generation in one dependency-free application." },
      { name: "Layered checks", reason: "I ordered the workflow by dependency so DNS must pass before TCP, and TCP must pass before HTTP." },
      { name: "JSON + Markdown", reason: "I separated machine-readable evidence from the customer-facing explanation while generating both from the same assessment." },
      { name: "PowerShell, Bash and Python", reason: "I used small scripts to keep the workflow practical across Windows and Linux and to create a concise handoff summary." },
      { name: "GitHub Actions", reason: "I used CI to compile the Java workflow, run its scenarios and validate the supporting Python and shell files on every push and pull request." },
    ],
    challenges: [
      "I had to separate observed evidence from inference so the tool identifies a likely fault domain without claiming a definitive root cause it cannot prove.",
      "I had to preserve the dependency chain: an HTTP check should be skipped after a TCP failure rather than reported as a second failure.",
      "I kept the lab intentionally read-only; it does not capture packets, use credentials, run remote commands or change customer configuration.",
    ],
    learned: [
      "I learned to troubleshoot from the lowest relevant dependency upward instead of jumping directly to the visible application symptom.",
      "I learned how to make Java diagnostics useful to support work by pairing evidence with concise, bounded next actions.",
      "I learned why a known-good healthy run is valuable when comparing intermittent customer incidents and platform logs.",
      "I learned to treat automated classification as a support aid, not a replacement for customer timelines, routing evidence or application logs.",
    ],
    snippet: {
      label: "Dependency-aware result",
      language: "diagnostic",
      code: "LOCAL_INTERFACE  PASS\nDNS              PASS\nTCP              FAIL\nHTTP             SKIPPED\n\nfaultDomain=NETWORK_TRANSPORT",
    },
    demo: {
      src: "/video/customer-application-support-lab-demo.mp4",
      poster: "/images/projects/customer-application-support-lab-demo.webp",
      duration: "00:36",
      title: "Customer Application Network Support Lab live local run",
      heading: "Watch the real diagnostic path produce support-ready evidence.",
      caption: "This is an uncut local run: the Java test suite passes 13 assertions, a real local HTTP target starts, interface, DNS, TCP and HTTP checks execute, and the application writes JSON and Markdown handoff artifacts.",
      sequence: "13 assertions -> local customer target -> layered diagnostics -> generated support summary.",
    },
  },
  {
    number: "07",
    slug: "scamshield-local-voice-agent",
    title: "SCAMPA: ScamShield Local Voice Agent",
    type: "Defensive AI Course Research",
    date: "2026",
    ownership: "Three-person research team + individual reconstruction",
    status: "Phase 1 proposal · separate controlled reconstruction",
    contribution: "I co-authored the research architecture and built the separate deterministic portfolio reconstruction.",
    evidence: "IEEE-formatted course report, repository, recorded reconstruction and interactive controlled lab.",
    limitation: "The reconstruction demonstrates the policy boundary; it is not proof of local ASR or LLM inference.",
    summary:
      "As part of a three-person research team, I co-designed a local-first voice-agent architecture for controlled defensive scambaiting research.",
    repository: "https://github.com/Mahal-Raj/ScamShield-LLM",
    report: "/research/scamshield-phase-1.pdf",
    technologies: ["C++20", "Whisper", "llama.cpp", "RtAudio", "Vulkan", "CMake"],
    categories: ["AI", "Security", "Software"],
    visual: "scamshield",
    overview:
      "SCAMPA is represented by the ScamShield-LLM Phase 1 work on my GitHub: an IEEE-formatted course research report and proposed modular architecture for a fully local conversational agent. The design connects speech recognition, policy enforcement, local LLM inference, speech synthesis, audio I/O and performance instrumentation while keeping the research boundary controlled and defensive.",
    facts: [
      { label: "Stage", value: "Phase 1 architecture" },
      { label: "Core", value: "Proposed C++20 static library" },
      { label: "Pipeline", value: "ASR -> policy -> LLM -> TTS" },
      { label: "Research team", value: "3 contributors" },
    ],
    problem:
      "The research asks how a real-time local agent could engage scam callers long enough to support controlled cybersecurity study without disclosing sensitive information, executing harmful actions or depending on cloud inference. That requires conversational latency, safety policy and privacy to be designed as one system rather than separate features.",
    architecture: [
      "Controlled inbound audio",
      "Voice activity detection",
      "Whisper-compatible ASR",
      "Dialogue state + policy engine",
      "Local llama.cpp inference",
      "TTS + RtAudio output",
      "Optional Vulkan acceleration",
      "Metrics + Chrome Trace logs",
    ],
    built: [
      "I co-authored the Phase 1 report with Martin Jajarmi and Yahya Fazal for an Information Technology Security and Privacy course project at Algoma University.",
      "We defined a controlled, inbound-only research scenario and documented the ethical, privacy and consent boundaries around voice data.",
      "We proposed a platform-independent engine core for dialogue state, policy enforcement, prompt construction, inference orchestration and metrics logging.",
      "We separated platform-specific speech, audio and GPU dependencies behind narrow adapters so ASR, TTS and LLM backends can be replaced.",
      "We selected a local C++20 stack around Whisper-compatible ASR, llama.cpp-compatible inference, RtAudio, GLFW, Dear ImGui and optional Vulkan acceleration.",
      "We defined future evaluation around end-to-end latency, ASR accuracy, model response time, safety-policy triggers and sustained engagement time.",
      "We documented Phase 2 as planned implementation and controlled validation rather than presenting the proposal as a completed product.",
      "For this portfolio, I built a separate deterministic reconstruction that executes the documented safety boundary against a controlled voice fixture and sends its bounded response to local desktop text-to-speech.",
    ],
    choices: [
      { name: "Local-first processing", reason: "The design keeps audio and model inference on the research machine to reduce unnecessary data exposure." },
      { name: "Explicit policy engine", reason: "Safety decisions remain outside unconstrained model generation so stall, clarify and refuse actions can be enforced in code." },
      { name: "C++20 core", reason: "The proposed static-library boundary supports low-level audio, inference and performance control across desktop platforms." },
      { name: "Narrow adapters", reason: "ASR, TTS, audio and GPU implementations can change without rewriting dialogue and policy logic." },
      { name: "Trace-based metrics", reason: "The proposal makes latency and policy behavior measurable instead of relying on subjective conversational impressions." },
    ],
    challenges: [
      "The architecture has to balance low response latency with safety checks that cannot be skipped when the conversation becomes unpredictable.",
      "Voice research introduces consent, privacy, retention and telecommunications constraints, so the design is restricted to controlled testing.",
      "Local models, speech processing and optional GPU acceleration create hardware and cross-platform integration constraints that Phase 2 still needs to validate.",
      "The current repository contains the report and proposed architecture, not the engine implementation; the case study keeps that boundary explicit.",
    ],
    learned: [
      "I learned to place safety policy in the system architecture rather than treating it as a prompt-writing detail.",
      "I learned how ASR, local inference, TTS and audio routing contribute separately to end-to-end conversational latency.",
      "I learned why replaceable adapters are important when hardware, models and platform APIs evolve independently.",
      "I learned to describe research-stage work by what is defined, what is measurable and what still has to be implemented.",
    ],
    snippet: {
      label: "Proposed policy boundary",
      language: "research model",
      code: "audio -> ASR -> dialogue state\n              -> policy: STALL | CLARIFY | REFUSE\n              -> local LLM -> TTS\n\nmeasure: latency | accuracy | policy triggers",
    },
    demo: {
      src: "/video/scamshield-reconstructed-local-demo.mp4",
      poster: "/images/projects/scamshield-reconstructed-local-demo.jpg",
      duration: "00:41",
      title: "SCAMPA controlled local reconstruction",
      heading: "Watch one controlled utterance move through the reconstructed safety path.",
      caption:
        "This is a 1080p screen recording of a separate portfolio reconstruction based on the Phase 1 architecture. It executes real local rule analysis, calculates a risk score, enforces a CLARIFY + STALL action and sends the bounded response to desktop text-to-speech. It is not presented as the deleted Phase 2 showcase or as proof of local ASR or LLM inference.",
      sequence:
        "Controlled voice fixture -> transcript adapter -> deterministic safety policy -> bounded response -> local desktop TTS.",
      label: "RECONSTRUCTED LOCAL EXECUTION / 00:41",
      interactive: {
        href: "/labs/scampa/index.html",
        label: "Open the interactive reconstruction",
      },
    },
  },
  {
    number: "08",
    slug: "moodify-emotion-music-recommender",
    title: "Moodify: Emotion-Aware Music Recommender",
    type: "Full-Stack AI Application",
    date: "2025",
    ownership: "Three-person team project",
    status: "Team prototype · controlled local frontend demo",
    contribution: "My documented contribution covers project documentation, an authentication readability change and four local frontend build repairs for the demo.",
    evidence: "Shared repository history and a 26-second controlled recording of the repaired dashboard state flow.",
    limitation: "Spotify, Gemini, MongoDB and webcam calls use clearly labelled local fixtures in the portfolio demo.",
    summary:
      "As part of a three-person team, I helped connect a Next.js music dashboard with a Flask API for mood signals, Spotify playback and preference scoring.",
    repository: "https://github.com/Meet16123/Moodify",
    technologies: ["Next.js", "TypeScript", "Flask", "Python", "Spotify API", "MongoDB"],
    categories: ["AI", "Software"],
    visual: "moodify",
    overview:
      "Moodify is a team-built full-stack prototype that turns a typed situation or webcam emotion signal into a music context. The repository connects a Next.js dashboard to a Flask API for Spotify OAuth and playback, Gemini-assisted text analysis, webcam state, song reaction scoring and real-time database updates.",
    facts: [
      { label: "Team", value: "3 contributors" },
      { label: "Interface", value: "Next.js + React" },
      { label: "API", value: "Flask + Python" },
      { label: "State updates", value: "SSE + polling" },
    ],
    problem:
      "Static playlists do not respond to the context around a listening session. Our project explored how text sentiment, facial emotion and listening reactions could become signals for selecting, playing and re-ranking music without making the interface feel like a collection of disconnected AI features.",
    architecture: [
      "Next.js dashboard",
      "Flask REST API",
      "Gemini text analysis",
      "Spotify OAuth + playback",
      "DeepFace webcam signal",
      "MongoDB reaction scores",
      "SSE dashboard updates",
    ],
    built: [
      "We created a Next.js dashboard with Spotify authentication state, a situation input, mood filters, ranked songs, webcam controls and a persistent playback surface.",
      "We implemented Flask endpoints for text analysis, Spotify playback controls, webcam lifecycle, face-distance volume recommendations and enjoyed-song retrieval.",
      "We modelled per-track reactions with total scores and an emotion breakdown for happy, sad, angry, surprise, fear, disgust, neutral and skipped states.",
      "We used Server-Sent Events for database notifications while retaining periodic refreshes as a fallback for the song-ranking view.",
      "The Git history credits my account with the project documentation and a later Spotify authentication readability change; the application itself is presented as shared team work.",
      "For the portfolio recording, I repaired the frontend's path alias, component import, JSX class string and missing Spotify color tokens so the repository dashboard could build and run locally.",
    ],
    choices: [
      { name: "Next.js", reason: "We used it for the dashboard, client-side state and the interaction surface around mood, songs and playback." },
      { name: "Flask", reason: "We used a Python API boundary to coordinate AI, webcam, database and Spotify integrations." },
      { name: "Spotify Web API", reason: "It provides the OAuth, search, queue and playback controls needed for a real listening workflow." },
      { name: "Gemini + DeepFace", reason: "The design separates text context from visual emotion so each signal can contribute without becoming the whole recommendation." },
      { name: "MongoDB", reason: "The flexible track documents store total preference scores beside emotion-specific reaction counts." },
      { name: "SSE + polling", reason: "The dashboard can react to new scoring data while retaining a simple recovery path if the event stream closes." },
    ],
    challenges: [
      "The application coordinates several stateful external boundaries: Spotify OAuth and device playback, Gemini responses, webcam processing and MongoDB availability.",
      "Mood detection, playback polling and database events can update the same interface at different intervals, so stale or contradictory state is a practical concern.",
      "The public repository does not include service credentials or a fully self-contained backend environment, so the recorded demo uses clearly labelled local API fixtures instead of presenting external integrations as live.",
      "The frontend required four small local build repairs before it could be recorded; those capture-only corrections are not claimed as changes to the shared upstream repository.",
    ],
    learned: [
      "I learned how a frontend and Python API divide responsibility in a full-stack application.",
      "I learned that OAuth, playback devices and rate-limited APIs create product states the interface must explain clearly.",
      "I learned to treat text and camera outputs as replaceable signals rather than letting one model control the complete experience.",
      "I learned that a credible demo must separate verified interface behavior from integrations that still require credentials, hardware or external services.",
    ],
    snippet: {
      label: "Dashboard contracts",
      language: "http",
      code: "POST /api/analyze-situation\n  -> { sentiment, keyword }\n\nGET  /api/current-playback\n  -> { track, device, is_playing }\n\nGET  /api/db-updates\n  -> text/event-stream",
    },
    demo: {
      src: "/video/moodify-controlled-local-demo.mp4",
      poster: "/images/projects/moodify-controlled-local-demo.jpg",
      duration: "00:26",
      title: "Moodify controlled local frontend run",
      heading: "Watch the repository dashboard respond across mood, camera and playback states.",
      caption:
        "This is a real 1080p screen recording of the repository's Next.js dashboard after the local build repairs described above. For repeatability and privacy, requests to Spotify, Gemini, MongoDB and webcam services are intercepted with controlled contract-shaped fixtures. The recording verifies the dashboard state flow, filtering and playback controls; it does not claim live external services or model inference.",
      sequence:
        "Repository frontend -> controlled authentication -> webcam state -> situation analysis -> mood filter -> playback change.",
      label: "CONTROLLED LOCAL FRONTEND RUN / 00:26",
    },
  },
  {
    number: "09",
    slug: "temporal-consensus-ocr-research",
    title: "Temporal-Consensus OCR Research",
    type: "Accessible Video Text Research",
    date: "2026",
    ownership: "Independent research revision",
    status: "Working local pipeline · controlled benchmark",
    contribution: "I rebuilt the OCR pipeline, deterministic benchmark, evaluation, accessible report and four-page manuscript.",
    evidence: "Open repository, downloadable paper and a reproducible 50-clip benchmark with machine-readable results.",
    limitation: "The benchmark is synthetic and uses a known single-line region; real broadcasts, languages and automatic localization remain unverified.",
    summary:
      "I built a local video-text pipeline that combines OCR evidence across frames to recover static lower-thirds and scrolling news tickers.",
    repository: "https://github.com/Mahal-Raj/NewsHeadlinesExtractor_OCR",
    report: "/research/temporal-consensus-ocr.pdf",
    technologies: ["Python", "RapidOCR", "OpenCV", "ONNX Runtime", "Accessibility"],
    categories: ["AI", "Software", "Automation"],
    visual: "research",
    overview:
      "This research asks whether lightweight temporal aggregation can recover a known headline region more accurately than single-frame OCR. The CPU-oriented pipeline compares raw, contrast-equalized and binarized hypotheses, filters them with confidence-aware rules, resolves static text with a weighted medoid and reconstructs scrolling text through fuzzy token overlap.",
    facts: [
      { label: "Controlled corpus", value: "50 four-second clips" },
      { label: "Mean character error", value: "12.34% to 2.10%" },
      { label: "Exact match", value: "70.0%" },
      { label: "Threshold success", value: "40/40 positive clips" },
    ],
    problem:
      "Text in news lower-thirds and tickers may never appear in audio or captions, and a moving headline may not be fully visible in any single frame. I wanted a local, inspectable method that combines temporal evidence while keeping its evaluation and limits reproducible.",
    architecture: [
      "Video frames",
      "Normalized headline region",
      "Raw + CLAHE + Otsu hypotheses",
      "RapidOCR recognition",
      "Confidence-aware filtering",
      "Static consensus or ticker assembly",
      "JSON + accessible HTML",
    ],
    built: [
      "I created a resolution-independent sampling and headline-region pipeline for static and scrolling text.",
      "I implemented quality-weighted consensus for static overlays and fuzzy chronological overlap for tickers.",
      "I generated a deterministic 50-clip benchmark spanning two motion modes, four degradations and ten negative controls.",
      "I compared center-frame, multiview and temporal conditions with character, word, exact-match and sequence-success measures.",
      "I exported inspectable JSON, regenerated result tables and a high-contrast browser report with local text-to-speech controls.",
    ],
    choices: [
      { name: "Temporal aggregation", reason: "A scrolling sentence may be structurally incomplete in every individual frame, so evidence must be assembled over time." },
      { name: "Local CPU inference", reason: "The pipeline remains inspectable and usable without sending video content to a cloud OCR boundary." },
      { name: "Synthetic benchmark", reason: "A fixed generator makes the mechanism and degradations reproducible while clearly limiting external-validity claims." },
      { name: "Accessible output", reason: "Visible text, keyboard-friendly controls and local speech synthesis make the recovered headline useful beyond a raw OCR string." },
    ],
    challenges: [
      "Ticker assembly must join partial text without turning a plausible overlap into an incorrect word.",
      "The supplied one-line region keeps the experiment focused but does not solve full-frame text detection or tracking.",
      "A 100% threshold-success result on the controlled positives is not 100% transcription accuracy; exact match remains 70.0%.",
    ],
    learned: [
      "I learned to separate mechanism validation from claims about real-world readiness.",
      "I learned that temporal evidence contributes the gain; preprocessing alone did not improve the center-frame baseline.",
      "I learned to keep OCR candidates and evaluation artifacts visible enough for someone else to audit.",
    ],
    snippet: {
      label: "Verified benchmark result",
      language: "evaluation",
      code: "center-frame CER: 12.34%\ntemporal CER:      2.10%\nexact match:       70.0%\nthreshold success: 40 / 40 positives",
    },
  },
]

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug)
}
