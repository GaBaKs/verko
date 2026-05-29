# VERKO v2 — Plan de Desarrollo: Módulo Presupuestos
## Implementación completa basada en la lógica de la app original

---

## Contexto

La sección de presupuestos ya existe en el proyecto pero está vacía — solo tiene la estructura de carpetas y componentes en blanco. Este documento describe todo lo que hay que implementar para replicar fielmente la lógica de la app original, transpilada a TypeScript.

El backend (Supabase) ya existe con todas las tablas. No se modifica nada del backend. Solo se construye el frontend.

---

## 1. Modelo de datos — tablas existentes en Supabase

### `presupuestos` (tabla principal)

```ts
interface Presupuesto {
  id: string;                        // UUID PK
  obra_id: string | null;            // FK → obras
  cliente_id: string | null;         // FK → clientes
  version: number;                   // incremental dentro de la misma obra
  estado: 'borrador' | 'enviado' | 'aprobado' | 'rechazado';
  moneda: 'ARS' | 'USD' | 'EUR';
  thread_id: string;                 // hilo de chat IA
  resumen_ia: string | null;
  brief_json: BriefJson | null;

  // Totales calculados
  total_materiales: number;
  total_herrajes: number;
  total_extras: number;
  total_ajustes: number;
  total_piezas: number;
  total_mano_obra: number;
  total_otros: number;
  total_indirectos: number;
  total_costo_directo: number;
  total_costo: number;
  subtotal_con_margen: number;
  total_iva: number;
  total_descuento: number;
  total_final: number;
  ganancia_neta: number;
  margen_real_pct: number;

  tc_manual: number | null;          // tipo de cambio ARS/USD
  costeo_config: CosteoConfig;       // configuración por presupuesto
  metadata: PresupuestoMetadata;     // { lead: {...}, origin_mode }

  fecha_envio: string | null;
  fecha_aprobacion: string | null;
  fecha_vencimiento: string | null;
  created_by: string;
  created_at: string;
  ultima_revision_ia_at: string | null;
}
```

### `lineas_presupuesto`

```ts
interface LineaPresupuesto {
  id: string;
  presupuesto_id: string;
  concepto: string;
  detalle: string | null;
  cantidad: number;
  unidad: string;
  precio_unitario: number;
  subtotal: number;                  // GENERATED por Postgres (cantidad × precio_unitario)
  orden: number;
  tipo_linea: 'mueble' | 'pieza' | 'herraje' | 'extra' | 'ajuste' | 'servicio';
  parent_linea_id: string | null;
  material_id: string | null;
  material_nombre: string | null;
  material_snapshot: MaterialSnapshot | null;
  ancho_mm: number | null;
  alto_mm: number | null;
  profundidad_mm: number | null;
  espesor_mm: number | null;
  desperdicio_pct: number;           // default 12
  origen_ia: boolean;
  margen_pct_override: number | null;
  horas_mano_obra: number | null;
  costo_mano_obra: number | null;
  costo_otros: number | null;
  complejidad: number;               // 0.7 | 1.0 | 1.2 | 1.4 | 1.8
  metadata: Record<string, unknown> | null;
}
```

### `presupuesto_piezas`

```ts
interface PresupuestoPieza {
  id: string;
  presupuesto_id: string;
  linea_presupuesto_id: string;
  mueble_key: string;
  modulo_key: string | null;
  codigo: string;
  nombre: string;
  pieza_tipo: 'estructura' | 'frente' | 'fondo' | 'estante' | 'mesada' | 'canto' | 'herraje' | 'extra';
  material_id: string | null;
  material_nombre: string | null;
  material_snapshot: MaterialSnapshot | null;
  unidad_calculo: 'pieza' | 'm2' | 'metro' | 'unidad' | 'par' | 'kit' | 'placa' | 'kg' | 'litro';
  cantidad: number;
  ancho_mm: number | null;
  alto_mm: number | null;
  profundidad_mm: number | null;
  espesor_mm: number | null;
  largo_lineal_mm: number | null;
  area_m2: number | null;
  consumo_unidades: number;
  desperdicio_pct: number;
  precio_unitario: number;
  subtotal: number;
  editable: boolean;
  metadata: Record<string, unknown> | null;
}
```

