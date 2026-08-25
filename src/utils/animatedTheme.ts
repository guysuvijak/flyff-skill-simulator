// Next.js 15 - src/utils/animatedTheme.ts
import { flushSync } from 'react-dom';

export type TransitionVariant =
    | 'circle'
    | 'square'
    | 'triangle'
    | 'diamond'
    | 'hexagon'
    | 'rectangle'
    | 'star';

function polygonCollapsed(point: string, vertexCount: number): string {
    const pairs = Array.from({ length: vertexCount }, () => point).join(', ');
    return `polygon(${pairs})`;
}

function getThemeTransitionClipPaths(
    variant: TransitionVariant,
    cx: number,
    cy: number,
    maxRadius: number,
    viewportWidth: number,
    viewportHeight: number
): [string, string] {
    const toX = (x: number) => `${(x / viewportWidth) * 100}%`;
    const toY = (y: number) => `${(y / viewportHeight) * 100}%`;
    const point = (x: number, y: number) => `${toX(x)} ${toY(y)}`;
    const toRadius = (r: number) =>
        `${(r / (Math.hypot(viewportWidth, viewportHeight) / Math.SQRT2)) * 100}%`;

    switch (variant) {
        case 'circle':
            return [
                `circle(0% at ${point(cx, cy)})`,
                `circle(${toRadius(maxRadius)} at ${point(cx, cy)})`
            ];
        case 'square': {
            const halfW = Math.max(cx, viewportWidth - cx);
            const halfH = Math.max(cy, viewportHeight - cy);
            const halfSide = Math.max(halfW, halfH) * 1.05;
            const end = [
                point(cx - halfSide, cy - halfSide),
                point(cx + halfSide, cy - halfSide),
                point(cx + halfSide, cy + halfSide),
                point(cx - halfSide, cy + halfSide)
            ].join(', ');
            return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
        }
        case 'triangle': {
            const scale = maxRadius * 2.2;
            const dx = (Math.sqrt(3) / 2) * scale;
            const verts = [
                point(cx, cy - scale),
                point(cx + dx, cy + 0.5 * scale),
                point(cx - dx, cy + 0.5 * scale)
            ].join(', ');
            return [polygonCollapsed(point(cx, cy), 3), `polygon(${verts})`];
        }
        case 'diamond': {
            const R = maxRadius * Math.SQRT2;
            const end = [
                point(cx, cy - R),
                point(cx + R, cy),
                point(cx, cy + R),
                point(cx - R, cy)
            ].join(', ');
            return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
        }
        case 'hexagon': {
            const R = maxRadius * Math.SQRT2;
            const verts: string[] = [];
            for (let i = 0; i < 6; i++) {
                const a = -Math.PI / 2 + (i * Math.PI) / 3;
                verts.push(point(cx + R * Math.cos(a), cy + R * Math.sin(a)));
            }
            return [
                polygonCollapsed(point(cx, cy), 6),
                `polygon(${verts.join(', ')})`
            ];
        }
        case 'rectangle': {
            const halfW = Math.max(cx, viewportWidth - cx);
            const halfH = Math.max(cy, viewportHeight - cy);
            const end = [
                point(cx - halfW, cy - halfH),
                point(cx + halfW, cy - halfH),
                point(cx + halfW, cy + halfH),
                point(cx - halfW, cy + halfH)
            ].join(', ');
            return [polygonCollapsed(point(cx, cy), 4), `polygon(${end})`];
        }
        case 'star': {
            const R = maxRadius * Math.SQRT2 * 1.03;
            const innerRatio = 0.42;
            const starPolygon = (radius: number) => {
                const verts: string[] = [];
                for (let i = 0; i < 5; i++) {
                    const outerA = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
                    verts.push(
                        point(
                            cx + radius * Math.cos(outerA),
                            cy + radius * Math.sin(outerA)
                        )
                    );
                    const innerA = outerA + Math.PI / 5;
                    verts.push(
                        point(
                            cx + radius * innerRatio * Math.cos(innerA),
                            cy + radius * innerRatio * Math.sin(innerA)
                        )
                    );
                }
                return `polygon(${verts.join(', ')})`;
            };
            const startR = Math.max(2, R * 0.025);
            return [starPolygon(startR), starPolygon(R)];
        }
        default:
            return [
                `circle(0% at ${point(cx, cy)})`,
                `circle(${toRadius(maxRadius)} at ${point(cx, cy)})`
            ];
    }
}

export interface AnimatedThemeChangeOptions {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
    currentTheme?: string;
    event?: { currentTarget: Element } | null;
    duration?: number;
    variant?: TransitionVariant;
    fromCenter?: boolean;
}

/**
 * Applies a light/dark theme change with a View Transition reveal animation.
 * Falls back to an instant theme change when View Transitions are unavailable.
 */
export function startAnimatedThemeChange({
    theme: nextTheme,
    setTheme,
    currentTheme,
    event,
    duration = 400,
    variant = 'circle',
    fromCenter = false
}: AnimatedThemeChangeOptions): void {
    if (currentTheme === nextTheme) return;
    if (document.documentElement.dataset.magicuiThemeVt === 'active') return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let x: number;
    let y: number;
    if (fromCenter || !event?.currentTarget) {
        x = viewportWidth / 2;
        y = viewportHeight / 2;
    } else {
        const { top, left, width, height } =
            event.currentTarget.getBoundingClientRect();
        x = left + width / 2;
        y = top + height / 2;
    }

    const maxRadius = Math.hypot(
        Math.max(x, viewportWidth - x),
        Math.max(y, viewportHeight - y)
    );

    const applyTheme = () => {
        if (nextTheme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        setTheme(nextTheme);
    };

    if (typeof document.startViewTransition !== 'function') {
        applyTheme();
        return;
    }

    const clipPath = getThemeTransitionClipPaths(
        variant,
        x,
        y,
        maxRadius,
        viewportWidth,
        viewportHeight
    );

    const root = document.documentElement;
    root.dataset.magicuiThemeVt = 'active';
    root.style.setProperty(
        '--magicui-theme-toggle-vt-duration',
        `${duration}ms`
    );
    root.style.setProperty('--magicui-theme-vt-clip-from', clipPath[0]);

    const cleanup = () => {
        delete root.dataset.magicuiThemeVt;
        root.style.removeProperty('--magicui-theme-toggle-vt-duration');
        root.style.removeProperty('--magicui-theme-vt-clip-from');
    };

    const transition = document.startViewTransition(() => {
        flushSync(applyTheme);
    });

    if (typeof transition?.finished?.finally === 'function') {
        transition.finished.finally(cleanup).catch(() => {});
    } else {
        cleanup();
    }

    const ready = transition?.ready;
    if (ready && typeof ready.then === 'function') {
        ready
            .then(() => {
                document.documentElement.animate(
                    {
                        clipPath
                    },
                    {
                        duration,
                        easing: variant === 'star' ? 'linear' : 'ease-in-out',
                        fill: 'forwards',
                        pseudoElement: '::view-transition-new(root)'
                    }
                );
            })
            .catch(() => {});
    }
}
