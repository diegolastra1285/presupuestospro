# Implementation Plan: PresupuestoPro v1

**Branch**: `001-presupuestopro-v1` | **Date**: 2026-10-03 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-presupuestopro-v1/spec.md`

## Summary

PresupuestoPro v1 es una aplicación web (SPA / PWA) orientada a autónomos y freelancers en España para crear, editar, listar y descargar presupuestos profesionales en formato PDF con vista previa en tiempo real. 

El enfoque técnico rector (Principio I de la Constitución) es **la máxima simplicidad**: funciona 100% en el navegador del usuario sin servidor backend ni base de datos en la nube. Se construye con **Preact + Vite** en JavaScript moderno, persistencia local en **IndexedDB** (`idb-keyval`), exportación PDF con **pdfmake** (carga diferida/lazy) y soporte completo sin conexión mediante Service Worker (PWA).

## Technical Context

**Language/Version**: JavaScript (ES2022+), ejecutado en navegador; Node.js (v20+) para entorno de desarrollo y compilación Vite.

**Primary Dependencies**:
- `preact` (~4 KB) + `@preact/preset-vite`: interfaz reactiva sin sobrecarga.
- `idb-keyval` (< 1 KB): persistencia local simple y rápida en IndexedDB.
- `pdfmake`: generación declarativa de PDFs en cliente con fuentes tipográficas estándar.
- `vite-plugin-pwa`: Service Worker automático para soporte offline (PWA).

**Storage**: IndexedDB en el navegador del usuario (mediante `idb-keyval`), almacenando el estado completo bajo la clave `presupuestopro:estado` con autosave diferido (debounce ~300ms).

**Testing**: `vitest` para pruebas unitarias de cálculos fiscales (aritmética de céntimos), validación de identificadores (NIF/NIE/CIF) y contratos de formato. Verificación funcional manual mediante [quickstart.md](./quickstart.md).

**Target Platform**: Navegadores modernos (Chrome, Firefox, Safari, Edge) en entornos de escritorio y dispositivos móviles (Android / iOS). Instalable como PWA en pantalla de inicio.

**Project Type**: Single Page Application (SPA) estática (Frontend-only) sin backend.

**Performance Goals**:
- Carga inicial ultrarrápida (< 1.5s en 3G / móvil).
- Actualización reactiva instantánea de la vista previa (< 50ms por pulsación).
- Generación y descarga de PDF en menos de 3 segundos (cumpliendo SC-003 < 5s).

**Constraints**:
- Funcionamiento 100% offline tras la primera carga (FR-024).
- Aritmética entera en céntimos (D8) para evitar cualquier error de redondeo en base imponible, IVA e IRPF.
- Privacidad total: sin telemetría, sin envío de datos a servidores externos, sin claves API ni secretos.

**Scale/Scope**:
- Diseñado para un profesional autónomo por dispositivo, capaz de albergar miles de presupuestos en IndexedDB.
- Ámbito acotado a 6 pantallas/vistas principales (Editor con vista previa, Listado de presupuestos, Detalle, Clientes, Catálogo, Perfil/Ajustes con respaldo).

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Estado | Justificación y Cumplimiento |
| :--- | :--- | :--- |
| **I. Simplicidad ante todo** | **PASADO** | Arquitectura 100% estática en cliente, sin servidor, sin base de datos externa, sin TypeScript innecesario, sin librerías pesadas de estado ni frameworks CSS complejos. Preact + CSS puro. |
| **II. Idioma y Mercado Español** | **PASADO** | Todo en español de España (`es-ES`), moneda Euro (`€`), IVA general al 21% e IRPF español (15%, 7% o 0% según perfil y tipo de cliente), validador NIF/NIE/CIF nacional. |
| **III. Cero Alcance Fantasma** | **PASADO** | Implementación estricta de las 8 historias de usuario detalladas en [spec.md](./spec.md). No se añaden funcionalidades fuera de alcance (facturación completa, pasarelas de pago, multiusuario). |
| **IV. Verificable por Personas No Técnicas** | **PASADO** | Todos los criterios de aceptación y flujos se verifican directamente desde la interfaz de usuario en el navegador siguiendo la guía paso a paso en [quickstart.md](./quickstart.md). |
| **V. Privacidad y Datos con Respeto** | **PASADO** | Los datos nunca abandonan el dispositivo del usuario. Almacenamiento local seguro en IndexedDB; copias de seguridad exportables/importables en JSON local. Cero secretos en código. |

## Project Structure

### Documentation (this feature)

```text
specs/001-presupuestopro-v1/
├── plan.md              # Este documento de planificación (/speckit-plan)
├── research.md          # Decisiones técnicas y de negocio (Fase 0)
├── data-model.md        # Entidades, esquemas y validaciones (Fase 1)
├── quickstart.md        # Guía de validación funcional paso a paso (Fase 1)
├── contracts/           # Contratos de interfaz y formatos (Fase 1)
│   ├── copia-de-seguridad.md
│   ├── documento-pdf.md
│   └── pantallas.md
└── tasks.md             # Tareas de implementación desglosadas (Fase 2 - /speckit-tasks)
```

### Source Code (repository root)

```text
├── index.html                  # Punto de entrada HTML con meta tags y viewport mobile
├── package.json                # Dependencias (preact, idb-keyval, pdfmake, vite, vitest)
├── vite.config.js              # Configuración de Vite y vite-plugin-pwa
├── public/
│   ├── favicon.svg             # Favicon de la app
│   ├── pwa-192x192.png         # Icono PWA
│   └── pwa-512x512.png         # Icono PWA para pantalla de inicio
├── src/
│   ├── index.jsx               # Bootstrap de la aplicación Preact
│   ├── app.jsx                 # Componente raíz con enrutado por hash y estado global
│   ├── styles/
│   │   ├── variables.css       # Tokens de diseño, tipografía y paleta
│   │   ├── base.css            # Reset y estilos globales mobile-first
│   │   ├── layout.css          # Estructura general, navegación y vista partida
│   │   └── components.css      # Botones, formularios, tablas, badges y vista previa
│   ├── domain/                 # Lógica de negocio pura (sin dependencias de UI)
│   │   ├── calculos.js         # Aritmética de céntimos: base, IVA, IRPF y totales
│   │   ├── nif.js              # Validador NIF/NIE/CIF (aviso no bloqueante)
│   │   ├── numeracion.js       # Generador correlativo de códigos (PRE-AAAA-XXXX)
│   │   └── estado-inicial.js   # Estructura por defecto de datos
│   ├── storage/
│   │   └── idb.js              # Acceso a IndexedDB vía idb-keyval
│   ├── pdf/
│   │   └── generador.js        # Lazy load de pdfmake y compilación del documento PDF
│   ├── components/             # Componentes de UI reactivos
│   │   ├── comun/              # Modal, Alerta, Header, BarraTotales
│   │   ├── presupuestos/       # EditorPresupuesto, VistaPrevia, ListadoPresupuestos, DetallePresupuesto
│   │   ├── clientes/           # GestionClientes, SelectorClienteModal
│   │   ├── catalogo/           # GestionCatalogo, SelectorConceptoModal
│   │   └── perfil/             # ConfiguracionPerfil, RespaldoDatos (exportar/importar JSON)
│   └── utils/
│       ├── fechas.js           # Formateo de fechas en español (DD/MM/AAAA)
│       └── moneda.js           # Formateador de importes en € (formato es-ES)
└── tests/
    ├── unit/
    │   ├── calculos.test.js    # Pruebas exhaustivas de redondeos y totales fiscales
    │   ├── nif.test.js         # Pruebas de validación de identificadores fiscales
    │   └── numeracion.test.js  # Pruebas de generación y correlatividad de numeración
    └── contract/
        ├── copia-seguridad.test.js # Validación de esquema de importación/exportación
        └── pdf-definicion.test.js  # Validación de estructura de documento pdfmake
```

**Structure Decision**: Se establece una estructura de proyecto web estático único (Single project SPA) con separación clara entre lógica de dominio pura (`src/domain/`), persistencia (`src/storage/`), generación documental (`src/pdf/`) y componentes visuales (`src/components/`).

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|---|---|---|
| *Ninguna* | No hay violaciones constitucionales ni sobreingeniería | N/A |
