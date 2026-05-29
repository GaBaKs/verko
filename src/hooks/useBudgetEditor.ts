import { useState, useCallback, useEffect } from 'react';
import type { 
  Presupuesto, 
  LineaPresupuesto, 
  PresupuestoPieza, 
  PresupuestoManoObra, 
  PresupuestoOtrosCostos
} from '../types/database';
import type { BudgetTotals, BudgetTab, PresupuestoCompleto } from '../types/budget';
import { computeBudgetTotals, generarManoObraGenerica } from '../lib/budgetEngine';
import * as api from '../lib/api/budgets';
import { useUiStore } from '../stores/uiStore';

export function useBudgetEditor(presupuestoId: string) {
  const { addToast } = useUiStore();
  
  const [presupuesto, setPresupuesto] = useState<Presupuesto | null>(null);
  const [lineas, setLineas] = useState<LineaPresupuesto[]>([]);
  const [piezas, setPiezas] = useState<PresupuestoPieza[]>([]);
  const [manoObra, setManoObra] = useState<PresupuestoManoObra[]>([]);
  const [totales, setTotales] = useState<BudgetTotals | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<BudgetTab>('resumen');

  const fetchBudget = useCallback(async () => {
    if (!presupuestoId) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await api.getPresupuesto(presupuestoId);
      setPresupuesto(data as Presupuesto);
      setLineas(data.lineas || []);
      setPiezas(data.piezas || []);
      setManoObra(data.mano_obra || []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al cargar presupuesto';
      setError(msg);
      addToast(msg, 'error');
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presupuestoId]);

  // Recalcular totales cada vez que cambian piezas, MO, otros costos o config
  useEffect(() => {
    if (!presupuesto) return;
    const config = presupuesto.costeo_config ?? {
      margen_pct: 35, iva_pct: 21, iibb_pct: 0, descuento_pct: 0,
      descuento_monto: 0, indirectos_pct: 12, tarifa_horaria: 8000,
      moneda_default: 'ARS', redondeo: 100, alquiler_taller_pct: 4,
      servicios_pct: 2, sueldos_admin_pct: 4, software_pct: 1,
      seguro_pct: 1, mantenimiento_pct: 2, scrap_material_pct: 5,
      reposicion_errores_pct: 2, contingencia_pct: 3, publicidad_pct: 0,
      comision_vendedor_pct: 0, garantia_post_venta_pct: 0,
    };
    const t = computeBudgetTotals(piezas, manoObra, lineas, config as import('../types/database').CosteoConfig);
    setTotales(t);
  }, [piezas, manoObra, lineas, presupuesto]);

  // CRUD Líneas
  const addLinea = async (data: Partial<LineaPresupuesto>) => {
    setSaving(true);
    try {
      const newLine = await api.upsertLinea({ ...data, presupuesto_id: presupuestoId });
      setLineas(prev => [...prev, newLine]);
      addToast('Línea agregada', 'success');
      return newLine;
    } catch (err: any) {
      addToast(err.message || 'Error al agregar línea', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateLinea = async (id: string, data: Partial<LineaPresupuesto>) => {
    setSaving(true);
    try {
      const updatedLine = await api.upsertLinea({ id, presupuesto_id: presupuestoId, ...data });
      setLineas(prev => prev.map(l => l.id === id ? updatedLine : l));
    } catch (err: any) {
      addToast(err.message || 'Error al actualizar línea', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteLinea = async (id: string) => {
    setSaving(true);
    try {
      await api.deleteLinea(id);
      setLineas(prev => prev.filter(l => l.id !== id));
      addToast('Línea eliminada', 'success');
    } catch (err: any) {
      addToast(err.message || 'Error al eliminar línea', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addManoObra = async (data: Partial<PresupuestoManoObra>) => {
    setSaving(true);
    try {
      const newMo = await api.upsertManoObra({ ...data, presupuesto_id: presupuestoId });
      setManoObra(prev => [...prev, newMo]);
      addToast('Mano de obra agregada', 'success');
      return newMo;
    } catch (err: any) {
      addToast(err.message || 'Error al agregar mano de obra', 'error');
    } finally {
      setSaving(false);
    }
  };

  const deleteManoObra = async (id: string) => {
    setSaving(true);
    try {
      await api.deleteManoObra(id);
      setManoObra(prev => prev.filter(m => m.id !== id));
      addToast('Mano de obra eliminada', 'success');
    } catch (err: any) {
      addToast(err.message || 'Error al eliminar mano de obra', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Generar piezas para una línea de tipo mueble (Mocked for now since algorithm is complex)
  const generarPiezas = async (linea: LineaPresupuesto) => {
    addToast('Generación de piezas no impl., se deben cargar manualmente o usar la IA', 'success');
  };

  // Auto-generar MO para una línea
  const generarManoObra = async (linea: LineaPresupuesto) => {
    setSaving(true);
    try {
      if (!presupuesto?.costeo_config) throw new Error('Falta configuración de costeo');
      const horasBase = linea.horas_mano_obra && (linea.horas_mano_obra as number) > 0
        ? (linea.horas_mano_obra as number)
        : 8;
      const moItems = generarManoObraGenerica(linea, horasBase, presupuesto.costeo_config as import('../types/database').CosteoConfig);
      
      const newMoPromises = moItems.map(item => api.upsertManoObra({ ...item, presupuesto_id: presupuestoId }));
      const newMos = await Promise.all(newMoPromises);
      
      setManoObra(prev => [...prev, ...newMos]);
      addToast('Mano de obra generada', 'success');
    } catch (err: any) {
      addToast(err.message || 'Error al generar mano de obra', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Guardar totales en Supabase
  const saveTotales = async () => {
    if (!totales || !presupuestoId) return;
    setSaving(true);
    try {
      await api.saveTotales(presupuestoId, totales);
      addToast('Totales guardados', 'success');
    } catch (err: any) {
      addToast(err.message || 'Error al guardar totales', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updateTotals = async (tc_manual: number) => {
    if (!presupuestoId) return;
    setSaving(true);
    try {
      await api.updatePresupuesto(presupuestoId, { tc_manual });
      setPresupuesto(p => p ? { ...p, tc_manual } : null);
      // In a real scenario, this should scan `piezas` and re-convert their prices
      addToast(`Tipo de cambio actualizado`, 'success');
    } catch (err: any) {
      addToast(err.message || 'Error al actualizar tipo de cambio', 'error');
    } finally {
      setSaving(false);
    }
  };

  const updatePresupuestoData = async (data: Partial<Presupuesto>) => {
    if (!presupuestoId) return;
    setSaving(true);
    try {
      await api.updatePresupuesto(presupuestoId, data);
      setPresupuesto(p => p ? { ...p, ...data } : null);
      addToast('Presupuesto actualizado', 'success');
    } catch (err: any) {
      addToast(err.message || 'Error al actualizar presupuesto', 'error');
    } finally {
      setSaving(false);
    }
  };

  return {
    presupuesto,
    lineas,
    piezas,
    manoObra,
    totales,
    isLoading,
    saving,
    error,
    activeTab,
    setActiveTab,
    fetchBudget,
    addLinea,
    updateLinea,
    deleteLinea,
    addManoObra,
    deleteManoObra,
    generarPiezas,
    generarManoObra,
    saveTotales,
    updateTotals,
    updatePresupuestoData,
    setPresupuesto
  };
}
