import { ReactNode } from 'react';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: string;
  message: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="w-full py-16 flex flex-col items-center justify-center text-center border border-dashed border-verko-border rounded-[28px] bg-[rgba(255,255,255,0.02)]">
      {icon && <div className="text-verko-dim mb-4">{icon}</div>}
      {title && <h3 className="font-serif text-xl text-verko-text mb-2">{title}</h3>}
      <p className="text-sm text-verko-secondary max-w-sm mb-6">{message}</p>
      {action && <div>{action}</div>}
    </div>
  );
}
