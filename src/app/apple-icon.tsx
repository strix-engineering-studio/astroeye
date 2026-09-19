import { ImageResponse } from "next/og"

export const size = {
  width: 180,
  height: 180,
}

export const contentType = "image/png"

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #111820 0%, #07090c 100%)",
          color: "#f4f0e8",
          borderRadius: 36,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 14,
            borderRadius: 28,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "linear-gradient(135deg, rgba(216,158,88,0.26), rgba(122,168,112,0.14))",
          }}
        />
        <div
          style={{
            fontSize: 84,
            fontWeight: 700,
            lineHeight: 1,
            fontFamily: "Arial, sans-serif",
            letterSpacing: "-0.08em",
            textShadow: "0 8px 18px rgba(0,0,0,0.3)",
          }}
        >
          S
        </div>
      </div>
    ),
    size
  )
}