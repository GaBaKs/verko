import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../ui/Button';

interface BudgetAddMuebleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (mueble: { concepto: string; precio_unitario: number; tipo_mueble: string }) => void;
}

const OPCIONES_MUEBLES = [
  { id: 'importacion', nombre: 'Mueble de importación' },
  { id: 'premium', nombre: 'Mueble premium' }
];

export function BudgetAddMuebleModal({ isOpen, onClose, onAdd }: BudgetAddMuebleModalProps) {
  const [selectedMueble, setSelectedMueble] = useState<string>(OPCIONES_MUEBLES[0].id);
  const [precio, setPrecio] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parseFloat(precio) || 0;
    const opcion = OPCIONES_MUEBLES.find(o => o.id === selectedMueble);
    
    if (opcion) {
      onAdd({
        concepto: opcion.nombre,
        precio_unitario: parsedPrice,
        tipo_mueble: opcion.id
      });
      setPrecio('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[9000] flex items-center justify-center bg-[rgba(4,5,8,0.78)] backdrop-blur-[10px]" onClick={onClose}>
      <div 
        className="w-[min(480px,calc(100vw-32px))] p-[30px] rounded-[28px] border border-verko-border bg-gradient-to-b from-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.02)] backdrop-blur-[28px] shadow-md"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6 border-b border-verko-border pb-3">
          <div>
            <h2 className="font-serif text-[34px] font-normal leading-[0.95] text-verko-text">Agregar Mueble</h2>
            <p className="text-[13px] leading-relaxed text-verko-muted mt-2">
              Seleccioná un tipo de mueble predefinido y asignale un precio.
            </p>
          </div>
          <button onClick={onClose} className="text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.7)] transition p-1">
             <X className="w-5 h-5"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-verko-dim mb-2 block">Tipo de Mueble</label>
            <div className="relative">
              <select
                value={selectedMueble}
                onChange={e => setSelectedMueble(e.target.value)}
                className="w-full min-h-[48px] px-[15px] py-3 rounded-2xl text-sm text-verko-text outline-none transition border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] focus:border-[rgba(199,153,67,0.58)] appearance-none"
              >
                {OPCIONES_MUEBLES.map(op => (
                  <option key={op.id} value={op.id} className="bg-verko-bg text-verko-text">{op.nombre}</option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-verko-dim pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-verko-dim mb-2 block">Precio ($)</label>
            <input
              type="number"
              required
              value={precio}
              onChange={e => setPrecio(e.target.value)}
              placeholder="Ej. 150000"
              className="w-full min-h-[48px] px-[15px] py-3 rounded-2xl text-sm text-verko-text outline-none transition border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] focus:border-[rgba(199,153,67,0.58)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] placeholder:text-verko-muted"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-verko-border">
            <Button type="button" variant="default" onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="primary">Guardar Mueble</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ChevronDownIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m6 9 6 6 6-6"/>
    </svg>
  );
}
