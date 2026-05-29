# VERKO v2 — Plan de Desarrollo Frontend
## React 18 + Tailwind CSS 3 · Fase 1: Diseñador IA + Presupuestos

---

## 1. Contexto del proyecto

**VERKO** es una empresa de mobiliario fijo de alta gama. Esta es su **aplicación interna** — no es pública ni SaaS. La usan los integrantes del equipo (diseñadores, comerciales, ingeniería) para gestionar el ciclo completo de cada obra: desde el primer contacto con el cliente hasta la entrega e instalación del mobiliario.

Las dos funcionalidades principales de esta primera fase son:
- **Diseñador IA:** chat con IA para generar renders fotorrealistas y planos técnicos a partir de conversaciones en lenguaje natural.
- **Presupuestos:** módulo de cotización detallada con materiales, mano de obra, márgenes e impuestos.

El backend (Supabase PostgreSQL + Edge Functions) **ya existe y no se modifica**. Solo se reescribe el frontend, pasando de HTML/CSS/JS vanilla a React + TypeScript.

---

## 2. Stack tecnológico

| Capa | Tecnología | Versión | Nota crítica |
|------|-----------|---------|-------------|
| Framework | React + Vite | 18 / 5.x | template `react-ts` |
| Lenguaje | TypeScript | 5.x strict | `"strict": true` en tsconfig |
| Estilos | Tailwind CSS | **3.x** | `tailwind.config.ts` — **NO v4** |
| Estado | Zustand | 4.x | una store por dominio |
| Ruteo | React Router | **v6** | `createBrowserRouter` — **NO legacy Switch** |
| Backend | Supabase JS | v2 | mismo proyecto cloud, mismo schema |
| Formularios | React Hook Form + Zod | latest | validación tipada |
| Íconos | Lucide React | latest | tree-shakeable |
| Testing | Vitest + RTL | latest | unit + integration |
| Linting | ESLint 9 + Prettier | latest | — |

> ⚠️ **Tailwind v3 obligatorio.** La configuración va en `tailwind.config.ts` con `theme.extend`. La sintaxis `@theme` es de v4 y no aplica acá.

> ⚠️ **React Router v6 con `createBrowserRouter`.** No usar `<Switch>` ni el modo framework de v7.

---

## 3. Tema visual — oscuro premium

La app usa un **tema oscuro** con estética glass/premium. Es una app interna de alta gama, no una dashboard genérica. Los rasgos visuales clave son:

- Fondo oscuro antracita (`#0B0E14`)
- Cards con glassmorphism (gradiente sutil + borde rgba blanco)
- Línea shine en el borde superior de las cards (`::before` con gradiente blanco)
- Bordes de baja opacidad (`rgba(255,255,255,0.08)`)
- Dorado (`#B8973A`) como único acento de color
- Tipografía Instrument Serif para títulos, Archivo para texto, JetBrains Mono para códigos/labels
- Modales con `backdrop-filter: blur(28px)`
- Nav items con efecto glassmorphism activo y línea dorada inferior

El objetivo es replicar esta estética fielmente, no modernizarla ni simplificarla.

---

## 4. tailwind.config.ts — configuración completa

```ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        verko: {
          bg:           '#0B0E14',
          card:         'rgba(12,16,22,0.72)',
          sidebar:      '#1A1D23',
          text:         '#E8E8E8',
          secondary:    '#C0B8B0',
          muted:        '#888888',
          dim:          'rgba(255,255,255,0.35)',
          border:       'rgba(255,255,255,0.08)',
          gold:         '#B8973A',
          'gold-light': '#C79943',
          'gold-bg':    'rgba(199,153,67,0.12)',
          blue:         '#2C5F7C',
          'blue-bg':    '#0D1E28',
          green:        '#2D6B4A',
          'green-bg':   '#0D2218',
          orange:       '#B8600D',
          'orange-bg':  '#2A1A08',
          red:          '#C0392B',
          'red-bg':     '#2A0D0A',
          yellow:       '#9A7D0A',
          'yellow-bg':  '#221C04',
          purple:       '#6C3483',
          'purple-bg':  '#1C0E22',
          teal:         '#1A8A6A',
          'teal-bg':    '#082218',
          gray:         '#777777',
          'gray-bg':    'rgba(255,255,255,0.06)',
          hover:        'rgba(255,255,255,0.05)',
        },
      },
      fontFamily: {
        serif: ['Instrument Serif', 'Georgia', 'serif'],
        sans:  ['Archivo', 'system-ui', 'sans-serif'],
        mono:  ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '8px',
        sm:  '5px',
        lg:  '12px',
        xl:  '16px',
        '2xl': '24px',
        '3xl': '28px',
      },
      boxShadow: {
        DEFAULT: '0 1px 3px rgba(0,0,0,0.12)',
        md:   '0 4px 12px rgba(0,0,0,0.18)',
        lg:   '0 18px 44px rgba(0,0,0,0.32)',
        gold: '0 0 0 1px rgba(184,151,58,0.35)',
      },
    },
  },
  plugins: [],
} satisfies Config;
```

---

## 5. globals.css

```css
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Archivo:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply bg-verko-bg text-verko-text font-sans;
}

* {
  box-sizing: border-box;
}
```

---

## 6. Arquitectura de archivos

