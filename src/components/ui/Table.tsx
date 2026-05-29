import { ReactNode } from 'react';
import { cn } from './Button';

interface Column<T> {
  key: string;
  header: ReactNode;
  render?: (row: T) => ReactNode;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  className?: string;
}

export default function Table<T extends { id?: string | number }>({ columns, data, onRowClick, className }: TableProps<T>) {
  return (
    <div className={cn(
      'rounded-[24px] border border-verko-border overflow-hidden',
      'bg-gradient-to-b from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.015)]',
      className
    )}>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={col.key || idx}
                  className="px-[18px] py-[15px] font-mono text-[10px] tracking-[0.18em] uppercase text-verko-dim bg-[rgba(255,255,255,0.03)] border-b border-verko-border font-normal whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-[18px] py-8 text-center text-[13px] text-verko-secondary">
                  No hay datos para mostrar.
                </td>
              </tr>
            ) : (
              data.map((row, rowIdx) => (
                <tr
                  key={row.id || rowIdx}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    'transition-colors',
                    onRowClick ? 'cursor-pointer hover:bg-[rgba(255,255,255,0.035)]' : ''
                  )}
                >
                  {columns.map((col, colIdx) => (
                    <td
                      key={col.key || colIdx}
                      className="px-[18px] py-[16px] text-[13px] text-verko-secondary border-b border-[rgba(255,255,255,0.06)]"
                    >
                      {col.render ? col.render(row) : (row as any)[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
