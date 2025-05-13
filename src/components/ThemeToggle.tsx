'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    return (
        <Button
            variant='outline'
            size='icon'
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label='Theme Button'
            className='cursor-pointer'
        >
            {theme === 'dark' ? (
                <Sun className='h-5 w-5' />
            ) : (
                <Moon className='h-5 w-5' />
            )}
        </Button>
    );
}