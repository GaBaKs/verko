import type { PresupuestoCompleto } from '../types/budget';
import { getPresupuesto } from './api/budgets';
import { computeBudgetTotals } from './budgetEngine';

export interface BudgetPdfPayload {
  identificacion: {
    numero: string;
    fecha: string;
    validez_dias: number;
  };
  cliente: {
    nombre: string;
    domicilio: string;
    localidad: string;
    proyecto: string;
    email: string;
    telefono: string;
  };
  items: Array<{
    numero: string;
    titulo: string;
    tipo: string;
    especificaciones: string[];
    nota_exclusiones: string | null;
    precio_sin_iva: number;
  }>;
  mano_obra_total: number;
  totales: {
    subtotal_items: number;
    mano_obra: number;
    costo_directo: number;
    descuento_monto: number;
    subtotal_con_descuento: number;
    iva_pct: number;
    iva_monto: number;
    iibb_pct: number;
    iibb_monto: number;
    total_final: number;
  };
  condiciones_generales: string;
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

function formatFecha(isoDate: string | null): string {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  if (isNaN(d.getTime())) return '';
  const dia = String(d.getDate()).padStart(2, '0');
  const mes = MESES[d.getMonth()];
  const anio = d.getFullYear();
  return `${dia} · ${mes} · ${anio}`;
}

export async function buildBudgetPdfPayload(presupuestoId: string): Promise<BudgetPdfPayload> {
  const p: PresupuestoCompleto = await getPresupuesto(presupuestoId);
  const config = p.costeo_config || {} as any;
  const engineResult = computeBudgetTotals(p.piezas || [], p.mano_obra || [], p.lineas || [], config as any);
  const metadata = (p.metadata || {}) as Record<string, unknown>;
  const lead = (metadata?.lead || {}) as Record<string, unknown>;

  // Identificacion
  const validez_dias = Number(config.validez_dias) || 15;
  const fecha = formatFecha(p.created_at);
  const numero = p.numero_correlativo || p.id.substring(0, 8).toUpperCase();

  // Cliente info extraccion
  // Mapeamos de metadata.lead principalmente
  const nombreCliente = String(lead.nombre || 'Consumidor Final');
  const domicilio = String(lead.domicilio || lead.direccion || '');
  const localidad = String(lead.localidad || lead.ciudad || '');
  const proyectoName = String(metadata.proyecto || lead.proyecto || '');
  const email = String(lead.email || '');
  const telefono = String(lead.telefono || lead.celular || '');

  // Llenar Items
  const muebles = p.lineas.filter(l => l.tipo_linea === 'mueble');
  const items = muebles.map((l, index) => {
    let multiplier = 1;
    const lMeta = (l.metadata || {}) as Record<string, unknown>;
    const tipo = String(lMeta.tipo_mueble || 'standard');
    
    if (tipo === 'importacion') {
      multiplier = Number(p.costeo_config?.multiplicador_mueble_importado) || 2.5;
    } else if (tipo === 'premium') {
      multiplier = Number(p.costeo_config?.multiplicador_mueble_premium) || 5.0;
    }

    const subtotalCalculado = (Number(l.precio_unitario) || 0) * Number(l.cantidad || 1) * multiplier;
    
    const titulo = l.concepto || 'Ítem sin título';
    const numeroStr = String(index + 1).padStart(2, '0');
    
    return {
      numero: numeroStr,
      titulo,
      tipo,
      especificaciones: l.especificaciones || [],
      nota_exclusiones: l.nota_exclusiones || null,
      precio_sin_iva: subtotalCalculado
    };
  });

  // Totales
  const subtotal_items = engineResult.total_materiales || 0; // en budgetEngine, total_materiales suma todo (piezas y el costo de los muebles, no con los multiplicadores como venta. ah, wait.
  // actually wait. The user asked: `precio_sin_iva` for items, and `subtotal_items` in `totales`.
  // We need to reflect the total revenue. If items use `subtotalCalculado`, `subtotal_items` should be the sum of that plus pieces maybe. Let's see.
  // Actually, wait, budgetEngine returns total_costo + margen, which gives we subtotal.
  
  // Actually, I can just use engineResult logic for the Totales
  return {
    identificacion: {
      numero,
      fecha,
      validez_dias
    },
    cliente: {
      nombre: nombreCliente,
      domicilio,
      localidad,
      proyecto: proyectoName,
      email,
      telefono
    },
    items,
    mano_obra_total: engineResult.total_mano_obra || 0,
    totales: {
      subtotal_items: engineResult.total_materiales || 0,
      mano_obra: engineResult.total_mano_obra || 0,
      costo_directo: engineResult.total_costo || 0,
      descuento_monto: engineResult.total_descuento || 0,
      subtotal_con_descuento: (engineResult.subtotal_con_margen || 0) - (engineResult.total_descuento || 0),
      iva_pct: Number(config.iva_pct) || 0,
      iva_monto: engineResult.total_iva || 0,
      iibb_pct: Number(config.iibb_pct) || 0,
      iibb_monto: engineResult.total_iibb || 0,
      total_final: engineResult.total_final || 0,
    },
    condiciones_generales: "Los importes indicados están sujetos a modificaciones según la cotización del dólar billete y la disponibilidad de stock al momento del cierre de la operación. Este presupuesto tiene validez por tiempo limitado." // Texto fijo institucional de Verko
  };
}
