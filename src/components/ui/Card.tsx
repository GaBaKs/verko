import { ReactNode } from 'react';
import { cn } from './Button';

interface CardProps {
  children: ReactNode;
  className?: string;
  clickable?: boolean;
  onClick?: () => void;
  shine?: boolean;
}

export default function Card({ children, className, clickable = false, onClick, shine = true }: CardProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (clickable && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative rounded-[28px] border border-verko-border overflow-hidden',
        'bg-gradient-to-b from-[rgba(255,255,255,0.06)] to-[rgba(255,255,255,0.015)]',
        'shadow-[0_4px_12px_rgba(0,0,0,0.08)] text-left outline-none',
        
        clickable && [
          'cursor-pointer transition duration-[180ms]',
          'hover:-translate-y-px hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:border-[rgba(184,151,58,0.45)]',
          'focus-visible:outline-2 focus-visible:outline-verko-gold focus-visible:outline-offset-[3px]'
        ],
        
        className
      )}
    >
      {shine && (
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.22)] to-transparent pointer-events-none" />
      )}
      {children}
    </div>
  );
}
