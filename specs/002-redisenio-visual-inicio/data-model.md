# Data Model: Rediseño visual, página de inicio y navegación compartida

**Feature**: `002-redisenio-visual-inicio` | **Fecha**: 2026-10-05 | **Spec**: [spec.md](./spec.md)

## Conformidad con el modelo de datos existente

Conforme a las directrices de diseño y a las restricciones de la funcionalidad:
1. **Esquema canónico respetado**: Todo el modelo de datos de dominio, las estructuras persistidas en IndexedDB (`presupuestopro:estado`), los cálculos en céntimos y las convenciones de `Cliente`, `Servicio`, `Presupuesto` y `Perfil` se mantienen **estrictamente idénticos** a lo definido en [`specs/001-presupuestopro-v1/data-model.md`](file:///C:/Users/User/sdd_curso/tema2/presupuestospro/specs/001-presupuestopro-v1/data-model.md).
2. **Cero migraciones**: No se alteran campos ni se añade ninguna clave de almacenamiento en base de datos.
3. **Capa de presentación**: Las entidades descritas a continuación corresponden exclusivamente a la capa de presentación y visualización en memoria de la interfaz de usuario.

---

## Entidades de la capa de presentación

### 1. ResumenActividad (en memoria para la Página de Inicio)

Estructura calculada de forma reactiva a partir de la lista de presupuestos en memoria (`estado.presupuestos`):

| Campo | Tipo | Descripción |
|---|---|---|
| `total` | entero | Número total de presupuestos registrados. |
| `borradores` | entero | Número de presupuestos en estado borrador o con edición abierta. |
| `enviados` | entero | Número de presupuestos emitidos pendientes de respuesta comercial. |
| `aceptados` | entero | Número de presupuestos marcados como aceptados por el cliente. |
| `rechazados` | entero | Número de presupuestos marcados como rechazados. |
| `caducados` | entero | Número de presupuestos cuya fecha de validez ha expirado sin aceptación. |

*Regla de cálculo*: Se evalúa en el componente de la página de inicio en tiempo de renderizado; si no existen presupuestos, todos los valores se inicializan a `0`.

---

### 2. EstadoVisualPresupuesto (Mapeo de insignias / badges)

Asociación visual de los estados del presupuesto con su representación en la interfaz:

| Valor de dominio | Etiqueta visible (es-ES) | Clase visual (`public/css/estilos.css`) | Semántica de color |
|---|---|---|---|
| `borrador` | «Borrador» | `.badge--borrador` | Gris neutro / pizarra |
| `enviado` | «Enviado» | `.badge--enviado` | Azul marino / petróleo sobrio |
| `aceptado` | «Aceptado» | `.badge--aceptado` | Verde bosque sobrio |
| `rechazado` | «Rechazado» | `.badge--rechazado` | Teja / carmín apagado |
| `caducado` | «Caducado» | `.badge--caducado` | Ámbar tostado apagado |

---

### 3. Modelo de Tokens Visuales (`public/css/estilos.css`)

Estructura de variables CSS centralizadas:

| Grupo | Variables principales | Propósito |
|---|---|---|
| **Colores de marca** | `--pp-color-primary`, `--pp-color-primary-hover`, `--pp-color-primary-light` | Azul corporativo sobrio y variantes interactivas. |
| **Colores neutros** | `--pp-color-bg`, `--pp-color-surface`, `--pp-color-border`, `--pp-color-text`, `--pp-color-text-muted` | Fondos de página, tarjetas, bordes sutiles y textos de alto contraste. |
| **Colores semánticos** | `--pp-color-success`, `--pp-color-warning`, `--pp-color-danger`, `--pp-color-info` | Fondos y textos para estados y alertas. |
| **Tipografía** | `--pp-font-family`, `--pp-font-size-base`, `--pp-font-size-sm`, `--pp-font-size-lg`, `--pp-font-size-xl` | Fuente del sistema sans-serif sobria y escala tipográfica armónica. |
| **Espaciado** | `--pp-spacing-xs`, `--pp-spacing-sm`, `--pp-spacing-md`, `--pp-spacing-lg`, `--pp-spacing-xl` | Escala uniforme basada en múltiplos estándar de 4px / 8px. |
| **Bordes y sombras** | `--pp-radius-sm`, `--pp-radius-md`, `--pp-shadow-sm`, `--pp-shadow-md` | Redondeos sutiles y elevaciones discretas profesionales. |
