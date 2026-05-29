import React from 'react';
import Badge, { type BadgeTone } from '../ui/Badge';
import type { Presupuesto } from '../../types/database';

interface BudgetStatusBadgeProps {
  status?: string;
  className?: string;
}

const STATUS_BADGE: Record<string, { label: string; tone: BadgeTone }> = {
  borrador:  { label: 'Borrador',  tone: 'gray' },
  enviado:   { label: 'Enviado',   tone: 'blue' },
  aprobado:  { label: 'Aprobado',  tone: 'green' },
  rechazado: { label: 'Rechazado', tone: 'red' },
};

export function BudgetStatusBadge({ status, className }: BudgetStatusBadgeProps) {
  const badgeInfo = status && STATUS_BADGE[status] ? STATUS_BADGE[status] : STATUS_BADGE.borrador;

  
  return (
    <Badge tone={badgeInfo.tone} className={className}>
      {badgeInfo.label}
    </Badge>
  );
}
