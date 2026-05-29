import { supabase } from '../supabase';
import type { 
  Presupuesto, 
  LineaPresupuesto, 
  PresupuestoPieza, 
  PresupuestoManoObra, 
  PresupuestoOtrosCostos,
  Material,
  CosteoConfigGlobal
} from '../../types/database';
import type { BudgetTotals, PresupuestoCompleto } from '../../types/budget';

// Lista
export async function getPresupuestos(filters?: { text?: string }): Promise<Presupuesto[]> {
  let query = supabase.from('presupuestos').select('*');
  
  if (filters?.text && filters.text.trim() !== '') {
    // Buscar en metadata->lead->nombre via cast text
    query = query.ilike('metadata->>lead', `%${filters.text}%`);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  
  // Note: if text search exists we can do full text search
  return data as Presupuesto[];
}

// CRUD principal
// export async function getPresupuesto(id: string): Promise<PresupuestoCompleto> {
export async function getPresupuesto(id: string): Promise<PresupuestoCompleto> {
  const { data: pres, error: presErr } = await supabase
    .from('presupuestos')
    .select('*')
    .eq('id', id)
    .single();
    
  if (presErr) throw presErr;

  const { data: lineas, error: lineasErr } = await supabase
    .from('lineas_presupuesto')
    .select('*')
    .eq('presupuesto_id', id);
  if (lineasErr) throw lineasErr;

  const { data: piezas, error: piezasErr } = await supabase
    .from('presupuesto_piezas')
    .select('*')
    .eq('presupuesto_id', id);
  if (piezasErr) throw piezasErr;

  const { data: mo, error: moErr } = await supabase
    .from('presupuesto_mano_obra')
    .select('*')
    .eq('presupuesto_id', id);
  if (moErr) throw moErr;

  return {
    ...(pres as object),
    lineas: lineas as LineaPresupuesto[],
    piezas: piezas as PresupuestoPieza[],
    mano_obra: mo as PresupuestoManoObra[],
    otros_costos: [] // Mock empty as it's unused
  } as unknown as PresupuestoCompleto;
}

export async function createPresupuesto(data: Partial<Presupuesto>): Promise<Presupuesto> {
  const { data: newPres, error } = await supabase
    .from('presupuestos')
    .insert(data as any)
    .select()
    .single();
  if (error) throw error;
  return newPres;
}

export async function updatePresupuesto(id: string, data: Partial<Presupuesto>): Promise<void> {
  const { error } = await supabase
    .from('presupuestos')
    .update(data as never)
    .eq('id', id);
  if (error) throw error;
}

export async function deletePresupuesto(id: string): Promise<void> {
  const { error } = await supabase
    .from('presupuestos')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// Líneas
export async function upsertLinea(data: Partial<LineaPresupuesto>): Promise<LineaPresupuesto> {
  const { data: line, error } = await supabase
    .from('lineas_presupuesto')
    .upsert(data as any)
    .select()
    .single();
  if (error) throw error;
  return line;
}

export async function deleteLinea(id: string): Promise<void> {
  const { error } = await supabase
    .from('lineas_presupuesto')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// Piezas
export async function upsertPiezas(piezas: Partial<PresupuestoPieza>[]): Promise<void> {
  const { error } = await supabase
    .from('presupuesto_piezas')
    .upsert(piezas as any);
  if (error) throw error;
}

export async function deletePiezasByLinea(linea_id: string): Promise<void> {
  const { error } = await supabase
    .from('presupuesto_piezas')
    .delete()
    .eq('linea_presupuesto_id', linea_id);
  if (error) throw error;
}

// MO
export async function upsertManoObra(data: Partial<PresupuestoManoObra>): Promise<PresupuestoManoObra> {
  const { data: mo, error } = await supabase
    .from('presupuesto_mano_obra')
    .upsert(data as any)
    .select()
    .single();
  if (error) throw error;
  return mo;
}

export async function deleteManoObra(id: string): Promise<void> {
  const { error } = await supabase
    .from('presupuesto_mano_obra')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// Otros costos
export async function upsertOtroCosto(data: Partial<PresupuestoOtrosCostos>): Promise<PresupuestoOtrosCostos> {
  const { data: costo, error } = await supabase
    .from('presupuesto_otros_costos')
    .upsert(data as any)
    .select()
    .single();
  if (error) throw error;
  return costo;
}

export async function deleteOtroCosto(id: string): Promise<void> {
  const { error } = await supabase
    .from('presupuesto_otros_costos')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

// Materiales
export async function getMateriales(searchQuery?: string): Promise<Material[]> {
  let query = supabase.from('materiales').select('*').limit(90);
  if (searchQuery) {
    query = query.ilike('nombre', `%${searchQuery}%`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Configuración global
export async function getCosteoConfigGlobal(): Promise<CosteoConfigGlobal | null> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.id) return null;

  const { data, error } = await supabase
    .from('costeo_config_global')
    .select('*')
    .eq('user_id', session.user.id)
    .single();
    
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is not found
  return data;
}

export async function saveCosteoConfigGlobal(data: Partial<CosteoConfigGlobal>): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.id) throw new Error('No user session');

  const current = await getCosteoConfigGlobal();

  const { error } = await supabase
    .from('costeo_config_global')
    .upsert({ 
      tarifa_moneda: 'ARS',
      moneda_default: 'ARS',
      ...current,
      ...data, 
      user_id: session.user.id 
    } as any, { onConflict: 'user_id' });
  if (error) throw error;
}

// Guardar totales
export async function saveTotales(id: string, totales: BudgetTotals): Promise<void> {
  const { error } = await supabase
    .from('presupuestos')
    .update({
      total_materiales: totales.total_materiales,
      total_mano_obra: totales.total_mano_obra,
      total_costo: totales.total_costo,
      subtotal_con_margen: totales.subtotal_con_margen,
      total_descuento: totales.total_descuento,
      total_iva: totales.total_iva,
      total_final: totales.total_final,
      ganancia_neta: totales.ganancia_neta,
      margen_real_pct: totales.margen_real_pct,
    } as never)
    .eq('id', id);
  if (error) throw error;
}
