"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import type { ProjectVisual as ProjectVisualType } from "@/data/projects"

export function ProjectVisual({ type, compact = false }: { type: ProjectVisualType; compact?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const visible = useInView(ref, { once: true, margin: "-15%" })

  if (type === "deployguard") {
    return (
      <div ref={ref} className={`project-art deployguard-art ${visible ? "is-visible" : ""} ${compact ? "is-compact" : ""}`} aria-label="DeployGuard canary release moving through four traffic stages with SLO checks and automatic rollback">
        <p className="art-label">release / progressive delivery</p>
        <div className="deployguard-release">
          <div className="deployguard-heading"><span>release/v1.8</span><strong><i /> HEALTHY</strong></div>
          <div className="deployguard-stages">
            {["10%", "25%", "50%", "100%"].map((stage, index) => (
              <div key={stage}><span>{String(index + 1).padStart(2, "0")}</span><strong>{stage}</strong><i /></div>
            ))}
          </div>
          <div className="deployguard-metrics"><span><i /> p95 latency</span><span><i /> error rate</span><strong>ALL GATES PASSED</strong></div>
        </div>
        <p className="deployguard-status"><span>PROMOTED</span><strong>SLO-GATED / AUDITED</strong></p>
      </div>
    )
  }

  if (type === "signaldesk") {
    return (
      <div ref={ref} className={`project-art signaldesk-art ${visible ? "is-visible" : ""} ${compact ? "is-compact" : ""}`} aria-label="SignalDesk privacy-first incident path from redaction through explainable classification, routing and similar-case retrieval">
        <p className="art-label">incident / private local inference</p>
        <div className="signaldesk-workspace">
          <div className="signaldesk-alert"><span>INC-2048</span><i>PII REDACTED</i><p>Service cannot reach <b>[REDACTED_IP]</b> after the latest deployment.</p></div>
          <div className="signaldesk-route"><span>EXAMPLE PREDICTION</span><strong>Network team</strong><em>92% confidence</em></div>
          <div className="signaldesk-evidence"><span>Explain</span><i /><span>Runbook</span><i /><span>Similar cases</span></div>
        </div>
        <p className="signaldesk-status"><span>LOCAL</span><strong>EXPLAINABLE / HUMAN CONFIRMED</strong></p>
      </div>
    )
  }

  if (type === "pipeline") {
    return (
      <div ref={ref} className={`project-art pipeline-art ${visible ? "is-visible" : ""} ${compact ? "is-compact" : ""}`} aria-label="Container delivery path from the Express service to CloudWatch logs">
        <p className="art-label">aws_setup.sh / delivery path</p>
        <div className="pipeline-track">
          {["Express", "Docker", "ECR", "Task", "Fargate", "Logs"].map((step, index) => (
            <div className="pipeline-node" key={step} style={{ "--step": index } as React.CSSProperties}>
              <i>{String(index + 1).padStart(2, "0")}</i><span>{step}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (type === "network") {
    return (
      <div ref={ref} className={`project-art network-art network-art-expanded ${visible ? "is-visible" : ""} ${compact ? "is-compact" : ""}`} aria-label="Two-site campus topology with a cloud edge, main and branch routers, multilayer switching, ten VLANs and shared email, web and FTP services">
        <p className="art-label">packet tracer / two-site topology</p>
        <svg viewBox="0 0 820 470" role="img" aria-hidden="true">
          <text className="network-zone-label" x="292" y="34">MAIN CAMPUS / VLANS 10-80</text>
          <text className="network-zone-label" x="686" y="34">BRANCH / VLANS 90-100</text>
          <path className="network-edge" d="M65 90H155M245 90H245M245 90H292M340 90H570M292 114V188M617 114V188M292 212L85 340M292 212L220 340M292 212L355 340M292 212L490 340M292 212L505 254M617 212L600 340M617 212L735 340" />
          <path className="network-packet packet-a" d="M65 90H292V188L85 340" />
          <path className="network-packet packet-b" d="M292 90H617V188L735 340" />
          <g className="network-device service"><rect x="20" y="66" width="90" height="48" rx="5"/><text x="65" y="86">EMAIL</text><text className="network-device-sub" x="65" y="103">CLOUD</text></g>
          <g className="network-device router"><rect x="155" y="66" width="90" height="48" rx="5"/><text x="200" y="86">CLOUD</text><text className="network-device-sub" x="200" y="103">ROUTER</text></g>
          <g className="network-device router"><rect x="245" y="66" width="95" height="48" rx="5"/><text x="292" y="86">MAIN</text><text className="network-device-sub" x="292" y="103">ROUTER</text></g>
          <g className="network-device router"><rect x="570" y="66" width="95" height="48" rx="5"/><text x="617" y="86">BRANCH</text><text className="network-device-sub" x="617" y="103">ROUTER</text></g>
          <g className="network-device core"><rect x="232" y="164" width="120" height="48" rx="5"/><text x="292" y="184">MAIN L3</text><text className="network-device-sub" x="292" y="201">CORE</text></g>
          <g className="network-device core"><rect x="555" y="164" width="125" height="48" rx="5"/><text x="617" y="184">BRANCH L3</text><text className="network-device-sub" x="617" y="201">SWITCH</text></g>
          <g className="network-device leaf"><rect x="35" y="326" width="100" height="54" rx="5"/><text x="85" y="347">ADMIN / HR</text><text className="network-device-sub" x="85" y="366">10 / 20</text></g>
          <g className="network-device leaf"><rect x="165" y="326" width="110" height="54" rx="5"/><text x="220" y="347">FIN / BIZ</text><text className="network-device-sub" x="220" y="366">30 / 40</text></g>
          <g className="network-device leaf"><rect x="300" y="326" width="110" height="54" rx="5"/><text x="355" y="347">ENG / ARTS</text><text className="network-device-sub" x="355" y="366">50 / 60</text></g>
          <g className="network-device leaf"><rect x="435" y="326" width="110" height="54" rx="5"/><text x="490" y="347">LAB / IT</text><text className="network-device-sub" x="490" y="366">70 / 80</text></g>
          <g className="network-device service"><rect x="455" y="240" width="100" height="48" rx="5"/><text x="505" y="260">WEB + FTP</text><text className="network-device-sub" x="505" y="277">SERVICES</text></g>
          <g className="network-device leaf"><rect x="552" y="326" width="96" height="54" rx="5"/><text x="600" y="347">STAFF</text><text className="network-device-sub" x="600" y="366">VLAN 90</text></g>
          <g className="network-device leaf"><rect x="684" y="326" width="102" height="54" rx="5"/><text x="735" y="347">STUDENTS</text><text className="network-device-sub" x="735" y="366">VLAN 100</text></g>
        </svg>
        <span className="network-status">10 VLANs · 2 campuses · 3 shared services</span>
      </div>
    )
  }

  if (type === "scamshield") {
    const stages = ["Audio in", "Whisper ASR", "Policy + LLM", "TTS", "Audio out"]
    return (
      <div ref={ref} className={`project-art scamshield-art ${visible ? "is-visible" : ""} ${compact ? "is-compact" : ""}`} aria-label="Proposed local voice-agent path from audio input through speech recognition, policy-controlled local inference and text-to-speech output">
        <p className="art-label">phase 1 / local voice architecture</p>
        <div className="scamshield-boundary">
          <span>LOCAL-FIRST / CONTROLLED RESEARCH</span>
          <div className="scamshield-flow">
            {stages.map((stage, index) => (
              <div className="scamshield-node" key={stage} style={{ "--step": index } as React.CSSProperties}>
                <i>{String(index + 1).padStart(2, "0")}</i>
                <strong>{stage}</strong>
              </div>
            ))}
          </div>
          <div className="scamshield-guardrails"><span>SAFETY POLICY</span><span>LOCAL INFERENCE</span><span>TRACE METRICS</span></div>
        </div>
        <p className="scamshield-status"><span>PHASE 1</span><strong>ARCHITECTURE DEFINED</strong></p>
      </div>
    )
  }

  if (type === "moodify") {
    return (
      <div ref={ref} className={`project-art moodify-art ${visible ? "is-visible" : ""} ${compact ? "is-compact" : ""}`} aria-label="Moodify signal path connecting typed context and a camera emotion signal to a recommendation and playback state">
        <p className="art-label">mood signal / recommendation path</p>
        <div className="moodify-stage">
          <div className="moodify-input moodify-text-input"><span>01</span><strong>“Calm while I work”</strong><small>TEXT CONTEXT</small></div>
          <div className="moodify-input moodify-camera-input"><span>02</span><strong>HAPPY</strong><small>CAMERA SIGNAL</small></div>
          <div className="moodify-core"><i /><span>FOCUSED</span><small>MOOD CONTEXT</small></div>
          <div className="moodify-output"><span>03</span><strong>DEEP WORK</strong><small>RECOMMENDATION</small></div>
          <div className="moodify-player">
            <div><i>▶</i><span><strong>Focus Flow</strong><small>Controlled session</small></span></div>
            <em><b />02:18 / 03:42</em>
          </div>
        </div>
        <p className="moodify-status"><span>NEXT.JS</span><span>FLASK</span><span>SPOTIFY</span><span>MONGODB</span></p>
      </div>
    )
  }

  if (type === "support") {
    const checks = [
      { label: "Local interface", status: "PASS", tone: "pass" },
      { label: "DNS", status: "PASS", tone: "pass" },
      { label: "TCP", status: "FAIL", tone: "fail" },
      { label: "HTTP", status: "SKIPPED", tone: "skip" },
    ]

    return (
      <div ref={ref} className={`project-art support-art ${visible ? "is-visible" : ""} ${compact ? "is-compact" : ""}`} aria-label="Dependency-aware support diagnostic where the local interface and DNS pass, TCP fails and HTTP is skipped">
        <p className="art-label">incident run / dependency path</p>
        <div className="support-path">
          {checks.map((check, index) => (
            <div className={`support-check is-${check.tone}`} key={check.label} style={{ "--step": index } as React.CSSProperties}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{check.label}</strong>
              <em>{check.status}</em>
            </div>
          ))}
        </div>
        <p className="support-result"><span>INC-2026-001</span><strong>NETWORK_TRANSPORT</strong></p>
      </div>
    )
  }

  if (type === "research") {
    return (
      <div ref={ref} className={`project-art research-art ${visible ? "is-visible" : ""} ${compact ? "is-compact" : ""}`} aria-label="Temporal OCR benchmark comparing a single center frame with evidence aggregated across video frames">
        <p className="art-label">ocr / controlled benchmark</p>
        <div className="research-art-grid">
          <div><span>CENTER FRAME</span><strong>12.34%</strong><small>MEAN CER</small></div>
          <i aria-hidden="true">→</i>
          <div><span>TEMPORAL</span><strong>2.10%</strong><small>MEAN CER</small></div>
        </div>
        <p className="research-art-status"><span>50 CLIPS</span><strong>STATIC + SCROLLING TEXT</strong></p>
      </div>
    )
  }

  return (
    <div ref={ref} className={`project-art infra-art ${visible ? "is-visible" : ""} ${compact ? "is-compact" : ""}`} aria-label="Terraform to AWS infrastructure flow">
      <p className="art-label">terraform plan / not applied</p>
      <div className="infra-flow">
        {["Terraform", "VPC + subnet", "ECS Fargate", "NGINX :80"].map((step, index) => (
          <div key={step}><span>{String(index + 1).padStart(2, "0")}</span><strong>{step}</strong>{index < 3 ? <i>↓</i> : null}</div>
        ))}
      </div>
      <p className="infra-status"><span>6 resources</span><span>1 service</span><span>desired 1</span></p>
    </div>
  )
}
