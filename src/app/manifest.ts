import type { MetadataRoute } from "next";
import { SITE_NAME } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${SITE_NAME} — Precision Rail Maintenance`,
    short_name: "Xapika",
    description:
      "Precision rail maintenance with uncompromised safety — operations across nine offices in eight countries.",
    start_url: "/en",
    display: "standalone",
    background_color: "#0B1F3A",
    theme_color: "#0B1F3A",
    orientation: "portrait",
    icons: [
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
