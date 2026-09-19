import { ImageResponse } from "next/og"

export const size = {
  width: 512,
  height: 512,
}

export const contentType = "image/png"

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 30% 25%, #263241 0%, #10141b 48%, #07090c 100%)",
          color: "#f4f0e8",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 34,
            borderRadius: 120,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "linear-gradient(135deg, rgba(216,158,88,0.25), rgba(122,168,112,0.12))",
            boxShadow: "0 20px 80px rgba(0,0,0,0.45)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(216,158,88,0.45) 0%, rgba(216,158,88,0.12) 45%, transparent 72%)",
            filter: "blur(6px)",
          }}
        />
        <div
          style={{
            fontSize: 208,
            fontWeight: 700,
            lineHeight: 1,
            fontFamily: "Arial, sans-serif",
            letterSpacing: "-0.08em",
            transform: "translateY(8px)",
            textShadow: "0 10px 24px rgba(0,0,0,0.35)",
          }}
        >
          S
        </div>
      </div>
    ),
    size
  )
}