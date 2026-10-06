# Implementation Plan: Rediseño visual, página de inicio y navegación compartida

**Branch**: `002-redisenio-visual-inicio` | **Date**: 2026-10-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/002-redisenio-visual-inicio/spec.md`

## Summary

Esta funcionalidad optimiza la capa de presentación de PresupuestosPro introduciendo dos mejoras fundamentales sin alterar ninguna lógica de cálculo, API ni estructura de datos preexistente:
1. **Página de inicio (Index / Cuadro de mando) y navegación compartida**: Punto de entrada inicial al acceder a la raíz del servidor (`#/` o `/`), incorporando un resumen cuantitativo de actividad de presupuestos por estado (Borrador, Enviado, Aceptado, Rechazado, Caducado) y enlaces directos a las cuatro secciones existentes. Todas las vistas pasan a compartir una barra de navegación persistente para alternar entre secciones en un solo clic/toque sin usar el botón «Atrás».
2. **Rediseño visual sobrio y profesional**: Centralización del sistema visual en Custom Properties dentro de `public/css/estilos.css` (paleta sobria, tipografía armónica, espaciado uniforme, distintivos legibles para los 5 estados de presupuesto y maquetación de tablas/formularios), trasladando este mismo lenguaje a la plantilla del PDF (`src/services/plantillas/presupuesto.html` y generador PDF) para el cliente final.

## Technical Context

**Language/Version**: JavaScript (ES2022+), ejecutado en navegador moderno; Node.js (v20+) para entorno de desarrollo y empaquetado Vite.

**Primary Dependencies**:
- `preact`: capa reactiva de componentes.
- `idb-keyval`: persistencia existente en IndexedDB (sin modificaciones).
- `pdfmake`: generación de presupuestos en PDF desde el cliente (sin dependencias adicionales).
- `vite`: servidor de desarrollo y compilación.