### Tablas auxiliares relevantes

```ts
// presupuesto_mano_obra
interface PresupuestoManoObra {
  id: string;
  presupuesto_id: string;
  actividad: 'cortado' | 'canteado' | 'perforado' | 'armado' | 'instalacion' | string;
  descripcion: string | null;
  minutos: number;
  tarifa_hora: number;
  subtotal: number;                  // (minutos / 60) × tarifa_hora
  linea_presupuesto_id: string | null;
  origen: 'manual' | 'auto';
}

// presupuesto_otros_costos
interface PresupuestoOtroCosto {
  id: string;
  presupuesto_id: string;
  concepto: string;
  cantidad: number;
  costo_unitario: number;
  subtotal: number;
  categoria: 'flete' | 'embalaje' | 'medicion' | 'instalacion' | 'diseno' | 'comision' | 'otro';
}

// costeo_config_global (configuración del usuario)
interface CosteoConfigGlobal {
  user_id: string;
  empresa_nombre: string;
  empresa_cuit: string;
  empresa_direccion: string;
  empresa_tel: string;
  defaults: CosteoConfig;
}
```

### Tipo `CosteoConfig`

```ts
interface CosteoConfig {
  iva_pct: number;               // default: 21
  iibb_pct: number;              // default: 0
  retencion_iva_pct: number;     // default: 0
  margen_pct: number;            // default: 35
  descuento_pct: number;         // default: 0
  descuento_monto: number;       // default: 0
  redondeo: number;              // default: 100
  tarifa_horaria: number;        // default: 8000 (ARS/hora)
  indirectos_pct: number;        // default: 12
  scrap_material_pct: number;    // default: 8
  reposicion_errores_pct: number;// default: 3
  contingencia_pct: number;      // default: 5
  alquiler_taller_pct: number;   // default: 4
  servicios_pct: number;         // default: 2
  sueldos_admin_pct: number;     // default: 4
  software_pct: number;          // default: 1
  seguro_pct: number;            // default: 1
  mantenimiento_pct: number;     // default: 2
  publicidad_pct: number;        // default: 3
  comision_vendedor_pct: number; // default: 5
  garantia_post_venta_pct: number; // default: 2
  forma_pago: string;            // default: '50% anticipo, 30% al avance, 20% al instalar'
  validez_dias: number;          // default: 10
  plazo_entrega_dias: number;    // default: 30
}
```

---

## 2. Estructura de archivos a crear/completar

```
src/
├── hooks/
│   └── useBudgetEditor.ts          ← lógica principal, motor de costeo
│
├── lib/
│   ├── api/
│   │   └── budgets.ts              ← todas las queries a Supabase
│   └── budgetEngine.ts             ← motor de costeo (transpile del original)
│
└── components/budgets/
    ├── BudgetsPage.tsx             ← lista + botón nuevo
    ├── BudgetList.tsx              ← tabla con filtros y búsqueda
    ├── BudgetStatusBadge.tsx       ← badge por estado
    ├── BudgetNewModal.tsx          ← modal de creación (3 modos)
    ├── BudgetEditor.tsx            ← editor con tabs
    ├── tabs/
    │   ├── BudgetSummaryTab.tsx    ← resumen y KPIs
    │   ├── BudgetItemsTab.tsx      ← CRUD de líneas/muebles
    │   ├── BudgetLaborTab.tsx      ← mano de obra
    │   ├── BudgetOtherCostsTab.tsx ← otros costos
    │   ├── BudgetConfigTab.tsx     ← márgenes e impuestos
    │   ├── BudgetChatTab.tsx       ← asistente IA
    │   └── BudgetAttachmentsTab.tsx← adjuntos
    ├── BudgetLineItem.tsx          ← renglón editable
    ├── BudgetMaterialPicker.tsx    ← selector de material del catálogo
    ├── BudgetPiecesTable.tsx       ← tabla de piezas desglosadas
    ├── BudgetTotalsPanel.tsx       ← panel lateral de totales
    └── BudgetDiagnostic.tsx        ← copiloto de diagnóstico
```

