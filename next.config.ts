import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
    reactStrictMode: true,
    swcMinify: true,

    eslint: {
        ignoreDuringBuilds: true,
    },
};

export default nextConfig;
