from __future__ import annotations

import json
import re
from pathlib import Path
from urllib.parse import unquote

from lxml import html


ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
PRESERVED_DEPLOYMENT = "https://v0-portfolio-with-p2t4apc87-sukhna-9511s-projects.vercel.app"

PROJECTS = [
    {
        "number": "07",
        "slug": "deployguard-cloud-platform",
        "title": "DeployGuard Cloud Platform",
        "type": "SLO-Driven Progressive Delivery",
        "summary": "A working canary-release control plane that evaluates latency and error-rate SLOs, promotes healthy releases, and automatically rolls back failed gates.",
        "repository": "https://github.com/Mahal-Raj/deployguard-cloud-platform",
        "technologies": ["AWS EKS", "Terraform", "Kubernetes", "Helm", "Docker", "Prometheus", "GitHub Actions"],
        "categories": ["Cloud", "DevOps", "Automation"],
        "poster": "/images/projects/deployguard-cloud-platform.png",
        "video": "/video/deployguard-cloud-platform-demo.mp4",
        "status": "SLO gates / automatic rollback",
        "overview": "DeployGuard models the release decisions a platform team makes during a production canary. It moves traffic through 10%, 25%, 50%, and 100% stages, evaluates p95 latency and error-rate objectives, and records every promotion or rollback in an auditable timeline.",
        "problem": "A deployment being technically available does not mean it is safe to promote. The project turns release health into explicit, inspectable gates so a bad version can be stopped before it reaches all traffic.",
        "facts": [("Release path", "10% → 25% → 50% → 100%"), ("Safety", "Automatic SLO rollback"), ("Runtime", "Non-root container"), ("Evidence", "Tests, metrics, policy and audit trail")],
        "built": ["Working release controller and operations dashboard", "Latency and error-rate SLO evaluation", "Prometheus metrics and release audit timeline", "Helm chart with probes, limits, HPA, PDB and NetworkPolicy", "Terraform blueprint for private-subnet EKS, ECR, IAM and audit logging", "GitHub Actions tests, policy checks, Trivy scan and container build"],
        "architecture": ["Release dashboard", "Deployment controller", "SLO analysis gate", "Traffic promotion or rollback", "Prometheus metrics", "AWS EKS blueprint"],
        "limitations": "The controller and dashboard are fully runnable locally. The AWS and Kubernetes layers are production-oriented blueprints; provisioning them requires an AWS account and creates billable infrastructure.",
        "demo_heading": "Watch a release move through measurable gates.",
        "demo_caption": "The working demo starts a canary, evaluates the live SLO state, and shows how a failed gate produces an automatic rollback with an auditable reason.",
    },
    {
        "number": "08",
        "slug": "signaldesk-ai",
        "title": "SignalDesk AI",
        "type": "Privacy-First Incident Intelligence",
        "summary": "A local incident-routing system that redacts sensitive text, classifies alerts, explains its evidence, selects a runbook, and retrieves similar resolved cases.",
        "repository": "https://github.com/Mahal-Raj/signaldesk-ai",
        "technologies": ["Python", "scikit-learn", "NLP", "Explainable AI", "Vector Retrieval", "Docker", "CI/CD"],
        "categories": ["AI", "Software", "DevOps", "Security"],
        "poster": "/images/projects/signaldesk-ai.png",
        "video": "/video/signaldesk-ai-demo.mp4",
        "status": "81.7% macro-F1 / local inference",
        "overview": "SignalDesk converts an unstructured operational alert into a category, severity, responder team, runbook and similar historical cases without sending incident text to an external model.",
        "problem": "Incident queues mix noisy language, sensitive details and repeated failure patterns. The project creates a transparent first-pass triage workflow while keeping a human responsible for every operational action.",
        "facts": [("Task", "Six-class incident routing"), ("Evaluation", "81.7% accuracy and macro-F1"), ("Privacy", "Redaction before inference"), ("Model", "TF-IDF + logistic regression")],
        "built": ["Versioned 60-incident training and evaluation corpus", "Five-fold stratified cross-validation report", "Email, IP address and common-secret redaction", "Positive-feature explanations for each prediction", "Similar-incident retrieval and mapped runbooks", "Health, model metadata and feedback endpoints", "Non-root container plus CI tests and blocking Trivy scan"],
        "architecture": ["Incident text", "Deterministic redaction", "Local NLP classifier", "Prediction evidence", "Team and runbook routing", "Similar resolved cases"],
        "limitations": "The bundled corpus is deliberately small and demonstrates the complete ML lifecycle. Low-confidence or unfamiliar incidents require human review before any operational decision.",
        "demo_heading": "Watch an alert become an explainable response path.",
        "demo_caption": "The working demo redacts sensitive values, classifies an incident locally, exposes the weighted evidence, and returns the relevant responder, runbook and similar resolved cases.",
    },
]


