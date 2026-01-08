import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";

import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    preload: true,
});

export const metadata: Metadata = {
    title: "TimescaleDB Tuner - Optimize Your Database Performance",
    description:
        "Free web-based tool to optimize TimescaleDB configuration for better performance. Get intelligent tuning recommendations based on your system resources.",
    keywords: [
        "TimescaleDB",
        "database tuning",
        "PostgreSQL optimization",
        "database performance",
        "configuration tuner",
        "timeseries database",
        "database optimization",
        "postgres tuning",
    ],
    authors: [{ name: "TimescaleDB Tuner UI" }],
    creator: "TimescaleDB Tuner UI",
    publisher: "TimescaleDB Tuner UI",
    robots: "index, follow",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://timescaledb-tune.host.ender.fi",
        siteName: "TimescaleDB Tuner",
        title: "TimescaleDB Tuner - Optimize Your Database Performance",
        description:
            "Free web-based tool to optimize TimescaleDB configuration for better performance. Get intelligent tuning recommendations based on your system resources.",
        images: [
            {
                url: "/logo-nobg-dark.svg",
                width: 1200,
                height: 630,
                alt: "TimescaleDB Tuner - Database Optimization Tool",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "TimescaleDB Tuner - Optimize Your Database Performance",
        description:
            "Free web-based tool to optimize TimescaleDB configuration for better performance.",
        images: ["/logo-nobg-dark.svg"],
    },
    viewport: "width=device-width, initial-scale=1",
    themeColor: "#000000",
    manifest: "/manifest.json",
    icons: {
        icon: "/favicon.ico",
        shortcut: "/favicon.ico",
        apple: "/apple-touch-icon.png",
    },
    verification: {
        google: "6T0KridUTOIprUpRHF0U1O7zutvVEZRhN8L1kOWMNLw",
    },
    category: "technology",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <head>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
                <meta name="theme-color" content="#000000" />
                <meta name="msapplication-TileColor" content="#000000" />
                <link
                    rel="canonical"
                    href="https://timescaledb-tune.host.ender.fi"
                />
            </head>
            <body className={`${inter.className} dark`}>{children}</body>
        </html>
    );
}
