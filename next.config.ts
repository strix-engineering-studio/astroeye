import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/work", destination: "/case-studies", permanent: true },
      { source: "/work/:path*", destination: "/case-studies/:path*", permanent: true },
      { source: "/blog", destination: "/insights", permanent: true },
      { source: "/blog/:path*", destination: "/insights/:path*", permanent: true },
      { source: "/services", destination: "/capabilities", permanent: true },
      { source: "/services/:path*", destination: "/capabilities/:path*", permanent: true },
      { source: "/uses", destination: "/technology-decisions", permanent: true },
      { source: "/uses/:path*", destination: "/technology-decisions/:path*", permanent: true },
    ]
  },
};

export default nextConfig;
