import createNextPWA from 'next-pwa';

const withPWA = createNextPWA({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true
});

const nextConfig = {
    images: {
        unoptimized: true,
        minimumCacheTTL: 60,
        remotePatterns: [{ hostname: 'api.flyff.com' }]
    }
};

export default withPWA(nextConfig);
