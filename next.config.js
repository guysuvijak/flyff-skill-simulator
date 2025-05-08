/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60,
        remotePatterns: [
            { hostname: 'www.google.com' },
            { hostname: 'cdn.discordapp.com' },
            { hostname: 'api.flyff.com' }
        ]
    }
};

module.exports = nextConfig;
