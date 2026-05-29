import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from './Button';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  containerClassName?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, containerClassName, ...props }, ref) => {
    return (
      <div className={cn('w-full', containerClassName)}>
        {label && (
          <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-verko-dim mb-2 block">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={cn(
            'w-full min-h-[48px] px-[15px] py-3 rounded-2xl text-sm text-verko-text outline-none transition',
            'border bg-gradient-to-b from-[rgba(255,255,255,0.025)] to-[rgba(255,255,255,0.01)]',
            'shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
            'placeholder:text-verko-muted resize-y',
            
            error 
              ? 'border-[#C0392B] focus:border-[#C0392B] focus:shadow-[0_0_0_4px_rgba(192,57,43,0.12),inset_0_1px_0_rgba(255,255,255,0.06)]' 
              : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.14)] focus:border-[rgba(199,153,67,0.58)] focus:shadow-[0_0_0_4px_rgba(199,153,67,0.12),inset_0_1px_0_rgba(255,255,255,0.06)]',
            className
          )}
          {...props}
        />
        {error && <p className="text-[#C0392B] text-xs mt-1.5">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';
export default Textarea;
