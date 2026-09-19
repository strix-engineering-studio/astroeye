import { ImageResponse } from "next/og"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "linear-gradient(135deg, #0b0d10 0%, #10141b 45%, #0a0c11 100%)",
        color: "#fff",
        padding: 64,
      }}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", fontSize: 24, color: "#9bb3ff" }}>Strix</div>
        <div style={{ fontSize: 70, lineHeight: 1.02, fontWeight: 700, maxWidth: 920 }}>Strix Product Engineering Studio</div>
        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.72)", maxWidth: 920 }}>Discovery-first software products, backend systems, mobile experiences, and AI-enabled workflows designed for clarity and long-term support.</div>
      </div>
    ),
    size
  )
}
