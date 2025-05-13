// Next.js 15 - src/app/layout.tsx
import { ThemeProvider } from '@/providers/ThemeProvider';
import { Toaster } from '@/components/ui/sonner';
import { VIEWPORT, METADATA } from '@/configs/metadata';
import './globals.css';

export const viewport = VIEWPORT;
export const metadata = METADATA;

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en'>
            <body>
                <ThemeProvider>
                    {children}
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
