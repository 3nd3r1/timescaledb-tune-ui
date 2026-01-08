/** @type {import('next').NextConfig} */
const nextConfig = {
    typedRoutes: true,
    experimental: {
        optimizeCss: true,
    },
    compress: true,
    poweredByHeader: false,
    generateEtags: true,
    images: {
        formats: ["image/webp", "image/avif"],
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    },
    headers: async () => {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff",
                    },
                    {
                        key: "X-Frame-Options",
                        value: "DENY",
                    },
                    {
                        key: "X-XSS-Protection",
                        value: "1; mode=block",
                    },
                    {
                        key: "Referrer-Policy",
                        value: "origin-when-cross-origin",
                    },
                ],
            },
            {
                source: "/favicon.ico",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, immutable, max-age=31536000",
                    },
                ],
            },
            {
                source: "/(.*)\.(ico|png|jpg|jpeg|gif|webp|svg|woff|woff2)",
                headers: [
                    {
                        key: "Cache-Control",
                        value: "public, immutable, max-age=31536000",
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
