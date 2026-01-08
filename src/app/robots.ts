import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: ["/api/", "/_next/", "/admin/"],
        },
        sitemap: "https://timescaledb-tune.host.ender.fi/sitemap.xml",
    };
}