def arrow(up: bool = False) -> str:
    return "↗" if up else "→"


def poster(project: dict) -> str:
    return f'''<div class="project-art project-poster-art is-compact" aria-label="{project['title']} working-demo preview">
      <p class="art-label">working system / recorded demo</p>
      <img src="{project['poster']}" alt="{project['title']} interface" loading="lazy">
      <p class="project-poster-status"><span>{project['type']}</span><strong>{project['status']}</strong></p>
    </div>'''


def card(project: dict) -> str:
    tech = "".join(f"<li>{item}</li>" for item in project["technologies"])
    cats = ",".join(project["categories"])
    return f'''<article class="project-index-item" data-categories="{cats}">
      {poster(project)}
      <div class="project-index-copy">
        <p class="project-index-meta"><span>{project['number']}</span>{project['type']}</p>
        <h2>{project['title']}</h2>
        <p>{project['summary']}</p>
        <ul>{tech}</ul>
        <div>
          <a class="arrow-link" href="/projects/{project['slug']}">View case study {arrow()}</a>
          <a class="arrow-link" href="/projects/{project['slug']}#demo">Watch demo {arrow()}</a>
          <a class="arrow-link" href="{project['repository']}" target="_blank" rel="noreferrer">Repository {arrow(True)}</a>
        </div>
      </div>
    </article>'''


def detail_page(project: dict) -> str:
    tech = "".join(f"<li>{item}</li>" for item in project["technologies"])
    facts = "".join(f"<li><span>{label}</span><strong>{value}</strong></li>" for label, value in project["facts"])
    built = "".join(f"<li><span>{index:02d}</span><p>{item}</p></li>" for index, item in enumerate(project["built"], 1))
    architecture = "".join(f"<li><span>{index:02d}</span><strong>{item}</strong></li>" for index, item in enumerate(project["architecture"], 1))
    return f'''<!doctype html>
<html lang="en" data-static-page>
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
  <link rel="preload" href="/_next/static/immutable/media/GeistMono_Variable.p.1sg4ifey12l8-.woff2" as="font" crossorigin type="font/woff2">
  <link rel="preload" href="/_next/static/immutable/media/Geist_Variable-s.p.2mxb0x7usg4km.woff2" as="font" crossorigin type="font/woff2">
  <link rel="stylesheet" href="/_next/static/immutable/chunks/3eul9gepa-d1k.css">
  <link rel="stylesheet" href="/_next/static/immutable/chunks/0sr7tyw4177yw.css">
  <link rel="stylesheet" href="/custom.css">
  <title>{project['title']} · Sukhraj Singh</title>
  <meta name="description" content="{project['summary']}">
  <link rel="canonical" href="https://portfolio-singhsukhraj.vercel.app/projects/{project['slug']}">
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="site-header" data-scrolled="false"><div class="site-shell header-inner"><div class="header-identity"><a class="header-back" aria-label="Back to projects" href="/projects"><span class="header-back-label">Back to Projects</span><span class="header-back-short">Back</span></a><a class="site-wordmark" href="/">SUKHRAJ SINGH</a></div><button class="menu-trigger" type="button" aria-label="Open navigation" aria-expanded="false"><span>Menu</span> ☰</button></div></header>
  <main id="main-content" class="case-study">
    <section class="case-hero"><div class="site-shell case-hero-grid"><div><p class="section-label">PROJECT {project['number']} / {project['type']}</p><h1 class="case-title">{project['title']}</h1><p class="case-lead">{project['summary']}</p><ul class="case-tech">{tech}</ul><div class="case-repository-links"><a class="arrow-link" href="{project['repository']}" target="_blank" rel="noreferrer">View repository {arrow(True)}</a><a class="arrow-link case-demo-jump" href="#demo">Watch demo {arrow()}</a></div></div>{poster(project)}</div></section>
    <nav class="chapter-nav" aria-label="Case-study chapters"><div class="site-shell chapter-nav-inner"><strong>{project['title']}</strong><div><a href="#overview" class="is-active">Overview</a><a href="#architecture">Architecture</a><a href="#build">What I built</a><a href="#demo">Demo</a></div></div></nav>
    <section class="case-section" id="overview"><div class="site-shell case-body"><div class="case-section-grid"><div><p class="section-label">01 / OVERVIEW</p><h2>Built around a real operational decision.</h2></div><div><p>{project['overview']}</p><p>{project['problem']}</p><ul class="case-facts">{facts}</ul></div></div></div></section>
    <section class="case-section case-architecture-section" id="architecture"><div class="site-shell case-body"><p class="section-label">02 / SYSTEM PATH</p><h2>The architecture is visible end to end.</h2><ol class="case-architecture">{architecture}</ol></div></section>
    <section class="case-section" id="build"><div class="site-shell case-body"><div class="case-section-grid"><div><p class="section-label">03 / IMPLEMENTATION</p><h2>What I built and verified.</h2></div><ol class="case-built">{built}</ol></div></div></section>
    <section class="case-demo-section" id="demo"><div class="site-shell"><div class="case-demo-intro"><div><p class="section-label">04 / WORKING DEMO</p><h2>{project['demo_heading']}</h2></div><p>{project['demo_caption']}</p></div><figure class="case-demo-figure"><video class="case-video" controls preload="metadata" poster="{project['poster']}"><source src="{project['video']}" type="video/mp4">Your browser does not support embedded video.</video><figcaption>{project['status']} · 00:12</figcaption></figure></div></section>
    <section class="case-section case-challenges"><div class="site-shell case-body"><div class="case-section-grid"><div><p class="section-label">05 / HONEST SCOPE</p><h2>Implemented claims stay separate from future infrastructure.</h2></div><p>{project['limitations']}</p></div></div></section>
    <section class="case-next"><div class="site-shell"><p>Continue through the project index.</p><a class="arrow-link" href="/projects">View all projects {arrow()}</a></div></section>
  </main>
  <footer class="site-footer"><div class="site-shell footer-grid"><a class="footer-name" href="/">Sukhraj Singh</a><nav class="footer-socials" aria-label="Social links"><a href="https://github.com/Mahal-Raj" target="_blank" rel="noreferrer">GitHub</a><a href="https://www.linkedin.com/in/sukhrajsingh0001/" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://medium.com/@mahalraj0001" target="_blank" rel="noreferrer">Medium</a><a href="mailto:mahalraj0001@gmail.com">Email</a></nav><p class="footer-year">© 2026</p></div><div class="site-shell footer-note"><span>Designed around the work and the person behind it.</span><span class="mono-label">status: still learning</span></div></footer>
  <script src="/static.js"></script>
</body></html>'''


