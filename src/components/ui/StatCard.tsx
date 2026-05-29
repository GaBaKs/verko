import { ReactNode } from 'react';
import Card from './Card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
}

export default function StatCard({ label, value, icon }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="font-mono text-[10px] tracking-[0.16em] uppercase text-verko-dim mb-2">
            {label}
          </p>
          <div className="font-serif text-[32px] font-semibold text-verko-gold">
            {value}
          </div>
        </div>
        {icon && <div className="text-verko-dim">{icon}</div>}
      </div>
    </Card>
  );
}
