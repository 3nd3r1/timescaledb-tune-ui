import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "TimescaleDB Tuner",
        short_name: "DB Tuner",
        description:
            "Optimize your TimescaleDB configuration for better performance",
        start_url: "/",
        display: "standalone",
        background_color: "#000000",
        theme_color: "#000000",
        orientation: "portrait-primary",
        icons: [
            {
                src: "/favicon.ico",
                sizes: "16x16 32x32 48x48",
                type: "image/x-icon",
            },
            {
                src: "/icon-192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/icon-512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
        categories: ["productivity", "utilities", "developer"],
        lang: "en",
    };
}
