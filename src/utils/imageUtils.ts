// Next.js 15 - src/utils/imageUtils.ts
/**
 * Get direct FlyFF API image URL for class icons
 * @param icon - Icon filename (e.g., 'vagrant.png')
 * @returns Direct FlyFF API image URL
 */
export function getCachedClassIconUrl(icon: string): string {
    if (!icon) {
        return '/images/placeholder.png'; // fallback image
    }

    // Use direct FlyFF API instead of our cached API route to reduce Vercel edge function usage
    return `https://api.flyff.com/image/class/messenger/${icon}`;
}
