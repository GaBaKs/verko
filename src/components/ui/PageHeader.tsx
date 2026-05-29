import { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  actions?: ReactNode;
}

export default function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between px-8 pt-6 pb-4 flex-shrink-0">
      <h1 className="font-serif text-[22px] font-semibold text-verko-text">
        {title}
      </h1>
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
