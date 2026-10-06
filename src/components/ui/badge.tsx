import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-[#FFCC00]/40 bg-[#FFCC00]/15 text-[#FFCC00]',
        secondary:
          'border-neutral-700 bg-neutral-800 text-neutral-300',
        destructive:
          'border-rose-500/30 bg-rose-500/10 text-rose-400',
        outline:
          'border-neutral-700 text-neutral-400',
        success:
          'border-emerald-500/30 bg-emerald-500/10 text-emerald-400',
        warning:
          'border-amber-500/30 bg-amber-500/10 text-amber-400',
        info:
          'border-sky-500/30 bg-sky-500/10 text-sky-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
