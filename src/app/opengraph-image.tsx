import { ImageResponse } from "next/og";

export const alt = "Xapika Engineering — Precision rail maintenance with uncompromised safety";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          backgroundColor: "#0B1F3A",
          fontFamily: "ui-sans-serif, system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* radial primary glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "55%",
            height: "100%",
            background:
              "radial-gradient(ellipse at 100% 50%, rgba(246,163,23,0.18) 0%, transparent 65%)",
          }}
        />

        {/* rail lines on left */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 80,
            width: "1px",
            height: "100%",
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.18) 30%, rgba(255,255,255,0.18) 70%, transparent 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 96,
            width: "1px",
            height: "100%",
            background:
              "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.10) 30%, rgba(255,255,255,0.10) 70%, transparent 100%)",
          }}
        />

        {/* primary accent — top track */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "4px",
            backgroundColor: "#F6A317",
          }}
        />

        {/* Header — overline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            zIndex: 10,
          }}
        >
          <div
            style={{
              width: 36,
              height: 2,
              backgroundColor: "#F6A317",
            }}
          />
          <div
            style={{
              color: "rgba(255,255,255,0.85)",
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
            }}
          >
            Xapika Engineering
          </div>
        </div>

        {/* H1 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            zIndex: 10,
            maxWidth: 980,
          }}
        >
          <div
            style={{
              color: "#FFFFFF",
              fontSize: 88,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.04,
            }}
          >
            Precision rail maintenance.
          </div>
          <div
            style={{
              color: "#F6A317",
              fontSize: 88,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              lineHeight: 1.04,
              marginTop: 4,
            }}
          >
            Uncompromised safety.
          </div>
        </div>

        {/* Footer metric */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            zIndex: 10,
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 56,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  color: "#FFFFFF",
                  fontSize: 36,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                227
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginTop: 8,
                }}
              >
                Trains maintained
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  color: "#FFFFFF",
                  fontSize: 36,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                5
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginTop: 8,
                }}
              >
                Countries
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  color: "#FFFFFF",
                  fontSize: 36,
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1,
                }}
              >
                9 yrs
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 14,
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  marginTop: 8,
                }}
              >
                Continuous service
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: "#F6A317",
              }}
            />
            <div
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "0.16em",
                textTransform: "uppercase",
              }}
            >
              xapika.pl
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