**Storage**: IndexedDB en el navegador (`presupuestopro:estado`) respetado al 100% conforme a [`specs/001-presupuestopro-v1/data-model.md`](file:///C:/Users/User/sdd_curso/tema2/presupuestospro/specs/001-presupuestopro-v1/data-model.md). Cero cambios de esquema.

**Testing**: `vitest` para la ejecución de pruebas unitarias y contratos de interfaz existentes. Verificación interactiva no técnica mediante [`quickstart.md`](./quickstart.md).

**Target Platform**: Navegadores web modernos (Chrome, Firefox, Safari, Edge) en escritorio, tabletas y móviles con diseño mobile-first.

**Project Type**: Single Page Application (SPA) frontend estática sin backend.

**Performance Goals**:
- Carga de la página de inicio inmediata (< 1s).
- Transición entre secciones mediante navegación compartida reactiva instantánea (< 50ms).
- Generación de PDF en menos de 3 segundos.

**Constraints**:
- **Cero dependencias nuevas**: Prohibido añadir librerías CSS externas o paquetes npm adicionales.
- **Sistema visual centralizado**: Todos los tokens de diseño (colores, fuentes, espaciados, badges) definidos en `public/css/estilos.css`.
- **Ámbito estricto de presentación**: Cambios acotados a la capa visual (`public/css/estilos.css`, componentes visuales de navegación e inicio, y plantilla PDF en `src/services/plantillas/presupuesto.html` / `src/pdf/generador.js`).
- **Invarianza de lógica**: No alterar cálculos fiscales, formatos monetarios, generador correlativo de códigos ni validadores de NIF.
- **Idioma y moneda**: Español de España (`es-ES`) y Euro (`€`).

**Scale/Scope**:
- 1 nueva pantalla: Página de inicio / Index (`PaginaInicio`).
- 1 navegación compartida actualizada con 5 secciones: Inicio, Presupuestos, Clientes, Catálogo y Perfil.
- 1 sistema visual con variables CSS centralizadas y badges para 5 estados.
- 1 plantilla PDF sobria renovada.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principio | Estado | Justificación y Cumplimiento |
| :--- | :--- | :--- |
| **I. Simplicidad ante todo** | **PASADO** | No se agregan frameworks de diseño complejos, dependencias externas ni abstracciones pesadas. Se emplean Custom Properties estándar de CSS en `public/css/estilos.css` y enrutado ligero por hash. |
| **II. Idioma y Mercado Español** | **PASADO** | Textos íntegramente en español de España (`es-ES`), moneda Euro (`€`), etiquetas de estado en español («Borrador», «Enviado», «Aceptado», «Rechazado», «Caducado»). |
| **III. Cero Alcance Fantasma** | **PASADO** | Se implementa estrictamente lo pedido en la especificación 002: página de inicio con resumen, navegación compartida, sistema visual sobrio y plantilla PDF, sin funciones extra no solicitadas. |
| **IV. Verificable por Personas No Técnicas** | **PASADO** | Cada pantalla, tarjeta métrica, botón de navegación y aspecto visual es comprobable directamente en navegador mediante el documento [`quickstart.md`](./quickstart.md). |
| **V. Privacidad y Datos con Respeto** | **PASADO** | La aplicación sigue ejecutándose íntegramente en local sin envío de datos a servidores externos ni uso de claves de acceso o secretos. |

## Project Structure

### Documentation (this feature)

```text
specs/002-redisenio-visual-inicio/
├── spec.md              # Especificación funcional de la feature
├── plan.md              # Este plan de implementación (/speckit-plan)
├── research.md          # Decisiones de diseño y alternativas (Fase 0)
├── data-model.md        # Entidades de presentación y conformidad de datos (Fase 1)
├── quickstart.md        # Guía paso a paso de verificación funcional (Fase 1)
├── contracts/           # Contratos formales de la funcionalidad
│   ├── contrato-sistema-visual.md
│   ├── contrato-navegacion-inicio.md
│   └── contrato-plantilla-pdf.md
└── checklists/
    └── requirements.md  # Checklist de validación de calidad de requisitos
```

### Source Code (repository root)

```text
├── index.html                               # Enlace a la hoja de estilos centralizada y viewport
├── public/
│   ├── css/
│   │   └── estilos.css                      # Sistema visual centralizado con variables CSS y clases de componentes
│   └── favicon.svg
├── src/
│   ├── index.jsx                            # Punto de entrada de Preact
│   ├── app.jsx                              # Enrutado a #/ por defecto y montaje de vistas
│   ├── components/
│   │   ├── comun/
│   │   │   └── Header.jsx                   # Navegación común persistente (Inicio, Presupuestos, Clientes, Catálogo, Perfil)
│   │   ├── inicio/
│   │   │   └── PaginaInicio.jsx             # Vista de inicio con resumen de presupuestos por estado y accesos directos
│   │   ├── presupuestos/                    # Listado, editor y detalle de presupuestos con nuevos badges sobrios
│   │   ├── clientes/                        # Gestión de clientes con la nueva estética
│   │   ├── catalogo/                        # Gestión de catálogo adaptado a la paleta sobria
│   │   └── perfil/                          # Perfil y copias de seguridad con estilo sobrio
│   ├── services/
│   │   └── plantillas/
│   │       └── presupuesto.html             # Plantilla HTML estandarizada del presupuesto PDF sobrio
│   ├── pdf/
│   │   └── generador.js                     # Generador de PDF alineado con la estética sobria y profesional
│   └── domain/                              # Cálculos monetarios, NIF y estado inicial (INTACTOS)
```

**Structure Decision**: Se mantiene la arquitectura SPA ligera con Preact + Vite, centralizando el sistema de estilos en `public/css/estilos.css` y suministrando la plantilla estandarizada en `src/services/plantillas/presupuesto.html`, preservando completamente intactos los archivos de dominio y almacenamiento de datos.

## Complexity Tracking

*No existen violaciones constitucionales ni sobrecomplejidad arquitectónica añadida.*