```
src/
├── main.tsx                        # Entry point + providers
├── App.tsx                         # createBrowserRouter + AppShell + rutas lazy
│
├── styles/
│   └── globals.css                 # @tailwind + fuentes + base styles
│
├── lib/
│   ├── supabase.ts                 # createClient tipado con Database
│   └── api/
│       ├── designs.ts
│       ├── budgets.ts
│       ├── renders.ts
│       └── materials.ts
│
├── stores/
│   ├── authStore.ts                # user, profile, role, login(), logout(), init()
│   └── uiStore.ts                  # toast, modal, sidebar mobile open/close
│
├── hooks/
│   ├── useDesignChat.ts            # thread, historial, sendTurn(), attachments, voz
│   ├── useRenderStudio.ts          # estado render, polling de status
│   ├── useBudgetEditor.ts          # CRUD líneas, motor de cálculo de totales
│   └── useVoiceRecording.ts        # MediaRecorder + transcripción
│
├── components/
│   ├── ui/                         # Design system — componentes base
│   │   ├── Button.tsx              # variantes: default, primary, danger, icon
│   │   ├── Input.tsx               # input, textarea, select con estilos glass
│   │   ├── Badge.tsx               # con prop tone: gold|green|blue|orange|red|gray|yellow|purple|teal
│   │   ├── Card.tsx                # con prop clickable
│   │   ├── Modal.tsx               # sin botón X, cierra con ESC y click overlay
│   │   ├── Toast.tsx               # conectado a uiStore
│   │   ├── Spinner.tsx             # anillo dorado giratorio
│   │   ├── EmptyState.tsx
│   │   ├── PageHeader.tsx          # título + slot actions
│   │   ├── StatCard.tsx            # KPI con valor grande en font-serif dorado
│   │   └── Table.tsx               # con estilos glass y hover
│   │
│   ├── layout/
│   │   ├── AppShell.tsx            # Sidebar + MobileHeader + <main>
│   │   ├── Sidebar.tsx             # nav antracita glass, secciones, user footer
│   │   ├── MobileHeader.tsx        # header glass mobile con hamburguesa
│   │   └── ProtectedRoute.tsx      # redirige a /login sin sesión
│   │
│   ├── designer/                   # Módulo Diseñador IA
│   │   ├── DesignerPage.tsx
│   │   ├── DesignerTabs.tsx        # chat | proyectos | renders | planos | historial
│   │   ├── ChatPanel.tsx
│   │   ├── ChatMessage.tsx         # burbujas user/agente/sistema con avatares
│   │   ├── ChatComposer.tsx        # input + foto + voz + enviar
│   │   ├── VoiceRecorder.tsx
│   │   ├── AttachmentBar.tsx
│   │   ├── InlineRenderCard.tsx    # tarjeta confirmación + CTAs dentro del chat
│   │   ├── ProjectList.tsx
│   │   ├── RenderGallery.tsx
│   │   ├── RenderDetailModal.tsx
│   │   ├── PlanList.tsx
│   │   ├── ChatHistory.tsx
│   │   └── DesignerSummary.tsx
│   │
│   ├── budgets/                    # Módulo Presupuestos
│   │   ├── BudgetsPage.tsx
│   │   ├── BudgetList.tsx
│   │   ├── BudgetEditor.tsx        # tabs: resumen | ítems | mano de obra | config | chat IA
│   │   ├── BudgetItemsTab.tsx
│   │   ├── BudgetLaborTab.tsx
│   │   ├── BudgetOtherCostsTab.tsx
│   │   ├── BudgetConfigTab.tsx
│   │   ├── BudgetChatTab.tsx
│   │   ├── BudgetSummaryTab.tsx
│   │   ├── BudgetLineItem.tsx
│   │   ├── BudgetMaterialPicker.tsx
│   │   ├── BudgetStatusBadge.tsx
│   │   └── BudgetPdfExport.tsx
│   │
│   └── shared/
│       ├── MaterialSelector.tsx
│       ├── ClientSelector.tsx
│       ├── ObraSelector.tsx
│       └── FileUploader.tsx
│
├── pages/
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   └── NotFoundPage.tsx
│
└── types/
    ├── database.ts                 # tipos manuales del schema (ver §7 del plan) — NO autogenerados
    ├── designer.ts                 # ChatMessage, RenderHandoff, SessionMeta, etc.
    └── budget.ts                   # BudgetLine, BudgetTotals, CosteoConfig, etc.
```

---

## 7. Schema de Base de Datos

> El backend Supabase **ya existe y no se modifica**. Este schema es referencia de solo lectura para construir el cliente tipado (`src/types/database.ts`) y las funciones de API en `src/lib/api/`.
>
> **Tablas base preexistentes** (sin migraciones en el repo, presentes en producción):
> `obras`, `modulos`, `clientes`, `materiales`, `presupuestos`, `lineas_presupuesto`, `stock_ubicaciones`, `usuarios`, `organizaciones`

---

### 7.1 Tablas del módulo Diseñador IA

#### `verko_design_sessions`
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| id | `string` | UUID PK |
| user_id | `string \| null` | → auth.users |
| cliente_id | `string \| null` | → clientes |
| obra_id | `string \| null` | → obras |
| descripcion_inicial | `string \| null` | |
| dxf_path / pdf_path / preview_path | `string \| null` | Storage paths |
| total_usd | `number \| null` | |
| status | `'procesando' \| 'completado' \| 'error'` | |
| error_msg | `string \| null` | |
| warnings_json | `unknown \| null` | JSONB |
| metadata | `Record<string, unknown>` | JSONB |
| completed_at / created_at / updated_at | `string` | ISO timestamptz |
| deleted_at | `string \| null` | Soft delete |

