'use client';

import * as React from 'react';
import * as MenubarPrimitive from '@radix-ui/react-menubar';
import { Check, ChevronRight, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

import { cn } from '@/lib/utils';

function MenubarMenu({
    ...props
}: React.ComponentProps<typeof MenubarPrimitive.Menu>) {
    return <MenubarPrimitive.Menu {...props} />;
}

function MenubarGroup({
    ...props
}: React.ComponentProps<typeof MenubarPrimitive.Group>) {
    return <MenubarPrimitive.Group {...props} />;
}

function MenubarPortal({
    ...props
}: React.ComponentProps<typeof MenubarPrimitive.Portal>) {
    return <MenubarPrimitive.Portal {...props} />;
}

function MenubarRadioGroup({
    ...props
}: React.ComponentProps<typeof MenubarPrimitive.RadioGroup>) {
    return <MenubarPrimitive.RadioGroup {...props} />;
}

function MenubarSub({
    ...props
}: React.ComponentProps<typeof MenubarPrimitive.Sub>) {
    return <MenubarPrimitive.Sub data-slot='menubar-sub' {...props} />;
}

const MENU_ITEM_SELECTOR =
    '[role="menuitem"], [role="menuitemcheckbox"], [role="menuitemradio"]';

type HighlightRect = { top: number; height: number };

const useSlidingHighlight = () => {
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [highlight, setHighlight] = React.useState<HighlightRect | null>(
        null
    );

    const updateFromElement = React.useCallback((item: HTMLElement | null) => {
        const content = contentRef.current;
        if (!content || !item) {
            setHighlight(null);
            return;
        }
        if (item.hasAttribute('data-disabled') || item.getAttribute('aria-disabled') === 'true') {
            return;
        }

        const contentRect = content.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        setHighlight({
            top: itemRect.top - contentRect.top + content.scrollTop,
            height: itemRect.height
        });
    }, []);

    const onPointerMove = React.useCallback(
        (event: React.PointerEvent<HTMLDivElement>) => {
            const item = (event.target as HTMLElement).closest(
                MENU_ITEM_SELECTOR
            ) as HTMLElement | null;
            updateFromElement(item);
        },
        [updateFromElement]
    );

    const onPointerLeave = React.useCallback(() => {
        setHighlight(null);
    }, []);

    const onFocusCapture = React.useCallback(
        (event: React.FocusEvent<HTMLDivElement>) => {
            const item = (event.target as HTMLElement).closest(
                MENU_ITEM_SELECTOR
            ) as HTMLElement | null;
            updateFromElement(item);
        },
        [updateFromElement]
    );

    return {
        contentRef,
        highlight,
        onPointerMove,
        onPointerLeave,
        onFocusCapture
    };
};

const SlidingHighlight = ({
    highlight
}: {
    highlight: HighlightRect | null;
}) => {
    const lastRect = React.useRef<HighlightRect>({ top: 0, height: 36 });
    if (highlight) {
        lastRect.current = highlight;
    }
    const visible = highlight !== null;
    const { top, height } = lastRect.current;

    return (
        <motion.div
            aria-hidden
            className='pointer-events-none absolute left-1 right-1 z-0 rounded-sm bg-accent'
            initial={false}
            animate={{
                top,
                height,
                opacity: visible ? 1 : 0
            }}
            transition={{
                top: visible
                    ? { type: 'spring', stiffness: 450, damping: 35 }
                    : { duration: 0 },
                height: visible
                    ? { type: 'spring', stiffness: 450, damping: 35 }
                    : { duration: 0 },
                opacity: { duration: 0.15, ease: 'easeOut' }
            }}
        />
    );
};

const Menubar = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Root>
>(({ className, ...props }, ref) => (
    <MenubarPrimitive.Root
        ref={ref}
        className={cn(
            'flex h-9 items-center space-x-1 rounded-md border bg-background p-1 shadow-sm',
            className
        )}
        {...props}
    />
));
Menubar.displayName = MenubarPrimitive.Root.displayName;

const MenubarTrigger = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.Trigger>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Trigger>
>(({ className, ...props }, ref) => (
    <MenubarPrimitive.Trigger
        ref={ref}
        className={cn(
            'flex cursor-default select-none items-center rounded-sm px-3 py-1 text-sm font-medium outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
            className
        )}
        {...props}
    />
));
MenubarTrigger.displayName = MenubarPrimitive.Trigger.displayName;

const MenubarSubTrigger = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.SubTrigger>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubTrigger> & {
        inset?: boolean;
    }
>(({ className, inset, children, ...props }, ref) => (
    <MenubarPrimitive.SubTrigger
        ref={ref}
        className={cn(
            'relative z-10 flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:text-accent-foreground data-[state=open]:bg-accent/60 data-[state=open]:text-accent-foreground',
            inset && 'pl-8',
            className
        )}
        {...props}
    >
        {children}
        <ChevronRight className='ml-auto h-4 w-4' />
    </MenubarPrimitive.SubTrigger>
));
MenubarSubTrigger.displayName = MenubarPrimitive.SubTrigger.displayName;

const MenubarSubContent = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.SubContent>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.SubContent>
>(
    (
        {
            className,
            onPointerMove,
            onPointerLeave,
            onFocusCapture,
            children,
            ...props
        },
        ref
    ) => {
        const {
            contentRef,
            highlight,
            onPointerMove: handlePointerMove,
            onPointerLeave: handlePointerLeave,
            onFocusCapture: handleFocusCapture
        } = useSlidingHighlight();

        return (
            <MenubarPrimitive.SubContent
                ref={(node) => {
                    (
                        contentRef as React.MutableRefObject<HTMLDivElement | null>
                    ).current = node;
                    if (typeof ref === 'function') ref(node);
                    else if (ref) ref.current = node;
                }}
                className={cn(
                    'relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]',
                    className
                )}
                onPointerMove={(event) => {
                    handlePointerMove(event);
                    onPointerMove?.(event);
                }}
                onPointerLeave={(event) => {
                    handlePointerLeave();
                    onPointerLeave?.(event);
                }}
                onFocusCapture={(event) => {
                    handleFocusCapture(event);
                    onFocusCapture?.(event);
                }}
                {...props}
            >
                <SlidingHighlight highlight={highlight} />
                {children}
            </MenubarPrimitive.SubContent>
        );
    }
);
MenubarSubContent.displayName = MenubarPrimitive.SubContent.displayName;

const MenubarContent = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Content>
>(
    (
        {
            className,
            align = 'start',
            alignOffset = -4,
            sideOffset = 8,
            onPointerMove,
            onPointerLeave,
            onFocusCapture,
            children,
            ...props
        },
        ref
    ) => {
        const {
            contentRef,
            highlight,
            onPointerMove: handlePointerMove,
            onPointerLeave: handlePointerLeave,
            onFocusCapture: handleFocusCapture
        } = useSlidingHighlight();

        return (
            <MenubarPrimitive.Portal>
                <MenubarPrimitive.Content
                    ref={(node) => {
                        (
                            contentRef as React.MutableRefObject<HTMLDivElement | null>
                        ).current = node;
                        if (typeof ref === 'function') ref(node);
                        else if (ref) ref.current = node;
                    }}
                    align={align}
                    alignOffset={alignOffset}
                    sideOffset={sideOffset}
                    className={cn(
                        'relative z-50 min-w-[12rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-[--radix-menubar-content-transform-origin]',
                        className
                    )}
                    onPointerMove={(event) => {
                        handlePointerMove(event);
                        onPointerMove?.(event);
                    }}
                    onPointerLeave={(event) => {
                        handlePointerLeave();
                        onPointerLeave?.(event);
                    }}
                    onFocusCapture={(event) => {
                        handleFocusCapture(event);
                        onFocusCapture?.(event);
                    }}
                    {...props}
                >
                    <SlidingHighlight highlight={highlight} />
                    {children}
                </MenubarPrimitive.Content>
            </MenubarPrimitive.Portal>
        );
    }
);
MenubarContent.displayName = MenubarPrimitive.Content.displayName;

const MenubarItem = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.Item>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Item> & {
        inset?: boolean;
    }
>(({ className, inset, ...props }, ref) => (
    <MenubarPrimitive.Item
        ref={ref}
        className={cn(
            'relative z-10 flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            inset && 'pl-8',
            className
        )}
        {...props}
    />
));
MenubarItem.displayName = MenubarPrimitive.Item.displayName;

const MenubarCheckboxItem = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.CheckboxItem>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
    <MenubarPrimitive.CheckboxItem
        ref={ref}
        className={cn(
            'relative z-10 flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            className
        )}
        checked={checked}
        {...props}
    >
        <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
            <MenubarPrimitive.ItemIndicator>
                <Check className='h-4 w-4 text-primary' />
            </MenubarPrimitive.ItemIndicator>
        </span>
        {children}
    </MenubarPrimitive.CheckboxItem>
));
MenubarCheckboxItem.displayName = MenubarPrimitive.CheckboxItem.displayName;