---

## 3. Motor de costeo — `src/lib/budgetEngine.ts`

Transpilar fielmente el archivo `presupuesto-engine.js` original. Las fórmulas no se modifican.

### 3.1 Costeo de piezas de material

```ts
// Material en placa (tableros)
function calcularPiezaPlaca(pieza: PresupuestoPieza, material: MaterialSnapshot): number {
  const area_m2 = (pieza.ancho_mm * pieza.alto_mm * pieza.cantidad) / 1_000_000;

  if (material.unidad === 'placa' || material.unidad === 'hoja') {
    const area_placa = (material.ancho_mm * material.largo_mm) / 1_000_000;
    const consumo = (area_m2 / area_placa) * (1 + pieza.desperdicio_pct / 100);
    return consumo * material.precio_unitario;
  }

  if (material.unidad === 'm2') {
    const consumo = area_m2 * (1 + pieza.desperdicio_pct / 100);
    return consumo * material.precio_unitario;
  }

  return 0;
}

// Material lineal (cantos, burletes, perfiles)
function calcularPiezaLineal(pieza: PresupuestoPieza): number {
  const consumo = pieza.largo_lineal_mm / 1000; // → metros
  return consumo * pieza.precio_unitario;
}

// Material por unidad (bisagras, correderas, tiradores)
function calcularPiezaUnidad(pieza: PresupuestoPieza): number {
  return pieza.cantidad * pieza.precio_unitario;
}
```

### 3.2 Conversión de moneda

```ts
function convertirMoneda(
  precio: number,
  moneda_origen: string,
  moneda_destino: string,
  tc_manual: number | null
): number {
  if (moneda_origen === moneda_destino) return precio;
  if (!tc_manual) return 0; // advertir al usuario
  if (moneda_origen === 'ARS' && moneda_destino === 'USD') return precio / tc_manual;
  if (moneda_origen === 'USD' && moneda_destino === 'ARS') return precio * tc_manual;
  return precio;
}
```

### 3.3 Algoritmo de totalización (11 capas) — `computeBudgetTotals`

```ts
function computeBudgetTotals(
  piezas: PresupuestoPieza[],
  manoObra: PresupuestoManoObra[],
  otrosCostos: PresupuestoOtroCosto[],
  lineasAjuste: LineaPresupuesto[],
  config: CosteoConfig
): BudgetTotals {

  // CAPA 1 — Materiales
  const total_materiales = sum(piezas, 'subtotal');

  // CAPA 2 — Mano de obra
  const total_mano_obra = sum(manoObra, 'subtotal');
  // subtotal_MO = (minutos / 60) × tarifa_hora

  // CAPA 3 — Otros costos directos
  const total_otros = sum(otrosCostos, 'subtotal');
  // subtotal_otro = cantidad × costo_unitario

  // CAPA 4 — Ajustes manuales
  const total_ajustes = sum(lineasAjuste.filter(l => l.tipo_linea === 'ajuste'), 'subtotal');

  // COSTO DIRECTO BRUTO
  const costo_directo_bruto = total_materiales + total_mano_obra + total_otros + total_ajustes;

  // CAPA 5 — Mermas y contingencias
  const merma_material  = total_materiales * (config.scrap_material_pct / 100);
  const reprocesos      = costo_directo_bruto * (config.reposicion_errores_pct / 100);
  const contingencia    = costo_directo_bruto * (config.contingencia_pct / 100);
  const total_mermas    = merma_material + reprocesos + contingencia;
  const costo_directo   = costo_directo_bruto + total_mermas;

  // CAPA 6 — Indirectos (overhead)
  const base_indirectos = costo_directo;
  const total_indirectos = base_indirectos * (
    (config.alquiler_taller_pct + config.servicios_pct + config.sueldos_admin_pct +
     config.software_pct + config.seguro_pct + config.mantenimiento_pct) / 100
  );
  const total_costo = costo_directo + total_indirectos;

  // CAPA 7 — Margen
  const margen_monto = total_costo * (config.margen_pct / 100);
  const subtotal_con_margen = total_costo + margen_monto;

  // CAPA 8 — Costos comerciales
  const publicidad  = subtotal_con_margen * (config.publicidad_pct / 100);
  const comision    = subtotal_con_margen * (config.comision_vendedor_pct / 100);
  const garantia    = subtotal_con_margen * (config.garantia_post_venta_pct / 100);
  const comerciales = publicidad + comision + garantia;

  // CAPA 9 — Descuento
  const descuento_calculado = subtotal_con_margen * (config.descuento_pct / 100) + config.descuento_monto;
  const total_descuento = Math.min(descuento_calculado, subtotal_con_margen);
  const subt_con_desc = subtotal_con_margen - total_descuento;

  // CAPA 10 — Impuestos
  const total_iva   = subt_con_desc * (config.iva_pct / 100);
  const total_iibb  = subt_con_desc * (config.iibb_pct / 100);

  // CAPA 11 — Precio final
  const total_sin_redondeo = subt_con_desc + total_iva + total_iibb;
  const total_final = config.redondeo > 0
    ? Math.ceil(total_sin_redondeo / config.redondeo) * config.redondeo
    : total_sin_redondeo;

  const ganancia_neta  = subt_con_desc - (total_costo + comerciales);
  const margen_real_pct = total_costo > 0 ? (ganancia_neta / total_costo) * 100 : 0;

  return {
    total_materiales, total_mano_obra, total_otros, total_ajustes,
    total_mermas, costo_directo, total_indirectos, total_costo,
    subtotal_con_margen, total_descuento, total_iva, total_iibb,
    total_final, ganancia_neta, margen_real_pct,
  };
}
```

