import { useEffect, useState } from 'react';
import * as api from '../../lib/api/budgets';
import type { Presupuesto } from '../../types/database';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Spinner from '../ui/Spinner';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { useUiStore } from '../../stores/uiStore';

function getNombrePresupuesto(b: Presupuesto): string {
  const lead = b.metadata?.lead as Record<string, any> | undefined;
  const leadNombre = lead?.nombre as string | undefined;
  if (leadNombre) return leadNombre;
  if (b.obra_id) return `Obra #${b.obra_id.substring(0, 8)}`;
  if (b.cliente_id) return `Cliente #${b.cliente_id.substring(0, 8)}`;
  return 'Presupuesto sin título';
}

export default function BudgetList() {
  const [budgets, setBudgets] = useState<Presupuesto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addToast } = useUiStore();

  const fetchBudgets = () => {
    setIsLoading(true);
    api.getPresupuestos()
      .then(data => {
        setBudgets(data);
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    // Persistencia: reabrir último presupuesto
    const lastOpened = localStorage.getItem('verko_last_budget_id');
    // Si queremos redirigir directamente, podriamos hacerlo aca.
    // Pero lo vamos a mantener simple, el usuario hace click.
    fetchBudgets();
  }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('¿Estás seguro de eliminar este presupuesto?')) return;
    
    setDeletingId(id);
    try {
      await api.deletePresupuesto(id);
      addToast('Presupuesto eliminado con éxito', 'success');
      setBudgets(budgets.filter(b => b.id !== id));
      if (localStorage.getItem('verko_last_budget_id') === id) {
        localStorage.removeItem('verko_last_budget_id');
      }
    } catch (err: any) {
      console.error('[BudgetList delete]', err);
      addToast('Error al eliminar el presupuesto', 'error');
    } finally {
      if (deletingId === id) setDeletingId(null);
    }
  };

  if (isLoading && budgets.length === 0) {
    return <div className="flex h-40 justify-center items-center"><Spinner /></div>;
  }

  if (budgets.length === 0) {
    return <div className="text-sm text-verko-secondary p-8 text-center rounded-[24px] border border-verko-border bg-[rgba(255,255,255,0.02)]">No hay presupuestos todavía.</div>;
  }

  return (
    <div className="grid gap-4">
      {budgets.map(b => (
        <Card 
          key={b.id} 
          clickable 
          className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
          onClick={() => {
            localStorage.setItem('verko_last_budget_id', b.id);
            navigate(`/budget/${b.id}`);
          }}
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h4 className="font-serif text-[18px] text-verko-text font-medium truncate">
                {getNombrePresupuesto(b)}
              </h4>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-verko-dim uppercase tracking-wider">
              <span>{b.id.substring(0, 8)}</span>
              <span>•</span>
              <span>{new Date(b.created_at).toLocaleDateString('es-AR')}</span>
            </div>
          </div>
          <div className="flex items-center gap-6 justify-end">
            <div className="text-right">
              {b.total_final && b.total_final > 0 ? (
                <>
                  <p className="font-mono text-[10px] uppercase text-verko-dim tracking-widest mb-0.5">Total</p>
                  <p className="font-serif text-[20px] text-verko-gold leading-none">
                    ARS {b.total_final.toLocaleString('es-AR')}
                  </p>
                </>
              ) : null}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="default" onClick={(e) => {
                e.stopPropagation();
                localStorage.setItem('verko_last_budget_id', b.id);
                navigate(`/budget/${b.id}`);
              }}>Abrir</Button>
              <button 
                onClick={(e) => handleDelete(e, b.id)}
                disabled={deletingId === b.id}
                className="w-[38px] h-[38px] flex items-center justify-center rounded-sm border border-transparent hover:border-[#C0392B] hover:bg-[#C0392B]/10 text-verko-muted hover:text-[#C0392B] transition-colors disabled:opacity-50"
                title="Eliminar presupuesto"
              >
                {deletingId === b.id ? <Spinner /> : <Trash2 className="w-[18px] h-[18px]" />}
              </button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
