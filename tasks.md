# Tareas VERKO v2

## Fase 1.1 — Setup
- [x] Configurar proyecto, instalar dependencias (Tailwind CSS 3, Zustand, React Router v6, Supabase, etc.)
- [x] Configurar `tailwind.config.ts` (design system)
- [x] Configurar `src/styles/globals.css`
- [x] Crear cliente Supabase tipado en `src/lib/supabase.ts`
- [x] Verificar tokens `verko-*`

## Fase 1.2 — Auth + Ruteo
- [x] Store de autenticación (`useAuthStore`)
- [x] `LoginPage`
- [x] `ProtectedRoute`
- [x] React Router lazy routes
- [x] `AppShell` (Sidebar + MobileHeader + main)

## Fase 1.3 — UI Base
- [x] `Button`
- [x] `Input` + `Textarea` + `Select`
- [x] `Badge`
- [x] `Card`
- [x] `Modal`
- [x] `Toast` (con `uiStore`)
- [x] `Spinner` + `EmptyState`
- [x] `PageHeader` + `StatCard` + `Table`

## Fase 1.4 — Chat Diseñador IA
- [x] Hook `useDesignChat`
- [x] `ChatPanel` + `ChatMessage` + `ChatComposer`
- [x] `VoiceRecorder`
- [x] `AttachmentBar`
- [x] `InlineRenderCard`
- [x] Typing dots

## Fase 1.5 — Generador de Renders
- [x] Hook `useRenderStudio`
- [x] Flujo chat → foto → render contextual (inline)
- [x] `RenderGallery`
- [x] `RenderDetailModal` (Implementado como RenderConfigModal)

## Fase 1.6 — Módulo Presupuestos
- [x] Hook `useBudgetEditor`
- [x] `BudgetList`
- [x] `BudgetEditor` (tabs) y `BudgetMaterialPicker`
- [x] Exportación PDF
- [x] Chat asistente IA

## Fase 1.7 — Pulido + Tests
- [x] Auditoría visual
- [x] Responsive
- [x] Testing y linting
