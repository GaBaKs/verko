export type DespieceReviewStatus = 'borrador' | 'en_revision' | 'aprobado_parcial' | 'aprobado' | 'rechazado';
export type PiezaReviewStatus = 'pendiente' | 'aprobada' | 'observada' | 'rechazada' | 'corregida';
export type RenderEstado = 'en_cola' | 'procesando' | 'completado' | 'fallido' | 'cancelado';
export type RetazoEstado = 'disponible' | 'reservado' | 'descartado' | 'consumido';
export type PlanCorteEstado = 'calculado' | 'aprobado' | 'cortado' | 'anulado';
export type SvgStatus = 'pendiente' | 'generado' | 'desactualizado' | 'error' | 'obsoleto';
export type TipoLineaPresupuesto = 'mueble' | 'pieza' | 'herraje' | 'extra' | 'ajuste' | 'servicio' | 'observacion';
export type TipoIteracion = 'inicial' | 'edicion_conversacional' | 'regeneracion_completa';
export type ManoObraCategoria = 'cortado' | 'canteado' | 'perforado' | 'armado' | 'lijado' | 'pintura' | 'lustre' | 'instalacion' | 'transporte' | 'medicion' | 'diseno' | 'general';
export type OtroCostosCategoria = 'flete' | 'embalaje' | 'instalacion' | 'medicion' | 'diseno' | 'comision' | 'garantia' | 'permisos' | 'subcontrato' | 'otros';
export type Moneda = 'ARS' | 'USD' | 'EUR' | 'BRL' | 'CLP';
export type PiezaTipo = 'estructura' | 'frente' | 'fondo' | 'estante' | 'mesada' | 'canto' | 'herraje' | 'extra' | 'ajuste' | 'otro';
export type UnidadCalculo = 'pieza' | 'm2' | 'metro' | 'unidad' | 'par' | 'kit' | 'placa' | 'kg' | 'litro' | 'rollo' | 'caja';
export type ManoObraOrigen = 'manual' | 'tipologia' | 'ia' | 'preset';

// ── Base Entities ────────────────────────────────────────────────────────
export interface Cliente {
  id: string;
}

export interface Obra {
  id: string;
}

export interface Material {
  id: string;
}

export interface Modulo {
  id: string;
}

export interface Organizacion {
  id: string;
}

export interface StockUbicacion {
  id: string;
}