def add_shared_assets(source: str, static_page: bool = False) -> str:
    if "/custom.css" not in source:
        source = source.replace("</head>", '<link rel="stylesheet" href="/custom.css"></head>')
    if static_page:
        source = source.replace("<html", '<html data-static-page="true"', 1)
    if "/static.js" not in source:
        source = source.replace("</body>", '<script src="/static.js"></script></body>')
    return source


def remove_runtime_scripts(source: str) -> str:
    source = re.sub(r"<script\b[^>]*>.*?</script>", "", source, flags=re.IGNORECASE | re.DOTALL)
    source = re.sub(r'<link\b[^>]*href="[^"]+\.js"[^>]*>', "", source, flags=re.IGNORECASE)
    if not re.search(r"<html\b[^>]*\bdata-static-page", source, flags=re.IGNORECASE):
        source = source.replace("<html", '<html data-static-page="true"', 1)
    source = source.replace("icon.svg%3Ficon.3nkyw0_skd342.svg", "/icon.svg")
    return source


def make_links_clean(source: str) -> str:
    replacements = {
        'href="index.html': 'href="/',
        'href="../index.html': 'href="/',
        'href="../../index.html': 'href="/',
    }
    for old, new in replacements.items():
        source = source.replace(old, new)
    source = source.replace('href="contact%3Fsubject=match.html"', 'href="/contact?subject=match"')
    source = re.sub(r'href="(?:\.\./)*(about|experience|projects|skills|education|beyond|contact)\.html', r'href="/\1', source)
    source = re.sub(r'href="(?:\.\./)*projects/([a-z0-9-]+)\.html', r'href="/projects/\1', source)
    return source


