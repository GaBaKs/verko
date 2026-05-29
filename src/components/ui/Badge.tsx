import { cn } from './Button';

export type BadgeTone = 'gold' | 'green' | 'blue' | 'orange' | 'red' | 'gray' | 'yellow' | 'purple' | 'teal';

interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}

const toneStyles: Record<BadgeTone, string> = {
  gold:   'bg-[rgba(199,153,67,0.12)] text-verko-gold-light border-[rgba(199,153,67,0.22)]',
  green:  'bg-verko-green-bg text-verko-green border-[rgba(121,210,140,0.2)]',
  blue:   'bg-verko-blue-bg text-verko-blue border-[rgba(121,171,255,0.22)]',
  orange: 'bg-verko-orange-bg text-verko-orange border-[rgba(231,170,97,0.22)]',
  red:    'bg-verko-red-bg text-verko-red border-[rgba(239,143,129,0.22)]',
  gray:   'bg-verko-gray-bg text-verko-gray border-[rgba(154,147,140,0.18)]',
  yellow: 'bg-verko-yellow-bg text-verko-yellow border-[rgba(239,198,107,0.2)]',
  purple: 'bg-verko-purple-bg text-verko-purple border-[rgba(185,156,244,0.22)]',
  teal:   'bg-verko-teal-bg text-verko-teal border-[rgba(105,211,195,0.2)]',
};

export default function Badge({ children, tone = 'gray', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border',
        'text-[10px] tracking-[0.12em] uppercase font-medium',
        toneStyles[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