#### `verko_design_conversations`
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| id | `string` | UUID PK |
| session_id | `string \| null` | → verko_design_sessions (CASCADE) |
| thread_id | `string \| null` | UUID lógico del hilo |
| user_id | `string \| null` | |
| rol | `'user' \| 'agent' \| 'system'` | |
| canal | `'web' \| 'whatsapp' \| 'api'` | |
| intent | `string \| null` | |
| texto | `string \| null` | |
| transcripcion | `string \| null` | |
| vision_json | `unknown \| null` | JSONB |
| tokens_in / tokens_out / latency_ms | `number \| null` | |
| created_at | `string` | |

#### `verko_design_attachments`
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| id | `string` | UUID PK |
| session_id / thread_id / user_id | `string \| null` | |
| tipo | `'dxf' \| 'pdf' \| 'png' \| 'json' \| 'other' \| 'foto_espacio' \| 'nota_voz' \| 'vision_json'` | |
| storage_path | `string` | |
| mime / mime_type | `string \| null` | |
| file_size_kb | `number \| null` | |
| metadata | `Record<string, unknown>` | JSONB |
| created_at | `string` | |

#### `verko_vision_analyses`
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| id | `string` | UUID PK |
| thread_id / session_id / user_id | `string \| null` | |
| photo_path | `string \| null` | |
| tipo_espacio | `string \| null` | |
| ancho_mm / alto_mm / profundidad_mm | `number \| null` | |
| confianza | `number \| null` | NUMERIC(3,2) |
| metodo | `string \| null` | |
| obstaculos_json / advertencias_json / sugerencia_json / raw_json | `unknown \| null` | JSONB |
| created_at | `string` | |

#### `verko_whatsapp_users`
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| phone | `string` | PK |
| user_id | `string` | |
| thread_id | `string \| null` | |
| contact_name | `string \| null` | |
| cliente_id | `string \| null` | |
| status | `'pending_link' \| 'active' \| 'blocked'` | |
| quiero_audio_respuesta | `boolean` | |
| ultimo_mensaje_at | `string \| null` | |
| created_at / updated_at | `string` | |

---

### 7.2 Tablas del módulo Renders

#### `renders`
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| id | `string` | UUID PK |
| obra_id | `string` | → obras (CASCADE) |
| modulo_id | `string \| null` | → modulos |
| template_id | `string \| null` | → render_templates |
| modelo_codigo | `string` | |
| ambiente | `string` | default 'general' |
| prompt_usuario | `string` | |
| prompt_final | `string \| null` | |
| lora_scale | `number` | NUMERIC(4,2) |
| estado | `'en_cola' \| 'procesando' \| 'completado' \| 'fallido' \| 'cancelado'` | |
| metadata | `Record<string, unknown>` | |
| resultado_url | `string \| null` | |
| fal_request_id | `string \| null` | |
| seed_usado | `number \| null` | BIGINT |
| costo_usd | `number \| null` | |
| progreso_steps | `number` | |
| aprobado | `boolean` | |
| aprobado_por / created_by | `string \| null` | → auth.users |
| aprobado_at / notas_aprobacion / completado_at | `string \| null` | |
| created_at / updated_at | `string` | |
| deleted_at | `string \| null` | Soft delete |

#### `render_templates`
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| id | `string` | UUID PK |
| codigo | `string` | UNIQUE |
| nombre | `string` | |
| descripcion / prompt_base | `string \| null` | |
| activo | `boolean` | |
| prioridad | `number` | |
| created_at / updated_at | `string` | |

#### `render_modelos`
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| id | `string` | UUID PK |
| codigo | `string` | UNIQUE |
| nombre | `string` | |
| proveedor / descripcion | `string \| null` | |
| activo | `boolean` | |
| metadata | `Record<string, unknown>` | incluye endpoints, lora_version, trigger_word, etc. |
| created_at / updated_at | `string` | |

**Vista disponible:** `v_renders_verko` — JOIN de renders + obras + modulos + render_templates + render_modelos.

---

### 7.3 Tablas del módulo Presupuestos

#### `presupuestos` (columnas extendidas por migraciones — tabla base preexistente)
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| thread_id | `string \| null` | UUID hilo IA |
| resumen_ia | `string \| null` | |
| brief_json | `Record<string, unknown>` | JSONB |
| total_materiales / total_herrajes / total_extras / total_ajustes | `number` | |
| total_piezas | `number` | integer |
| tc_manual | `number \| null` | tipo de cambio override |
| ultima_revision_ia_at | `string \| null` | |
| metadata | `Record<string, unknown>` | |
| cliente_id | `string \| null` | → clientes |
| obra_id | `string \| null` | → obras (nullable) |
| costeo_config | `CosteoConfig` | JSONB con margen_pct, iva_pct, etc. |
| total_mano_obra / total_otros / total_indirectos | `number` | |
| total_costo_directo / total_costo | `number` | |
| subtotal_con_margen / total_iva / total_descuento / total_final | `number` | |
| ganancia_neta | `number` | |
| margen_real_pct | `number` | NUMERIC(8,4) |

