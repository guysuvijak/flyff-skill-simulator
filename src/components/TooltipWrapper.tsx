// Next.js 15 - src/components/TooltipWrapper.tsx
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip';

interface UseTooltipProps {
    message: string;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

export const TooltipWrapper = ({
    message,
    children,
    position = 'top'
}: UseTooltipProps) => {
    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent side={position} className='z-100'>
                    <p className='text-center whitespace-pre-line'>{message}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
