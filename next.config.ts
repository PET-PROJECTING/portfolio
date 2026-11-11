import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
        // The Tailwind loader emits plain CSS and an empty module map.
        // Leave *.module.css on Turbopack's built-in CSS module pipeline.
        condition: { not: { path: /\.module\.css$/ } },
      },
    },
  },
};

export default nextConfig;
