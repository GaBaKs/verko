import React from 'react';
import Card from '../../ui/Card';

export function BudgetConfigTab({ editor }: { editor: any }) {
  const config = editor.presupuesto?.costeo_config || {};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-serif text-[20px] text-verko-text mb-4">Configuración del Presupuesto</h2>
        <p className="text-sm text-verko-secondary">Ajusta los parámetros específicos de este presupuesto. Las modificaciones aquí afectarán solo la estructura de costeo de la versión activa.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="font-mono text-[10px] tracking-[0.16em] uppercase text-verko-dim mb-4">Márgenes e Impuestos</h3>
          <div className="space-y-4">
             <div className="flex justify-between items-center py-2 border-b border-[rgba(255,255,255,0.06)]">
                <span className="text-sm text-verko-text">Multiplicador Importado</span>
                <span className="font-mono text-[12px]">{config.multiplicador_mueble_importado ?? 2.5}x</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-[rgba(255,255,255,0.06)]">
                <span className="text-sm text-verko-text">Multiplicador Premium</span>
                <span className="font-mono text-[12px]">{config.multiplicador_mueble_premium ?? 5.0}x</span>
             </div>
             <div className="flex justify-between items-center py-2 border-b border-[rgba(255,255,255,0.06)]">
                <span className="text-sm text-verko-text">IVA</span>
                <span className="font-mono text-[12px]">{config.iva_pct || 21}%</span>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
