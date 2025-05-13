// Next.js 15 - src/components/ThemeToggle.tsx
'use client';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { TooltipWrapper } from '@/components/TooltipWrapper';

interface ThemeToggleProps {
    mode: 'icon' | 'text';
}

export const ThemeToggle = ({ mode }: ThemeToggleProps) => {
    const { theme, setTheme } = useTheme();

    return (
        <>
            {mode === 'icon' ? (
                <TooltipWrapper message='Theme Switch'>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() =>
                            setTheme(theme === 'dark' ? 'light' : 'dark')
                        }
                        aria-label='Theme Button'
                    >
                        {theme === 'dark' ? (
                            <Sun size={18} />
                        ) : (
                            <Moon size={18} />
                        )}
                    </Button>
                </TooltipWrapper>
            ) : (
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={() =>
                        setTheme(theme === 'dark' ? 'light' : 'dark')
                    }
                    aria-label='Theme Button'
                    className='flex justify-start'
                >
                    {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                    <p>Theme Switch</p>
                </Button>
            )}
        </>
    );
};
