from __future__ import annotations

import shutil
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfgen.canvas import Canvas
from reportlab.platypus import (
    BaseDocTemplate,
    Flowable,
    Frame,
    FrameBreak,
    KeepTogether,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "output" / "pdf" / "scampa-phase-1-ieee-report.pdf"
PUBLIC_COPY = ROOT / "public" / "research" / "scamshield-phase-1.pdf"

PAGE_W, PAGE_H = letter
LEFT = RIGHT = 0.625 * inch
BOTTOM = 0.55 * inch
TOP = 0.62 * inch
GUTTER = 0.25 * inch
COLUMN_W = (PAGE_W - LEFT - RIGHT - GUTTER) / 2


def register_fonts() -> tuple[str, str, str]:
    windows_fonts = Path("C:/Windows/Fonts")
    candidates = {
        "body": windows_fonts / "times.ttf",
        "bold": windows_fonts / "timesbd.ttf",
        "italic": windows_fonts / "timesi.ttf",
    }
    if all(path.exists() for path in candidates.values()):
        pdfmetrics.registerFont(TTFont("IEEE-Times", str(candidates["body"])))
        pdfmetrics.registerFont(TTFont("IEEE-Times-Bold", str(candidates["bold"])))
        pdfmetrics.registerFont(TTFont("IEEE-Times-Italic", str(candidates["italic"])))
        return "IEEE-Times", "IEEE-Times-Bold", "IEEE-Times-Italic"
    return "Times-Roman", "Times-Bold", "Times-Italic"


BODY_FONT, BOLD_FONT, ITALIC_FONT = register_fonts()


class ArchitectureDiagram(Flowable):
    """Compact vector version of the architecture described in the Phase 1 paper."""

    def __init__(self, width: float, height: float = 174):
        super().__init__()
        self.width = width
        self.height = height

    def _box(
        self,
        canvas: Canvas,
        x: float,
        y: float,
        width: float,
        height: float,
        title: str,
        subtitle: str,
        fill: colors.Color,
        stroke: colors.Color,
    ) -> None:
        canvas.setFillColor(fill)
        canvas.setStrokeColor(stroke)
        canvas.setLineWidth(0.7)
        canvas.roundRect(x, y, width, height, 4, fill=1, stroke=1)
        canvas.setFillColor(colors.HexColor("#111827"))
        canvas.setFont(BOLD_FONT, 6.8)
        canvas.drawCentredString(x + width / 2, y + height - 14, title)
        canvas.setFillColor(colors.HexColor("#4b5563"))
        canvas.setFont(BODY_FONT, 5.7)
        canvas.drawCentredString(x + width / 2, y + 8, subtitle)

    def _arrow(self, canvas: Canvas, x1: float, y1: float, x2: float, y2: float) -> None:
        canvas.setStrokeColor(colors.HexColor("#4b5563"))
        canvas.setFillColor(colors.HexColor("#4b5563"))
        canvas.setLineWidth(0.85)
        canvas.line(x1, y1, x2, y2)
        canvas.line(x2, y2, x2 - 4, y2 + 2.3)
        canvas.line(x2, y2, x2 - 4, y2 - 2.3)

    def draw(self) -> None:
        canvas = self.canv
        w = self.width
        canvas.saveState()
        canvas.setFillColor(colors.HexColor("#f8fafc"))
        canvas.setStrokeColor(colors.HexColor("#cbd5e1"))
        canvas.roundRect(0, 0, w, self.height, 6, fill=1, stroke=1)

        if w < 400:
            pad = 10
            box_w = w - 2 * pad
            box_h = 30
            gap = 5
            start_y = self.height - 8 - box_h
            layers = [
                ("Audio input + VAD / ASR", "inbound audio and local transcription", "#eff6ff", "#93c5fd"),
                ("C++20 dialogue + policy core", "state, prompt construction, hard constraints", "#fff7ed", "#fdba74"),
                ("Sandboxed local inference", "llama.cpp with GPU backend where available", "#f5f3ff", "#c4b5fd"),
                ("Safety check + TTS output", "validated response returned as local speech", "#ecfdf5", "#86efac"),
            ]
            for index, (title, subtitle, fill, stroke) in enumerate(layers):
                y = start_y - index * (box_h + gap)
                self._box(
                    canvas,
                    pad,
                    y,
                    box_w,
                    box_h,
                    title,
                    subtitle,
                    colors.HexColor(fill),
                    colors.HexColor(stroke),
                )
                if index < len(layers) - 1:
                    centre = w / 2
                    canvas.setStrokeColor(colors.HexColor("#64748b"))
                    canvas.setLineWidth(0.8)
                    canvas.line(centre, y - 1, centre, y - gap + 1)
                    canvas.line(centre, y - gap + 1, centre - 2.5, y - gap + 4)
                    canvas.line(centre, y - gap + 1, centre + 2.5, y - gap + 4)

            obs_y = 8
            canvas.setFillColor(colors.white)
            canvas.setStrokeColor(colors.HexColor("#94a3b8"))
            canvas.setDash(3, 2)
            canvas.roundRect(pad, obs_y, box_w, 18, 4, fill=1, stroke=1)
            canvas.setDash()
            canvas.setFillColor(colors.HexColor("#475569"))
            canvas.setFont(ITALIC_FONT, 6)
            canvas.drawCentredString(w / 2, obs_y + 7, "Cross-cutting observability: metrics, logging, and JSON traces")
            canvas.restoreState()
            return

        pad = 12
        gap = 6
        node_w = (w - 2 * pad - 6 * gap) / 7
        node_y = 107
        node_h = 43
        nodes = [
            ("Audio input", "inbound only", "#eff6ff", "#93c5fd"),
            ("VAD + ASR", "local speech", "#eff6ff", "#93c5fd"),
            ("Dialogue state", "turn context", "#f5f3ff", "#c4b5fd"),
            ("Policy", "stall / clarify", "#fff7ed", "#fdba74"),
            ("Local LLM", "llama.cpp", "#f5f3ff", "#c4b5fd"),
            ("Safety check", "hard constraints", "#fff7ed", "#fdba74"),
            ("TTS output", "local speech", "#ecfdf5", "#86efac"),
        ]
        for index, (title, subtitle, fill, stroke) in enumerate(nodes):
            x = pad + index * (node_w + gap)
            self._box(
                canvas,
                x,
                node_y,
                node_w,
                node_h,
                title,
                subtitle,
                colors.HexColor(fill),
                colors.HexColor(stroke),
            )
            if index < len(nodes) - 1:
                self._arrow(canvas, x + node_w + 1, node_y + node_h / 2, x + node_w + gap - 1, node_y + node_h / 2)

        lower_y = 25
        lower_h = 52
        lower_gap = 12
        lower_w = (w - 2 * pad - 2 * lower_gap) / 3
        lower = [
            ("Platform adapters", "RtAudio / ASR / TTS interfaces"),
            ("C++20 core engine", "orchestration / prompt / inference"),
            ("Observability + host", "JSON trace / console / ImGui"),
        ]
        for index, (title, subtitle) in enumerate(lower):
            x = pad + index * (lower_w + lower_gap)
            self._box(
                canvas,
                x,
                lower_y,
                lower_w,
                lower_h,
                title,
                subtitle,
                colors.white,
                colors.HexColor("#94a3b8"),
            )

        canvas.setDash(3, 2)
        canvas.setStrokeColor(colors.HexColor("#64748b"))
        canvas.roundRect(
            pad + 2 * (node_w + gap) - 4,
            node_y - 8,
            4 * node_w + 3 * gap + 8,
            node_h + 16,
            5,
            fill=0,
            stroke=1,
        )
        canvas.setDash()
        canvas.setFillColor(colors.HexColor("#475569"))
        canvas.setFont(ITALIC_FONT, 6)
        canvas.drawString(pad + 2 * (node_w + gap), node_y - 5, "sandboxed inference and policy boundary")

        centre_x = w / 2
        self._arrow(canvas, centre_x, node_y - 8, centre_x, lower_y + lower_h + 3)
        canvas.setFillColor(colors.HexColor("#64748b"))
        canvas.setFont(ITALIC_FONT, 6)
        canvas.drawCentredString(w / 2, 8, "Narrow interfaces keep platform-specific dependencies outside the engine core.")
        canvas.restoreState()


def draw_footer(canvas: Canvas, doc: BaseDocTemplate) -> None:
    canvas.saveState()
    canvas.setFillColor(colors.HexColor("#6b7280"))
    canvas.setFont(BODY_FONT, 7.5)
    canvas.drawCentredString(PAGE_W / 2, 0.27 * inch, str(doc.page))
    canvas.restoreState()


def draw_first_page(canvas: Canvas, doc: BaseDocTemplate) -> None:
    draw_footer(canvas, doc)
    canvas.saveState()
    canvas.setFillColor(colors.black)
    canvas.setFont(BODY_FONT, 20.5)
    canvas.drawCentredString(PAGE_W / 2, PAGE_H - 0.82 * inch, "Design of a Local, GPU-Accelerated Conversational Agent")
    canvas.drawCentredString(PAGE_W / 2, PAGE_H - 1.13 * inch, "for Defensive Scambaiting Research")
    canvas.setFont(BODY_FONT, 10.5)
    canvas.drawCentredString(PAGE_W / 2, PAGE_H - 1.58 * inch, "Martin Jajarmi, Sukhraj Singh, and Yahya Fazal")
    canvas.setFont(ITALIC_FONT, 9.2)
    canvas.drawCentredString(PAGE_W / 2, PAGE_H - 1.81 * inch, "Department of Computer Science and Technology, Algoma University")
    canvas.setFont(BODY_FONT, 8.2)
    canvas.setFillColor(colors.HexColor("#4b5563"))
    canvas.drawCentredString(PAGE_W / 2, PAGE_H - 2.04 * inch, "Information Technology Security and Privacy - Group 14 - February 5, 2026")
    canvas.drawCentredString(PAGE_W / 2, PAGE_H - 2.20 * inch, "Course instructor: Dr. Yazan Otoum")
    canvas.restoreState()


def make_styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    body = ParagraphStyle(
        "IEEEBody",
        parent=base["BodyText"],
        fontName=BODY_FONT,
        fontSize=9.7,
        leading=11.55,
        alignment=TA_JUSTIFY,
        firstLineIndent=11,
        spaceAfter=6.1,
        allowWidows=0,
        allowOrphans=0,
        splitLongWords=True,
    )
    return {
        "body": body,
        "body_first": ParagraphStyle("IEEEBodyFirst", parent=body, firstLineIndent=0),
        "abstract": ParagraphStyle(
            "IEEEAbstract",
            parent=body,
            fontSize=9,
            leading=10.8,
            firstLineIndent=0,
            spaceAfter=5.5,
        ),
        "section": ParagraphStyle(
            "IEEESection",
            parent=body,
            fontName=BOLD_FONT,
            fontSize=9.6,
            leading=11.1,
            alignment=TA_CENTER,
            firstLineIndent=0,
            spaceBefore=10,
            spaceAfter=4.8,
            keepWithNext=True,
        ),
        "subsection": ParagraphStyle(
            "IEEESubsection",
            parent=body,
            fontName=ITALIC_FONT,
            fontSize=9.7,
            leading=11.55,
            alignment=TA_LEFT,
            firstLineIndent=0,
            spaceBefore=7,
            spaceAfter=3.5,
            keepWithNext=True,
        ),
        "caption": ParagraphStyle(
            "IEEECaption",
            parent=body,
            fontSize=8.15,
            leading=9.5,
            alignment=TA_CENTER,
            firstLineIndent=0,
            spaceBefore=4,
            spaceAfter=4,
        ),
        "reference": ParagraphStyle(
            "IEEEReference",
            parent=body,
            fontSize=8.3,
            leading=9.8,
            alignment=TA_LEFT,
            firstLineIndent=-12,
            leftIndent=12,
            spaceAfter=5.5,
            splitLongWords=True,
        ),
        "table_title": ParagraphStyle(
            "IEEETableTitle",
            parent=body,
            fontName=BOLD_FONT,
            fontSize=8.4,
            leading=9.7,
            alignment=TA_CENTER,
            firstLineIndent=0,
            spaceBefore=11,
            spaceAfter=5,
        ),
        "table_cell": ParagraphStyle(
            "IEEETableCell",
            parent=body,
            fontSize=8.1,
            leading=9.5,
            alignment=TA_LEFT,
            firstLineIndent=0,
            spaceAfter=0,
        ),
    }


def paragraph(text: str, style: ParagraphStyle) -> Paragraph:
    return Paragraph(text, style)


def build_document() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    PUBLIC_COPY.parent.mkdir(parents=True, exist_ok=True)

    first_top = PAGE_H - 2.47 * inch
    first_height = first_top - BOTTOM
    normal_height = PAGE_H - TOP - BOTTOM

    first_frames = [
        Frame(LEFT, BOTTOM, COLUMN_W, first_height, id="first-left", leftPadding=0, rightPadding=5, topPadding=0, bottomPadding=0),
        Frame(LEFT + COLUMN_W + GUTTER, BOTTOM, COLUMN_W, first_height, id="first-right", leftPadding=5, rightPadding=0, topPadding=0, bottomPadding=0),
    ]
    later_frames = [
        Frame(LEFT, BOTTOM, COLUMN_W, normal_height, id="later-left", leftPadding=0, rightPadding=5, topPadding=0, bottomPadding=0),
        Frame(LEFT + COLUMN_W + GUTTER, BOTTOM, COLUMN_W, normal_height, id="later-right", leftPadding=5, rightPadding=0, topPadding=0, bottomPadding=0),
    ]

    doc = BaseDocTemplate(
        str(OUTPUT),
        pagesize=letter,
        leftMargin=LEFT,
        rightMargin=RIGHT,
        topMargin=TOP,
        bottomMargin=BOTTOM,
        title="Design of a Local, GPU-Accelerated Conversational Agent for Defensive Scambaiting Research",
        author="Martin Jajarmi, Sukhraj Singh, Yahya Fazal",
        subject="SCAMPA / ScamShield Phase 1 technical report",
        creator="SCAMPA Group 14",
    )
    doc.addPageTemplates(
        [
            PageTemplate(id="First", frames=first_frames, onPage=draw_first_page),
            PageTemplate(id="Later", frames=later_frames, onPage=draw_footer),
        ]
    )

    styles = make_styles()
    story: list[Flowable] = [NextPageTemplate("Later")]

    story.extend(
        [
            paragraph(
                "<b><i>Abstract</i>-</b> Telephone-based social-engineering scams remain a significant vector for cybercrime, relying on real-time persuasion to extract credentials, payments, or system access from technologically naive victims. Defensive scambaiting, the controlled engagement of scammers to delay operations and collect behavioral data, has emerged as a potential research and mitigation strategy. This project proposes the design and implementation of a fully local, GPU-accelerated conversational agent capable of engaging scam callers in real time while enforcing strict safety constraints. The system integrates automatic speech recognition (ASR), large language model (LLM) inference, dialogue policy enforcement, and text-to-speech (TTS) synthesis into a modular, cross-platform architecture. The proposed solution emphasizes low-latency inference, sandboxed deployment, and extensibility through a statically linked core engine with platform-specific wrappers and a standalone application frontend written in C++20.",
                styles["abstract"],
            ),
            paragraph(
                "<b><i>Index Terms</i>-</b> conversational agents, defensive scambaiting, local inference, safety policy, social engineering, voice phishing.",
                styles["abstract"],
            ),
            paragraph("I. INTRODUCTION", styles["section"]),
            paragraph(
                "Telephone fraud and voice-based phishing (vishing) continue to scale globally, exploiting human trust rather than software vulnerabilities. Recent public reporting indicates that reported fraud losses increased substantially in the United States, with billions of dollars in reported losses in 2024 and a notable share attributed to contact methods such as calls and texts [1]. Telecom-side mitigations such as caller ID authentication under the STIR/SHAKEN framework aim to reduce spoofing and improve trust signals at the network layer [2], [3]. However, these mitigations do not fully address human-in-the-loop persuasion once a call is connected.",
                styles["body_first"],
            ),
            paragraph(
                "Scambaiting, the deliberate engagement of scammers to occupy their resources, has historically been performed manually. Human-operated scambaiting can be effective, but it is not easily reproducible or scalable for academic experimentation. This project proposes an automated, local-first conversational agent for controlled, inbound-only research scenarios. The system prioritizes low-latency interaction while enforcing hard safety constraints to prevent disclosure of sensitive information or execution of harmful actions.",
                styles["body"],
            ),
            paragraph("II. PROBLEM STATEMENT", styles["section"]),
            paragraph(
                "How can a real-time, fully local conversational agent be designed to safely engage scam callers for extended periods while preventing harmful actions and maintaining low-latency interaction? The proposed solution must integrate speech processing and LLM inference, enforce safety constraints in code, and remain portable across platforms.",
                styles["body_first"],
            ),
            paragraph("III. CASE STUDY CONTEXT", styles["section"]),
            paragraph(
                "This work was conducted as a course project for Information Technology Security and Privacy, with an emphasis on defensive techniques against social-engineering attacks. The agent is treated as a research tool rather than an operational, production-ready mitigation system. Evaluation is restricted to controlled inbound calls and synthetic test callers, with appropriate legal practices for any recording or data retention.",
                styles["body_first"],
            ),
            paragraph("IV. REVIEW OF RELATED WORK", styles["section"]),
            paragraph("A. Vishing and Social Engineering", styles["subsection"]),
            paragraph(
                "Vishing has been studied as a form of social engineering in which attackers apply persuasion and compliance techniques during live voice interactions. Jones et al. analyzed how persuasion principles are applied during vishing attacks, providing insight into the conversational tactics that enable escalation and victim compliance [4]. More recent work highlights vishing and voice-based social engineering as an increasing challenge and motivates automated methods for understanding and mitigating spoken deception [5]. Broader surveys of smishing and vishing detection discuss feature engineering and machine learning approaches for identifying suspicious communications [6].",
                styles["body_first"],
            ),
            paragraph("B. Network-Layer and Call-Screening Mitigations", styles["subsection"]),
            paragraph(
                "Telecom-focused interventions, including STIR/SHAKEN caller ID authentication, attempt to reduce caller ID spoofing and enable downstream blocking and labeling strategies [2], [3]. Scammers can still adapt through legitimate numbers, call forwarding, or social pretexting, leaving a gap for defenses at the conversational layer. Applied proposals have used conversational AI to analyze call content and interaction patterns [7], while recent research has examined LLM-based phone-scam detection through conversational dynamics [8].",
                styles["body_first"],
            ),
            paragraph("C. LLM-Driven Agents and Dialogue Control", styles["subsection"]),
            paragraph(
                "General-purpose LLMs can generate fluent dialogue, but robust interactive systems require an explicit control layer for objectives and safety. Agent paradigms such as ReAct interleave reasoning and action selection, improving interpretability by structuring how models select the next action [9]. A scambaiting or call-screening system can similarly separate policy decisions, such as stall, clarify, or refuse, from surface realization and enforce hard constraints outside the model.",
                styles["body_first"],
            ),
            paragraph("D. Speech Processing Components for Local Agents", styles["subsection"]),
            paragraph(
                "Modern local ASR has been accelerated by large-scale weakly supervised training. The Whisper model family demonstrates robust speech recognition across many conditions and languages [10], while whisper.cpp provides a C/C++ implementation for local inference [11]. Voice activity detection is used to segment speech and avoid unnecessary computation; practical WebRTC-based VAD implementations are common in voice applications [12].",
                styles["body_first"],
            ),
            paragraph("E. Local Inference Runtimes and Cross-Platform I/O", styles["subsection"]),
            paragraph(
                "Local runtimes such as llama.cpp target efficient LLM inference in C/C++ across varied hardware [13]. LlamaLib provides a higher-level wrapper for llama.cpp [19]. RtAudio offers a cross-platform C++ interface for real-time audio streaming [14]. Vulkan supplies a vendor-neutral API for accelerated computation [15], [16]. Platform differences in file I/O, multithreading, and input handling can be handled at compile time for POSIX and Windows APIs. GLFW and Dear ImGui provide cross-platform windowing and immediate-mode interface support with Vulkan backends [17], [18].",
                styles["body_first"],
            ),
            paragraph("V. PROPOSED SYSTEM ARCHITECTURE", styles["section"]),
            ArchitectureDiagram(COLUMN_W - 10, height=205),
            paragraph("Fig. 1. Proposed local-first SCAMPA architecture with an explicit policy and sandbox boundary.", styles["caption"]),
            paragraph(
                "The system is organized around a platform-agnostic engine core implemented as a static library. The core contains dialogue state management, policy enforcement, prompt construction, inference orchestration, and metrics logging. Platform-specific dependencies, including audio I/O, GPU backends, and speech synthesis, are accessed through narrow adapter interfaces.",
                styles["body_first"],
            ),
            paragraph(
                "A standalone console application links against the core and exposes a frontend through the engine's layer system. This separation supports runtime model configuration, replacement of ASR or TTS components, and cross-platform portability without moving policy enforcement into the model. Future work may examine direct VoIP integration; the initial evaluation instead uses external calling software and virtual audio routing in a controlled environment [20], [21].",
                styles["body"],
            ),
            paragraph("VI. PROPOSED EVALUATION METRICS", styles["section"]),
            paragraph(
                "Future phases will measure end-to-end latency from utterance completion to TTS start, ASR accuracy, LLM response time, safety-policy trigger rates, and sustained engagement time under controlled scenarios. Custom instrumentation in the core library will emit JSON traces for review with Chrome's Trace Event Format tooling, supporting bottleneck analysis and validation of real-time performance [22].",
                styles["body_first"],
            ),
            paragraph("VII. CONCLUSION AND PHASE 2 PLAN", styles["section"]),
            paragraph(
                "This Phase 1 report defines the cybersecurity motivation for automated defensive scambaiting, reviews related work in vishing, call screening, LLM agents, and speech processing, and proposes a modular, cross-platform architecture for a local voice agent. Phase 2 will implement the engine core, integrate local ASR and LLM inference with Vulkan acceleration where available, and validate safety enforcement and latency targets in controlled experiments.",
                styles["body_first"],
            ),
            KeepTogether(
                [
                    paragraph("TABLE I<br/>PHASE 1 SCOPE AND VALIDATION BOUNDARY", styles["table_title"]),
                    Table(
                        [
                            [paragraph("Dimension", styles["table_cell"]), paragraph("Phase 1 position", styles["table_cell"])],
                            [paragraph("Research use", styles["table_cell"]), paragraph("Controlled, inbound-only tests with synthetic callers.", styles["table_cell"])],
                            [paragraph("System status", styles["table_cell"]), paragraph("Architecture and interfaces defined; engine implementation planned for Phase 2.", styles["table_cell"])],
                            [paragraph("Safety", styles["table_cell"]), paragraph("Policy decisions and hard constraints remain outside unconstrained generation.", styles["table_cell"])],
                            [paragraph("Evaluation", styles["table_cell"]), paragraph("Latency, ASR accuracy, model response time, policy triggers, and engagement duration.", styles["table_cell"])],
                        ],
                        colWidths=[0.93 * inch, COLUMN_W - 0.93 * inch - 6],
                        repeatRows=1,
                        style=TableStyle(
                            [
                                ("FONTNAME", (0, 0), (-1, 0), BOLD_FONT),
                                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#eef2f7")),
                                ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#111827")),
                                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                                ("GRID", (0, 0), (-1, -1), 0.45, colors.HexColor("#94a3b8")),
                                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                                ("TOPPADDING", (0, 0), (-1, -1), 5),
                                ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
                            ]
                        ),
                    ),
                ]
            ),
            NextPageTemplate("Later"),
            PageBreak(),
            paragraph("REFERENCES", styles["section"]),
        ]
    )

    references = [
        '[1] Federal Trade Commission, "Consumer Sentinel Network Data Book 2024," 2025. [Online]. Available: https://www.ftc.gov/system/files/ftc_gov/pdf/csn-annual-data-book-2024.pdf',
        '[2] Federal Communications Commission, "Combating Spoofed Robocalls with Caller ID Authentication (STIR/SHAKEN)," 2020-2025. [Online]. Available: https://www.fcc.gov/call-authentication',
        '[3] Federal Communications Commission, "Call Authentication Trust Anchor," <i>Federal Register</i>, Aug. 19, 2025. [Online]. Available: https://www.federalregister.gov/documents/2025/08/19/2025-15809/call-authentication-trust-anchor',
        '[4] K. S. Jones, M. E. Armstrong, M. K. Tornblad, and A. S. Namin, "How social engineers use persuasion principles during vishing attacks," 2020. [Online]. Available: https://par.nsf.gov/servlets/purl/10281805',
        '[5] A. Triantafyllopoulos et al., "Vishing: Detecting social engineering in spoken communication," 2025. [Online]. Available: https://www.sciencedirect.com/science/article/pii/S0885230825000270',
        '[6] A. E. Chichwadia et al., "Detecting Smishing and Vishing Attacks using Machine Learning," 2024. [Online]. Available: https://infonomics-society.org/wp-content/uploads/Detecting-Smishing-and-Vishing-Attacks-using-Machine-Learning.pdf',
        '[7] K. M. Rao, "Suspicious Call Detection and Mitigation Using Conversational AI," 2023. [Online]. Available: https://www.tdcommons.org/cgi/viewcontent.cgi?article=7596&amp;context=dpubs_series',
        '[8] "Combating Phone Scams with LLM-based Detection," arXiv, 2024. [Online]. Available: https://arxiv.org/html/2409.11643v2',
        '[9] S. Yao et al., "ReAct: Synergizing Reasoning and Acting in Language Models," arXiv:2210.03629, 2022. [Online]. Available: https://arxiv.org/abs/2210.03629',
        '[10] A. Radford et al., "Robust Speech Recognition via Large-Scale Weak Supervision," in <i>Proc. ICML</i>, 2023. [Online]. Available: https://proceedings.mlr.press/v202/radford23a.html',
        '[11] ggml-org, "whisper.cpp," GitHub repository, accessed 2026. [Online]. Available: https://github.com/ggml-org/whisper.cpp',
        '[12] serenadeai, "webrtcvad," GitHub repository documentation, accessed 2026. [Online]. Available: https://github.com/serenadeai/webrtcvad/blob/master/README.md',
        '[13] ggml-org, "llama.cpp: LLM inference in C/C++," GitHub repository, accessed 2026. [Online]. Available: https://github.com/ggml-org/llama.cpp',
        '[14] G. P. Scavone, "RtAudio: A Cross-Platform C++ Class for Realtime Audio Input/Output," in <i>Proc. ICMC</i>, 2002. [Online]. Available: https://caml.music.mcgill.ca/~gary/papers/rtaudio2002.pdf',
        '[15] Khronos Group, "Khronos Vulkan Registry," accessed 2026. [Online]. Available: https://registry.khronos.org/vulkan/',
        '[16] Khronos Group, "Vulkan API Specification," accessed 2026. [Online]. Available: https://registry.khronos.org/vulkan/specs/latest/html/vkspec.html',
        '[17] M. Magnusson and C. Lovdahl, "GLFW - An OpenGL and Vulkan Windowing Library," accessed 2026. [Online]. Available: https://www.glfw.org',
        '[18] O. Cornut, "Dear ImGui: Immediate Mode GUI," GitHub repository, accessed 2026. [Online]. Available: https://github.com/ocornut/imgui',
        '[19] undreamai, "LlamaLib: High-Level LLM Runtime for C++ and C#," GitHub repository, accessed 2026. [Online]. Available: https://github.com/undreamai/LlamaLib',
        '[20] E. Muzychenko, "Virtual Audio Cable," accessed 2026. [Online]. Available: https://vac.muzychenko.net',
        '[21] Google LLC, "Google Voice," accessed 2026. [Online]. Available: https://voice.google.com',
        '[22] Google, "Trace Event Format," Chromium Project Documentation, accessed 2026. [Online]. Available: https://chromium.googlesource.com/catapult/+/HEAD/tracing/README.md',
    ]
    for index, reference in enumerate(references):
        story.append(paragraph(reference, styles["reference"]))
        if index == 10:
            story.append(FrameBreak())

    doc.build(story)
    shutil.copy2(OUTPUT, PUBLIC_COPY)
    print(f"Created {OUTPUT}")
    print(f"Updated {PUBLIC_COPY}")


if __name__ == "__main__":
    build_document()
