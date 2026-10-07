# Tasks: Exportar todos mis presupuestos en un archivo comprimido .zip

**Input**: Design documents from `/specs/003-exportar-todo-zip/` (`plan.md`, `spec.md`, `data-model.md`, `research.md`, `contracts/`, `quickstart.md`)

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included as specified in plan.md and contracts/ (unit tests for file sanitization and contract tests for ZIP packaging).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Exact file paths included in all descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic dependencies

- [X] T001 Install `fflate` dependency (^0.8.3) in `package.json` for in-browser client ZIP compression

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core utilities and PDF binary generator required before implementing user stories

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T002 [P] Implement file naming and sanitization utility in `src/utils/archivos.js` with `normalizarNombrePdfLote(numero, nombreCliente, nombresExistentes)` applying data-model constraints verbatim: "Eliminación de caracteres prohibidos en sistemas de archivos: `[\\/:*?\"<>|]` y caracteres de control `[\\x00-\\x1F\\x7F]`", "Colapso de múltiples espacios en blanco a un único espacio", "Truncado a máximo 60 caracteres", "Valor por defecto si queda vacío: 'Cliente'", and "Desambiguación ante colisiones: Si dos presupuestos arrojan el mismo nombre de archivo, se añade un sufijo diferenciador correlativo (ej. `{Número} - {Cliente}_2.pdf`)"
- [X] T003 [P] Create unit test suite for file sanitization in `tests/unit/archivos.test.js` validating all rules from `contracts/contrato-exportacion-zip.md` (illegal characters, control characters, space collapsing, empty/null fallbacks, 60-character truncation, and collision suffixes)
- [X] T004 Expose binary PDF generation function `generarPdfBuffer(numero, version, esAnulado)` in `src/pdf/generador.js` returning `Promise<Uint8Array>` using `pdfMake.createPdf(docDefinition).getBuffer()` with watermark "ANULADO" support when `esAnulado === true`

**Checkpoint**: Foundation ready - binary PDF generation and sanitized naming utilities available for user stories.

---

## Phase 3: User Story 1 - Descarga consolidada de todos los presupuestos en un .zip (Priority: P1) 🎯 MVP

**Goal**: Permitir al usuario descargar en un clic desde el listado un archivo ZIP (`presupuestospro-copia-AAAA-MM-DD.zip`) con estructura plana conteniendo todos los presupuestos consolidados en PDF y el archivo `datos.json`, ignorando filtros visuales.

**Independent Test**: Con al menos un presupuesto emitido o anulado en la app, pulsar «Exportar todo (.zip)» en `ListadoPresupuestos`. Verificar la descarga de `presupuestospro-copia-AAAA-MM-DD.zip` conteniendo en la raíz `datos.json` y los PDFs `{Número} - {Cliente}.pdf` que cuadran al céntimo con las descargas individuales, sin alterar datos en IndexedDB.

### Tests for User Story 1 ⚠️

- [X] T005 [P] [US1] Create contract test for ZIP packaging in `tests/contract/exportacion-zip.test.js` verifying flat root structure, presence and schema validity of `datos.json` via `validarEsquemaCopiaSeguridad`, and exact inclusion of consolidated PDFs

### Implementation for User Story 1

- [X] T006 [US1] Implement ZIP export orchestrator service in `src/services/exportacion-zip.js` with `exportarTodoZip(estado, onProgreso)`: filter consolidated budgets (`numero`, `estado !== 'borrador'`, `versiones.length > 0`), take latest active version (`versiones[versiones.length - 1]`), generate `datos.json` using `generarCopiaSeguridadJson(estado)`, build binary PDFs using `generarPdfBuffer`, assemble flat root ZIP with `fflate`, and implement browser download trigger `dispararDescargaArchivo(blob, nombreArchivo)`
- [X] T007 [US1] Integrate «Exportar todo (.zip)» button in `src/components/presupuestos/ListadoPresupuestos.jsx` inside `.view-header .header-actions` calling `exportarTodoZip(estado)` with global unfiltered state and triggering download of `presupuestospro-copia-AAAA-MM-DD.zip`

**Checkpoint**: User Story 1 (MVP) is functional and independently testable. The user can export all budgets and backup data in a single ZIP.

---

## Phase 4: User Story 2 - Control visual y prevención ante cero presupuestos exportables (Priority: P2)

**Goal**: Deshabilitar el botón de exportación cuando no existan presupuestos emitidos o consolidados (0 presupuestos o solo borradores), mostrando una indicación explicativa para evitar descargas vacías.

**Independent Test**: Cargar la aplicación con 0 presupuestos o únicamente con presupuestos en estado borrador. Verificar que el botón «Exportar todo (.zip)» permanece deshabilitado con `title="No hay presupuestos emitidos para exportar en PDF"` y no desencadena descargas.

### Implementation for User Story 2

- [X] T008 [US2] Update `src/components/presupuestos/ListadoPresupuestos.jsx` to compute `presupuestosExportables` (budgets with official number and at least one version, excluding drafts), disabling the export button (`disabled={true}`) with `title="No hay presupuestos emitidos para exportar en PDF"` and accessible `aria-label` when no exportable budgets exist

**Checkpoint**: User Story 2 is functional. Empty exports are prevented when there are no official budgets.

---

## Phase 5: User Story 3 - Indicador de estado y progreso durante la exportación en lotes (Priority: P3)

**Goal**: Mostrar retroalimentación visual continua en el botón de exportación («Generando (X/N)...», «Comprimiendo ZIP...»), deshabilitarlo durante el proceso para prevenir envíos duplicados, ceder el hilo del navegador y presentar alertas amigables de éxito o error.

