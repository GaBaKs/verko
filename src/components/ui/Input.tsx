import { InputHTMLAttributes, forwardRef, ReactNode } from 'react';
import { cn } from './Button'; // reuse cn

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, rightElement, containerClassName, ...props }, ref) => {
    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-verko-muted mb-2 block">
            {label}
          </label>
        )}
        <div className="relative">
          <input
            ref={ref}
            className={cn(
              'w-full min-h-[52px] px-5 py-[14px] rounded-xl font-sans text-[15px] font-[450] text-verko-text outline-none transition',
              'border',
              '!bg-[#0c1016]',
              'shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
              'placeholder:text-verko-muted',
              '[&:-webkit-autofill]:![box-shadow:0_0_0_1000px_#0c1016_inset,inset_0_1px_0_rgba(255,255,255,0.04)]',
              '[&:-webkit-autofill]:[color:inherit]',
              '[&:-webkit-autofill]:[background-color:#0c1016]',
              
              error 
                ? 'border-[#C0392B] focus:border-[#C0392B] focus:shadow-[0_0_0_4px_rgba(192,57,43,0.12),inset_0_1px_0_rgba(255,255,255,0.06)]' 
                : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.14)] focus:border-[rgba(199,153,67,0.58)] focus:shadow-[0_0_0_3px_rgba(199,153,67,0.15),inset_0_1px_0_rgba(255,255,255,0.06)]',
              rightElement && 'pr-10',
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-verko-muted">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="text-[#C0392B] text-xs mt-1.5">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';
export default Input;