### 3.4 Generación de piezas por tipología — `buildGenericCabinet`

Implementar con los valores por defecto exactos de la tabla original:

| Tipo | Ancho | Alto | Prof | Mód | Puertas | Cajones | Estantes | Desperdicio |
|------|-------|------|------|-----|---------|---------|----------|-------------|
| bajo_mesada | 1800 | 870 | 580 | 3 | 4 | 3 | 1 | 12% |
| alacena | 1800 | 720 | 350 | 3 | 3 | 0 | 2 | 12% |
| isla | 1800 | 920 | 900 | 3 | 4 | 4 | 1 | 14% |
| vestidor | 2600 | 2400 | 600 | 4 | 0 | 4 | 6 | 14% |
| placard | 2400 | 2400 | 600 | 3 | 6 | 4 | 5 | 14% |
| escritorio | 1600 | 750 | 650 | 2 | 0 | 3 | 0 | 10% |
| vanitory | 1200 | 850 | 500 | 2 | 2 | 2 | 1 | 12% |
| panel_tv | 2400 | 2600 | 30 | 1 | 0 | 0 | 0 | 8% |
| despensa | 1200 | 2300 | 600 | 2 | 4 | 0 | 6 | 12% |
| puerta | 900 | 2400 | 60 | 1 | 1 | 0 | 0 | 8% |
| otro | 1200 | 900 | 580 | 2 | 2 | 0 | 1 | 12% |

**Aliases de tipos** (mapear antes de buscar en la tabla):
```ts
const TIPO_ALIASES: Record<string, string> = {
  cocina: 'bajo_mesada',
  ropero: 'placard',
  torre: 'despensa',
  'bajo pileta': 'vanitory',
};
```

**Fórmulas de piezas por módulo:**
```
altura_zocalo = 150mm (muebles base)
altura_carcasa = max(640, altura_total - altura_zocalo) [base] | altura_total [alto]
ancho_modulo = ancho_total / modulos
ancho_libre = max(100, ancho_modulo - espesor × 2)
profundidad_libre = max(120, profundidad_total - 20)

Por módulo: Lateral×2, Piso+Techo×2, Fondo×1, Estantes×N
```

**Piezas adicionales:**
```
Puertas:         ancho = max(140, ancho_total/puertas - 6) | alto = max(300, altura_carcasa - 6)
Bisagras:        cantidad = puertas × (altura_puerta > 900 ? 3 : 2)
Frentes cajón:   ancho = max(180, ancho_total/modulos - 16) | prof = max(300, prof_total - 80)
Correderas:      unidad=='par' ? cajones : cajones × 2
Tiradores:       puertas + cajones
Canto:           ∑((ancho+alto) × cantidad) × 1.1 | desperdicio 5%
Mesada:          ancho_total × max(350, profundidad_total) | desperdicio 10%
```

