# Documentación de Arquitectura y Desarrollo - VERKO v2

Esta documentación detalla el estado actual del desarrollo frontend de la aplicación VERKO v2.

## Arquitectura Base
La aplicación está construida utilizando el siguiente stack tecnológico:
- **Framework:** React 18 + Vite
- **Lenguaje:** TypeScript (Strict Mode)
- **Estilos:** Tailwind CSS v3 con colores y tipografías específicas del sistema de diseño (Design System "VERKO").
- **Manejo de Estado Global:** Zustand (Stores separadas por dominio: `auth` y `ui`).
- **Enrutamiento:** React Router v6 usando `createBrowserRouter` y componentización "lazy" (`Suspense`).
- **Backend Services:** Supabase V2 (se encarga del manejo de Auth y Data Fetching).
- **Iconografía:** Lucide React.

## Módulos Desarrollados

### 1. Autenticación (`/login`)
- Implementado el flujo de Login conectado con `Supabase`.
- Persistencia de sesión manejada desde `authStore.ts` y verificada en el componente `ProtectedRoute`.

### 2. Design System & UI Components (`/src/components/ui`)
Se desarrolló una biblioteca de componentes base respetando a rajatabla el estilo premium (tema oscuro, bordes ghost, acentos dorados):
- **Botones:** `Button.tsx`
- **Inputs & Selects:** `Input.tsx`, `Select.tsx`
- **Contenedores:** `Card.tsx`
- **Modales:** `Modal.tsx`
- **Indicadores:** `Spinner.tsx`, `Badge.tsx`
- **Toast Notifications:** Implementados mediante `uiStore.ts`.

### 3. Layout Principal (`/dashboard` & Sidebar)
- El Dashboard actúa como punto de carga tras acceder.
- `AppShell.tsx`: Estructura principal que inyecta la Sidebar.
- `Sidebar.tsx`: Menú de navegación responsive (con drawer modal en mobile) agrupado en secciones (Comercial, Ingeniería, Producción).

### 4. Módulo "Diseñador IA" (`/designer`)
- Integración de chat generativo en vivo interactuando con un agente de IA.
- Interfaz conversacional rica con avatares, control de scroll personalizado, mensajes rehidratados dinámicamente, campo de input expandible (optimizado para desktop y mobile).
- `AssistantChat.tsx`: Componente que mantiene la integridad de la sesión del chat conversacional.

### 5. Módulo "Presupuestos" (`/budgets`)
Se avanzó profundamente en la lógica de estimación, transpilando el motor de costos original dictado en el esquema de la empresa:
- **API & Motor:** `api/budgets.ts` para consultas CRUD y `budgetEngine.ts` que calcula la totalización a través de 11 capas de mermas, impuestos e indirectos.
- **Tipos fuertemente definidos:** Definiciones de piezas, cálculos lineales, placas por M2 en `types/database.ts` y `types/budget.ts`.
- **Listado y Navegación:** Vista de grilla de proyectos en `BudgetsPage` con enlace directo a la vista de detalle conservando el `last_opened` id en el local storage.
- **Formularios de Creación:** Modales para crear proyectos vinculando Prospectos, Clientes y Obras (`BudgetNewModal.tsx`).
- **Editor en Tabbed View:** Componentes modulares inyectados en un layout horizontal (`BudgetEditor.tsx`).
  - *Resumen:* Cuadro comparativo, KPIs y Diagnóstico de Estado (`BudgetDiagnostic.tsx`, `BudgetSummaryTab.tsx`).
  - *Ítems y Piezas:* Grilla expandible para iterar por muebles.
  - *Mano de Obra & Otros Costos:* Tablas financieras de tarifas/hora, fletes e instalación.
  - *Configuraciones & Asistente:* Panel de control impositivo asociado y adjuntos del proyecto.

## Tipos de Usuario, Autenticación y Diferencias
Por el momento (y por definición del sistema original mediante Supabase) existe **un solo marco general de autenticación** conectado mediante Google Auth / SignIn con Email.

**Diferencias:**
- A nivel del **Frontend (React)**: No se han forzado bloqueos drásticos (Role-Based Access Control) dentro del diseño. Todos los usuarios logueados comparten el mismo AppShell, aunque ciertas vistas podrían adaptar información basada en el `user.uid`.
- A nivel del **Backend/Database**: La aplicación asume que Supabase con sus *Row Level Security (RLS)* gestionará las diferencias. 
- Existen conceptos en la BDD del rol de *"Administrador"* pero su desarrollo dentro de las iteraciones de la App aún se concentra en proveer a los **diseñadores / ventas de VERKO** las herramientas nucleares. Cualquier tipo superior está preparado para entrar operando al sistema con todo destrabado.

---
**Próximos pasos recomendados:**
- Revisar "Casos Borde" de presupuestos (ej: Materiales sin precio) 
- Continuar refinando el asistente conversacional para cargar esquemas DXF/PDF al presupuesto.