#### `lineas_presupuesto` (columnas extendidas)
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| tipo_linea | `'mueble' \| 'pieza' \| 'herraje' \| 'extra' \| 'ajuste' \| 'servicio' \| 'observacion'` | |
| parent_linea_id | `string \| null` | → self (CASCADE) |
| material_id | `string \| null` | → materiales |
| material_nombre / codigo_interno | `string \| null` | |
| material_snapshot | `Record<string, unknown>` | |
| ancho_mm / alto_mm / profundidad_mm / espesor_mm | `number \| null` | NUMERIC |
| desperdicio_pct | `number` | default 12 |
| origen_ia | `boolean` | |
| metadata | `Record<string, unknown>` | |
| margen_pct_override | `number \| null` | |
| horas_mano_obra / costo_mano_obra / costo_otros | `number` | |
| complejidad | `number` | NUMERIC(4,2), default 1.0 |

#### `presupuesto_piezas`
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| id | `string` | UUID PK |
| presupuesto_id | `string` | → presupuestos (CASCADE) |
| linea_presupuesto_id | `string \| null` | |
| user_id | `string \| null` | |
| mueble_key / modulo_key / codigo | `string \| null` | |
| nombre | `string` | |
| pieza_tipo | `'estructura' \| 'frente' \| 'fondo' \| 'estante' \| 'mesada' \| 'canto' \| 'herraje' \| 'extra' \| 'ajuste' \| 'otro'` | |
| material_id | `string \| null` | |
| material_nombre | `string \| null` | |
| material_snapshot | `Record<string, unknown>` | |
| unidad_calculo | `'pieza' \| 'm2' \| 'metro' \| 'unidad' \| 'par' \| 'kit' \| 'placa' \| 'kg' \| 'litro' \| 'rollo' \| 'caja'` | |
| cantidad | `number` | |
| ancho_mm / alto_mm / profundidad_mm / espesor_mm / largo_lineal_mm | `number \| null` | |
| area_m2 / consumo_unidades | `number \| null` | |
| desperdicio_pct | `number` | |
| precio_unitario / subtotal | `number` | |
| orden | `number` | |
| editable | `boolean` | |
| metadata | `Record<string, unknown>` | |
| created_at / updated_at | `string` | |

#### `presupuesto_mano_obra`
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| id | `string` | UUID PK |
| presupuesto_id | `string` | → presupuestos (CASCADE) |
| linea_presupuesto_id | `string \| null` | |
| tarifa_id | `string \| null` | → tarifas_mano_obra |
| user_id | `string \| null` | |
| actividad | `string` | |
| categoria | `'cortado' \| 'canteado' \| 'perforado' \| 'armado' \| 'lijado' \| 'pintura' \| 'lustre' \| 'instalacion' \| 'transporte' \| 'medicion' \| 'diseno' \| 'general'` | |
| minutos / tarifa_hora | `number` | |
| moneda | `'ARS' \| 'USD' \| 'EUR' \| 'BRL' \| 'CLP'` | |
| subtotal | `number` | |
| origen | `'manual' \| 'tipologia' \| 'ia' \| 'preset'` | |
| notas | `string \| null` | |
| orden | `number` | |
| metadata | `Record<string, unknown>` | |
| created_at / updated_at | `string` | |

#### `presupuesto_otros_costos`
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| id | `string` | UUID PK |
| presupuesto_id | `string` | |
| linea_presupuesto_id | `string \| null` | |
| user_id | `string \| null` | |
| concepto | `string` | |
| categoria | `'flete' \| 'embalaje' \| 'instalacion' \| 'medicion' \| 'diseno' \| 'comision' \| 'garantia' \| 'permisos' \| 'subcontrato' \| 'otros'` | |
| cantidad / costo_unitario / subtotal | `number` | |
| moneda | `string` | |
| notas | `string \| null` | |
| orden | `number` | |
| metadata | `Record<string, unknown>` | |
| created_at / updated_at | `string` | |

#### `presupuesto_conversaciones`
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| id | `string` | UUID PK |
| presupuesto_id | `string` | → presupuestos (CASCADE) |
| thread_id | `string \| null` | |
| user_id | `string \| null` | |
| rol | `'user' \| 'agent' \| 'system'` | |
| canal | `'web' \| 'whatsapp' \| 'api'` | |
| texto / transcripcion | `string \| null` | |
| attachments_json | `unknown[]` | JSONB array |
| structured_json | `Record<string, unknown>` | |
| modelo | `string \| null` | |
| latency_ms / tokens_in / tokens_out | `number \| null` | |
| created_at | `string` | |

#### `costeo_config_global`
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| id | `string` | UUID PK, UNIQUE(user_id) |
| user_id | `string \| null` | |
| margen_pct / descuento_pct / iva_pct | `number` | defaults: 35 / 0 / 21 |
| retencion_iva_pct / indirectos_pct | `number` | defaults: 0 / 12 |
| tarifa_horaria | `number` | default 8000 ARS |
| tarifa_moneda / moneda_default | `string` | |
| redondeo | `number` | default 100 |
| validez_dias / plazo_entrega_dias | `number` | defaults: 10 / 30 |
| forma_pago | `string` | |
| incluye_diseno / incluye_instalacion / incluye_transporte | `boolean` | |
| empresa_nombre / empresa_razon_social / empresa_cuit | `string \| null` | |
| empresa_direccion / empresa_telefono / empresa_email / empresa_web | `string \| null` | |
| empresa_logo_url / empresa_iva_condicion | `string \| null` | |
| texto_legal / observaciones_pdf | `string \| null` | |
| extras | `Record<string, unknown>` | |
| created_at / updated_at | `string` | |

