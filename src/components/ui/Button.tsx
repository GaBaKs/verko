import { ButtonHTMLAttributes, forwardRef, ReactNode } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'danger' | 'icon';
  size?: 'default' | 'sm';
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', children, ...props }, ref) => {
    
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center gap-1.5 transition duration-[180ms] disabled:opacity-50 disabled:cursor-not-allowed',
          // Variants
          variant === 'default' && 'border border-verko-border bg-verko-card text-verko-text hover:-translate-y-px',
          variant === 'primary' && 'bg-verko-gold text-white border border-verko-gold hover:bg-[#7A6549]',
          variant === 'danger' && 'bg-[#C0392B] text-white border border-[#C0392B] hover:bg-[#A93226]',
          variant === 'icon' && 'bg-transparent border-none text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.7)] p-1 hover:-translate-y-px',
          
          // Sizes
          size === 'default' && variant !== 'icon' && 'px-[18px] py-[9px] rounded-sm text-[13px] font-medium',
          size === 'sm' && variant !== 'icon' && 'px-3 py-1 rounded-sm text-xs font-medium',
          
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;
