import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const apiOrigin = (() => {
  try { return new URL(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080").origin; }
  catch { return "http://localhost:8080"; }
})();

const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline'",
  `connect-src 'self' ${apiOrigin} blob:`,
  "img-src 'self' data: blob: https:",
  "media-src 'self' blob:",
  "font-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options",        value: "nosniff" },
  { key: "X-Frame-Options",               value: "DENY" },
  { key: "X-XSS-Protection",              value: "1; mode=block" },
  { key: "Referrer-Policy",               value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",            value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy",       value: csp },
  ...(process.env.NODE_ENV === "production"
    ? [{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }]
    : []),
];

const nextConfig = {
  reactStrictMode: false,
  typedRoutes: true,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
