-- =====================================================================================
-- SCHEMA SQL - VERKO v2
-- Basado en la planificación (Fase 1: Diseñador IA + Presupuestos)
-- Importante: Este archivo es solo una referencia estructural. El backend de 
-- Supabase y las tablas de negocio principales ya existen en producción.
-- =====================================================================================

-- -------------------------------------------------------------------------------------
-- TABLAS BASE (Mock para satisfacer Foreign Keys de las nuevas tablas)
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS clientes (id UUID PRIMARY KEY DEFAULT gen_random_uuid());
CREATE TABLE IF NOT EXISTS obras (id UUID PRIMARY KEY DEFAULT gen_random_uuid());
CREATE TABLE IF NOT EXISTS materiales (id UUID PRIMARY KEY DEFAULT gen_random_uuid());
CREATE TABLE IF NOT EXISTS modulos (id UUID PRIMARY KEY DEFAULT gen_random_uuid());
CREATE TABLE IF NOT EXISTS organizaciones (id UUID PRIMARY KEY DEFAULT gen_random_uuid());
CREATE TABLE IF NOT EXISTS stock_ubicaciones (id UUID PRIMARY KEY DEFAULT gen_random_uuid());

-- -------------------------------------------------------------------------------------
-- 7.1 Módulo Diseñador IA
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS verko_design_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID, -- Referencia a auth.users (implícita)
    cliente_id UUID REFERENCES clientes(id),
    obra_id UUID REFERENCES obras(id),
    descripcion_inicial TEXT,
    dxf_path TEXT,
    pdf_path TEXT,
    preview_path TEXT,
    total_usd NUMERIC,
    status TEXT CHECK (status IN ('procesando', 'completado', 'error')),
    error_msg TEXT,
    warnings_json JSONB,
    metadata JSONB DEFAULT '{}'::jsonb,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS verko_design_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES verko_design_sessions(id) ON DELETE CASCADE,
    thread_id UUID,
    user_id UUID,
    rol TEXT CHECK (rol IN ('user', 'agent', 'system')),
    canal TEXT CHECK (canal IN ('web', 'whatsapp', 'api')),
    intent TEXT,
    texto TEXT,
    transcripcion TEXT,
    vision_json JSONB,
    tokens_in INTEGER,
    tokens_out INTEGER,
    latency_ms INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS verko_design_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID,
    thread_id UUID,
    user_id UUID,
    tipo TEXT CHECK (tipo IN ('dxf', 'pdf', 'png', 'json', 'other', 'foto_espacio', 'nota_voz', 'vision_json')),
    storage_path TEXT NOT NULL,
    mime TEXT,
    mime_type TEXT,
    file_size_kb NUMERIC,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS verko_vision_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID,
    session_id UUID,
    user_id UUID,
    photo_path TEXT,
    tipo_espacio TEXT,
    ancho_mm NUMERIC,
    alto_mm NUMERIC,
    profundidad_mm NUMERIC,
    confianza NUMERIC(3,2),
    metodo TEXT,
    obstaculos_json JSONB,
    advertencias_json JSONB,
    sugerencia_json JSONB,
    raw_json JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS verko_whatsapp_users (
    phone TEXT PRIMARY KEY,
    user_id UUID NOT NULL,
    thread_id UUID,
    contact_name TEXT,
    cliente_id UUID REFERENCES clientes(id),
    status TEXT CHECK (status IN ('pending_link', 'active', 'blocked')),
    quiero_audio_respuesta BOOLEAN DEFAULT false,
    ultimo_mensaje_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------------------
-- 7.2 Módulo Renders
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS render_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    descripcion TEXT,
    prompt_base TEXT,
    activo BOOLEAN DEFAULT true,
    prioridad INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS render_modelos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    proveedor TEXT,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS renders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    obra_id UUID NOT NULL REFERENCES obras(id) ON DELETE CASCADE,
    modulo_id UUID REFERENCES modulos(id),
    template_id UUID REFERENCES render_templates(id),
    modelo_codigo TEXT NOT NULL,
    ambiente TEXT DEFAULT 'general',
    prompt_usuario TEXT NOT NULL,
    prompt_final TEXT,
    lora_scale NUMERIC(4,2),
    estado TEXT CHECK (estado IN ('en_cola', 'procesando', 'completado', 'fallido', 'cancelado')),
    metadata JSONB DEFAULT '{}'::jsonb,
    resultado_url TEXT,
    fal_request_id TEXT,
    seed_usado BIGINT,
    costo_usd NUMERIC,
    progreso_steps INTEGER DEFAULT 0,
    aprobado BOOLEAN DEFAULT false,
    aprobado_por UUID,
    aprobado_at TIMESTAMPTZ,
    notas_aprobacion TEXT,
    completado_at TIMESTAMPTZ,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- -------------------------------------------------------------------------------------
-- 7.3 Módulo Presupuestos
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS presupuestos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    numero_correlativo TEXT,
    -- Columnas extendidas reportadas en schema
    thread_id UUID,
    resumen_ia TEXT,
    brief_json JSONB DEFAULT '{}'::jsonb,
    total_materiales NUMERIC DEFAULT 0,
    total_piezas INTEGER DEFAULT 0,
    tc_manual NUMERIC,
    ultima_revision_ia_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb,
    cliente_id UUID REFERENCES clientes(id),
    obra_id UUID REFERENCES obras(id),
    costeo_config JSONB,
    total_mano_obra NUMERIC DEFAULT 0,
    total_costo NUMERIC DEFAULT 0,
    subtotal_con_margen NUMERIC DEFAULT 0,
    total_iva NUMERIC DEFAULT 0,
    total_descuento NUMERIC DEFAULT 0,
    total_final NUMERIC DEFAULT 0,
    ganancia_neta NUMERIC DEFAULT 0,
    margen_real_pct NUMERIC(8,4) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lineas_presupuesto (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    presupuesto_id UUID REFERENCES presupuestos(id) ON DELETE CASCADE,
    tipo_linea TEXT CHECK (tipo_linea IN ('mueble', 'pieza', 'herraje', 'extra', 'ajuste', 'servicio', 'observacion')),
    parent_linea_id UUID REFERENCES lineas_presupuesto(id) ON DELETE CASCADE,
    material_id UUID REFERENCES materiales(id),
    material_nombre TEXT,
    codigo_interno TEXT,
    material_snapshot JSONB,
    ancho_mm NUMERIC,
    alto_mm NUMERIC,
    profundidad_mm NUMERIC,
    espesor_mm NUMERIC,
    desperdicio_pct NUMERIC DEFAULT 12,
    origen_ia BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::jsonb,
    especificaciones JSONB DEFAULT '[]'::jsonb,
    nota_exclusiones TEXT,
    margen_pct_override NUMERIC,
    horas_mano_obra NUMERIC DEFAULT 0,
    costo_mano_obra NUMERIC DEFAULT 0,
    costo_otros NUMERIC DEFAULT 0,
    complejidad NUMERIC(4,2) DEFAULT 1.0,
    concepto TEXT,
    cantidad NUMERIC DEFAULT 1,
    precio_unitario NUMERIC DEFAULT 0,
    subtotal NUMERIC DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS presupuesto_piezas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    presupuesto_id UUID NOT NULL REFERENCES presupuestos(id) ON DELETE CASCADE,
    linea_presupuesto_id UUID,
    user_id UUID,
    mueble_key TEXT,
    modulo_key TEXT,
    codigo TEXT,
    nombre TEXT NOT NULL,
    pieza_tipo TEXT CHECK (pieza_tipo IN ('estructura', 'frente', 'fondo', 'estante', 'mesada', 'canto', 'herraje', 'extra', 'ajuste', 'otro')),
    material_id UUID,
    material_nombre TEXT,
    material_snapshot JSONB,
    unidad_calculo TEXT CHECK (unidad_calculo IN ('pieza', 'm2', 'metro', 'unidad', 'par', 'kit', 'placa', 'kg', 'litro', 'rollo', 'caja')),
    cantidad NUMERIC NOT NULL,
    ancho_mm NUMERIC,
    alto_mm NUMERIC,
    profundidad_mm NUMERIC,
    espesor_mm NUMERIC,
    largo_lineal_mm NUMERIC,
    area_m2 NUMERIC,
    consumo_unidades NUMERIC,
    desperdicio_pct NUMERIC DEFAULT 0,
    precio_unitario NUMERIC NOT NULL,
    subtotal NUMERIC NOT NULL,
    orden INTEGER DEFAULT 0,
    editable BOOLEAN DEFAULT true,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tarifas_mano_obra (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    actividad TEXT NOT NULL,
    categoria TEXT,
    tarifa_hora NUMERIC NOT NULL,
    moneda TEXT NOT NULL,
    tipo_mueble TEXT,
    minutos_default NUMERIC DEFAULT 60,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true,
    vigencia_desde DATE NOT NULL,
    vigencia_hasta DATE,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS presupuesto_mano_obra (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    presupuesto_id UUID NOT NULL REFERENCES presupuestos(id) ON DELETE CASCADE,
    linea_presupuesto_id UUID,
    tarifa_id UUID REFERENCES tarifas_mano_obra(id),
    user_id UUID,
    actividad TEXT NOT NULL,
    categoria TEXT CHECK (categoria IN ('cortado', 'canteado', 'perforado', 'armado', 'lijado', 'pintura', 'lustre', 'instalacion', 'transporte', 'medicion', 'diseno', 'general')),
    minutos NUMERIC NOT NULL,
    tarifa_hora NUMERIC NOT NULL,
    moneda TEXT CHECK (moneda IN ('ARS', 'USD', 'EUR', 'BRL', 'CLP')),
    subtotal NUMERIC NOT NULL,
    origen TEXT CHECK (origen IN ('manual', 'tipologia', 'ia', 'preset')),
    notas TEXT,
    orden INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);



CREATE TABLE IF NOT EXISTS presupuesto_conversaciones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    presupuesto_id UUID NOT NULL REFERENCES presupuestos(id) ON DELETE CASCADE,
    thread_id UUID,
    user_id UUID,
    rol TEXT CHECK (rol IN ('user', 'agent', 'system')),
    canal TEXT CHECK (canal IN ('web', 'whatsapp', 'api')),
    texto TEXT,
    transcripcion TEXT,
    attachments_json JSONB DEFAULT '[]'::jsonb,
    structured_json JSONB DEFAULT '{}'::jsonb,
    modelo TEXT,
    latency_ms INTEGER,
    tokens_in INTEGER,
    tokens_out INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS costeo_config_global (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE,
    margen_pct NUMERIC DEFAULT 35,
    descuento_pct NUMERIC DEFAULT 0,
    iva_pct NUMERIC DEFAULT 21,
    retencion_iva_pct NUMERIC DEFAULT 0,
    tarifa_horaria NUMERIC DEFAULT 8000,
    tarifa_moneda TEXT NOT NULL,
    redondeo NUMERIC DEFAULT 100,
    validez_dias INTEGER DEFAULT 10,
    plazo_entrega_dias INTEGER DEFAULT 30,
    forma_pago TEXT,
    incluye_diseno BOOLEAN DEFAULT false,
    incluye_instalacion BOOLEAN DEFAULT false,
    incluye_transporte BOOLEAN DEFAULT false,
    moneda_default TEXT NOT NULL,
    multiplicador_mueble_importado NUMERIC DEFAULT 2.5,
    multiplicador_mueble_premium NUMERIC DEFAULT 5.0,
    empresa_nombre TEXT,
    empresa_razon_social TEXT,
    empresa_cuit TEXT,
    empresa_direccion TEXT,
    empresa_telefono TEXT,
    empresa_email TEXT,
    empresa_web TEXT,
    empresa_logo_url TEXT,
    empresa_iva_condicion TEXT,
    texto_legal TEXT,
    observaciones_pdf TEXT,
    extras JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------------------
-- 7.4 Tablas de Ingeniería / Despiece
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS tipologias_3d (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    categoria TEXT NOT NULL,
    geometria_parametrica JSONB DEFAULT '{}'::jsonb,
    formula_despiece JSONB DEFAULT '{}'::jsonb,
    formula_isometrico JSONB DEFAULT '{}'::jsonb,
    variantes_disponibles JSONB DEFAULT '[]'::jsonb,
    herrajes_default JSONB DEFAULT '{}'::jsonb,
    activo BOOLEAN DEFAULT true,
    svg_url TEXT,
    svg_storage_path TEXT,
    svg_hash TEXT,
    svg_status TEXT CHECK (svg_status IN ('pendiente', 'generado', 'error', 'obsoleto')),
    svg_generado_at TIMESTAMPTZ,
    svg_error TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS proyectos_despiece (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre TEXT NOT NULL,
    color_material_global TEXT,
    observaciones_globales TEXT,
    estado TEXT DEFAULT 'borrador',
    cliente_id UUID REFERENCES clientes(id),
    pdf_status TEXT CHECK (pdf_status IN ('pendiente', 'generado', 'desactualizado', 'error')),
    pdf_url TEXT,
    pdf_storage_path TEXT,
    pdf_generado_at TIMESTAMPTZ,
    plano_url TEXT,
    plano_filename TEXT,
    plano_tipo TEXT CHECK (plano_tipo IN ('dwg', 'dxf', 'pdf', 'jpg', 'jpeg', 'png')),
    organizacion_id UUID REFERENCES organizaciones(id),
    origen TEXT,
    generacion_diseno_id UUID,
    observaciones_cliente TEXT,
    observaciones_tecnicas TEXT,
    ajustes_realizados JSONB,
    alertas_tecnicas JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS instancias_modulo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proyecto_id UUID REFERENCES proyectos_despiece(id) ON DELETE CASCADE,
    tipologia_id UUID REFERENCES tipologias_3d(id),
    codigo_modulo TEXT NOT NULL,
    ancho_mm INTEGER NOT NULL,
    profundidad_mm INTEGER NOT NULL,
    alto_mm INTEGER NOT NULL,
    cantidad INTEGER DEFAULT 1,
    variantes_seleccionadas JSONB DEFAULT '{}'::jsonb,
    herrajes_override JSONB DEFAULT '{}'::jsonb,
    configuracion_interna JSONB DEFAULT '{}'::jsonb,
    herrajes JSONB DEFAULT '{}'::jsonb,
    observaciones TEXT,
    orden_en_proyecto INTEGER,
    despiece_status TEXT CHECK (despiece_status IN ('pendiente', 'generado', 'desactualizado', 'error')),
    svg_status TEXT CHECK (svg_status IN ('pendiente', 'generado', 'desactualizado', 'error')),
    plan_corte_status TEXT CHECK (plan_corte_status IN ('pendiente', 'generado', 'desactualizado', 'error')),
    plano_mueble_status TEXT CHECK (plano_mueble_status IN ('pendiente', 'generado', 'desactualizado', 'error')),
    svg_url TEXT,
    svg_storage_path TEXT,
    svg_hash TEXT,
    tipologia TEXT,
    material_principal TEXT,
    origen TEXT,
    espesor_lateral_mm NUMERIC DEFAULT 18,
    espesor_piso_mm NUMERIC DEFAULT 18,
    espesor_techo_mm NUMERIC DEFAULT 18,
    espesor_fondo_mm NUMERIC DEFAULT 12,
    espesor_frente_mm NUMERIC DEFAULT 18,
    generacion_diseno_id UUID,
    imagen_referencia_url TEXT,
    despiece_bom JSONB,
    despiece_hardware JSONB,
    despiece_warnings JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS piezas_despiece (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    instancia_id UUID REFERENCES instancias_modulo(id) ON DELETE CASCADE,
    codigo_pieza_global INTEGER,
    descripcion TEXT NOT NULL,
    material TEXT NOT NULL,
    espesor_mm DECIMAL(5,2) NOT NULL,
    ancho_mm NUMERIC NOT NULL,
    largo_mm NUMERIC NOT NULL,
    cantidad NUMERIC NOT NULL,
    canto_aplicado JSONB DEFAULT '[]'::jsonb,
    observaciones TEXT
);

CREATE TABLE IF NOT EXISTS despiece_revisiones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    obra_id UUID REFERENCES obras(id) ON DELETE CASCADE,
    modulo_id UUID REFERENCES modulos(id) ON DELETE SET NULL,
    tipo_modulo TEXT NOT NULL,
    config JSONB DEFAULT '{}'::jsonb,
    piezas_snapshot JSONB DEFAULT '{}'::jsonb,
    estado TEXT CHECK (estado IN ('borrador', 'en_revision', 'aprobado_parcial', 'aprobado', 'rechazado')),
    total_piezas INTEGER NOT NULL,
    piezas_aprobadas INTEGER NOT NULL,
    piezas_observadas INTEGER NOT NULL,
    piezas_rechazadas INTEGER NOT NULL,
    porcentaje_aprobacion NUMERIC,
    enviado_por UUID,
    revisado_por UUID,
    aprobado_por UUID,
    enviado_at TIMESTAMPTZ,
    revision_iniciada_at TIMESTAMPTZ,
    completado_at TIMESTAMPTZ,
    notas_revision TEXT,
    notas_aprobacion TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------------------
-- 7.5 Tablas de Diseño IA avanzado / Tokens
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS generaciones_diseno (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    cliente_id UUID REFERENCES clientes(id),
    organizacion_id UUID NOT NULL REFERENCES organizaciones(id),
    proyecto_despiece_id UUID REFERENCES proyectos_despiece(id),
    foto_ambiente_url TEXT NOT NULL,
    foto_ambiente_storage_path TEXT,
    foto_ambiente_hash TEXT,
    prompt_usuario_original TEXT NOT NULL,
    prompt_enriquecido_verko TEXT NOT NULL,
    parametros_estructurados JSONB,
    tipologia_inferida TEXT,
    material_inferido TEXT,
    estilo_inferido TEXT,
    dimensiones_inferidas JSONB,
    confianza_inferencia JSONB,
    preguntas_aclaracion JSONB,
    cantidad_puertas_inferida NUMERIC,
    cantidad_cajones_inferida NUMERIC,
    cantidad_estantes_inferida NUMERIC,
    mueble_aislado_url TEXT,
    montaje_final_url TEXT,
    mueble_aislado_costo_usd NUMERIC,
    montaje_final_costo_usd NUMERIC,
    status TEXT NOT NULL,
    error_mensaje TEXT,
    error_paso TEXT,
    tokens_consumidos INTEGER DEFAULT 1,
    tipo_iteracion TEXT CHECK (tipo_iteracion IN ('inicial', 'edicion_conversacional', 'regeneracion_completa')),
    numero_iteracion INTEGER NOT NULL,
    generacion_padre_id UUID REFERENCES generaciones_diseno(id),
    generacion_raiz_id UUID REFERENCES generaciones_diseno(id),
    aprobado_por_cliente_at TIMESTAMPTZ,
    aprobado_por_carpintero_at TIMESTAMPTZ,
    modulo_generado_id UUID REFERENCES instancias_modulo(id),
    proyecto_creado_id UUID REFERENCES proyectos_despiece(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS tokens_organizacion (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organizacion_id UUID UNIQUE NOT NULL REFERENCES organizaciones(id),
    tokens_disponibles NUMERIC CHECK (tokens_disponibles >= 0),
    tokens_consumidos_total NUMERIC NOT NULL,
    tokens_incluidos_setup NUMERIC DEFAULT 100,
    tokens_comprados_total NUMERIC NOT NULL,
    tokens_reembolsados_total NUMERIC NOT NULL,
    ultima_recarga_at TIMESTAMPTZ,
    ultimo_consumo_at TIMESTAMPTZ,
    ultima_recarga_monto_usd NUMERIC,
    alerta_saldo_bajo_enviada BOOLEAN DEFAULT false,
    umbral_alerta_saldo_bajo NUMERIC DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -------------------------------------------------------------------------------------
-- 7.6 Tablas de planos DXF / Corte
-- -------------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS dxf_analisis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    obra_id UUID REFERENCES obras(id),
    file_url TEXT NOT NULL,
    entities_count INTEGER,
    layers TEXT[],
    bounding_box JSONB,
    interpretation JSONB,
    svg_preview TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS planes_corte (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    obra_id UUID REFERENCES obras(id),
    material_id UUID REFERENCES materiales(id),
    operador_id UUID,
    created_by UUID,
    placa_ancho_mm INTEGER NOT NULL,
    placa_largo_mm INTEGER NOT NULL,
    espesor_mm NUMERIC NOT NULL,
    ancho_sierra_mm NUMERIC NOT NULL,
    margen_borde_mm NUMERIC NOT NULL,
    total_piezas INTEGER NOT NULL,
    area_placa_mm2 BIGINT NOT NULL,
    area_piezas_mm2 BIGINT NOT NULL,
    area_desperdicio_mm2 BIGINT NOT NULL,
    aprovechamiento_pct NUMERIC NOT NULL,
    estado TEXT CHECK (estado IN ('calculado', 'aprobado', 'cortado', 'anulado')),
    metadata JSONB DEFAULT '{}'::jsonb,
    cortado_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS retazos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID REFERENCES planes_corte(id),
    material_id UUID REFERENCES materiales(id),
    stock_ubicacion_id UUID REFERENCES stock_ubicaciones(id),
    created_by UUID,
    nombre TEXT,
    ancho_mm INTEGER NOT NULL,
    largo_mm INTEGER NOT NULL,
    area_mm2 BIGINT NOT NULL,
    espesor_mm NUMERIC NOT NULL,
    estado TEXT CHECK (estado IN ('disponible', 'reservado', 'descartado', 'consumido')),
    metadata JSONB DEFAULT '{}'::jsonb,
    reservado_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);