def normalize_optimized_images(source: str) -> str:
    source = re.sub(r'\s+srcset="[^"]*_next/image[^"]*"', "", source, flags=re.IGNORECASE)

    def replace(match: re.Match[str]) -> str:
        encoded = match.group(1).replace("%252F", "/").replace("%2F", "/")
        return f'src="/{unquote(encoded).lstrip("/")}'

    return re.sub(r'src="(?:\.\./)*_next/image%3Furl=%252F([^&"]+)&(?:amp;)?w=\d+&(?:amp;)?q=\d+', replace, source)


def externalize_preserved_assets(source: str) -> str:
    keep_local = {
        "/images/projects/deployguard-cloud-platform.png",
        "/images/projects/signaldesk-ai.png",
        "/video/deployguard-cloud-platform-demo.mp4",
        "/video/signaldesk-ai-demo.mp4",
    }

    def replace(match: re.Match[str]) -> str:
        attribute, path = match.groups()
        if path in keep_local:
            return match.group(0)
        return f'{attribute}="{PRESERVED_DEPLOYMENT}{path}"'

    source = re.sub(r'(src|href)="(/(?:images|video|media|research)/[^"]+)"', replace, source)
    source = re.sub(
        r'(src|href)="(?:\.\./)*(images|video|media|research|labs)/([^"]+)"',
        lambda match: f'{match.group(1)}="{PRESERVED_DEPLOYMENT}/{match.group(2)}/{match.group(3)}"',
        source,
    )
    source = source.replace('href="/labs/scampa/index.html"', f'href="{PRESERVED_DEPLOYMENT}/labs/scampa/index.html"')
    return source


def augment_index() -> None:
    path = SITE / "projects.html"
    document = html.fromstring(path.read_text(encoding="utf-8"))
    document.set("data-static-page", "true")
    for script in document.xpath("//script"):
        script.getparent().remove(script)
    grid = document.xpath("//*[contains(concat(' ', normalize-space(@class), ' '), ' projects-index ')]")[0]
    for project in PROJECTS:
        for node in grid.xpath(f".//article[.//a[contains(@href, '/{project['slug']}')]]"):
            node.getparent().remove(node)
    existing = grid.xpath(".//*[contains(concat(' ', normalize-space(@class), ' '), ' project-index-item ')]")
    existing_categories = [
        "Cloud,Automation,DevOps",
        "DevOps,Automation,Cloud,Software",
        "Networking",
        "Networking,Automation,Software,DevOps",
        "AI,Security,Software",
        "AI,Software",
    ]
    for node, categories in zip(existing, existing_categories):
        node.set("data-categories", categories)
    for project in PROJECTS:
        grid.append(html.fragment_fromstring(card(project)))
    counts = {"All": 8, "Cloud": 3, "DevOps": 5, "Networking": 2, "Automation": 4, "Software": 6, "AI": 3, "Security": 2}
    for button in document.xpath("//*[contains(concat(' ', normalize-space(@class), ' '), ' project-filters ')]//button"):
        label = (button.text or "").strip()
        spans = button.xpath(".//span")
        if spans and label in counts:
            spans[0].text = str(counts[label])
    rendered = "<!DOCTYPE html>" + html.tostring(document, encoding="unicode", method="html")
    path.write_text(externalize_preserved_assets(normalize_optimized_images(make_links_clean(add_shared_assets(rendered, static_page=False)))), encoding="utf-8")


def main() -> None:
    for path in SITE.rglob("*.html"):
        source = path.read_text(encoding="utf-8")
        source = remove_runtime_scripts(source)
        path.write_text(externalize_preserved_assets(normalize_optimized_images(make_links_clean(add_shared_assets(source)))), encoding="utf-8")
    augment_index()
    for project in PROJECTS:
        destination = SITE / "projects" / f"{project['slug']}.html"
        destination.write_text(detail_page(project), encoding="utf-8")
    sitemap = SITE / "sitemap.xml"
    existing_projects = [
        "aws-infrastructure-terraform",
        "container-delivery-pipeline",
        "segmented-campus-network",
        "customer-application-network-support-lab",
        "scamshield-local-voice-agent",
        "moodify-emotion-music-recommender",
    ]
    routes = ["", "about", "experience", "projects", "skills", "education", "beyond", "contact"]
    routes += [f"projects/{slug}" for slug in existing_projects]
    routes += [f"projects/{p['slug']}" for p in PROJECTS]
    sitemap.write_text("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n" + "\n".join(f"  <url><loc>https://portfolio-singhsukhraj.vercel.app/{route}</loc></url>" for route in routes) + "\n</urlset>\n", encoding="utf-8")


if __name__ == "__main__":
    main()