### 3.5 Multiplicadores de complejidad

```ts
const COMPLEJIDAD: Record<string, number> = {
  simple:   0.7,
  estandar: 1.0,
  completo: 1.2,
  premium:  1.4,
  custom:   1.8,
};
```

### 3.6 Auto-generación de mano de obra

```ts
function generarManoObra(
  linea: LineaPresupuesto,
  horasBase: number,
  config: CosteoConfig
): PresupuestoManoObra[] {
  const horas_total = horasBase * linea.complejidad * linea.cantidad;
  const distribuciones = {
    cortado:     0.15,
    canteado:    0.20,
    perforado:   0.10,
    armado:      0.35,
    instalacion: 0.20,
  };

  return Object.entries(distribuciones).map(([actividad, pct]) => {
    const minutos = horas_total * pct * 60;
    const subtotal = (minutos / 60) * config.tarifa_horaria;
    return { actividad, minutos, tarifa_hora: config.tarifa_horaria, subtotal, origen: 'auto' };
  });
}
```

### 3.7 Matching de materiales

```ts
function matchMaterial(hint: string, catalogo: Material[]): Material | null {
  // Scoring para cada material:
  // Sin precio:              -60
  // Categoría coincide:      +40 | no coincide: -20
  // Unidad coincide:         +10
  // Espesor ±0.75mm:         +22 | ±2mm: +12 | ±5mm: +3 | no coincide: -10
  // Por keyword encontrada:  +5 a +8
  // Seleccionar score máximo ≥ 12
}
```

---

## 4. Hook `useBudgetEditor`

```ts
// src/hooks/useBudgetEditor.ts

export function useBudgetEditor(presupuesto_id: string) {
  // Estado
  const [presupuesto, setPresupuesto] = useState<Presupuesto | null>(null);
  const [lineas, setLineas] = useState<LineaPresupuesto[]>([]);
  const [piezas, setPiezas] = useState<PresupuestoPieza[]>([]);
  const [manoObra, setManoObra] = useState<PresupuestoManoObra[]>([]);
  const [otrosCostos, setOtrosCostos] = useState<PresupuestoOtroCosto[]>([]);
  const [totales, setTotales] = useState<BudgetTotals | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<BudgetTab>('resumen');

  // Recalcular totales cada vez que cambian piezas, MO, otros costos o config
  useEffect(() => {
    if (!presupuesto) return;
    const t = computeBudgetTotals(piezas, manoObra, otrosCostos, lineasAjuste, presupuesto.costeo_config);
    setTotales(t);
  }, [piezas, manoObra, otrosCostos, presupuesto]);

  // CRUD líneas
  const addLinea = async (data: Partial<LineaPresupuesto>) => { ... };
  const updateLinea = async (id: string, data: Partial<LineaPresupuesto>) => { ... };
  const deleteLinea = async (id: string) => { ... };

  // Generar piezas para una línea de tipo mueble
  const generarPiezas = async (linea: LineaPresupuesto) => { ... };

  // Auto-generar MO para una línea
  const generarManoObra = async (linea: LineaPresupuesto) => { ... };

  // Guardar totales en Supabase
  const saveTotales = async () => { ... };

  // Cambiar estado del presupuesto
  const cambiarEstado = async (estado: Presupuesto['estado']) => { ... };

  // Manejo de tipo de cambio (dispara recálculo de piezas en moneda extranjera)
  const updateTipoCambio = async (tc: number) => { ... };

  return {
    presupuesto, lineas, piezas, manoObra, otrosCostos, totales,
    saving, activeTab, setActiveTab,
    addLinea, updateLinea, deleteLinea,
    generarPiezas, generarManoObra, saveTotales,
    cambiarEstado, updateTotals: updateTipoCambio,
  };
}
```

---

## 5. Flujo de creación — 3 modos (`BudgetNewModal`)

