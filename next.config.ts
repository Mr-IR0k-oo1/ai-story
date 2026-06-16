import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverRuntimeConfig: {
    bodySizeLimit: "100kb",
  },
};

export default nextConfig;
