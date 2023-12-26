const FIREBASE_AUTH_URL = process.env.FIREBASE_AUTH_URL;

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/__/:path*",
        destination: `${FIREBASE_AUTH_URL}/__/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