#### `tarifas_mano_obra`
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| id | `string` | UUID PK |
| user_id | `string \| null` | |
| actividad | `string` | |
| categoria | `string` | ver enum de presupuesto_mano_obra.categoria |
| tarifa_hora | `number` | |
| moneda | `string` | |
| tipo_mueble | `string \| null` | |
| minutos_default | `number` | default 60 |
| descripcion | `string \| null` | |
| activo | `boolean` | |
| vigencia_desde | `string` | DATE |
| vigencia_hasta | `string \| null` | |
| metadata | `Record<string, unknown>` | |
| created_at / updated_at | `string` | |

---

### 7.4 Tablas de Ingeniería / Despiece

#### `tipologias_3d`
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| id | `string` | UUID PK |
| codigo | `string` | UNIQUE |
| nombre / categoria | `string` | |
| geometria_parametrica / formula_despiece / formula_isometrico | `Record<string, unknown>` | JSONB |
| variantes_disponibles | `unknown[]` | JSONB array |
| herrajes_default | `Record<string, unknown>` | |
| activo | `boolean` | |
| svg_url / svg_storage_path / svg_hash | `string \| null` | |
| svg_status | `'pendiente' \| 'generado' \| 'error' \| 'obsoleto'` | |
| svg_generado_at / svg_error | `string \| null` | |
| created_at | `string` | |

#### `proyectos_despiece`
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| id | `string` | UUID PK |
| nombre | `string` | |
| color_material_global / observaciones_globales | `string \| null` | |
| estado | `string \| null` | default 'borrador' |
| cliente_id | `string \| null` | → clientes |
| pdf_status | `'pendiente' \| 'generado' \| 'desactualizado' \| 'error'` | |
| pdf_url / pdf_storage_path | `string \| null` | |
| pdf_generado_at | `string \| null` | |
| plano_url / plano_filename | `string \| null` | |
| plano_tipo | `'dwg' \| 'dxf' \| 'pdf' \| 'jpg' \| 'jpeg' \| 'png' \| null` | |
| organizacion_id | `string \| null` | |
| origen | `string \| null` | |
| generacion_diseno_id | `string \| null` | → generaciones_diseno |
| observaciones_cliente / observaciones_tecnicas | `string \| null` | |
| ajustes_realizados / alertas_tecnicas | `unknown \| null` | JSONB |
| created_at / updated_at | `string` | |

#### `instancias_modulo`
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| id | `string` | UUID PK |
| proyecto_id | `string \| null` | → proyectos_despiece (CASCADE) |
| tipologia_id | `string \| null` | → tipologias_3d |
| codigo_modulo | `string` | |
| ancho_mm / profundidad_mm / alto_mm | `number` | INTEGER |
| cantidad | `number` | default 1 |
| variantes_seleccionadas / herrajes_override / configuracion_interna / herrajes | `Record<string, unknown>` | JSONB |
| observaciones | `string \| null` | |
| orden_en_proyecto | `number \| null` | |
| despiece_status / svg_status / plan_corte_status / plano_mueble_status | `'pendiente' \| 'generado' \| 'desactualizado' \| 'error' \| null` | |
| svg_url / svg_storage_path / svg_hash | `string \| null` | |
| tipologia / material_principal / origen | `string \| null` | |
| espesor_lateral_mm / espesor_piso_mm / espesor_techo_mm / espesor_fondo_mm / espesor_frente_mm | `number` | defaults: 18/18/18/12/18 |
| generacion_diseno_id | `string \| null` | → generaciones_diseno |
| imagen_referencia_url | `string \| null` | |
| despiece_bom / despiece_hardware / despiece_warnings | `unknown \| null` | JSONB |
| created_at | `string` | |

#### `piezas_despiece`
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| id | `string` | UUID PK |
| instancia_id | `string \| null` | → instancias_modulo (CASCADE) |
| codigo_pieza_global | `number \| null` | INTEGER |
| descripcion / material | `string` | |
| espesor_mm | `number` | DECIMAL(5,2) |
| ancho_mm / largo_mm / cantidad | `number` | |
| canto_aplicado | `unknown[]` | JSONB array |
| observaciones | `string \| null` | |

#### `despiece_revisiones`
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| id | `string` | UUID PK |
| obra_id | `string \| null` | → obras (CASCADE) |
| modulo_id | `string \| null` | → modulos (SET NULL) |
| tipo_modulo | `string` | |
| config / piezas_snapshot | `Record<string, unknown>` | JSONB |
| estado | `'borrador' \| 'en_revision' \| 'aprobado_parcial' \| 'aprobado' \| 'rechazado'` | enum |
| total_piezas / piezas_aprobadas / piezas_observadas / piezas_rechazadas | `number` | |
| porcentaje_aprobacion | `number \| null` | GENERATED STORED |
| enviado_por / revisado_por / aprobado_por | `string \| null` | → auth.users |
| enviado_at / revision_iniciada_at / completado_at | `string \| null` | |
| notas_revision / notas_aprobacion | `string \| null` | |
| created_at / updated_at | `string` | |

---

### 7.5 Tablas de Diseño IA avanzado / Tokens

