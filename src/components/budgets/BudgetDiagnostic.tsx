import React from 'react';
import Card from '../ui/Card';
import { AlertCircle, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';
import { useBudgetEditor } from '../../hooks/useBudgetEditor'; // or take from props as editor that contains budget data

export function BudgetDiagnostic({ editor }: { editor: any }) {

  // Simple diagnostics
  const diag = {
    blocks: [] as string[],
    criticals: [] as string[],
    warnings: [] as string[],
    ok: false
  };

  const b = editor.presupuesto;
  const tot = editor.totales;

  if (!b?.cliente_id && !b?.metadata?.lead) {
    diag.blocks.push("Sin cliente o prospecto asignado.");
  }
  if (editor.lineas.length === 0) {
    diag.blocks.push("No hay líneas de muebles en el presupuesto.");
  }

  if (tot && tot.ganancia_neta < 0) {
    diag.criticals.push("Ganancia neta negativa.");
  }
  if (tot && tot.total_mano_obra === 0 && editor.lineas.length > 0) {
    diag.criticals.push("No hay costos declarados de mano de obra.");
  }

  if (tot && tot.margen_real_pct < 15 && tot.margen_real_pct >= 0) {
    diag.warnings.push("El margen real es menor al 15%.");
  }

  if (diag.blocks.length === 0 && diag.criticals.length === 0 && diag.warnings.length === 0) {
    diag.ok = true;
  }

  return (
    <Card className="p-4">
       <div className="flex items-center gap-2 mb-3">
         <h3 className="font-serif text-[16px] text-verko-text">Diagnóstico de Presupuesto</h3>
       </div>
       
       {diag.ok ? (
         <div className="flex items-center gap-2 text-verko-green p-3 bg-verko-green-bg rounded-xl border border-[rgba(121,210,140,0.2)]">
           <CheckCircle2 className="w-4 h-4" />
           <span className="text-[13px]">El presupuesto se encuentra en condiciones óptimas.</span>
         </div>
       ) : (
         <div className="space-y-2">
           {diag.blocks.map((msg, i) => (
             <div key={i} className="flex gap-2 text-verko-red p-3 bg-verko-red-bg rounded-xl border border-[rgba(239,143,129,0.22)]">
               <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
               <span className="text-[13px]">{msg}</span>
             </div>
           ))}
           {diag.criticals.map((msg, i) => (
             <div key={i} className="flex gap-2 text-verko-orange p-3 bg-verko-orange-bg rounded-xl border border-[rgba(231,170,97,0.22)]">
               <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
               <span className="text-[13px]">{msg}</span>
             </div>
           ))}
           {diag.warnings.map((msg, i) => (
             <div key={i} className="flex gap-2 text-verko-yellow p-3 bg-verko-yellow-bg rounded-xl border border-[rgba(239,198,107,0.2)]">
               <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
               <span className="text-[13px]">{msg}</span>
             </div>
           ))}
         </div>
       )}
    </Card>
  );
}
