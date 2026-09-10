import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    dangerouslyAllowSVG: true,
    contentDispositionType: "inline",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/rreth-nesh", destination: "/about", permanent: true },
      {
        source: "/politika-e-dergesave",
        destination: "/shipping",
        permanent: true,
      },
      { source: "/politika-e-kthimit", destination: "/returns", permanent: true },
      {
        source: "/politika-e-privatesise",
        destination: "/privacy",
        permanent: true,
      },
      {
        source: "/termet-e-pergjitshme",
        destination: "/terms",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
