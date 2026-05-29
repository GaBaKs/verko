import { useState } from 'react';
import { buildBudgetPdfPayload } from '../lib/budgetPdfPayload';
import { renderBudgetPdf } from '../lib/budgetPdfRenderer';
import { useUiStore } from '../stores/uiStore';

export function useExportPdf() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addToast = useUiStore(s => s.addToast);

  const exportPdf = async (presupuestoId: string) => {
    setIsExporting(true);
    setError(null);
    try {
      const payload = await buildBudgetPdfPayload(presupuestoId);
      const html = renderBudgetPdf(payload);

      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Presupuesto-${payload.identificacion.numero.replace(/\s+/g, '-')}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      
      addToast('Presupuesto exportado con éxito', 'success');
      
    } catch (err: unknown) {
      console.error('[useExportPdf] Error generando PDF:', err);
      const msg = err instanceof Error ? err.message : 'Error desconocido al exportar';
      setError(msg);
      addToast(msg, 'error');
      throw err;
    } finally {
      setIsExporting(false);
    }
  };

  return {
    exportPdf,
    isExporting,
    error
  };
}
