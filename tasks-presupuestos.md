# Tareas Desarrollo Módulo Presupuestos

- [x] **Define Types**: Actualizar `src/types/database.ts` o crear `src/types/budget.ts` con todos los tipos descritos (Presupuesto, LineaPresupuesto, PresupuestoPieza, etc.).
- [x] **Budget Engine**: Crear `src/lib/budgetEngine.ts` con fórmulas de costeo, conversión de moneda, totalización en capas, generación de piezas, multiplicadores de complejidad, autogeneración MO y matching de materiales.
- [x] **API de Presupuestos**: Crear/Actualizar `src/lib/api/budgets.ts` con todas las queries de Supabase.
- [x] **Hook useBudgetEditor**: Crear/Actualizar `src/hooks/useBudgetEditor.ts` con la lógica de CRUD y recálculo de totales.
- [x] **Componentes de UI auxiliares**: Crear `BudgetStatusBadge.tsx`.
- [x] **Modales**: Crear `BudgetNewModal.tsx` con soporte para 3 modos (Prospecto, Cliente, Obra).
- [x] **Listado**: Actualizar `BudgetsPage.tsx` y crear/actualizar `BudgetList.tsx` (filtros, persistencia getLastOpened).
- [x] **Layout del Editor**: Crear/Actualizar `BudgetEditor.tsx` y su estructura de Tabs.
- [x] **Tab 1 - Resumen**: Crear `tabs/BudgetSummaryTab.tsx` + Panel Totales. Implementar `BudgetDiagnostic`.
- [x] **Tab 2 - Ítems (Muebles/Líneas)**: Crear `tabs/BudgetItemsTab.tsx`, `BudgetLineItem.tsx`, `BudgetPiecesTable.tsx` y `BudgetMaterialPicker.tsx`.
- [x] **Tab 3 - Mano de obra**: Crear `tabs/BudgetLaborTab.tsx`.
- [x] **Tab 4 - Otros costos**: Crear `tabs/BudgetOtherCostsTab.tsx`.
- [x] **Tab 5 - Configuración**: Crear `tabs/BudgetConfigTab.tsx`.
- [x] **Tab 6 - Chat IA**: Crear `tabs/BudgetChatTab.tsx` (aprovechar/actualizar el actual AssistantChat).
- [x] **Tab 7 - Adjuntos**: Crear `tabs/BudgetAttachmentsTab.tsx`.
- [ ] **Casos borde**: Revisar materiales sin precio, recálculo por tipo de cambio, ajustar subtotales generados, autocreación de obra, versiones.
