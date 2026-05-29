type SpinnerProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
};

export default function Spinner({ className = '', size = 'md' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-4',
  };

  return (
    <div
      className={`rounded-full border-verko-border border-t-verko-gold animate-spin ${sizeClasses[size]} ${className}`}
    />
  );
}
