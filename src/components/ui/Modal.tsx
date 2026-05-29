import { useEffect, useRef, ReactNode } from 'react';
import { cn } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export default function Modal({ isOpen, onClose, children, className }: ModalProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9000] flex items-center justify-center bg-[rgba(4,5,8,0.78)] backdrop-blur-[10px] p-4"
      onClick={handleOverlayClick}
    >
      <div
        ref={contentRef}
        className={cn(
          'w-[min(920px,calc(100vw-32px))] p-[30px] rounded-[28px]',
          'border border-verko-border shadow-md',
          'bg-gradient-to-b from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)]',
          'backdrop-blur-[28px]',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function ModalHeader({ title, subtitle, children }: { title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <div className="mb-6">
      <h2 className="font-serif text-[34px] font-normal leading-[0.95] text-verko-text">
        {title}
      </h2>
      {subtitle && (
        <p className="text-[13px] leading-relaxed text-verko-muted mt-2">
          {subtitle}
        </p>
      )}
      {children && (
        <div className="flex justify-end gap-2 pt-3 border-t border-verko-border mt-4">
          {children}
        </div>
      )}
    </div>
  );
}
