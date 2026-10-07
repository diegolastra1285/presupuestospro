# Implementation Plan: Exportar todos mis presupuestos en un archivo comprimido .zip

**Branch**: `003-exportar-todo-zip` | **Date**: 2026-10-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-exportar-todo-zip/spec.md`

## Summary

Esta funcionalidad permite al usuario autónomo exportar y respaldar en un único clic la totalidad de sus presupuestos y la base de datos de su negocio en un archivo comprimido `.zip` descargado localmente desde el navegador (`presupuestospro-copia-AAAA-MM-DD.zip`).

El paquete `.zip` sigue una estructura plana en raíz conteniendo:
1. Un archivo PDF por cada presupuesto consolidado con número oficial (`{Número} - {Cliente}.pdf`), generado en lote mediante `pdfmake` con paridad visual y cálculo al céntimo.
2. Un archivo `datos.json` en la raíz con el volcado completo del estado de la aplicación (incluyendo perfil, catálogo, clientes, numeración correlativa y todos los presupuestos, con sus borradores y versiones), validable por el mecanismo existente de restauración.
3. El botón «Exportar todo (.zip)» en la cabecera de `ListadoPresupuestos` ofrece retroalimentación dinámica de avance (`«Generando (X/N)...»`, `«Comprimiendo ZIP...»`) y previene descargas vacías si no existen presupuestos emitidos.

La compresión en cliente se resuelve mediante la biblioteca ultra-ligera `fflate` (~8 KB, ESM puro), respetando estrictamente la Constitución: 100% en el cliente, cero backend, sin telemetría y sin secretos.

---

## Technical Context

**Language/Version**: JavaScript moderno (ES2022+), ejecutado nativamente en navegadores modernos (Chrome, Firefox, Safari, Edge); Node.js v20+ para entorno de desarrollo y Vitest.

**Primary Dependencies**:
- `preact` (^10.26.4): Capa de UI y componentes reactivos.
- `idb-keyval` (^6.2.1): Persistencia en IndexedDB local (`presupuestopro:estado`).
- `pdfmake` (^0.2.18): Generador de documentos PDF en cliente.
- `fflate` (^0.8.3): Biblioteca ligera de compresión ZIP en cliente (puro ESM, sin dependencias transitivas).
- `vite` (^6.2.0): Servidor de desarrollo y empaquetador.

**Storage**: IndexedDB en el cliente (`presupuestopro:estado`). Operación de solo lectura: la exportación no modifica ningún registro en disco.

**Testing**: `vitest` (^3.0.7) para pruebas unitarias de utilidades (`archivos.js`) y pruebas de contrato (`exportacion-zip.test.js`). Verificación funcional en navegador documentada en [`quickstart.md`](./quickstart.md).

**Target Platform**: Navegadores web modernos en escritorio y dispositivos móviles (diseño responsive).

**Project Type**: Single Page Application (SPA / PWA) estática sin backend.

**Performance Goals**:
- Generación y compresión de hasta 20 presupuestos en menos de 5 segundos en cliente estándar (SC-004).
- Evitar bloqueo del hilo principal de interfaz mediante procesamiento secuencial asíncrono y refresco visual del botón.

**Constraints**:
- **Cero backend / Privacidad total**: La compresión y ensamblado del ZIP se ejecutan íntegramente en la máquina del usuario.
- **Estructura plana en la raíz**: Todos los PDF y `datos.json` residen en la raíz del `.zip` sin subcarpetas.
- **Saneamiento estricto de nombres**: Eliminación de caracteres prohibidos (`\ / : * ? " < > |`) y truncado a 60 caracteres en nombre de cliente.
- **Moneda e idioma**: Textos en español de España (`es-ES`) y moneda Euro (`€`).

**Scale/Scope**:
- 1 nuevo servicio de exportación ZIP: `src/services/exportacion-zip.js`.
- 1 módulo de normalización de nombres de archivo: `src/utils/archivos.js`.
- Actualización de `src/pdf/generador.js` para exponer generación binaria (`generarPdfBuffer` / `generarPdfBlob`).
- Actualización de `src/components/presupuestos/ListadoPresupuestos.jsx` con botón dinámico y estados.
- 1 dependencia npm ligera nueva: `fflate`.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Fase 0 | Fase 1 | Justificación y Cumplimiento |
| :--- | :--- | :--- | :--- |
| **I. Simplicidad ante todo** | **PASADO** | **PASADO** | Se elige `fflate` (~8 KB, ESM) en lugar de dependencias pesadas como `jszip` (~100 KB). Estructura plana sin abstracciones complejas. |
| **II. Idioma y Mercado Español** | **PASADO** | **PASADO** | Mensajes de botón (`«Exportar todo (.zip)»`, `«Generando (X/N)...»`, `«Comprimiendo ZIP...»`) y alertas en español de España (`es-ES`). Precios en euros (`€`). |
| **III. Cero Alcance Fantasma** | **PASADO** | **PASADO** | Acotado estrictamente a la spec: botón en listado, ZIP con PDFs y `datos.json`. No se añade importación de ZIP, envío por email ni formatos adicionales (Excel/CSV). |
| **IV. Verificable por Personas No Técnicas** | **PASADO** | **PASADO** | Cada criterio se valida visualmente descargando el ZIP, abriendo con doble clic y comprobando los PDFs según [`quickstart.md`](./quickstart.md). |
| **V. Privacidad y Datos con Respeto** | **PASADO** | **PASADO** | Proceso 100% local en navegador. Sin telemetría, sin servidores, sin llamadas de red ni secretos en código. |

