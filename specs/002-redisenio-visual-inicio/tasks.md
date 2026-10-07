---
description: "Task list for 002-redisenio-visual-inicio implementation"
---

# Tasks: 002-redisenio-visual-inicio

**Input**: Design documents from `/specs/002-redisenio-visual-inicio/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - only include them if explicitly requested in the feature specification.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project structure per implementation plan in `src/`
- [X] T002 Initialize Preact + Vite project with dependencies
- [X] T003 [P] Configure Vitest and linting/formatting tools

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Define CSS Custom Properties (`--pp-*`) in `src/styles/variables.css` based on data-model.md
- [X] T005 [P] Implement hash-based routing structure in `src/app.jsx` (`#/`, `#/presupuestos`, `#/clientes`, etc.)
- [X] T006 [P] Configure SVG inline icon system in `src/components/comun/iconos.jsx`
- [X] T007 Setup IndexedDB persistence logic in `src/store/db.js`
- [X] T008 Create base layout shell with shared navigation bar in `src/components/comun/Layout.jsx`

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Inicio (Dashboard) y Navegación Compartida Persistente (Priority: P1) 🎯 MVP

**Goal**: Dashboard with metrics, quick actions, and recent budgets, plus persistent navigation.

**Independent Test**: Load `#/` to see dashboard with metrics and recent items; click navigation links without page reload.

### Implementation for User Story 1

- [X] T009 [P] [US1] Create `ResumenMetricas` component in `src/components/inicio/ResumenMetricas.jsx`
- [X] T010 [P] [US1] Create `AccesosRapidos` component in `src/components/inicio/AccesosRapidos.jsx` (ensuring 44x44px touch targets)
- [X] T011 [P] [US1] Create `ListadoRecientes` component in `src/components/inicio/ListadoRecientes.jsx`
- [X] T012 [US1] Assemble `Inicio` view in `src/pages/Inicio.jsx` using the new components

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Editor de Presupuestos en Dos Columnas con Visor PDF en Tiempo Real (Priority: P1)

**Goal**: Split-screen budget editor with live PDF preview for desktop, tabbed for mobile.

**Independent Test**: Navigate to `#/presupuestos/nuevo` on desktop to see the two-column layout; modifying form updates PDF instantly.

### Implementation for User Story 2

- [X] T013 [P] [US2] Implement `FormularioDatos`, `LineasArticulos`, `DesgloseFiscal` in `src/components/presupuestos/`
- [X] T014 [P] [US2] Implement `VisorPdfLive` component in `src/components/presupuestos/VisorPdfLive.jsx`
- [X] T015 [US2] Create responsive two-column layout in `src/pages/EditorPresupuesto.jsx`
- [X] T016 [US2] Wire state updates between form fields and live PDF preview using `pdfmake` logic

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 3 - Listado de Presupuestos Optimizado con Acciones Rápidas y Exportación (Priority: P2)

**Goal**: Enhanced budget list with state filters, ZIP export, and mobile cards.

**Independent Test**: Navigate to `#/presupuestos`, filter by status, export ZIP, and resize window to see cards.

### Implementation for User Story 3

- [X] T017 [P] [US3] Create `CabeceraAcciones` with export button in `src/components/presupuestos/CabeceraAcciones.jsx`
- [X] T018 [P] [US3] Create semantic state badges in `src/components/comun/BadgeEstado.jsx`
- [X] T019 [P] [US3] Implement `FiltroEstados` component in `src/components/presupuestos/FiltroEstados.jsx`
- [X] T020 [US3] Create `TablaPresupuestos` component (responsive cards) in `src/components/presupuestos/TablaPresupuestos.jsx`
- [X] T021 [US3] Assemble budgets list view in `src/pages/Presupuestos.jsx`

**Checkpoint**: All user stories up to 3 should now be independently functional

---

## Phase 6: User Story 4 - Gestión Ágil de Clientes, Catálogo de Servicios y Perfil Profesional (Priority: P2)

**Goal**: Dedicated, clean screens for managing clients, catalog, and professional profile.

**Independent Test**: Validate Spanish fiscal IDs in `#/clientes`, edit services in `#/catalogo`, upload logo in `#/perfil`.

### Implementation for User Story 4

- [X] T022 [P] [US4] Implement `ModalFormCliente` with NIF/CIF/NIE validation in `src/components/clientes/ModalFormCliente.jsx`
- [X] T023 [US4] Assemble Clients view in `src/pages/Clientes.jsx`
- [X] T024 [P] [US4] Implement `FormServicio` and `ListaServicios` in `src/components/catalogo/`
- [X] T025 [US4] Assemble Catalog view in `src/pages/Catalogo.jsx`
- [X] T026 [P] [US4] Implement `CargaLogotipo` with instant preview in `src/components/perfil/CargaLogotipo.jsx`
- [X] T027 [US4] Assemble Profile view in `src/pages/Perfil.jsx`

---

## Phase 7: User Story 5 - Sistema de Diseño Sobrio, Tokens Centralizados e Iconografía Ligera (Priority: P3)

**Goal**: Fully strict design system adoption, enforcing tokens and vector icons without external dependencies.

**Independent Test**: Verify all colors/spacing use variables; no external CDN calls in network tab; touch targets >= 44px.

### Implementation for User Story 5

- [X] T028 [US5] Audit all interactive elements across `src/components/` to ensure `--pp-touch-size` >= 44px
- [X] T029 [US5] Verify all colors and typography use `--pp-*` variables in `src/styles/`
- [X] T030 [US5] Remove any external CSS or icon dependencies from `index.html` and components

---

## Phase 8: User Story 6 - Plantilla de Documento PDF Profesional y Coherente (Priority: P3)

**Goal**: The PDF output matches the web application's sober visual identity.

**Independent Test**: Generate PDF and check logo placement, semantic colors, margin consistency, and € alignments.

### Implementation for User Story 6

- [X] T031 [US6] Refactor `src/pdf/generador.js` to match the web app visual identity
- [X] T032 [US6] Ensure amounts in PDF align right, with the € symbol and decimal formatting
- [X] T033 [US6] Apply semantic colors and spacing tokens to the PDF document layout

---

## Phase N: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T034 [P] Run quickstart.md scenarios manually to validate end-to-end functionality
- [X] T035 [P] Audit IndexedDB persistence and business logic to guarantee no regressions

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete
