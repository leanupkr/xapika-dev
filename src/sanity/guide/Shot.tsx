// src/sanity/guide/Shot.tsx
//
// Renders one GuideShot ({ name, caption } — see content.tsx) as a
// screenshot slot: <img src="/studio-guide/{name}.png">. Screenshots don't
// exist yet (they land later as PNGs under public/studio-guide/), so this
// must never show a browser's broken-image icon — `onError` swaps to a
// dashed placeholder that names the still-missing file instead, so
// content.tsx's blocks can reference screenshots today without waiting on
// them.
//
// Click-to-zoom: clicking a successfully-loaded screenshot opens a simple
// full-viewport lightbox; click the backdrop, the close button, or press
// Escape to dismiss. Disabled while in the placeholder state (nothing to
// zoom into).

import { useEffect, useState } from "react";
import type { GuideShot } from "./content";

export function Shot({ name, caption }: GuideShot) {
  const src = `/studio-guide/${name}.png`;
  const [failed, setFailed] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    if (!zoomed) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setZoomed(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoomed]);

  return (
    <figure className="xk-guide-shot">
      {failed ? (
        <div className="xk-guide-shot-placeholder">
          스크린샷 준비 중: {name}
          <span className="xk-guide-shot-placeholder-name">public/studio-guide/{name}.png</span>
        </div>
      ) : (
        <img
          src={src}
          alt={caption}
          loading="lazy"
          className="xk-guide-shot-img"
          onError={() => setFailed(true)}
          onClick={() => setZoomed(true)}
        />
      )}
      <figcaption>{caption}</figcaption>
      {zoomed && !failed ? (
        <div className="xk-guide-lightbox" onClick={() => setZoomed(false)}>
          <img src={src} alt={caption} />
          <button
            type="button"
            className="xk-guide-lightbox-close"
            onClick={() => setZoomed(false)}
            aria-label="닫기"
          >
            ×
          </button>
        </div>
      ) : null}
    </figure>
  );
}
