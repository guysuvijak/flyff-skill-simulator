// Next.js 15 - src/components/ThemeToggle.tsx
'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant='outline'
            size='sm'
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label='Theme Button'
            className='cursor-pointer'
        >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
    );
}
