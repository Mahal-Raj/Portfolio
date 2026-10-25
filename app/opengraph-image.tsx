import { ImageResponse } from "next/og"

export const alt = "Sukhraj Singh — DevOps, Cloud & Network Engineer"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "72px", background: "#F3F3EF", color: "#111318", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: "0.12em" }}>
        <span>SUKHRAJ SINGH</span><span style={{ color: "#2768FF" }}>SS / PORTFOLIO</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div style={{ fontSize: 84, letterSpacing: "-0.055em", lineHeight: 0.96, maxWidth: 920 }}>I follow the whole path behind the screen.</div>
        <div style={{ display: "flex", gap: 20, fontSize: 24, color: "#72767D" }}><span>DevOps</span><span>·</span><span>Cloud</span><span>·</span><span>Networks</span><span>·</span><span>Automation</span></div>
      </div>
      <div style={{ width: "100%", height: 2, background: "#2768FF" }} />
    </div>,
    size,
  )
}
