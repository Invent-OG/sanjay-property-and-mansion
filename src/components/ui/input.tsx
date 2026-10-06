import * as React from 'react';
import { cn } from '../../lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-lg border border-neutral-700/80 bg-neutral-900 px-3 py-1 text-xs text-white shadow-xs transition-colors file:border-0 file:bg-transparent file:text-xs file:font-medium placeholder:text-neutral-500 focus-visible:outline-hidden focus-visible:border-[#FFCC00] focus-visible:ring-1 focus-visible:ring-[#FFCC00] disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
