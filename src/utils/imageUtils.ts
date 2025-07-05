/**
 * Get cached image URL for class icons
 * @param icon - Icon filename (e.g., 'vagrant.png')
 * @returns Cached image URL
 */
export function getCachedClassIconUrl(icon: string): string {
    if (!icon) {
        return '/images/placeholder.png'; // fallback image
    }
    
    // Use our cached API route instead of direct FlyFF API
    return `/api/flyff/image/class/messenger/${icon}`;
}

/**
 * Get direct FlyFF API image URL (for fallback)
 * @param icon - Icon filename
 * @returns Direct FlyFF API URL
 */
export function getDirectFlyffImageUrl(icon: string): string {
    if (!icon) {
        return '/images/placeholder.png';
    }
    
    return `https://api.flyff.com/image/class/messenger/${icon}`;
}

/**
 * Check if image URL is from our cache
 * @param url - Image URL
 * @returns True if URL is from our cache
 */
export function isCachedImageUrl(url: string): boolean {
    return url.startsWith('/api/flyff/image/');
}

/**
 * Get image filename from URL
 * @param url - Image URL
 * @returns Filename or null
 */
export function getImageFilenameFromUrl(url: string): string | null {
    if (!url) return null;
    
    // Extract filename from our cached URL
    if (url.startsWith('/api/flyff/image/class/messenger/')) {
        return url.split('/').pop() || null;
    }
    
    // Extract filename from direct FlyFF URL
    if (url.startsWith('https://api.flyff.com/image/class/messenger/')) {
        return url.split('/').pop() || null;
    }
    
    return null;
} 