#### `generaciones_diseno`
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| id | `string` | UUID PK |
| user_id / cliente_id | `string \| null` | |
| organizacion_id | `string` | required |
| proyecto_despiece_id | `string \| null` | → proyectos_despiece |
| foto_ambiente_url | `string` | |
| foto_ambiente_storage_path / foto_ambiente_hash | `string \| null` | |
| prompt_usuario_original | `string` | |
| prompt_enriquecido_verko | `string` | |
| parametros_estructurados | `Record<string, unknown> \| null` | JSONB |
| tipologia_inferida / material_inferido / estilo_inferido | `string \| null` | |
| dimensiones_inferidas / confianza_inferencia / preguntas_aclaracion | `unknown \| null` | JSONB |
| cantidad_puertas_inferida / cantidad_cajones_inferida / cantidad_estantes_inferida | `number \| null` | |
| mueble_aislado_url / montaje_final_url | `string \| null` | |
| mueble_aislado_costo_usd / montaje_final_costo_usd | `number \| null` | |
| status | `string` | 15 estados posibles (ver SQL) |
| error_mensaje / error_paso | `string \| null` | |
| tokens_consumidos | `number` | default 1 |
| tipo_iteracion | `'inicial' \| 'edicion_conversacional' \| 'regeneracion_completa'` | |
| numero_iteracion | `number` | |
| generacion_padre_id / generacion_raiz_id | `string \| null` | → self |
| aprobado_por_cliente_at / aprobado_por_carpintero_at | `string \| null` | |
| modulo_generado_id | `string \| null` | → instancias_modulo |
| proyecto_creado_id | `string \| null` | → proyectos_despiece |
| created_at / updated_at / completed_at | `string \| null` | |

#### `tokens_organizacion`
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| id | `string` | UUID PK |
| organizacion_id | `string` | UNIQUE |
| tokens_disponibles | `number` | CHECK >= 0 |
| tokens_consumidos_total | `number` | |
| tokens_incluidos_setup | `number` | default 100 |
| tokens_comprados_total / tokens_reembolsados_total | `number` | |
| ultima_recarga_at / ultimo_consumo_at | `string \| null` | |
| ultima_recarga_monto_usd | `number \| null` | |
| alerta_saldo_bajo_enviada | `boolean` | |
| umbral_alerta_saldo_bajo | `number` | default 5 |
| created_at / updated_at | `string` | |

---

### 7.6 Tablas de planos DXF / Corte

#### `dxf_analisis`
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| id | `string` | UUID PK |
| obra_id | `string \| null` | → obras |
| file_url | `string` | |
| entities_count | `number \| null` | |
| layers | `string[]` | TEXT[] |
| bounding_box / interpretation | `Record<string, unknown>` | JSONB |
| svg_preview | `string \| null` | |
| created_by | `string \| null` | → auth.users |
| created_at / updated_at | `string` | |

#### `planes_corte`
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| id | `string` | UUID PK |
| obra_id / material_id / operador_id / created_by | `string \| null` | |
| placa_ancho_mm / placa_largo_mm | `number` | INTEGER |
| espesor_mm / ancho_sierra_mm / margen_borde_mm | `number` | NUMERIC |
| total_piezas | `number` | |
| area_placa_mm2 / area_piezas_mm2 / area_desperdicio_mm2 | `number` | BIGINT |
| aprovechamiento_pct | `number` | |
| estado | `'calculado' \| 'aprobado' \| 'cortado' \| 'anulado'` | |
| metadata | `Record<string, unknown>` | |
| cortado_at | `string \| null` | |
| created_at / updated_at | `string` | |

#### `retazos`
| Columna | Tipo TS | Notas |
|---------|---------|-------|
| id | `string` | UUID PK |
| plan_id / material_id / stock_ubicacion_id / created_by | `string \| null` | |
| nombre | `string \| null` | |
| ancho_mm / largo_mm | `number` | INTEGER |
| area_mm2 | `number` | BIGINT (calculado) |
| espesor_mm | `number` | |
| estado | `'disponible' \| 'reservado' \| 'descartado' \| 'consumido'` | |
| metadata | `Record<string, unknown>` | |
| reservado_at / created_at / updated_at | `string \| null` | |
| deleted_at | `string \| null` | Soft delete |

---

### 7.7 Vistas, RPCs y Buckets de Storage

#### Vistas disponibles
| Vista | Descripción |
|-------|-------------|
| `v_renders_verko` | JOIN de renders + obras + modulos + render_templates + render_modelos |
| `v_verko_thread_timeline` | JOIN de verko_design_conversations + verko_design_sessions por thread_id |

#### RPCs relevantes para el frontend
```ts
// Aprobar un render
supabase.rpc('fn_render_aprobar', { p_render_id: string, p_notas: string })

// Ejecutar motor paramétrico y persistir piezas
supabase.rpc('disparar_motor_parametrico', { p_instancia_id: string })

// Consumir / reembolsar un token de diseño IA
supabase.rpc('consumir_token', { p_organizacion_id, p_generacion_id, p_edicion_id, p_tipo })
supabase.rpc('reembolsar_token', { p_organizacion_id, p_generacion_id, p_edicion_id, p_tipo })

// Generar retazos a partir de un plan de corte
supabase.rpc('fn_generar_retazos', { p_plan_id: string })

// Generar despiece completo (retorna JSONB con piezas + herrajes)
supabase.rpc('generar_despiece_completo_verko', { params: Record<string, unknown> })
```

#### Buckets de Storage
| Bucket | Público | Uso |
|--------|---------|-----|
| `obras` | ✅ Sí | DXF, PDF, PNG, planos — máx 100 MB |
| `verko-design-ai` | ❌ No | Fotos ambiente, notas de voz, renders — máx 25 MB |

