import React, { useState } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { Plus, Hammer, Trash2 } from 'lucide-react';
import type { PresupuestoManoObra } from '../../../types/database';
import { BudgetAddLaborModal } from '../BudgetAddLaborModal';

export function BudgetLaborTab({ editor }: { editor: any }) {
  const labor = editor.manoObra as PresupuestoManoObra[];
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddLabor = async (data: { actividad: string; costo_hora: number; cantidad_horas: number; subtotal: number }) => {
    await editor.addManoObra({
      actividad: data.actividad,
      tarifa_hora: data.costo_hora,
      minutos: data.cantidad_horas * 60,
      subtotal: data.subtotal,
      origen: 'manual'
    });
  };

  const handleDeleteLabor = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await editor.deleteManoObra(id);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-serif text-[20px] text-verko-text">Mano de Obra</h2>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Agregar Mano de Obra
        </Button>
      </div>

      {labor.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-verko-border rounded-2xl bg-[rgba(255,255,255,0.015)]">
           <Hammer className="w-8 h-8 text-verko-dim mb-3" />
           <p className="text-sm text-verko-secondary mb-4">No hay mano de obra registrada en este presupuesto.</p>
           <Button variant="primary" onClick={() => setIsModalOpen(true)}>
             <Plus className="w-4 h-4 mr-2" /> Agregar Mano de Obra
           </Button>
        </div>
      ) : (
        <div className="rounded-[24px] border border-verko-border bg-gradient-to-b from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.015)] overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-[18px] py-[15px] font-mono text-[10px] tracking-[0.18em] uppercase text-verko-dim bg-[rgba(255,255,255,0.03)] border-b border-verko-border">Actividad</th>
                <th className="px-[18px] py-[15px] font-mono text-[10px] tracking-[0.18em] uppercase text-verko-dim bg-[rgba(255,255,255,0.03)] border-b border-verko-border">Minutos</th>
                <th className="px-[18px] py-[15px] font-mono text-[10px] tracking-[0.18em] uppercase text-verko-dim bg-[rgba(255,255,255,0.03)] border-b border-verko-border text-right">Tarifa/Hora</th>
                <th className="px-[18px] py-[15px] font-mono text-[10px] tracking-[0.18em] uppercase text-verko-dim bg-[rgba(255,255,255,0.03)] border-b border-verko-border text-right">Subtotal</th>
                <th className="w-12 px-[18px] py-[15px] bg-[rgba(255,255,255,0.03)] border-b border-verko-border"></th>
              </tr>
            </thead>
            <tbody>
              {labor.map(l => (
                <tr key={l.id} className="group hover:bg-[rgba(255,255,255,0.035)] transition-colors">
                  <td className="px-[18px] py-[16px] text-[13px] text-verko-text border-b border-[rgba(255,255,255,0.06)] font-medium capitalize">
                    {l.actividad}
                    {l.origen === 'ia' && <span className="ml-2 px-1.5 py-0.5 rounded bg-[rgba(255,255,255,0.1)] text-[9px] uppercase tracking-wider text-verko-dim">Auto</span>}
                  </td>
                  <td className="px-[18px] py-[16px] text-[13px] text-verko-secondary border-b border-[rgba(255,255,255,0.06)]">
                    {l.minutos} min ({(l.minutos/60).toFixed(1)}h)
                  </td>
                  <td className="px-[18px] py-[16px] text-[13px] text-verko-secondary border-b border-[rgba(255,255,255,0.06)] text-right font-mono">
                    ${l.tarifa_hora?.toLocaleString('es-AR')}
                  </td>
                  <td className="px-[18px] py-[16px] text-[13px] text-verko-text border-b border-[rgba(255,255,255,0.06)] text-right font-mono">
                    ${l.subtotal?.toLocaleString('es-AR')}
                  </td>
                  <td className="px-[18px] py-[16px] border-b border-[rgba(255,255,255,0.06)] text-right">
                    <button onClick={(e) => handleDeleteLabor(l.id, e)} className="text-[rgba(255,255,255,0.3)] hover:text-verko-red transition opacity-0 group-hover:opacity-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <BudgetAddLaborModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddLabor}
      />
    </div>
  );
}