const MenubarRadioItem = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.RadioItem>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
    <MenubarPrimitive.RadioItem
        ref={ref}
        className={cn(
            'relative z-10 flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
            className
        )}
        {...props}
    >
        <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
            <MenubarPrimitive.ItemIndicator>
                <Circle className='h-4 w-4 fill-current' />
            </MenubarPrimitive.ItemIndicator>
        </span>
        {children}
    </MenubarPrimitive.RadioItem>
));
MenubarRadioItem.displayName = MenubarPrimitive.RadioItem.displayName;

const MenubarLabel = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.Label>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Label> & {
        inset?: boolean;
    }
>(({ className, inset, ...props }, ref) => (
    <MenubarPrimitive.Label
        ref={ref}
        className={cn(
            'relative z-10 px-2 py-1.5 text-sm font-semibold',
            inset && 'pl-8',
            className
        )}
        {...props}
    />
));
MenubarLabel.displayName = MenubarPrimitive.Label.displayName;

const MenubarSeparator = React.forwardRef<
    React.ElementRef<typeof MenubarPrimitive.Separator>,
    React.ComponentPropsWithoutRef<typeof MenubarPrimitive.Separator>
>(({ className, ...props }, ref) => (
    <MenubarPrimitive.Separator
        ref={ref}
        className={cn('relative z-10 -mx-1 my-1 h-px bg-muted', className)}
        {...props}
    />
));
MenubarSeparator.displayName = MenubarPrimitive.Separator.displayName;

const MenubarShortcut = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
    return (
        <span
            className={cn(
                'ml-auto text-xs tracking-widest text-muted-foreground',
                className
            )}
            {...props}
        />
    );
};
MenubarShortcut.displayname = 'MenubarShortcut';

export {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
    MenubarContent,
    MenubarItem,
    MenubarSeparator,
    MenubarLabel,
    MenubarCheckboxItem,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarPortal,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarGroup,
    MenubarSub,
    MenubarShortcut
};
