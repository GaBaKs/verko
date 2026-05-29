import React, { useState } from 'react';
import Card from '../../ui/Card';
import Button from '../../ui/Button';
import { Settings2, Plus, Box, Save, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import type { LineaPresupuesto } from '../../../types/database';
import { BudgetAddMuebleModal } from '../BudgetAddMuebleModal';

export function BudgetItemsTab({ editor }: { editor: any }) {
  const lineas = editor.lineas as LineaPresupuesto[];
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddMueble = async (data: { concepto: string; precio_unitario: number; tipo_mueble: string }) => {
    await editor.addLinea({
      tipo_linea: 'mueble',
      concepto: data.concepto,
      cantidad: 1,
      precio_unitario: data.precio_unitario,
      subtotal: data.precio_unitario,
      metadata: { tipo_mueble: data.tipo_mueble }
    });
  };

  const handleDeleteMueble = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await editor.deleteLinea(id);
  };

  const renderEmpty = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border border-dashed border-verko-border rounded-2xl bg-[rgba(255,255,255,0.015)]">
       <Box className="w-8 h-8 text-verko-dim mb-3" />
       <p className="text-sm text-verko-secondary mb-4">No hay ítems registrados en este presupuesto.</p>
       <Button variant="primary" onClick={() => setIsModalOpen(true)}>
         <Plus className="w-4 h-4 mr-2" /> Agregar Mueble
       </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-serif text-[20px] text-verko-text">Items</h2>
        <Button variant="primary" onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" /> Agregar Mueble
        </Button>
      </div>

      {lineas.length === 0 ? renderEmpty() : (
        <div className="rounded-[24px] border border-verko-border overflow-hidden bg-gradient-to-b from-[rgba(255,255,255,0.05)] to-[rgba(255,255,255,0.015)]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="w-8 px-[18px] py-[15px] bg-[rgba(255,255,255,0.03)] border-b border-verko-border"></th>
                <th className="px-[18px] py-[15px] font-mono text-[10px] tracking-[0.18em] uppercase text-verko-dim bg-[rgba(255,255,255,0.03)] border-b border-verko-border">Concepto</th>
                <th className="px-[18px] py-[15px] font-mono text-[10px] tracking-[0.18em] uppercase text-verko-dim bg-[rgba(255,255,255,0.03)] border-b border-verko-border text-right">Cant.</th>
                <th className="px-[18px] py-[15px] font-mono text-[10px] tracking-[0.18em] uppercase text-verko-dim bg-[rgba(255,255,255,0.03)] border-b border-verko-border text-right">Unitario</th>
                <th className="px-[18px] py-[15px] font-mono text-[10px] tracking-[0.18em] uppercase text-verko-dim bg-[rgba(255,255,255,0.03)] border-b border-verko-border text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {lineas.filter(l => l.tipo_linea === 'mueble').map(lineaRow => {
                const linea = lineaRow as any;
                const isExpanded = expandedRow === linea.id;
                const tipo = linea.metadata?.tipo_mueble;
                
                let multiplier = 1;
                const config = editor.presupuesto?.costeo_config || {};
                if (tipo === 'importacion') {
                  multiplier = Number(config.multiplicador_mueble_importado) || 2.5;
                } else if (tipo === 'premium') {
                  multiplier = Number(config.multiplicador_mueble_premium) || 5.0;
                }
                const subtotalCalculado = (linea.precio_unitario || 0) * (linea.cantidad || 1) * multiplier;

                return (
                 <React.Fragment key={linea.id}>
                  <tr 
                    className="hover:bg-[rgba(255,255,255,0.035)] cursor-pointer transition-colors"
                    onClick={() => setExpandedRow(isExpanded ? null : linea.id)}
                  >
                    <td className="px-[18px] py-[16px] border-b border-[rgba(255,255,255,0.06)]">
                      {isExpanded ? <ChevronDown className="w-4 h-4 text-verko-dim" /> : <ChevronRight className="w-4 h-4 text-verko-dim" />}
                    </td>
                    <td className="px-[18px] py-[16px] text-[13px] text-verko-text border-b border-[rgba(255,255,255,0.06)] font-medium">
                      {linea.concepto}
                    </td>
                    <td className="px-[18px] py-[16px] text-[13px] text-verko-secondary border-b border-[rgba(255,255,255,0.06)] text-right">
                      {linea.cantidad || 1}
                    </td>
                    <td className="px-[18px] py-[16px] text-[13px] text-verko-secondary border-b border-[rgba(255,255,255,0.06)] text-right font-mono">
                      ${linea.precio_unitario?.toLocaleString('es-AR')||'0'}
                    </td>
                    <td className="px-[18px] py-[16px] text-[13px] text-verko-text border-b border-[rgba(255,255,255,0.06)] text-right font-mono flex flex-col pt-[10px]">
                      <span>${subtotalCalculado.toLocaleString('es-AR')}</span>
                      <span className="text-[10px] text-verko-gold/80 italic font-sans">(x{multiplier})</span>
                    </td>
                  </tr>
                  {/* Expansion content */}
                  {isExpanded && (
                    <tr className="bg-[rgba(0,0,0,0.2)]">
                      <td colSpan={6} className="px-[18px] py-4 border-b border-[rgba(255,255,255,0.06)] border-l-2 border-l-verko-gold">
                        <div className="flex flex-col gap-3 ml-4">
                           <div className="text-xs text-verko-dim mb-2 flex justify-between items-center">
                             <span>Este mueble no tiene piezas cargadas. (Se generaría desde la IA).</span>
                             <div className="flex gap-2">
                               <Button variant="default" className="text-[12px] h-[28px] px-3 font-sans text-[#E8E8E8] border-[rgba(255,255,255,0.08)] bg-verko-card hover:-translate-y-px transition" onClick={(e) => handleDeleteMueble(linea.id, e)}>
                                 <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Eliminar Mueble
                               </Button>
                             </div>
                           </div>
                        </div>
                      </td>
                    </tr>
                  )}
                 </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <BudgetAddMuebleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddMueble}
      />
    </div>
  );
}
