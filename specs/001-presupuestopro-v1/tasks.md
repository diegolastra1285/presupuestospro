---
description: "Task list for PresupuestoPro v1 feature implementation"
---

# Tasks: PresupuestoPro v1

**Input**: Design documents from `/specs/001-presupuestopro-v1/`
- Specification: [spec.md](./spec.md)
- Implementation Plan: [plan.md](./plan.md)
- Data Model: [data-model.md](./data-model.md)
- Research & Decisions: [research.md](./research.md)
- Contracts: [contracts/copia-de-seguridad.md](./contracts/copia-de-seguridad.md), [contracts/documento-pdf.md](./contracts/documento-pdf.md), [contracts/pantallas.md](./contracts/pantallas.md)
- Quickstart & Validation: [quickstart.md](./quickstart.md)

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Unit tests and contract tests in `vitest` are included as specified in plan.md (`tests/unit/` and `tests/contract/`) to guarantee fiscal calculation accuracy, NIF validation, sequential zero-gap numbering, PDF structure, and backup schema integrity.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story in priority order (P1 → P2 → P3).

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root as defined in [plan.md](./plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, build tools, dependencies, and base static assets

- [X] T001 Initialize npm project with dependencies (`preact`, `@preact/preset-vite`, `idb-keyval`, `pdfmake`, `vite`, `vite-plugin-pwa`, `vitest`) in package.json
- [X] T002 [P] Configure Vite, Preact JSX transform, and PWA plugin settings in vite.config.js
- [X] T003 [P] Create main HTML application shell with viewport and mobile meta tags in index.html
- [X] T004 [P] Create PWA assets and application icons in public/favicon.svg, public/pwa-192x192.png, and public/pwa-512x512.png

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure, domain types, storage persistence, and styling that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T005 [P] Implement currency formatting utility in es-ES format (`1.272,00 €`) converting céntimos to formatted string in src/utils/moneda.js
- [X] T006 [P] Implement date formatting utility converting ISO `AAAA-MM-DD` and ISO 8601 timestamps to `dd/mm/aaaa` in src/utils/fechas.js
- [X] T007 [P] Implement Spanish NIF/NIE/CIF validation algorithm returning `{ valido, tipo, motivo }` ("Aviso no bloqueante si no es DNI/NIE/CIF válido") in src/domain/nif.js
- [X] T008 [P] Implement initial default application state with schema version 1 (`versionEsquema: 1`, `perfil: null`, `clientes: []`, `catalogo: []`, `presupuestos: []`, `contadores: {}`, `tema: "claro"`) and development seed data (ejemplo de referencia de spec: DevStudio Freelance y Acme Digital Corp) in src/domain/estado-inicial.js
- [X] T009 Implement IndexedDB storage wrapper with debounce autosave (~300ms) under key `presupuestopro:estado` and persistent storage request via `idb-keyval` in src/storage/idb.js
- [X] T010 [P] Create unit tests for annual numbering logic, consecutive sequence generation, year rollover (`PRE-2027-0001`), and > 9999 handling (`PRE-2026-10000`) in tests/unit/numeracion.test.js
- [X] T010b [P] Implement annual sequential numbering domain helper and atomic counter increment logic (`PRE-{YYYY}-{NNNN}`) in src/domain/numeracion.js
- [X] T011 [P] Create CSS design tokens, typography, and palette variables supporting light/dark themes in src/styles/variables.css
- [X] T012 [P] Create base CSS styles, reset, and touch-target definitions (min 44x44px) in src/styles/base.css
- [X] T013 [P] Create layout styles (split-view editor/preview conforming to FR-010, bottom bar) in src/styles/layout.css
- [X] T014 [P] Create reusable UI component styles for buttons, badges, tables, alerts, and modal dialogs in src/styles/components.css
- [X] T015 Create root application component with hash router (`#/presupuestos`, `#/presupuesto/:id`, `#/clientes`, `#/catalogo`, `#/perfil`), state reducer, and navigation bar in src/app.jsx
- [X] T016 Create application bootstrap entry point mounting Preact app into DOM in src/index.jsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Crear un presupuesto con cálculo fiscal automático y vista previa en vivo (Priority: P1) 🎯 MVP

**Goal**: The freelancer selects or creates a client, adds budget lines (manual or catalog), and sees instant real-time tax calculation (base, 21% IVA, 15%/7%/0% IRPF, total) alongside a live split-view HTML preview replicating the budget.

**Independent Test**: Create a budget with reference example lines and verify calculated amounts match exactly to the cent with the spec calculation rules (e.g., base 1.200,00 €, IVA 252,00 €, IRPF 180,00 €, total 1.272,00 €; and 2,5 × 33,33 = 83,33 €).

### Tests for User Story 1 ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T017 [P] [US1] Create unit tests for fiscal calculations covering all 6 spec test cases, Half-Up rounding, and cent integer arithmetic in tests/unit/calculos.test.js
- [X] T018 [P] [US1] Create unit tests for Spanish NIF/NIE/CIF validation (valid DNI/NIE/CIF, invalid control digits with non-blocking warnings) in tests/unit/nif.test.js

### Implementation for User Story 1

- [X] T019 [US1] Implement pure fiscal calculation domain module with cent integer arithmetic and Half-Up rounding (`redondearHalfUp(x / 100) = signo(x) × floor((|x| + 50) / 100)`) computing line subtotal, base imponible, 21% IVA, IRPF, and total in src/domain/calculos.js
- [X] T020 [P] [US1] Create reusable Modal and Alert components for warnings and confirmations in src/components/comun/Modal.jsx and src/components/comun/Alerta.jsx
- [X] T021 [P] [US1] Create fixed bottom/top Totals Bar component displaying base, IVA 21%, IRPF, and highlighted total in src/components/comun/BarraTotales.jsx
- [X] T022 [US1] Implement live HTML preview component replicating budget document layout and conditional emisor fallback in src/components/presupuestos/VistaPrevia.jsx
- [X] T023 [US1] Implement budget editor form with line management (description, quantity, price, reordering, deletion), IRPF selector (enforcing 0% with warning for Particular clients, 15% default or 7% for nuevoAutonomo), validity date (defaulted from profile days), and editable conditions/notes textarea (pre-filled with profile default conditions) in src/components/presupuestos/EditorPresupuesto.jsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently (MVP core)

---

## Phase 4: User Story 2 - Emitir y descargar el presupuesto en PDF (Priority: P1)

**Goal**: Validate required budget fields and line amounts (> 0), assign sequential budget number, generate and download professional PDF (< 5s) named `PRE-{YYYY}-{NNNN}_{NombreCliente}.pdf` with complete structure, headers, table, and totals.

**Independent Test**: Emit reference example budget, verify PDF generation triggers within 5 seconds, contains all mandatory fields (title, "Este documento no es una factura", emisor/client data, table, totals, notes), and matches screen values to the cent.

### Tests for User Story 2 ⚠️

- [X] T024 [P] [US2] Create contract tests for PDF document structure, column layout, page numbers, watermark, and filename normalization in tests/contract/pdf-definicion.test.js

### Implementation for User Story 2

- [X] T025 [US2] Implement PDF generation module with lazy-loaded pdfmake, Roboto fonts, table layout with repeating headers (`headerRows: 1`), unbreakable totals, and es-ES number formatting in src/pdf/generador.js
- [X] T026 [US2] Implement pre-issuance validation logic in budget editor (checking non-empty profile name/NIF, client selected, >= 1 line, non-empty line descriptions, and no line with subtotal <= 0) highlighting all errors simultaneously in src/components/presupuestos/EditorPresupuesto.jsx
- [X] T027 [US2] Wire "Generar PDF" action in editor to trigger validation, atomic numbering assignment, snapshot version freezing (emisor, cliente, lineas with subtotal, calculated totales), and PDF download named `PRE-{YYYY}-{NNNN}_{NombreCliente}.pdf` in src/components/presupuestos/EditorPresupuesto.jsx

**Checkpoint**: At this point, User Stories 1 AND 2 both work together to deliver the complete core budget generation flow

---

## Phase 5: User Story 3 - Configurar el perfil y la marca del freelancer (Priority: P2)

**Goal**: Configure and persist freelancer profile (nombre, nif, email, telefono, direccion, logo <= 1MB, nuevoAutonomo flag, datosPago, condicionesPorDefecto, and diasValidezPorDefecto), applying automatically to all budgets and PDFs.

**Independent Test**: Fill profile data with logo, close and reopen app, verify data persists, and verify new budget and generated PDF automatically include emisor identity and default conditions.

### Implementation for User Story 3

- [X] T028 [US3] Implement profile configuration form with inputs for `nombre` ("No vacío tras recortar espacios"), `nif`, `email`, `telefono`, `direccion`, `datosPago`, `condicionesPorDefecto`, `diasValidezPorDefecto` (default 30, integer >= 1), and `nuevoAutonomo` (boolean, default false) in src/components/perfil/ConfiguracionPerfil.jsx
- [X] T029 [US3] Implement logo file uploader with validation restricting to PNG/JPG and <= 1MB before Base64 encoding ("Solo PNG o JPG, ≤ 1 MB antes de codificar. Si no cumple → se rechaza con aviso y queda null") in src/components/perfil/ConfiguracionPerfil.jsx
- [X] T030 [US3] Implement inline non-blocking NIF/DNI validation warning badge next to the input field in src/components/perfil/ConfiguracionPerfil.jsx

**Checkpoint**: Freelancer identity and branding configured; persists across sessions and drives PDF emisor header

---

## Phase 6: User Story 4 - Gestionar el catálogo de servicios con precios de referencia (Priority: P2)

**Goal**: Create, edit, and delete catalog services with description, habitual price, and optional market price range (min <= max). Allow adding services to budget lines and applying min/max prices with one click.

**Independent Test**: Create two catalog services with market ranges (e.g. 300 € - 600 €), add to budget, verify "Mercado: 300,00 € – 600,00 €" is shown, click "Aplicar mín." and "Aplicar máx.", and verify catalog service deletion does not affect existing budget lines.

### Implementation for User Story 4

- [X] T031 [US4] Implement catalog management view to list, add, edit, and delete services with `descripcion` ("No vacío"), `precioCentimos` (integer >= 0), and market range validation ("Si existen ambos: mín ≤ máx; si no, no se guarda y se avisa") in src/components/catalogo/GestionCatalogo.jsx
- [X] T032 [P] [US4] Implement catalog service selection modal with search filter for quick insertion into budget lines in src/components/catalogo/SelectorConceptoModal.jsx
- [X] T033 [US4] Integrate catalog item picker in budget editor copying description, habitual price, and market range (min/max), adding "Aplicar mín." and "Aplicar máx." buttons on the line in src/components/presupuestos/EditorPresupuesto.jsx

**Checkpoint**: Catalog fully functional, integrated with budget lines, and decoupled from existing budgets

---

## Phase 7: User Story 5 - Gestionar la agenda de clientes (Priority: P2)

**Goal**: Maintain local clients directory (`nombre`, `nif`, `tipo` Particular vs Empresa/Autónomo, `email`, `direccion`). Allow creating clients directly from budget editor, and handle safe deletion with draft confirmation count.

**Independent Test**: Create Particular and Empresa/Autónomo clients, select them in budget to verify automatic IRPF adaptation, and verify deletion prompt shows count of drafts using the client.

### Implementation for User Story 5

- [X] T034 [US5] Implement client agenda view with creation, editing, and deletion with inline NIF warning and draft usage count confirmation ("N borradores usan este cliente") setting `clienteId: null` on drafts while leaving issued versions untouched in src/components/clientes/GestionClientes.jsx
- [X] T035 [P] [US5] Implement quick client creation and selector modal inside budget editor leaving newly created client immediately selected in src/components/clientes/SelectorClienteModal.jsx
- [X] T036 [US5] Integrate client switching logic in budget editor adapting IRPF (reset to 0% with warning when switching to Particular, default 15% or 7% for Empresa/Autónomo) in src/components/presupuestos/EditorPresupuesto.jsx

**Checkpoint**: Client directory active, linked with budget editor, and enforcing fiscal retention rules

---

## Phase 8: User Story 6 - Historial, numeración, versiones y anulación (Priority: P3)

**Goal**: Manage budget lifecycle (`borrador`, `emitido`, `anulado`), sequential zero-gap annual numbering `PRE-{YYYY}-{NNNN}`, versioning (v2, v3...), filtering by month/year/status, re-downloading PDFs, and irreversible cancellation with "ANULADO" watermark.

**Independent Test**: Emit 3 budgets, verify consecutive numbering, cancel the 2nd and verify "ANULADO" watermark on re-download with editing disabled, edit the 3rd to generate v2 with filename suffix `_v2.pdf`, and filter by month and year.

### Implementation for User Story 6

- [X] T039 [US6] Implement budget history list view with status filters (Todos, Borradores, Emitidos, Anulados), year and month filters, monthly count banner ("X presupuestos en [mes] de [año]"), and "Nuevo presupuesto" button in src/components/presupuestos/ListadoPresupuestos.jsx
- [X] T040 [US6] Implement budget detail view for issued and canceled budgets displaying immutable version history with individual "Descargar PDF" buttons, "Editar (nueva versión)" action, and "Anular" action with confirmation dialog in src/components/presupuestos/DetallePresupuesto.jsx
- [X] T041 [US6] Implement version draft branch and discard logic in budget editor allowing editing an issued budget as a new draft version without modifying v1 until generated in src/components/presupuestos/EditorPresupuesto.jsx
- [X] T042 [US6] Integrate diagonal red semi-transparent "ANULADO" watermark on all pages when re-downloading any version of an annulled budget in src/pdf/generador.js

**Checkpoint**: Complete lifecycle management, zero-gap numbering, immutable versions, and definitive cancellation working

---

## Phase 9: User Story 7 - Tema claro / oscuro (Priority: P3)

**Goal**: Toggle UI between light and dark themes with persistent preference in state, ensuring PDF documents remain strictly with white background and print-ready dark text regardless of active theme.

**Independent Test**: Toggle theme to dark, verify UI styles update, reload page to verify theme persists, and generate PDF verifying it maintains white background and dark text.

### Implementation for User Story 7

- [X] T043 [US7] Implement theme toggle control in header persisting `"claro"` or `"oscuro"` in state and applying `data-theme` attribute to document root in src/components/comun/Header.jsx
- [X] T044 [US7] Implement dark theme CSS overrides for surfaces, text, borders, tables, modals, and preview container while preserving print-safe styling in src/styles/variables.css and src/styles/components.css

**Checkpoint**: Light and dark theme switching verified and persistent across sessions

---

## Phase 10: User Story 8 - Copia de seguridad local (Priority: P3)

**Goal**: Export complete state to local JSON file named `presupuestopro-copia-AAAA-MM-DD.json` and import valid backups with pre-validation and confirmation replacing local state atomically.

**Independent Test**: Export backup JSON, clear local state, import file, verify full restoration of profile, catalog, clients, budgets, and sequential counters.

### Tests for User Story 8 ⚠️

- [X] T045 [P] [US8] Create contract tests for backup schema validation, verifying valid payload acceptance and rejection of invalid, incomplete, or corrupted files in tests/contract/copia-seguridad.test.js

### Implementation for User Story 8

- [X] T046 [US8] Implement backup export function generating formatted JSON file named `presupuestopro-copia-AAAA-MM-DD.json` containing app header, version 1 format, and full state payload in src/components/perfil/RespaldoDatos.jsx
- [X] T047 [US8] Implement backup import handler with schema validation (checking `aplicacion === "PresupuestoPro"`, `formato: 1`, array types, budget integrity, and counter coherence), confirmation modal, and atomic state replacement in src/components/perfil/RespaldoDatos.jsx

**Checkpoint**: Full backup export and atomic import with validation completed

---

## Phase 11: Polish & Cross-Cutting Concerns

**Purpose**: Offline service worker cache, mobile touch refinements, and end-to-end quickstart validation

- [X] T048 [P] Configure PWA service worker offline caching via vite-plugin-pwa in vite.config.js
- [X] T049 [P] Implement input ergonomics with decimal numeric virtual keyboard (`inputmode="decimal"`) and comma/dot decimal parsing in src/components/presupuestos/EditorPresupuesto.jsx
- [X] T050 Run automated test suite (`npm test`) and verify all tests pass for calculos, nif, numeracion, pdf-definicion, and copia-seguridad in tests/
- [X] T051 Verify all 12 manual validation scenarios described in specs/001-presupuestopro-v1/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - Phase 3 (US1 - Calculations & Preview) and Phase 4 (US2 - PDF Issuance) deliver the primary P1 value
  - Phase 5 (US3 - Profile), Phase 6 (US4 - Catalog), Phase 7 (US5 - Clients) provide P2 capabilities
  - Phase 8 (US6 - Lifecycle/History), Phase 9 (US7 - Themes), Phase 10 (US8 - Backup) provide P3 capabilities
- **Polish (Phase 11)**: Depends on all user story phases being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Depends on User Story 1 calculations and preview; delivers PDF output and numbering assignment
- **User Story 3 (P2)**: Can proceed after Foundational (Phase 2); provides emisor identity and default conditions
- **User Story 4 (P2)**: Can proceed after Foundational (Phase 2); integrates into budget editor lines
- **User Story 5 (P2)**: Can proceed after Foundational (Phase 2); integrates into budget editor client selector
- **User Story 6 (P3)**: Depends on US1 and US2 for budget creation/issuance; manages history, versions, and cancellation
- **User Story 7 (P3)**: Can proceed independently after Foundational (Phase 2)
- **User Story 8 (P3)**: Can proceed after Foundational (Phase 2); serializes and deserializes the entire application state

### Within Each User Story

- Tests (when specified) MUST be written and FAIL before implementation
- Domain modules before UI components
- UI sub-components before parent views
- Story complete and independently verified before moving forward

### Parallel Opportunities

- In Phase 1: T002, T003, T004 can run in parallel after T001
- In Phase 2: T005, T006, T007, T008, T010, T010b, T011, T012, T013, T014 can run in parallel
- In Phase 3: T017, T018 can run in parallel; T020, T021 can run in parallel
- In Phase 4: T024 can run in parallel with editor preparation
- In Phase 5: T028, T029, T030 can be structured sequentially or combined in ConfiguracionPerfil.jsx
- In Phase 6: T031, T032 can run in parallel
- In Phase 7: T034, T035 can run in parallel
- In Phase 8: T039, T040 can run in parallel
- In Phase 9: T043, T044 can run in parallel
- In Phase 10: T045 can run in parallel with RespaldoDatos implementation (T046, T047)
- In Phase 11: T048, T049 can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch test tasks for User Story 1 together:
Task: "T017 [P] [US1] Create unit tests for fiscal calculations covering all 6 spec test cases, Half-Up rounding, and cent integer arithmetic in tests/unit/calculos.test.js"
Task: "T018 [P] [US1] Create unit tests for Spanish NIF/NIE/CIF validation (valid DNI/NIE/CIF, invalid control digits with non-blocking warnings) in tests/unit/nif.test.js"

# Launch UI components for User Story 1 together:
Task: "T020 [P] [US1] Create reusable Modal and Alert components for warnings and confirmations in src/components/comun/Modal.jsx and src/components/comun/Alerta.jsx"
Task: "T021 [P] [US1] Create fixed bottom/top Totals Bar component displaying base, IVA 21%, IRPF, and highlighted total in src/components/comun/BarraTotales.jsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 + User Story 2)

1. Complete Phase 1: Setup (T001–T004)
2. Complete Phase 2: Foundational (T005–T016) (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (T017–T023)
4. Complete Phase 4: User Story 2 (T024–T027)
5. **STOP and VALIDATE**: Verify end-to-end budget creation and PDF download with reference example
6. Deploy/demo initial functional MVP

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add US1 + US2 → Test independently → Deploy/Demo (Core MVP: create, calculate, preview, download PDF)
3. Add US3 (Profile) → Test independently → Freelancer identity, logo, and defaults configured
4. Add US4 (Catalog) & US5 (Clients) → Test independently → Pre-saved concepts and client agenda
5. Add US6 (History, Versions, Annulment) → Test independently → Full lifecycle and trace
6. Add US7 (Theme) & US8 (Backup) → Test independently → UI customization and offline data safety
7. Polish & Offline Verification → PWA ready for production

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Verify tests fail before implementing
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Strict avoidance of vague tasks, file conflicts, or out-of-scope additions
