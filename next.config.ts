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
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'Permissions-Policy',
                        value: 'interest-cohort=()',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    }
                ],
            },
        ];
    },
};

export default withPWA(nextConfig);