Modal con selector de modo de origen. Implementar los tres:

**Modo 1 — Desde prospecto (lead):**
Formulario con: nombre, teléfono, email, localidad, fuente. Se guarda en `metadata.lead`. No requiere cliente ni obra existente.

**Modo 2 — Desde cliente existente:**
Selector de cliente (buscar en tabla `clientes`). Se crea presupuesto con `cliente_id`, sin `obra_id`.

**Modo 3 — Desde obra existente:**
Selector de obra (buscar en tabla `obras`). El `version` se auto-incrementa consultando cuántas versiones tiene esa obra.

---

## 6. Editor de presupuesto — 7 tabs

### Tab 1: Resumen (`BudgetSummaryTab`)
- Datos del presupuesto: cliente/obra/lead, estado, moneda, fechas
- Panel de totales con las 11 capas: costo directo, indirectos, margen, descuento, IVA, total final
- KPIs destacados: ganancia neta, margen real%, total final
- Historial de cambios de estado
- Botones de acción según estado: "Marcar enviado", "Aprobar", "Rechazar"
- Copiloto de diagnóstico (ver sección 9)

### Tab 2: Ítems (`BudgetItemsTab`)
- Tabla de líneas agrupadas por tipo (muebles > piezas hijas)
- Acciones por línea: editar, duplicar, eliminar, ver piezas, generar MO
- Botón "Agregar mueble" abre form con: concepto, tipo, dimensiones (ancho/alto/prof en mm), cantidad, material, complejidad
- Al guardar una línea de tipo mueble: `generarPiezas()` automáticamente
- `BudgetPiecesTable`: tabla expandible de piezas desglosadas por línea
- `BudgetMaterialPicker`: búsqueda en catálogo con matching por nombre/categoría/espesor

### Tab 3: Mano de obra (`BudgetLaborTab`)
- Tabla de renglones de MO agrupados por línea de mueble
- Botón "Auto-generar MO" por línea (usa `generarManoObra()`)
- Agregar MO manual: actividad, descripción, minutos, tarifa/hora
- Subtotales por actividad y total general
- Tarifa/hora editable (afecta todos los cálculos de MO)

### Tab 4: Otros costos (`BudgetOtherCostsTab`)
- Lista de costos directos no-materiales: flete, embalaje, medición, instalación, diseño, comisión, subcontrato
- CRUD: concepto, categoría, cantidad, costo unitario, subtotal calculado
- Total de otros costos

### Tab 5: Configuración (`BudgetConfigTab`)
- Formulario con todos los campos de `CosteoConfig`
- Secciones: Margen e impuestos | Indirectos | Costos comerciales | Mermas | Condiciones comerciales
- Botón "Aplicar defaults globales" (carga desde `costeo_config_global` del usuario)
- Al cambiar cualquier valor: recalcular totales en tiempo real

### Tab 6: Chat IA (`BudgetChatTab`)
- Chat con la edge function `presupuesto-assistant`
- El usuario describe muebles por texto (voz y adjuntos: próxima fase)
- La IA devuelve un `draft_payload` con array de muebles
- El motor `buildDraft()` convierte el payload en líneas y piezas
- El usuario puede revisar el borrador antes de aplicarlo
- Historial persistente via `presupuesto_conversaciones`

### Tab 7: Adjuntos (`BudgetAttachmentsTab`)
- Lista de archivos subidos (fotos, PDFs, DXF, audio)
- Upload a Supabase Storage: `presupuestos/{id}/adjuntos/`
- Preview de imágenes, nombre de archivo para el resto

---

## 7. BudgetList (`BudgetsPage`)

- Tabla con columnas: código/versión, cliente/lead, obra, estado, moneda, total final, fecha, acciones
- Filtros: estado (todos | borrador | enviado | aprobado | rechazado), búsqueda por texto
- Ordenamiento por fecha desc por defecto
- Click en fila abre el editor
- Botón "Nuevo presupuesto" abre `BudgetNewModal`
- **Persistencia de último abierto:** guardar en `localStorage` el `id` del último presupuesto visitado y reabrirlo automáticamente al entrar al módulo

---

## 8. BudgetStatusBadge

