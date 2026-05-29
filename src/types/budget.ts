import type { 
  Presupuesto, 
  LineaPresupuesto, 
  PresupuestoPieza, 
  PresupuestoManoObra, 
  CosteoConfig
} from './database';

export interface BudgetTotals {
  total_materiales: number;
  total_mano_obra: number;
  total_costo: number;
  subtotal_con_margen: number;
  total_descuento: number;
  total_iva: number;
  total_iibb: number;
  total_final: number;
  ganancia_neta: number;
  margen_real_pct: number;
}

export type BudgetTab = 
  | 'resumen' 
  | 'items' 
  | 'labor' 
  | 'config' 
  | 'info'
  | 'chat' 
  | 'attachments';

export interface MaterialSnapshot {
  id: string;
  nombre: string;
  categoria: string;
  precio_unitario: number;
  unidad: string;
  ancho_mm: number | null;
  largo_mm: number | null;
  espesor_mm: number | null;
}

export interface PresupuestoCompleto extends Presupuesto {
  lineas: LineaPresupuesto[];
  piezas: PresupuestoPieza[];
  mano_obra: PresupuestoManoObra[];
}
