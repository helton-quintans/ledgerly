import { join } from "path";
import { readFile } from "fs/promises";
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Ledgerly — Career, Health & Finance";
export const dynamic = 'force-dynamic';

export default async function Image() {
  let interData = null;
  try {
    interData = await readFile(
      join(process.cwd(), "public", "assets", "Inter-SemiBold.ttf"),
    );
  } catch (e) {
    // font not available, continue with system fonts
  }

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: "#0f172a",
        color: "white",
        fontFamily: interData
          ? "Inter"
          : "system-ui, -apple-system, sans-serif",
      }}
    >
      <div style={{ padding: 80, display: "flex", alignItems: "center" }}>
        <svg
          width={440}
          height={440}
          viewBox="-3 -3 34 34"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 0 24.249 A 28 28 0 0 0 28 24.249 A 28 28 0 0 0 14 0 A 28 28 0 0 0 0 24.249 Z"
            stroke="#ffffff"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          paddingRight: 120,
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 700 }}>ledgerly</div>
        <div style={{ height: 24 }} />
        <div style={{ fontSize: 28, color: "#cbd5e1" }}>
          Career · Health & Wellbeing · Finance
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: interData
        ? [
            {
              name: "Inter",
              data: interData,
              weight: 700,
              style: "normal",
            },
          ]
        : [],
    },
  );
}