```ts
const STATUS_BADGE: Record<Presupuesto['estado'], { label: string; tone: BadgeTone }> = {
  borrador:  { label: 'Borrador',  tone: 'gray' },
  enviado:   { label: 'Enviado',   tone: 'blue' },
  aprobado:  { label: 'Aprobado',  tone: 'green' },
  rechazado: { label: 'Rechazado', tone: 'red' },
};
```

---

## 9. Copiloto de diagnóstico (`BudgetDiagnostic`)

Analizar el presupuesto y mostrar alertas según nivel:

| Nivel | Condición |
|-------|-----------|
| **Bloqueante** | Sin cliente/lead vinculado, sin líneas de mueble, materiales con precio 0 |
| **Crítico** | Ganancia neta negativa, descuento erosiona margen (< 5%), sin renglones de MO |
| **Sugerencia** | Sin otros costos en presupuesto > $X, indirectos = 0%, MO > 50% del costo total |
| **OK** | Todo listo — mostrar en verde con checkmark |

Mostrar como panel colapsable en la tab Resumen.

---

## 10. Edge cases que implementar

1. **Materiales sin precio:** detectar piezas con `precio_unitario = 0` o `null`. Mostrar modal para completar precios y recalcular al guardar.

2. **Cambio de tipo de cambio:** al editar `tc_manual`, disparar recálculo de todas las piezas que usan materiales en moneda extranjera.

3. **Columna subtotal GENERATED:** `lineas_presupuesto.subtotal` es calculado por Postgres. Al editar piezas, ajustar `precio_unitario` de la línea padre para que el generated subtotal coincida.

4. **Auto-creación de obra al aprobar:** si al cambiar estado a `aprobado` el presupuesto tiene `cliente_id` pero no `obra_id`, crear una obra mínima automáticamente y vincularla.

5. **Versiones de presupuesto:** al duplicar bajo la misma obra, auto-incrementar `version`.

---

## 11. Queries Supabase a implementar en `src/lib/api/budgets.ts`

```ts
// Lista
getPresupuestos(filters): Promise<Presupuesto[]>

// CRUD principal
getPresupuesto(id): Promise<PresupuestoCompleto>   // incluye lineas, piezas, MO, otros
createPresupuesto(data): Promise<Presupuesto>
updatePresupuesto(id, data): Promise<void>
deletePresupuesto(id): Promise<void>

// Líneas
getLineas(presupuesto_id): Promise<LineaPresupuesto[]>
upsertLinea(data): Promise<LineaPresupuesto>
deleteLinea(id): Promise<void>

// Piezas
getPiezas(presupuesto_id): Promise<PresupuestoPieza[]>
upsertPiezas(piezas): Promise<void>             // batch upsert
deletePiezasByLinea(linea_id): Promise<void>

// MO
getManoObra(presupuesto_id): Promise<PresupuestoManoObra[]>
upsertManoObra(data): Promise<PresupuestoManoObra>
deleteManoObra(id): Promise<void>

// Otros costos
getOtrosCostos(presupuesto_id): Promise<PresupuestoOtroCosto[]>
upsertOtroCosto(data): Promise<PresupuestoOtroCosto>
deleteOtroCosto(id): Promise<void>

// Materiales (catálogo)
getMateriales(query?: string): Promise<Material[]>   // top 90 con precio, por relevancia

// Configuración global del usuario
getCosteoConfigGlobal(): Promise<CosteoConfigGlobal>
saveCosteoConfigGlobal(data): Promise<void>

// Guardar totales calculados en el presupuesto
saveTotales(id: string, totales: BudgetTotals): Promise<void>
```

---

## 12. Restricciones

- No modificar el backend de Supabase
- No modificar componentes de otros módulos (designer, layout, ui)
- Mantener TypeScript strict — tipar todas las interfaces
- Usar solo tokens `verko-*` — no romper el design system
- Todos los textos en español argentino
- Números en formato argentino: `1.250,00`
- Formato de moneda: `$ 1.250,00` para ARS, `U$D 1.250,00` para USD
- Las fórmulas del motor de costeo no se modifican bajo ninguna circunstancia