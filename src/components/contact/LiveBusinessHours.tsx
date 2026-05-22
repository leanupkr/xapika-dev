"use client";

import { useEffect, useState } from "react";

type TimeState = {
  warsawTime: string;
  seoulTime: string;
  isOpen: boolean;
} | null;

function computeTimeState(): TimeState {
  const warsawFormatter = new Intl.DateTimeFormat([], {
    timeZone: "Europe/Warsaw",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const seoulFormatter = new Intl.DateTimeFormat([], {
    timeZone: "Asia/Seoul",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const warsawWeekdayFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Warsaw",
    weekday: "short",
  });
  const warsawHourFormatter = new Intl.DateTimeFormat([], {
    timeZone: "Europe/Warsaw",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const now = new Date();
  const warsawTime = warsawFormatter.format(now);
  const seoulTime = seoulFormatter.format(now);

  const weekday = warsawWeekdayFormatter.format(now);
  const isWeekday = !["Sat", "Sun"].includes(weekday);

  const parts = warsawHourFormatter.formatToParts(now);
  const hourPart = parts.find((p) => p.type === "hour");
  const minutePart = parts.find((p) => p.type === "minute");
  const hour = hourPart ? parseInt(hourPart.value, 10) : 0;
  const minute = minutePart ? parseInt(minutePart.value, 10) : 0;
  const totalMinutes = hour * 60 + minute;

  const isOpen = isWeekday && totalMinutes >= 9 * 60 && totalMinutes < 18 * 60;

  return { warsawTime, seoulTime, isOpen };
}

export default function LiveBusinessHours() {
  const [timeState, setTimeState] = useState<TimeState>(null);

  useEffect(() => {
    setTimeState(computeTimeState());

    const interval = setInterval(() => {
      setTimeState(computeTimeState());
    }, 60_000);

    return () => clearInterval(interval);
  }, []);

  if (!timeState) {
    return (
      <div style={{ minHeight: "64px" }} aria-hidden="true" />
    );
  }

  const { warsawTime, seoulTime, isOpen } = timeState;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span
          aria-hidden="true"
          style={{
            width: "7px",
            height: "7px",
            borderRadius: "50%",
            flexShrink: 0,
            backgroundColor: isOpen ? "#10B981" : "rgba(11,31,58,0.30)",
            transition: "background-color 0.3s",
          }}
        />
        <span
          className="font-heading font-medium"
          style={{
            fontSize: "15px",
            color: "rgb(var(--color-ink))",
            letterSpacing: "-0.005em",
          }}
        >
          Warsaw (CET) {warsawTime}
        </span>
        <span
          aria-label={isOpen ? "Open now" : "Closed"}
          className="font-heading font-medium"
          style={{
            fontSize: "12px",
            letterSpacing: "0.04em",
            color: isOpen ? "#10B981" : "rgba(11,31,58,0.45)",
            paddingLeft: "4px",
          }}
        >
          {isOpen ? "Open now" : "Closed"}
        </span>
      </div>
      <span
        className="font-body"
        style={{
          fontSize: "13.5px",
          color: "rgba(11,31,58,0.60)",
          lineHeight: 1.4,
        }}
      >
        Seoul (KST) {seoulTime}
      </span>
      <span
        className="font-heading uppercase"
        style={{
          fontSize: "11px",
          letterSpacing: "0.18em",
          color: "rgba(11,31,58,0.45)",
          marginTop: "2px",
        }}
      >
        Mon–Fri 09:00–18:00 CET
      </span>
    </div>
  );
}
