import React, { useState, useEffect } from 'react';
import { X, Calculator } from 'lucide-react';
import Button from '../ui/Button';

interface BudgetAddLaborModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (labor: { actividad: string; costo_hora: number; cantidad_horas: number; subtotal: number }) => void;
}

const OPCIONES_ACTIVIDAD = [
  { id: 'armado', nombre: 'Armado de Mueble' },
  { id: 'instalacion', nombre: 'Instalación en sitio' },
  { id: 'corte', nombre: 'Corte y Canteado' },
  { id: 'diseño', nombre: 'Diseño e Ingeniería' },
  { id: 'otros', nombre: 'Otros (General)' },
];

export function BudgetAddLaborModal({ isOpen, onClose, onAdd }: BudgetAddLaborModalProps) {
  const [selectedActividad, setSelectedActividad] = useState<string>(OPCIONES_ACTIVIDAD[0].id);
  const [costoHoraStr, setCostoHoraStr] = useState<string>('');
  const [cantidadHorasStr, setCantidadHorasStr] = useState<string>('');
  const [totalStr, setTotalStr] = useState<string>('');
  const [isManualTotal, setIsManualTotal] = useState<boolean>(false);

  useEffect(() => {
    if (!isManualTotal) {
      const costo = parseFloat(costoHoraStr) || 0;
      const horas = parseFloat(cantidadHorasStr) || 0;
      if (costo > 0 && horas > 0) {
        setTotalStr((costo * horas).toString());
      } else {
        setTotalStr('');
      }
    }
  }, [costoHoraStr, cantidadHorasStr, isManualTotal]);

  const handleTotalChange = (ver: string) => {
    setIsManualTotal(true);
    setTotalStr(ver);
  };

  const resetManual = () => {
    setIsManualTotal(false);
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const costo_hora = parseFloat(costoHoraStr) || 0;
    const cantidad_horas = parseFloat(cantidadHorasStr) || 0;
    const subtotal = parseFloat(totalStr) || 0;
    const opcion = OPCIONES_ACTIVIDAD.find(o => o.id === selectedActividad);
    
    if (opcion) {
      onAdd({
        actividad: opcion.nombre,
        costo_hora,
        cantidad_horas,
        subtotal
      });
      setCostoHoraStr('');
      setCantidadHorasStr('');
      setTotalStr('');
      setIsManualTotal(false);
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
            <h2 className="font-serif text-[34px] font-normal leading-[0.95] text-verko-text">Agregar Mano de Obra</h2>
            <p className="text-[13px] leading-relaxed text-verko-muted mt-2">
              Definí el costo por hora y las horas estimadas.
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-[rgba(255,255,255,0.3)] hover:text-[rgba(255,255,255,0.7)] transition p-1">
             <X className="w-5 h-5"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-verko-dim mb-2 block">Actividad</label>
            <div className="relative">
              <select
                value={selectedActividad}
                onChange={e => setSelectedActividad(e.target.value)}
                className="w-full min-h-[48px] px-[15px] py-3 rounded-2xl text-sm text-verko-text outline-none transition border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] focus:border-[rgba(199,153,67,0.58)] appearance-none"
              >
                {OPCIONES_ACTIVIDAD.map(op => (
                  <option key={op.id} value={op.id} className="bg-verko-bg text-verko-text">{op.nombre}</option>
                ))}
              </select>
              <ChevronDownIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-verko-dim pointer-events-none" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-verko-dim mb-2 block">Costo / Hora ($)</label>
              <input
                type="number"
                value={costoHoraStr}
                onChange={e => {
                  setCostoHoraStr(e.target.value);
                  setIsManualTotal(false);
                }}
                placeholder="Ej. 15000"
                className="w-full min-h-[48px] px-[15px] py-3 rounded-2xl text-sm text-verko-text outline-none transition border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] focus:border-[rgba(199,153,67,0.58)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] placeholder:text-verko-muted"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-verko-dim mb-2 block">Cant. de Horas</label>
              <input
                type="number"
                value={cantidadHorasStr}
                onChange={e => {
                  setCantidadHorasStr(e.target.value);
                  setIsManualTotal(false);
                }}
                placeholder="Ej. 8"
                className="w-full min-h-[48px] px-[15px] py-3 rounded-2xl text-sm text-verko-text outline-none transition border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] focus:border-[rgba(199,153,67,0.58)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] placeholder:text-verko-muted"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="font-mono text-[10px] tracking-[0.16em] uppercase text-verko-dim block">Subtotal ($)</label>
              {isManualTotal && (
                <button type="button" onClick={resetManual} className="text-[10px] text-verko-gold flex items-center hover:underline">
                  <Calculator className="w-3 h-3 mr-1" /> Auto-calcular
                </button>
              )}
            </div>
            <input
              type="number"
              required
              value={totalStr}
              onChange={e => handleTotalChange(e.target.value)}
              placeholder="Ej. 120000"
              className={`w-full min-h-[48px] px-[15px] py-3 rounded-2xl text-sm text-verko-text outline-none transition border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] focus:border-[rgba(199,153,67,0.58)] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] placeholder:text-verko-muted ${isManualTotal ? 'border-verko-gold/50 bg-verko-gold/5' : ''}`}
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-verko-border">
            <Button type="button" variant="default" onClick={onClose}>Cancelar</Button>
            <Button type="submit" variant="primary">Guardar Mano de Obra</Button>
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
