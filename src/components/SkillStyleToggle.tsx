// Next.js 15 - src/components/SkillStyleToggle.tsx
'use client';
import { PaintBucket, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TooltipWrapper } from '@/components/TooltipWrapper';
import { useWebsiteStore } from '@/stores/websiteStore';

interface SkillStyleToggleProps {
    mode: 'icon' | 'text';
}

export const SkillStyleToggle = ({ mode }: SkillStyleToggleProps) => {
    const { skillStyle, setSkillStyle } = useWebsiteStore();

    return (
        <>
            {mode === 'icon' ? (
                <TooltipWrapper message='Skill Style Switch'>
                    <Button
                        variant='outline'
                        size='sm'
                        onClick={() =>
                            setSkillStyle(
                                skillStyle === 'colored' ? 'old' : 'colored'
                            )
                        }
                        aria-label='Skill Style Button'
                    >
                        {skillStyle === 'colored' ? (
                            <Palette size={18} />
                        ) : (
                            <PaintBucket size={18} />
                        )}
                    </Button>
                </TooltipWrapper>
            ) : (
                <Button
                    variant='ghost'
                    size='sm'
                    onClick={() =>
                        setSkillStyle(
                            skillStyle === 'colored' ? 'old' : 'colored'
                        )
                    }
                    aria-label='Skill Style Button'
                    className='flex justify-start'
                >
                    {skillStyle === 'colored' ? (
                        <Palette size={18} />
                    ) : (
                        <PaintBucket size={18} />
                    )}
                    <p>Skill Style Switch</p>
                </Button>
            )}
        </>
    );
};