---

## Project Structure

### Documentation (this feature)

```text
specs/003-exportar-todo-zip/
├── spec.md              # Especificación funcional aprobada
├── plan.md              # Este plan de implementación (/speckit-plan)
├── research.md          # Fase 0: Investigación de fflate, pdfmake y nombres (completada)
├── data-model.md        # Fase 1: Entidades del paquete ZIP, estado UI y respaldo (completada)
├── quickstart.md        # Fase 1: Guía de verificación funcional no técnica (completada)
├── contracts/           # Fase 1: Contratos de interfaces y estructuras
│   ├── contrato-exportacion-zip.md
│   └── contrato-ui-listado.md
└── checklists/
    └── requirements.md
```

### Source Code (repository root)

```text
package.json                                 # Incorporación de dependencia ligera "fflate"
src/
├── utils/
│   ├── archivos.js                          # NUEVO: Sanitización de nombres de archivo y sufijos anti-colisión
│   ├── fechas.js
│   └── moneda.js
├── pdf/
│   └── generador.js                         # ACTUALIZADO: Exportación de generarPdfBuffer / generarPdfBlob
├── services/
│   └── exportacion-zip.js                   # NUEVO: Orquestador de exportación masiva ZIP
├── components/
│   ├── presupuestos/
│   │   └── ListadoPresupuestos.jsx          # ACTUALIZADO: Botón «Exportar todo (.zip)», avance dinámico y alertas
│   └── perfil/
│       └── RespaldoDatos.jsx                # Reutilización de generarCopiaSeguridadJson
tests/
├── unit/
│   └── archivos.test.js                     # NUEVO: Pruebas unitarias de normalización de nombres
└── contract/
    └── exportacion-zip.test.js              # NUEVO: Pruebas de contrato de estructura y empaquetado ZIP
```

**Structure Decision**: Arquitectura SPA cliente existente. Se añade la utilidad `src/utils/archivos.js` y el servicio `src/services/exportacion-zip.js` para desacoplar la orquestación del ZIP de los componentes visuales de Preact.

---

## Complexity Tracking

*No hay violaciones constitucionales que requieran justificación.*

---

## Implementation Phases Outline

### Fase 0: Investigación y Decisiones Técnicas (Completada)
- Resueltas las elecciones técnicas en [`research.md`](./research.md): adopción de `fflate`, generación secuencial de buffers PDF desde `pdfmake` y normalización de nombres de archivo.

### Fase 1: Diseño y Contratos (Completada)
- Especificadas las entidades y diagramas en [`data-model.md`](./data-model.md).
- Definidos los contratos formales en [`contracts/contrato-exportacion-zip.md`](./contracts/contrato-exportacion-zip.md) y [`contracts/contrato-ui-listado.md`](./contracts/contrato-ui-listado.md).
- Creada la guía de pruebas paso a paso en [`quickstart.md`](./quickstart.md).

### Fase 2: Tareas de Implementación (a generar por `/speckit-tasks`)
1. **Infraestructura y dependencias**:
   - Instalar `fflate` (^0.8.3) en `package.json`.
2. **Utilidades del Dominio**:
   - Crear `src/utils/archivos.js` con `normalizarNombrePdfLote` y pruebas unitarias en `tests/unit/archivos.test.js`.
3. **Servicio PDF y Empaquetador ZIP**:
   - Adaptar `src/pdf/generador.js` para exponer generación asíncrona de buffer binario (`generarPdfBuffer`).
   - Crear `src/services/exportacion-zip.js` con `exportarTodoZip` y callback de progreso.
   - Crear pruebas de contrato en `tests/contract/exportacion-zip.test.js`.
4. **Integración en la Interfaz de Usuario**:
   - Integrar botón «Exportar todo (.zip)» en `src/components/presupuestos/ListadoPresupuestos.jsx`.
   - Control de botón deshabilitado si no hay presupuestos emitidos.
   - Feedback dinámico de progreso (`«Generando (X/N)...»` y `«Comprimiendo ZIP...»`).
   - Gestión de alertas de éxito y error amigables.
5. **Verificación y Pruebas**:
   - Ejecutar suite completa con `npm test` y verificar todos los escenarios de `quickstart.md`.
6. **Mantenimiento y Documentación de Proyecto (Paso Final)**:
   - Actualizar `CLAUDE.md` con las decisiones de diseño y convenciones nuevas de esta feature, una línea por decisión, con referencia a la spec (p. ej. `[003] ...`). No incluir entradas por incluir; asegurar siempre que sea información transversal y relevante para el proyecto que puedan aprovechar futuras features.

## Spec-kit
- Al ejecutar `/speckit.plan`, SIEMPRE incluye en `plan.md`, como último paso de la fase final, un paso de mantenimiento: “Actualizar `AGENTS.md` con las decisiones de diseño y convenciones nuevas de esta feature, una línea por decisión, con referencia a la spec (p. ej. ‘[003] ...’). No incluyas entradas por incluir, asegúrate siempre de que es información transversal y relevante para el proyecto que pueden aprovechar futuras features.”   
