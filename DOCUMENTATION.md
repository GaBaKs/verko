# VERKO v2 - Documentación de Desarrollo

## 1. Resumen y Contexto
VERKO v2 es una aplicación interna para el equipo de VERKO (empresa de mobiliario fijo de alta gama) encargada de gestionar el flujo completo de obras: diseño con IA, presupuestos, producción y entregas.

La aplicación es un **frontend Single Page Application (SPA)** construida utilizando herramientas modernas e interacciones inmersivas. Interactúa con un backend existente en **Supabase** (PostgreSQL + Edge Functions). 

## 2. Stack Tecnológico
- **Framework Front-end:** React 18
- **Construcción y Dev Server:** Vite
- **Lenguaje:** TypeScript 5 (Strict Mode, tipado estricto sin uso de `any`)
- **Estilos:** Tailwind CSS 3 (Configuración extendida a medida, sin `@theme`)
- **Routing:** React Router v6 (`createBrowserRouter`, con carga de rutas `lazy`)
- **Estado Global:** Zustand
- **Formularios y Validación:** React Hook Form + Zod
- **Backend / Authentication:** Supabase JS SDK v2
- **Iconografía:** Lucide React
- **Inteligencia Artificial:** Integración con la API de Gemini (`@google/genai`) para el Diseñador IA

## 3. Arquitectura y Estructura del Proyecto

### Organización de Archivos (`src/`)
- `/components/`: Componentes UI reutilizables divididos lógicamente:
  - `/ui/`: Componentes atómicos visuales (Button, Input, Card, Modal, Spinner, etc.), construidos siguiendo el UI Design System de VERKO.
  - `/layout/`: Estructuradores de la app (AppShell, Sidebar, MobileHeader, ProtectedRoute).
  - `/designer/`: Componentes funcionales del Chat y Diseñador Inteligente (ChatPanel, ChatMessage, ChatComposer, RenderGallery, etc.).
  - `/budgets/`: Estructuras y páginas para gestión y edición de presupuestos.
- `/hooks/`: React Custom Hooks utilizados para lógica compleja de dominio.
  - `useDesignChat.ts`: Control de conversaciones, peticiones streaming a la IA, y retención de historial.
  - Otros: `useBudgetEditor.ts`, `useRenderStudio.ts`, `useVoiceRecording.ts`.
- `/pages/`: Vistas de alto nivel rutables vía React Router (DashboardPage, LoginPage).
- `/lib/`: Módulos de configuración/envoltorios de terceros.
  - `supabase.ts`: Instancia del cliente de Supabase.
  - `gemini.ts`: Configuración e inicialización del SDK `@google/genai`.
- `/stores/`: Archivos para el manejo de estado con Zustand (`authStore.ts`, `uiStore.ts`).
- `/styles/`: Reglamentaciones CSS en root del proyecto (Ej: *Scrollbar custom* introducido en `globals.css`).
- `/types/`: Tipos definidos incluyendo modelos de la base de datos (Interfaces de entidades).

## 4. UI / UX y Sistema de Diseño (Design System)
Toda la interfaz rige sobre el concepto de **Tema Oscuro Premium** (Glassmorphism con bordes traslúcidos blancos e iluminaciones doradas).

### Reglas Visuales y de Diseño
- **Colores Restringidos:** Todos los colores fueron migrados a variables/tokens de Tailwind explícitas en `tailwind.config.ts` (ej: `verko-bg`, `verko-card`, `verko-gold`).
- **Tipografías:** Se respetan tres categorías de uso: `Instrument Serif` para títulos, `Archivo` o `system-ui` general, y `JetBrains Mono` para IDs/Labels técnicos.
- **Scrollbars Adaptativos:** Sustitución de scrollbars genéricos por versiones refinadas en Firefox y Chromium browsers, complementando con la interfaz oscura.
- **Responsive:** Adaptación perfecta al uso en Móvil vs Escritorio. 
   - `Sidebar` como menús tipo "Sheet" deslizante en móviles, y barra fija en desktop.
   - Textareas auto-expandibles resueltas usando contenedores de encogimiento dinámico (`min-w-0` limitando overflows).

## 5. Módulos Desarrollados hasta la Fecha

### 5.1. Autenticación y Seguridad (Supabase)
- **Login (`LoginPage.tsx`)**: Interfaz inmersiva de autenticación mediante e-mail y contraseña para uso del equipo.
- **Persistencia (`authStore.ts`)**: Se implementó la rehidratación proactiva y sincronización nativa de la sesión (`supabase.auth.getSession()` & `onAuthStateChange`).
- **Ruta Protegida (`ProtectedRoute.tsx`)**: Bloquea el render de la API previniendo redirecciones intermitentes al presentar `<Spinner />` durante el estado de inicialización `initializing: true`.

### 5.2. Diseñador IA / Interfaz Chat (`/designer`)
- **Composer y Entradas (`ChatComposer.tsx`)**: 
  - Campo de texto auto-engrandecible configurado en CSS para ajustar a su contenido.
  - Correcciones aplicadas para que encaje uniformemente en pantallas chicas (`mobile < 768px`) previniendo problemas de overflow por placeholders largos y reduciéndolo de forma inteligente.
- **Gestión Historial (`useDesignChat.ts`)**:
  - Incorpora nativamente un saludo/mensaje formal inmutable *(Mensaje de bienvenida "*Hola. Soy el Diseñador IA de VERKO*")* en el front-end que permanece incluso después de interacciones.
  - Filtrado que oculta diálogos estrictamente interfaciales al historial pasadizo hacia el modelo AI (Gemini).
- **Burbujas / Mensajes (`ChatMessage.tsx`)**: Aspecto refinado para roles interactivos: Usuario (Múltiples gradientes acento cobre), IA Agente (Cristal con reborde traslúcido), Sistema (Logos y descripciones).

### 5.3. Layout y Base del Portal
- **Core de la Aplicación (`AppShell.tsx`)**: Componente envoltorio que unifica el control de la estructura (`Sidebar` contra vistas dinámicas de hijos en un entorno de cuadrícula unificada).
- **Mapeo de Rutas y Menú (`Sidebar.tsx`)**: Maneja el estado en base a tokens seleccionados como Inicio, Diseñador Inteligente y Listado de Presupuestos.

## 6. Flujos pendientes a resolver (Próximos pasos recomendados)
- **Manejo de archivos (Adjuntos/Voz)**: Extender la utilidad en `ChatComposer` de subida finalizando el procesamiento y preview de blobs base (Audio a Texto o Imágenes de la obra al modelo Vision).
- **Dashboard / Panel Principal**: Visualizaciones, KPIs y seguimiento o Pipeline de obras.
- **Generación y Gestión de Presupuestos**: Terminar la parte compleja en `/budgets` (Lectura del flujo existente y componentes `BudgetEditor` y `BudgetList`).
- Renders: Integrar servicios de renderizado externos/API para la construcción de la galería generativa en `useRenderStudio.ts`.
