import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/config";

export const alt = `${SITE_NAME} — Perfumes y tenis con estilo`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#faf7f2",
        }}
      >
        <div style={{ fontSize: 128, color: "#1a1714", fontWeight: 600 }}>
          {SITE_NAME}
        </div>
        <div
          style={{
            marginTop: 28,
            width: 120,
            height: 3,
            background: "#a9884f",
          }}
        />
        <div style={{ marginTop: 28, fontSize: 34, color: "#7a7269" }}>
          Perfumes y tenis con estilo
        </div>
      </div>
    ),
    { ...size }
  );
}
