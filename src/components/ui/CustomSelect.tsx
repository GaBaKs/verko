import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from './Button'; // Assuming Button exports cn utility

export interface CustomSelectProps {
  label?: string;
  error?: string;
  containerClassName?: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
}

export default function CustomSelect({
  label,
  error,
  containerClassName,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={cn('w-full relative', containerClassName)} ref={containerRef}>
      {label && (
        <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-verko-muted mb-2 block">
          {label}
        </label>
      )}
      
      <div 
        className={cn(
          'w-full min-h-[52px] px-5 py-[14px] rounded-xl outline-none transition cursor-pointer flex items-center justify-between',
          'border !bg-[#0c1016]',
          'shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]',
          disabled && 'opacity-50 cursor-not-allowed',
          error 
            ? 'border-[#C0392B] shadow-[0_0_0_4px_rgba(192,57,43,0.12),inset_0_1px_0_rgba(255,255,255,0.06)]' 
            : isOpen 
              ? 'border-[rgba(199,153,67,0.58)] shadow-[0_0_0_3px_rgba(199,153,67,0.15),inset_0_1px_0_rgba(255,255,255,0.06)]'
              : 'border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.14)]'
        )}
        onClick={toggleDropdown}
      >
        <span className={cn(
          'font-sans text-[15px] font-[450] select-none truncate pr-4',
          !selectedOption ? 'text-verko-muted' : 'text-verko-text'
        )}>
          {selectedOption ? selectedOption.label : (placeholder || '\u00A0')}
        </span>
        
        <ChevronDown 
          className={cn(
            'w-4 h-4 text-verko-muted transition-transform duration-200 flex-shrink-0',
            isOpen && 'rotate-180 text-verko-gold'
          )} 
        />
      </div>

      {isOpen && (
        <div className="absolute top-full mt-1.5 left-0 right-0 z-50 bg-[#111318] border border-[rgba(255,255,255,0.1)] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.4)] overflow-hidden">
          <div className="max-h-[240px] overflow-y-auto scrollbar-thin scrollbar-thumb-[rgba(255,255,255,0.1)] scrollbar-track-transparent">
            {placeholder && (
              <div 
                className={cn(
                  'px-5 py-3 text-[14px] font-sans flex items-center justify-between cursor-pointer italic transition-colors duration-100',
                  value === '' 
                    ? 'bg-[rgba(199,153,67,0.1)] text-[#C79943]' 
                    : 'text-verko-muted hover:bg-[rgba(255,255,255,0.05)] hover:text-white'
                )}
                onClick={() => handleSelect('')}
              >
                <span>{placeholder}</span>
                {value === '' && <Check className="w-4 h-4" />}
              </div>
            )}
            
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <div
                  key={option.value}
                  className={cn(
                    'px-5 py-3 text-[14px] font-sans flex items-center justify-between cursor-pointer transition-colors duration-100',
                    isSelected 
                      ? 'bg-[rgba(199,153,67,0.1)] text-[#C79943]' 
                      : 'text-verko-text hover:bg-[rgba(255,255,255,0.05)] hover:text-white'
                  )}
                  onClick={() => handleSelect(option.value)}
                >
                  <span>{option.label}</span>
                  {isSelected && <Check className="w-4 h-4" />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {error && <p className="text-[#C0392B] text-xs mt-1.5">{error}</p>}
    </div>
  );
}