// ── Diseñador IA ───────────────────────────────────────────────────────
export interface VerkoDesignSession {
  id: string;
  user_id: string | null;
  cliente_id: string | null;
  obra_id: string | null;
  descripcion_inicial: string | null;
  dxf_path: string | null;
  pdf_path: string | null;
  preview_path: string | null;
  total_usd: number | null;
  status: 'procesando' | 'completado' | 'error';
  error_msg: string | null;
  warnings_json: unknown | null;
  metadata: Record<string, unknown>;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface VerkoDesignConversation {
  id: string;
  session_id: string | null;
  thread_id: string | null;
  user_id: string | null;
  rol: 'user' | 'agent' | 'system';
  canal: 'web' | 'whatsapp' | 'api';
  intent: string | null;
  texto: string | null;
  transcripcion: string | null;
  vision_json: unknown | null;
  tokens_in: number | null;
  tokens_out: number | null;
  latency_ms: number | null;
  created_at: string;
}

export interface VerkoDesignAttachment {
  id: string;
  session_id: string | null;
  thread_id: string | null;
  user_id: string | null;
  tipo: 'dxf' | 'pdf' | 'png' | 'json' | 'other' | 'foto_espacio' | 'nota_voz' | 'vision_json';
  storage_path: string;
  mime: string | null;
  mime_type: string | null;
  file_size_kb: number | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export interface VerkoVisionAnalysis {
  id: string;
  thread_id: string | null;
  session_id: string | null;
  user_id: string | null;
  photo_path: string | null;
  tipo_espacio: string | null;
  ancho_mm: number | null;
  alto_mm: number | null;
  profundidad_mm: number | null;
  confianza: number | null;
  metodo: string | null;
  obstaculos_json: unknown | null;
  advertencias_json: unknown | null;
  sugerencia_json: unknown | null;
  raw_json: unknown | null;
  created_at: string;
}

export interface VerkoWhatsappUser {
  phone: string;
  user_id: string;
  thread_id: string | null;
  contact_name: string | null;
  cliente_id: string | null;
  status: 'pending_link' | 'active' | 'blocked' | null;
  quiero_audio_respuesta: boolean;
  ultimo_mensaje_at: string | null;
  created_at: string;
  updated_at: string;
}

// ── Renders ────────────────────────────────────────────────────────────
export interface Render {
  id: string;
  obra_id: string;
  modulo_id: string | null;
  template_id: string | null;
  modelo_codigo: string;
  ambiente: string | null;
  prompt_usuario: string;
  prompt_final: string | null;
  lora_scale: number | null;
  estado: RenderEstado | null;
  metadata: Record<string, unknown>;
  resultado_url: string | null;
  fal_request_id: string | null;
  seed_usado: number | null;
  costo_usd: number | null;
  progreso_steps: number | null;
  aprobado: boolean | null;
  aprobado_por: string | null;
  aprobado_at: string | null;
  notas_aprobacion: string | null;
  completado_at: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface RenderTemplate {
  id: string;
  codigo: string;
  nombre: string;
  descripcion: string | null;
  prompt_base: string | null;
  activo: boolean | null;
  prioridad: number | null;
  created_at: string;
  updated_at: string;
}

export interface RenderModelo {
  id: string;
  codigo: string;
  nombre: string;
  proveedor: string | null;
  descripcion: string | null;
  activo: boolean | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ── Presupuestos ───────────────────────────────────────────────────────
export interface CosteoConfig {
  multiplicador_mueble_importado?: number;
  multiplicador_mueble_premium?: number;
  margen_pct: number;
  iva_pct: number;
  iibb_pct: number;
  descuento_pct: number;
  descuento_monto: number;
  tarifa_horaria: number;
  moneda_default: string;
  redondeo: number;
  validez_dias?: number;
}

export interface Presupuesto {
  id: string;
  numero_correlativo: string | null;
  obra_id: string | null;
  cliente_id: string | null;
  thread_id: string | null;
  resumen_ia: string | null;
  brief_json: Record<string, unknown>;
  total_materiales: number | null;
  total_piezas: number | null;
  tc_manual: number | null;
  ultima_revision_ia_at: string | null;
  metadata: Record<string, unknown>;
  costeo_config: CosteoConfig | null;
  total_mano_obra: number | null;
  total_costo: number | null;
  subtotal_con_margen: number | null;
  total_iva: number | null;
  total_descuento: number | null;
  total_final: number | null;
  ganancia_neta: number | null;
  margen_real_pct: number | null;
  created_at: string;
  updated_at: string;
}

export interface LineaPresupuesto {
  id: string;
  presupuesto_id: string | null;
  tipo_linea: TipoLineaPresupuesto | null;
  parent_linea_id: string | null;
  material_id: string | null;
  material_nombre: string | null;
  codigo_interno: string | null;
  material_snapshot: unknown | null;
  ancho_mm: number | null;
  alto_mm: number | null;
  profundidad_mm: number | null;
  espesor_mm: number | null;
  desperdicio_pct: number | null;
  origen_ia: boolean | null;
  especificaciones: string[] | null;
  nota_exclusiones: string | null;
  metadata: Record<string, unknown>;
  margen_pct_override: number | null;
  horas_mano_obra: number | null;
  costo_mano_obra: number | null;
  costo_otros: number | null;
  complejidad: number | null;
  concepto: string | null;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
}

export interface PresupuestoPieza {
  id: string;
  presupuesto_id: string;
  linea_presupuesto_id: string | null;
  user_id: string | null;
  mueble_key: string | null;
  modulo_key: string | null;
  codigo: string | null;
  nombre: string;
  pieza_tipo: PiezaTipo | null;
  material_id: string | null;
  material_nombre: string | null;
  material_snapshot: Record<string, unknown> | null;
  unidad_calculo: UnidadCalculo | null;
  cantidad: number;
  ancho_mm: number | null;
  alto_mm: number | null;
  profundidad_mm: number | null;
  espesor_mm: number | null;
  largo_lineal_mm: number | null;
  area_m2: number | null;
  consumo_unidades: number | null;
  desperdicio_pct: number | null;
  precio_unitario: number;
  subtotal: number;
  orden: number | null;
  editable: boolean | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface TarifaManoObra {
  id: string;
  user_id: string | null;
  actividad: string;
  categoria: string | null;
  tarifa_hora: number;
  moneda: string;
  tipo_mueble: string | null;
  minutos_default: number | null;
  descripcion: string | null;
  activo: boolean | null;
  vigencia_desde: string;
  vigencia_hasta: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface PresupuestoManoObra {
  id: string;
  presupuesto_id: string;
  linea_presupuesto_id: string | null;
  tarifa_id: string | null;
  user_id: string | null;
  actividad: string;
  categoria: ManoObraCategoria | null;
  minutos: number;
  tarifa_hora: number;
  moneda: Moneda | null;
  subtotal: number;
  origen: ManoObraOrigen | null;
  notas: string | null;
  orden: number | null;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface PresupuestoOtrosCostos {
  id: string;
  presupuesto_id: string;
  concepto: string;
  monto: number;
  tipo?: string;
}

export interface PresupuestoConversacion {
  id: string;
  presupuesto_id: string;
  thread_id: string | null;
  user_id: string | null;
  rol: 'user' | 'agent' | 'system' | null;
  canal: 'web' | 'whatsapp' | 'api' | null;
  texto: string | null;
  transcripcion: string | null;
  attachments_json: unknown | null;
  structured_json: unknown | null;
  modelo: string | null;
  latency_ms: number | null;
  tokens_in: number | null;
  tokens_out: number | null;
  created_at: string;
}

export interface CosteoConfigGlobal {
  id: string;
  user_id: string | null;
  margen_pct: number | null;
  descuento_pct: number | null;
  iva_pct: number | null;
  retencion_iva_pct: number | null;
  tarifa_horaria: number | null;
  tarifa_moneda: string;
  redondeo: number | null;
  validez_dias: number | null;
  plazo_entrega_dias: number | null;
  forma_pago: string | null;
  incluye_diseno: boolean | null;
  incluye_instalacion: boolean | null;
  incluye_transporte: boolean | null;
  moneda_default: string;
  multiplicador_mueble_importado: number | null;
  multiplicador_mueble_premium: number | null;
  empresa_nombre: string | null;
  empresa_razon_social: string | null;
  empresa_cuit: string | null;
  empresa_direccion: string | null;
  empresa_telefono: string | null;
  empresa_email: string | null;
  empresa_web: string | null;
  empresa_logo_url: string | null;
  empresa_iva_condicion: string | null;
  texto_legal: string | null;
  observaciones_pdf: string | null;
  extras: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

// ── Ingeniería / Despiece ──────────────────────────────────────────────
export interface Tipologia3D {
  id: string;
  codigo: string;
  nombre: string;
  categoria: string;
  geometria_parametrica: Record<string, unknown>;
  formula_despiece: Record<string, unknown>;
  formula_isometrico: Record<string, unknown>;
  variantes_disponibles: unknown;
  herrajes_default: Record<string, unknown>;
  activo: boolean | null;
  svg_url: string | null;
  svg_storage_path: string | null;
  svg_hash: string | null;
  svg_status: SvgStatus | null;
  svg_generado_at: string | null;
  svg_error: string | null;
  created_at: string;
}

export interface ProyectoDespiece {
  id: string;
  nombre: string;
  color_material_global: string | null;
  observaciones_globales: string | null;
  estado: string | null;
  cliente_id: string | null;
  pdf_status: SvgStatus | null;
  pdf_url: string | null;
  pdf_storage_path: string | null;
  pdf_generado_at: string | null;
  plano_url: string | null;
  plano_filename: string | null;
  plano_tipo: string | null;
  organizacion_id: string | null;
  origen: string | null;
  generacion_diseno_id: string | null;
  observaciones_cliente: string | null;
  observaciones_tecnicas: string | null;
  ajustes_realizados: unknown | null;
  alertas_tecnicas: unknown | null;
  created_at: string;
  updated_at: string;
}

export interface InstanciaModulo {
  id: string;
  proyecto_id: string | null;
  tipologia_id: string | null;
  codigo_modulo: string;
  ancho_mm: number;
  profundidad_mm: number;
  alto_mm: number;
  cantidad: number | null;
  variantes_seleccionadas: Record<string, unknown>;
  herrajes_override: Record<string, unknown>;
  configuracion_interna: Record<string, unknown> | null;
  herrajes: Record<string, unknown> | null;
  observaciones: string | null;
  orden_en_proyecto: number | null;
  despiece_status: SvgStatus | null;
  svg_status: SvgStatus | null;
  plan_corte_status: SvgStatus | null;
  plano_mueble_status: SvgStatus | null;
  svg_url: string | null;
  svg_storage_path: string | null;
  svg_hash: string | null;
  tipologia: string | null;
  material_principal: string | null;
  origen: string | null;
  espesor_lateral_mm: number | null;
  espesor_piso_mm: number | null;
  espesor_techo_mm: number | null;
  espesor_fondo_mm: number | null;
  espesor_frente_mm: number | null;
  generacion_diseno_id: string | null;
  imagen_referencia_url: string | null;
  despiece_bom: unknown | null;
  despiece_hardware: unknown | null;
  despiece_warnings: unknown | null;
  created_at: string;
}

export interface PiezaDespiece {
  id: string;
  instancia_id: string | null;
  codigo_pieza_global: number | null;
  descripcion: string;
  material: string;
  espesor_mm: number;
  ancho_mm: number;
  largo_mm: number;
  cantidad: number;
  canto_aplicado: unknown[];
  observaciones: string | null;
}

export interface DespieceRevision {
  id: string;
  obra_id: string | null;
  modulo_id: string | null;
  tipo_modulo: string;
  config: Record<string, unknown>;
  piezas_snapshot: Record<string, unknown>;
  estado: DespieceReviewStatus | null;
  total_piezas: number;
  piezas_aprobadas: number;
  piezas_observadas: number;
  piezas_rechazadas: number;
  porcentaje_aprobacion: number | null;
  enviado_por: string | null;
  revisado_por: string | null;
  aprobado_por: string | null;
  enviado_at: string | null;
  revision_iniciada_at: string | null;
  completado_at: string | null;
  notas_revision: string | null;
  notas_aprobacion: string | null;
  created_at: string;
  updated_at: string;
}


// ── Tokens / Diseño IA avanzado ────────────────────────────────────────
export interface GeneracionDiseno {
  id: string;
  user_id: string | null;
  cliente_id: string | null;
  organizacion_id: string;
  proyecto_despiece_id: string | null;
  foto_ambiente_url: string;
  foto_ambiente_storage_path: string | null;
  foto_ambiente_hash: string | null;
  prompt_usuario_original: string;
  prompt_enriquecido_verko: string;
  parametros_estructurados: unknown | null;
  tipologia_inferida: string | null;
  material_inferido: string | null;
  estilo_inferido: string | null;
  dimensiones_inferidas: unknown | null;
  confianza_inferencia: unknown | null;
  preguntas_aclaracion: unknown | null;
  cantidad_puertas_inferida: number | null;
  cantidad_cajones_inferida: number | null;
  cantidad_estantes_inferida: number | null;
  mueble_aislado_url: string | null;
  montaje_final_url: string | null;
  mueble_aislado_costo_usd: number | null;
  montaje_final_costo_usd: number | null;
  status: string;
  error_mensaje: string | null;
  error_paso: string | null;
  tokens_consumidos: number | null;
  tipo_iteracion: TipoIteracion | null;
  numero_iteracion: number;
  generacion_padre_id: string | null;
  generacion_raiz_id: string | null;
  aprobado_por_cliente_at: string | null;
  aprobado_por_carpintero_at: string | null;
  modulo_generado_id: string | null;
  proyecto_creado_id: string | null;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
}

export interface TokensOrganizacion {
  id: string;
  organizacion_id: string;
  tokens_disponibles: number | null;
  tokens_consumidos_total: number;
  tokens_incluidos_setup: number | null;
  tokens_comprados_total: number;
  tokens_reembolsados_total: number;
  ultima_recarga_at: string | null;
  ultimo_consumo_at: string | null;
  ultima_recarga_monto_usd: number | null;
  alerta_saldo_bajo_enviada: boolean | null;
  umbral_alerta_saldo_bajo: number | null;
  created_at: string;
  updated_at: string;
}

// ── Planos DXF / Corte ───────────────────────────────────────────────
export interface DxfAnalisis {
  id: string;
  obra_id: string | null;
  file_url: string;
  entities_count: number | null;
  layers: string[] | null;
  bounding_box: unknown | null;
  interpretation: unknown | null;
  svg_preview: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface PlanCorte {
  id: string;
  obra_id: string | null;
  material_id: string | null;
  operador_id: string | null;
  created_by: string | null;
  placa_ancho_mm: number;
  placa_largo_mm: number;
  espesor_mm: number;
  ancho_sierra_mm: number;
  margen_borde_mm: number;
  total_piezas: number;
  area_placa_mm2: number;
  area_piezas_mm2: number;
  area_desperdicio_mm2: number;
  aprovechamiento_pct: number;
  estado: PlanCorteEstado | null;
  metadata: Record<string, unknown>;
  cortado_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Retazo {
  id: string;
  plan_id: string | null;
  material_id: string | null;
  stock_ubicacion_id: string | null;
  created_by: string | null;
  nombre: string | null;
  ancho_mm: number;
  largo_mm: number;
  area_mm2: number;
  espesor_mm: number;
  estado: RetazoEstado | null;
  metadata: Record<string, unknown>;
  reservado_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface Database {
  public: {
    Tables: {
      verko_design_sessions: { Row: VerkoDesignSession; Insert: Partial<VerkoDesignSession>; Update: Partial<VerkoDesignSession> };
      verko_design_conversations: { Row: VerkoDesignConversation; Insert: Partial<VerkoDesignConversation>; Update: Partial<VerkoDesignConversation> };
      verko_design_attachments: { Row: VerkoDesignAttachment; Insert: Partial<VerkoDesignAttachment>; Update: Partial<VerkoDesignAttachment> };
      verko_vision_analyses: { Row: VerkoVisionAnalysis; Insert: Partial<VerkoVisionAnalysis>; Update: Partial<VerkoVisionAnalysis> };
      verko_whatsapp_users: { Row: VerkoWhatsappUser; Insert: Partial<VerkoWhatsappUser>; Update: Partial<VerkoWhatsappUser> };
      
      render_templates: { Row: RenderTemplate; Insert: Partial<RenderTemplate>; Update: Partial<RenderTemplate> };
      render_modelos: { Row: RenderModelo; Insert: Partial<RenderModelo>; Update: Partial<RenderModelo> };
      renders: { Row: Render; Insert: Partial<Render>; Update: Partial<Render> };
      
      presupuestos: { Row: Presupuesto; Insert: Partial<Presupuesto>; Update: Partial<Presupuesto> };
      lineas_presupuesto: { Row: LineaPresupuesto; Insert: Partial<LineaPresupuesto>; Update: Partial<LineaPresupuesto> };
      presupuesto_piezas: { Row: PresupuestoPieza; Insert: Partial<PresupuestoPieza>; Update: Partial<PresupuestoPieza> };
      tarifas_mano_obra: { Row: TarifaManoObra; Insert: Partial<TarifaManoObra>; Update: Partial<TarifaManoObra> };
      presupuesto_mano_obra: { Row: PresupuestoManoObra; Insert: Partial<PresupuestoManoObra>; Update: Partial<PresupuestoManoObra> };
      presupuesto_otros_costos: { Row: PresupuestoOtrosCostos; Insert: Partial<PresupuestoOtrosCostos>; Update: Partial<PresupuestoOtrosCostos> };
      presupuesto_conversaciones: { Row: PresupuestoConversacion; Insert: Partial<PresupuestoConversacion>; Update: Partial<PresupuestoConversacion> };
      costeo_config_global: { Row: CosteoConfigGlobal; Insert: Partial<CosteoConfigGlobal>; Update: Partial<CosteoConfigGlobal> };
      
      tipologias_3d: { Row: Tipologia3D; Insert: Partial<Tipologia3D>; Update: Partial<Tipologia3D> };
      proyectos_despiece: { Row: ProyectoDespiece; Insert: Partial<ProyectoDespiece>; Update: Partial<ProyectoDespiece> };
      instancias_modulo: { Row: InstanciaModulo; Insert: Partial<InstanciaModulo>; Update: Partial<InstanciaModulo> };
      piezas_despiece: { Row: PiezaDespiece; Insert: Partial<PiezaDespiece>; Update: Partial<PiezaDespiece> };
      despiece_revisiones: { Row: DespieceRevision; Insert: Partial<DespieceRevision>; Update: Partial<DespieceRevision> };
      
      generaciones_diseno: { Row: GeneracionDiseno; Insert: Partial<GeneracionDiseno>; Update: Partial<GeneracionDiseno> };
      tokens_organizacion: { Row: TokensOrganizacion; Insert: Partial<TokensOrganizacion>; Update: Partial<TokensOrganizacion> };
      
      dxf_analisis: { Row: DxfAnalisis; Insert: Partial<DxfAnalisis>; Update: Partial<DxfAnalisis> };
      planes_corte: { Row: PlanCorte; Insert: Partial<PlanCorte>; Update: Partial<PlanCorte> };
      retazos: { Row: Retazo; Insert: Partial<Retazo>; Update: Partial<Retazo> };
      
      clientes: { Row: Cliente; Insert: Partial<Cliente>; Update: Partial<Cliente> };
      obras: { Row: Obra; Insert: Partial<Obra>; Update: Partial<Obra> };
      materiales: { Row: Material; Insert: Partial<Material>; Update: Partial<Material> };
      modulos: { Row: Modulo; Insert: Partial<Modulo>; Update: Partial<Modulo> };
      organizaciones: { Row: Organizacion; Insert: Partial<Organizacion>; Update: Partial<Organizacion> };
      stock_ubicaciones: { Row: StockUbicacion; Insert: Partial<StockUbicacion>; Update: Partial<StockUbicacion> };
    };
    Views: {
      [key: string]: { Row: Record<string, unknown> };
    };
    Functions: {
      [key: string]: unknown;
    };
  };
}