import type { MetadataRoute } from "next";
import {
  siteDescription,
  siteName,
  siteShortName,
  siteUrl,
} from "../lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteName,
    short_name: siteShortName,
    description: siteDescription,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f1e3d",
    categories: ["education", "events", "non-profit"],
    screenshots: [],
    icons: [
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    id: siteUrl,
  };
}
