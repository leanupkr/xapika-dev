import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
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
          backgroundColor: "#0B1F3A",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background:
              "radial-gradient(ellipse at 100% 100%, rgba(246,163,23,0.18) 0%, transparent 60%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 0,
            bottom: 0,
            width: "100%",
            height: "18px",
            backgroundColor: "#F6A317",
          }}
        />
        <div
          style={{
            color: "#F6A317",
            fontSize: 110,
            fontWeight: 700,
            letterSpacing: "-0.05em",
            lineHeight: 1,
            display: "flex",
          }}
        >
          X
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "0.24em",
            marginTop: 4,
            display: "flex",
          }}
        >
          XAPIKA
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
