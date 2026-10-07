# Data Model: 002-redisenio-visual-inicio

El esquema base de almacenamiento (IndexedDB persistido a través de `idb-keyval`) no sufre mutaciones profundas, pero se derivan y estructuran componentes visuales y estados de presentación lógicos.

## Entidades UI Derivadas

### 1. ResumenMetricas (Dashboard)
Representación calculada del estado actual del almacén de presupuestos.
- `total`: Integer (Suma total general).
- `borradores`: Integer (Presupuestos en edición, pendientes de envío).
- `enviados`: Integer (Transmitidos, en espera).
- `aceptados`: Integer (Aprobados por el cliente).
- `rechazados`: Integer (Declinados).
- `caducados`: Integer (Plazo de validez excedido frente a la fecha actual).

### 2. EstadoPresupuesto (Semántica Visual)
Mapeo entre el valor lógico de estado en la base de datos y la representación CSS (badges) (FR-016).
- `borrador` -> `--pp-badge-borrador-bg`, `--pp-badge-borrador-text`
- `enviado` -> `--pp-badge-enviado-bg`, `--pp-badge-enviado-text`
- `aceptado` -> `--pp-badge-aceptado-bg`, `--pp-badge-aceptado-text`
- `rechazado` -> `--pp-badge-rechazado-bg`, `--pp-badge-rechazado-text`
- `caducado` -> `--pp-badge-caducado-bg`, `--pp-badge-caducado-text`

### 3. Tokens del Sistema de Diseño (`--pp-*`)
Definición estructural de variables globales CSS en `estilos.css`:
- **Colores (Paleta Sobria)**: `--pp-primary`, `--pp-surface`, `--pp-text-main`, `--pp-border`, `--pp-background`.
- **Escala Modular (Espaciados)**: `--pp-space-1` (0.25rem) a `--pp-space-8` (4rem).
- **Métricas Físicas y Accesibilidad**: `--pp-touch-size` definido en un mínimo de `44px` (FR-018).
