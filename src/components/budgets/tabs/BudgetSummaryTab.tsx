import React from 'react';
import Card from '../../ui/Card';
import { BudgetDiagnostic } from '../BudgetDiagnostic';

export function BudgetSummaryTab({ editor }: { editor: any }) {
  const tot = editor.totales;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6">
          <h2 className="font-serif text-[20px] text-verko-text mb-4">Estructura de Costeo</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-[rgba(255,255,255,0.06)]">
              <span className="font-sans text-[13px] text-verko-secondary">A. Materiales</span>
              <span className="font-mono text-[13px] text-verko-text">${tot?.total_materiales?.toLocaleString('es-AR')||'0'}</span>
            </div>
            {editor.lineas?.filter((l: any) => l.tipo_linea === 'mueble').length > 0 && (
              <div className="pl-4 pb-2 border-b border-[rgba(255,255,255,0.06)]">
                {editor.lineas.filter((l: any) => l.tipo_linea === 'mueble').map((mueble: any) => {
                  const costoBase = (mueble.precio_unitario || 0) * (mueble.cantidad || 1);
                  
                  return (
                    <div key={mueble.id} className="flex justify-between py-1 items-center">
                      <span className="font-sans text-[12px] text-verko-dim pl-2 border-l border-verko-gold/30">
                        └ {mueble.concepto}
                      </span>
                      <span className="font-mono text-[12px] text-verko-dim">${costoBase.toLocaleString('es-AR')}</span>
                    </div>
                  );
                })}
              </div>
            )}
            
            <div className="flex justify-between items-center py-2 border-b border-[rgba(255,255,255,0.06)]">
              <span className="font-sans text-[13px] text-verko-secondary">B. Mano de Obra</span>
              <span className="font-mono text-[13px] text-verko-text">${tot?.total_mano_obra?.toLocaleString('es-AR')||'0'}</span>
            </div>

            <div className="flex justify-between items-center py-2 bg-[rgba(255,255,255,0.02)] px-3 rounded-lg">
              <span className="font-sans text-[13px] text-verko-text font-medium">Costo Total (A+B)</span>
              <span className="font-mono text-[13px] text-verko-text font-medium">${tot?.total_costo?.toLocaleString('es-AR')||'0'}</span>
            </div>

            <div className="flex justify-between items-center py-2 border-b border-[rgba(255,255,255,0.06)]">
              <span className="font-sans text-[13px] text-verko-secondary">C. Margen Aplicado</span>
              <span className="font-mono text-[13px] text-[#A6E22E]">+ ${((tot?.subtotal_con_margen || 0) - (tot?.total_costo || 0))?.toLocaleString('es-AR')||'0'}</span>
            </div>
            
            <div className="flex justify-end pt-4 border-t border-[rgba(255,255,255,0.06)] mt-4">
              <button
                onClick={() => editor.saveTotales()}
                disabled={editor.saving}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-verko-gold text-[#1a1400] tracking-wide shadow-[0_2px_12px_rgba(199,153,67,0.25)] hover:bg-[#b58835] transition-all disabled:opacity-50"
              >
                {editor.saving ? 'Guardando...' : 'Guardar Totales'}
              </button>
            </div>
          </div>
        </Card>

        <BudgetDiagnostic editor={editor} />
      </div>

      <div className="space-y-6">
        <Card className="p-6 border-verko-gold/20 bg-gradient-to-br from-[rgba(199,153,67,0.08)] to-transparent">
          <h3 className="font-mono text-[10px] tracking-[0.16em] uppercase text-verko-gold-light mb-1">Precio Final</h3>
          <p className="font-serif text-[42px] leading-none text-verko-text mb-6">
            ${tot?.total_final?.toLocaleString('es-AR') || '0'}
          </p>

          <div className="space-y-3 pt-4 border-t border-[rgba(255,255,255,0.06)]">
            <div className="flex justify-between">
              <span className="font-sans text-[12px] text-verko-secondary">Ganancia Neta</span>
              <span className="font-mono text-[12px] text-[#A6E22E]">${tot?.ganancia_neta?.toLocaleString('es-AR')||'0'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-sans text-[12px] text-verko-secondary">Margen Real</span>
              <span className="font-mono text-[12px] text-[#A6E22E]">{tot?.margen_real_pct?.toFixed(1) || '0'}%</span>
            </div>
            <div className="flex justify-between">
              <span className="font-sans text-[12px] text-verko-secondary">Impuestos (IVA+IIBB)</span>
              <span className="font-mono text-[12px] text-verko-text">${((tot?.total_iva||0) + (tot?.total_iibb||0))?.toLocaleString('es-AR')||'0'}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
