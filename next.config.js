/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: true,
        remotePatterns: [
            { hostname: 'www.google.com' },
            { hostname: 'cdn.discordapp.com' },
            { hostname: 'pixturetraveler.com' },
            { hostname: 'api.flyff.com' }
        ]
    }
};

module.exports = nextConfig;