**Independent Test**: Con presupuestos emitidos, pulsar «Exportar todo (.zip)». Verificar que el botón pasa a estado cargando (`btn--loading`), cambia secuencialmente el texto de avance, no bloquea el navegador y muestra `<Alerta tipo="exito">` al terminar o `<Alerta tipo="error">` si ocurre un error imprevisto.

### Implementation for User Story 3

- [X] T009 [US3] Add sequential async yielding and progress reporting callbacks to `src/services/exportacion-zip.js` triggering `onProgreso({ fase: 'generando', completados, total })` per PDF with event loop pause (`setTimeout(0)`) and `onProgreso({ fase: 'comprimiendo', completados: total, total })` during compression
- [X] T010 [US3] Update `src/components/presupuestos/ListadoPresupuestos.jsx` to manage UI export states (`'inactivo'`, `'generando'`, `'comprimiendo'`), render dynamic button text, set `aria-busy="true"` during generation, and display auto-dismissing `<Alerta tipo="exito">` on completion or `<Alerta tipo="error">` on failure

**Checkpoint**: User Story 3 is functional. Smooth visual progress and error recovery are fully working.

---

## Phase 6: User Story 4 - Nombres de archivo seguros y normalizados frente a caracteres conflictivos (Priority: P4)

**Goal**: Asegurar nombres de archivo PDF limpios, universales y sin colisiones en Windows, macOS y Linux dentro del ZIP para clientes con caracteres reservados, nombres extensos o denominaciones repetidas.

**Independent Test**: Crear presupuestos con nombres especiales (ej. `Diseño/Web: "Norte" & Cía. <SL>`) y nombres duplicados. Descomprimir el ZIP y comprobar que los nombres no contienen caracteres ilegales, están truncados a 60 caracteres y tienen sufijos diferenciadores ante colisión.

### Implementation for User Story 4

- [X] T011 [US4] Connect `src/services/exportacion-zip.js` with `normalizarNombrePdfLote` passing a mutable `Set` of filenames to ensure zero filename collisions and adherence to length and character rules across all budgets in the ZIP
- [X] T012 [P] [US4] Add integration test cases in `tests/contract/exportacion-zip.test.js` validating sanitization of complex client names, collision handling with `_${i}` suffix, and 60-character length limits within the generated ZIP

**Checkpoint**: User Story 4 is functional. Filenames are clean, safe, and collision-free across all desktop platforms.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Quality assurance, end-to-end verification, performance validation, and project memory maintenance

- [X] T013 Run full automated test suite with `npm test` verifying all unit and contract tests pass
- [X] T014 Execute manual end-to-end scenarios described in `specs/003-exportar-todo-zip/quickstart.md` (empty state, multi-budget export, unzipping verification, and visual filters independence)
- [X] T015 Verify batch performance goal (SC-004) generating and compressing up to 20 budgets in under 10 seconds without UI freeze
- [X] T016 Update `AGENTS.md` with new design decisions and conventions from this feature (one line per decision with `[003]` reference), documenting `fflate` usage, flat root ZIP structure, and client naming normalization rules

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - install `fflate` immediately.
- **Foundational (Phase 2)**: Depends on Phase 1 completion - BLOCKS all user stories.
- **User Stories (Phase 3+)**: All depend on Phase 2 completion.
  - User Story 1 (P1 - MVP): Core export functionality.
  - User Story 2 (P2): Empty state validation and button disabling.
  - User Story 3 (P3): Progress feedback and alerts.
  - User Story 4 (P4): Edge-case filename sanitization and collision disambiguation.
- **Polish (Phase 7)**: Depends on all user stories being complete.

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 (Foundational). Delivers the MVP.
- **User Story 2 (P2)**: Builds upon the button added in US1, adding empty-state guards.
- **User Story 3 (P3)**: Enhances the export flow from US1 with progress callbacks and alerts.
- **User Story 4 (P4)**: Strengthens the filename pipeline from Phase 2 / US1 with collision tracking.

### Within Each User Story

- Contract/unit tests written before or alongside implementation.
- Core service logic before UI integration.
- Story complete and verified before moving to the next priority.

### Parallel Opportunities

- Phase 2: `T002` (`archivos.js`) and `T003` (`archivos.test.js`) can run in parallel with `T004` (`generador.js`).
- Phase 3: `T005` (`exportacion-zip.test.js`) contract test can be written in parallel with service development.
- Phase 6: `T012` test cases can run in parallel with `T011`.
- Phase 7: `T013` and `T014` can run across different terminals or sessions.

---

## Parallel Example: User Story 1

```bash
# Launch contract test for ZIP export:
Task: "T005 [P] [US1] Create contract test for ZIP packaging in tests/contract/exportacion-zip.test.js"

# In parallel or immediately after, implement service:
Task: "T006 [US1] Implement ZIP export orchestrator service in src/services/exportacion-zip.js"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (`package.json` with `fflate`).
2. Complete Phase 2: Foundational (`archivos.js`, `generador.js` binary buffer).
3. Complete Phase 3: User Story 1 (`exportacion-zip.js` and `ListadoPresupuestos.jsx` button).
4. **STOP and VALIDATE**: Verify that pressing the button downloads a valid `.zip` with PDFs and `datos.json`.

### Incremental Delivery

1. Setup + Foundational → Core utilities and dependencies ready.
2. User Story 1 → One-click ZIP download functional (MVP).
3. User Story 2 → Prevents empty downloads when no official budgets exist.
4. User Story 3 → Adds dynamic progress feedback («Generando (X/N)...») and alerts.
5. User Story 4 → Normalizes conflicting characters and prevents filename collisions.
6. Polish → Test suite, quickstart verification, performance check, and `AGENTS.md` update.
