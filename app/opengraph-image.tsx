import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(135deg, #f7f4ef 0%, #e8dfd2 100%)",
          color: "#844502",
          fontSize: 64,
          fontWeight: 700,
        }}
      >
        <div>{siteConfig.name}</div>
        <div style={{ fontSize: 32, marginTop: 24, color: "#5c4632", fontWeight: 400 }}>
          {siteConfig.description}
        </div>
      </div>
    ),
    size,
  );
}
