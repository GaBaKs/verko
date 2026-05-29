import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useBudgetEditor } from '../../hooks/useBudgetEditor';
import { useExportPdf } from '../../hooks/useExportPdf';
import { BudgetTab } from '../../types/budget';
import Spinner from '../ui/Spinner';
import Button from '../ui/Button';
import { ArrowLeft, FileDown } from 'lucide-react';
import { useUiStore } from '../../stores/uiStore';

import { BudgetSummaryTab } from './tabs/BudgetSummaryTab';
import { BudgetItemsTab } from './tabs/BudgetItemsTab';
import { BudgetLaborTab } from './tabs/BudgetLaborTab';
import { BudgetConfigTab } from './tabs/BudgetConfigTab';
import { BudgetInfoTab } from './tabs/BudgetInfoTab';
import { BudgetChatTab } from './tabs/BudgetChatTab';
import { BudgetAttachmentsTab } from './tabs/BudgetAttachmentsTab';

const TABS: { id: BudgetTab, label: string }[] = [
  { id: 'resumen', label: 'Resumen' },
  { id: 'items', label: 'Ítems y Piezas' },
  { id: 'labor', label: 'Mano de Obra' },
  { id: 'config', label: 'Configuración' },
  { id: 'info', label: 'Información' },
  { id: 'chat', label: 'Asistente IA' },
  { id: 'attachments', label: 'Adjuntos' },
];

function getNombrePresupuesto(b: any): string {
  const lead = b.metadata?.lead as Record<string, any> | undefined;
  const leadNombre = lead?.nombre as string | undefined;
  if (leadNombre) return leadNombre;
  if (b.obra_id) return `Obra #${b.obra_id.substring(0, 8)}`;
  if (b.cliente_id) return `Cliente #${b.cliente_id.substring(0, 8)}`;
  return 'Presupuesto sin título';
}

export default function BudgetEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addToast = useUiStore(s => s.addToast);
  
  const editor = useBudgetEditor(id || '');
  const { exportPdf, isExporting } = useExportPdf();

  useEffect(() => {
    if (id) {
      editor.fetchBudget();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (editor.isLoading && !editor.presupuesto) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!editor.presupuesto) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-verko-secondary">
        <p>El presupuesto no existe o no se pudo cargar.</p>
        <Button variant="default" onClick={() => navigate('/budgets')}>
          Volver a Presupuestos
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-verko-bg overflow-hidden">
      <div className="flex items-center justify-between px-6 pt-6 pb-2">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/budgets')}
            className="p-2 -ml-2 text-verko-dim hover:text-verko-text transition-colors rounded-full hover:bg-[rgba(255,255,255,0.05)]"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="font-serif text-[22px] font-semibold text-verko-text leading-none mb-1">
              {getNombrePresupuesto(editor.presupuesto)}
            </h1>
            <p className="font-mono text-[10px] text-verko-dim tracking-widest uppercase">
              {editor.presupuesto.numero_correlativo ? `N° ${editor.presupuesto.numero_correlativo}` : `ID: ${editor.presupuesto.id.substring(0,8)}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="default" 
            onClick={() => {
              if (editor.presupuesto) {
                exportPdf(editor.presupuesto.id).catch(() => {
                  addToast('Ocurrió un error al generar el payload para el PDF', 'error');
                });
              }
            }}
            disabled={isExporting}
          >
            <FileDown className="w-4 h-4 mr-2" />
            {isExporting ? 'Exportando...' : 'Exportar PDF'}
          </Button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-[rgba(255,255,255,0.06)] px-6 overflow-x-auto no-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => editor.setActiveTab(tab.id)}
            className={`px-4 py-3 font-sans text-[13px] font-medium transition-colors border-b-2 whitespace-nowrap ${
              editor.activeTab === tab.id 
                ? 'border-verko-gold text-verko-gold-light' 
                : 'border-transparent text-verko-muted hover:text-verko-text hover:border-[rgba(255,255,255,0.12)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-[1200px] mx-auto min-h-full">
          {editor.activeTab === 'resumen' && <BudgetSummaryTab editor={editor} />}
          {editor.activeTab === 'items' && <BudgetItemsTab editor={editor} />}
          {editor.activeTab === 'labor' && <BudgetLaborTab editor={editor} />}
          {editor.activeTab === 'config' && <BudgetConfigTab editor={editor} />}
          {editor.activeTab === 'info' && <BudgetInfoTab editor={editor} />}
          {editor.activeTab === 'chat' && <BudgetChatTab editor={editor} />}
          {editor.activeTab === 'attachments' && <BudgetAttachmentsTab editor={editor} />}
        </div>
      </div>
    </div>
  );
}