**Paths de Storage:**
- Fotos ambiente/adjuntos IA: `verko-design-ai/{organizacion_id}/...`
- Archivos de obra (planos, DXF): `obras/{obra_id}/...`

---

### 7.8 Enums / Tipos custom PostgreSQL

```ts
// En src/types/database.ts — definir como union types TS

type DespieceReviewStatus = 'borrador' | 'en_revision' | 'aprobado_parcial' | 'aprobado' | 'rechazado'
type PiezaReviewStatus = 'pendiente' | 'aprobada' | 'observada' | 'rechazada' | 'corregida'

// Los demás "estados" son CHECK constraints en SQL — implementar como union types TS también:
type RenderEstado = 'en_cola' | 'procesando' | 'completado' | 'fallido' | 'cancelado'
type RetazoEstado = 'disponible' | 'reservado' | 'descartado' | 'consumido'
type PlanCorteEstado = 'calculado' | 'aprobado' | 'cortado' | 'anulado'
type SvgStatus = 'pendiente' | 'generado' | 'desactualizado' | 'error'
type TipoLineaPresupuesto = 'mueble' | 'pieza' | 'herraje' | 'extra' | 'ajuste' | 'servicio' | 'observacion'
type TipoIteracion = 'inicial' | 'edicion_conversacional' | 'regeneracion_completa'
```

---

### 7.9 Notas críticas para el frontend

1. **No hay `database.ts` generado en el repo original.** Hay que crear `src/types/database.ts` manualmente usando este schema como referencia. Usar los tipos TS de las tablas 7.1–7.6.

2. **Soft deletes:** `renders`, `retazos`, `verko_design_sessions` usan `deleted_at`. Siempre filtrar con `.is('deleted_at', null)` en las queries de listado.

3. **`planes_corte` tiene dos definiciones de migración.** En producción remota prevalece la estructura de migración 003 (ver columnas en sección 7.6). Si se necesita acceder a `instancia_id` o `layout_json`, validar contra la instancia real.

4. **Las tablas base (`obras`, `clientes`, `materiales`, etc.) no están documentadas en migraciones.** Inferir su estructura desde los foreign keys y el uso existente en el código. Usar `unknown` para campos no documentados y tipar progresivamente.

5. **RLS owner-based:** las tablas `verko_design_sessions`, `presupuesto_conversaciones`, `costeo_config_global`, etc. filtran por `user_id = auth.uid()`. El cliente Supabase con sesión activa las filtra automáticamente — no hace falta pasar `user_id` manualmente en las queries.

6. **`costeo_config` en `presupuestos`** es un JSONB que replica la estructura de `costeo_config_global` en el momento de creación del presupuesto. Definir tipo `CosteoConfig` en `src/types/budget.ts`.

---

## 8. Contratos de Edge Functions
<!-- Sección renumerada — era §7 -->

| Edge Function | Input | Output |
|--------------|-------|--------|
| `disenador-chat` | `{ thread_id, user_message, photo_b64?, audio_b64?, plan_b64? }` | `{ response_text, session_id?, handoff? }` |
| `render-contextual` | `{ thread_id, session_id, brief_snapshot, session_meta, render_mode, photo_b64? }` | `{ render_id, status, preview_url? }` |
| `render-engine` | `{ prompt, lora_url, negative_prompt }` | `{ id, status, result_url? }` |
| `presupuesto-assistant` | `{ thread_id, user_message, presupuesto_id? }` | `{ response_text, structured_lines? }` |
| `enhance-prompt` | `{ prompt, style, materials }` | `{ enhanced_prompt }` |
| `transcribir-audio-prompt` | `{ audio_b64 }` | `{ transcript }` |
| `compilar-pdf-proyecto` | `{ session_id, template }` | `{ pdf_url }` |

Todas se invocan con el cliente tipado:
```ts
const { data, error } = await supabase.functions.invoke<TOutput>('nombre-funcion', { body: payload });
if (error) throw new Error(error.message);
return data;
```

---

## 9. Reglas de negocio que no cambian

**Pipeline de obras:** `lead → crm_activo → presupuestada → aprobada → ingenieria → produccion → entregada`

**Estaciones de producción:** `corte → canteado → mecanizado → armado → pintura → qc → embalaje → colocacion`

**Mapeo estados → badge color:**
```
borrador / anteproyecto / presupuesto        → blue
aprobado / entregado                         → green
en_produccion / corte / canteado / mecanizado
  / armado / pintura_acabado                 → orange
control_calidad / embalaje                   → yellow
listo_colocacion / en_colocacion             → purple
garantia                                     → teal
```

**Motor de presupuestos:** la lógica de `presupuesto-engine.js` se transpila a TypeScript en `useBudgetEditor.ts` sin modificar ninguna fórmula de cálculo.

**Formato numérico:** `1.250,00` — punto para miles, coma para decimales.

---

## 10. Patrones de código de referencia

### Async state pattern

```tsx
type AsyncState<T> =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'empty' }
  | { status: 'success'; data: T };

export default function BudgetList() {
  const [state, setState] = useState<AsyncState<Budget[]>>({ status: 'loading' });

  useEffect(() => {
    getBudgets()
      .then(data =>
        setState(data.length ? { status: 'success', data } : { status: 'empty' })
      )
      .catch(err => {
        setState({ status: 'error', error: 'No se pudieron cargar los presupuestos.' });
        console.error('[BudgetList]', err);
      });
  }, []);

  if (state.status === 'loading') return <Spinner />;
  if (state.status === 'error')   return <EmptyState message={state.error} />;
  if (state.status === 'empty')   return <EmptyState message="Todavía no hay presupuestos." />;
  return <Table rows={state.data} />;
}
```

