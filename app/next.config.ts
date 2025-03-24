import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
  },
  i18n: {
    locales: ["en", "bs"],
    defaultLocale: "en",
  }
};

export default nextConfig;
