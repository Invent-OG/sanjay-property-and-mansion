import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-xs font-semibold ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-[#FFCC00] text-neutral-950 hover:bg-[#ffe066] font-bold shadow-xs active:scale-[0.98]',
        destructive:
          'bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25 active:scale-[0.98]',
        outline:
          'border border-neutral-700/80 bg-neutral-900/60 text-neutral-200 hover:bg-neutral-800 hover:text-white hover:border-neutral-600',
        secondary:
          'bg-neutral-800 text-neutral-200 hover:bg-neutral-700 hover:text-white',
        ghost:
          'text-neutral-400 hover:bg-neutral-800/80 hover:text-neutral-200',
        link:
          'text-[#FFCC00] underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-9 px-3.5 py-2',
        sm: 'h-7 rounded-md px-2.5 text-[11px]',
        lg: 'h-10 rounded-xl px-5 text-sm',
        icon: 'h-8 w-8 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