### Zustand store

```ts
// src/stores/authStore.ts
import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  role: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  init: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message);
    set({ user: data.user });
  },
  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null, role: null });
  },
  init: async () => {
    const { data } = await supabase.auth.getSession();
    set({ user: data.session?.user ?? null });
  },
}));
```

### Router con lazy routes

```tsx
// src/App.tsx
import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Spinner from '@/components/ui/Spinner';
import ProtectedRoute from '@/components/layout/ProtectedRoute';
import AppShell from '@/components/layout/AppShell';

const LoginPage     = lazy(() => import('@/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const DesignerPage  = lazy(() => import('@/components/designer/DesignerPage'));
const BudgetsPage   = lazy(() => import('@/components/budgets/BudgetsPage'));

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Suspense fallback={<Spinner />}><LoginPage /></Suspense>,
  },
  {
    element: <ProtectedRoute><AppShell /></ProtectedRoute>,
    children: [
      { path: '/dashboard', element: <Suspense fallback={<Spinner />}><DashboardPage /></Suspense> },
      { path: '/designer',  element: <Suspense fallback={<Spinner />}><DesignerPage /></Suspense> },
      { path: '/budgets',   element: <Suspense fallback={<Spinner />}><BudgetsPage /></Suspense> },
      { path: '/',          element: <Suspense fallback={<Spinner />}><DashboardPage /></Suspense> },
    ],
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
```

---

## 11. Fases de desarrollo

### Fase 1.1 — Setup (Día 1)
```bash
npm create vite@latest verko-v2 -- --template react-ts
npm install tailwindcss@3 autoprefixer postcss
npm install zustand react-router-dom @supabase/supabase-js
npm install react-hook-form zod @hookform/resolvers
npm install lucide-react
npm install -D @types/react @types/react-dom vitest @testing-library/react
```
- Configurar `tailwind.config.ts` con el design system completo (ver sección 4)
- Configurar `globals.css` con fuentes y base styles
- Crear cliente Supabase tipado en `src/lib/supabase.ts`
- Verificar tokens `verko-*` en un componente de prueba

### Fase 1.2 — Auth + Ruteo (Día 1–2)
- `authStore` con login, logout, init, rol
- `LoginPage` con estética glass (input con focus dorado, fondo oscuro)
- `ProtectedRoute` con redirect a `/login`
- `createBrowserRouter` con rutas lazy
- `AppShell` con `Sidebar` + `MobileHeader` + `<main>`

### Fase 1.3 — UI Base (Día 2–3)
En orden de dependencia:
1. `Button` (default, primary, danger, icon)
2. `Input` + `Textarea` + `Select`
3. `Badge` (con todas las variantes de tone)
4. `Card` (con variante clickable y shine)
5. `Modal` (sin botón X, con ESC y click overlay)
6. `Toast` (conectado a uiStore)
7. `Spinner` + `EmptyState`
8. `PageHeader` + `StatCard` + `Table`

### Fase 1.4 — Chat Diseñador IA (Día 3–6)
- `useDesignChat`: thread_id, messages[], sending, sendTurn(), attachments[]
- `ChatPanel` → `ChatMessage` (burbujas con avatares) → `ChatComposer`
- `VoiceRecorder` con MediaRecorder + transcripción via edge function
- `AttachmentBar` para fotos/planos/audio pendientes
- `InlineRenderCard` con CTAs: "Generar render", "Ver galería"
- Typing dots durante respuesta del agente

### Fase 1.5 — Generador de Renders (Día 6–9)
- `useRenderStudio`: polling de status, construcción de prompt contextual
- Flujo: chat → foto detectada → `render-contextual` → polling → mostrar
- `RenderGallery` con filtros (todos / aprobados / fotomontajes / hero)
- `RenderDetailModal` con descarga, compartir, link WhatsApp

### Fase 1.6 — Módulo Presupuestos (Día 9–14)
- `useBudgetEditor`: CRUD líneas, transpile de `presupuesto-engine.js` a TS
- `BudgetList` con búsqueda y filtro por estado
- `BudgetEditor` multitab + `BudgetMaterialPicker` con búsqueda en Supabase
- Exportación PDF via edge function
- Chat asistente IA para presupuestos

### Fase 1.7 — Pulido + Tests (Día 14–16)
- Auditoría visual: cada pantalla contra estética glass premium
- Responsive completo: sidebar mobile con overlay, vistas adaptadas
- `eslint` + `tsc --noEmit` en cero errores
- Tests unitarios para `useBudgetEditor` y `authStore`

---

## 12. Estimación

| Fase | Días | Entregable |
|------|------|-----------|
| 1.1 Setup | 1 | Proyecto corriendo, tokens verificados |
| 1.2 Auth + Ruteo | 1–2 | Login funcional, rutas protegidas |
| 1.3 UI Base | 1–2 | 10 componentes del design system |
| 1.4 Chat Diseñador | 3–4 | Chat con voz, adjuntos, typing dots |
| 1.5 Renders | 3–4 | Render hero + fotomontaje desde chat |
| 1.6 Presupuestos | 5–6 | CRUD completo, motor, PDF, chat IA |
| 1.7 Pulido + Tests | 2–3 | Auditoría visual, responsive, tests |
| **Total** | **16–18 días** | Frontend listo para reemplazar la app actual |