# Implementation Plan: 002-redisenio-visual-inicio

**Branch**: `002-redisenio-visual-inicio` | **Date**: 2026-10-07 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/002-redisenio-visual-inicio/spec.md`

## Summary

Rediseño visual completo de la SPA incorporando un sistema de diseño sobrio basado en CSS Custom Properties (`--pp-`), una página de inicio tipo Dashboard con métricas clave, navegación persistente, editor en dos columnas con visor interactivo PDF para escritorio, y refactorización visual mobile-first. Todo ello manteniendo la estricta persistencia local (IndexedDB) y lógica fiscal existente.

## Technical Context

**Language/Version**: ES2022+ (JavaScript), HTML5, CSS3
**Primary Dependencies**: Preact (JSX), Vite, pdfmake, idb-keyval
**Storage**: IndexedDB (100% cliente)
**Testing**: Vitest
**Target Platform**: Navegador Web / PWA (Mobile-first, resoluciones >=360px)
**Project Type**: Single Page Application (SPA) sin backend
**Performance Goals**: <1s de carga visual inicial, transiciones instantáneas, 60fps en renderizado UI
**Constraints**: Cero dependencias externas adicionales, uso exclusivo de SVG inline, diseño responsivo riguroso
**Scale/Scope**: SPA autónoma, manejo local sin límite duro, orientado a uso individual.

## Constitution Check

*GATE: PASSED*

- **Simplicidad ante todo**: Se rechazan frameworks CSS pesados (Tailwind/Bootstrap). Se usarán Custom Properties nativas para estilos sobrios.
- **Idioma y Mercado**: Textos y formatos estrictos en `es-ES`, moneda `€`.
- **Cero Alcance Fantasma**: Se restringe la maquetación a lo definido en la `spec.md`.
- **Privacidad**: Diseño puramente frontend; 100% local sin tracking ni llamadas a CDNs.

## Project Structure

### Documentation (this feature)

```text
specs/002-redisenio-visual-inicio/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   ├── contrato-navegacion-inicio.md
│   ├── contrato-sistema-visual.md
│   └── contrato-plantilla-pdf.md
└── tasks.md             # Phase 2 output
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── inicio/
│   ├── comun/
│   ├── presupuestos/
│   ├── clientes/
│   ├── catalogo/
│   └── perfil/
├── styles/
│   ├── variables.css
│   ├── base.css
│   ├── layout.css
│   └── components.css
└── pdf/
    └── generador.js
```

**Structure Decision**: El proyecto mantiene su naturaleza de SPA (Opción 1), centralizando los tokens CSS y dividiendo las vistas de la UI en componentes Preact limpios alineados a los contratos descritos en `pre-especificacion-visual.md`.
