# Contrato: Sistema Visual y Tokens

Especificaciones de estilo CSS centralizadas (FR-015, FR-017, FR-018). Todo componente derivado de Stitch debe homologarse según este esquema.

## 1. Nomenclatura y Variables Base (Custom Properties)
Los atributos genéricos recaerán bajo el prefijo estricto `--pp-` en la raíz del CSS.
- **Colores principales**: `--pp-primary`, `--pp-surface`, `--pp-border`.
- **Badges Semánticos** (FR-016):
  - `--pp-badge-borrador-bg`, `--pp-badge-borrador-text`
  - `--pp-badge-enviado-bg`, `--pp-badge-enviado-text`
  - `--pp-badge-aceptado-bg`, `--pp-badge-aceptado-text`
  - `--pp-badge-rechazado-bg`, `--pp-badge-rechazado-text`
  - `--pp-badge-caducado-bg`, `--pp-badge-caducado-text`

## 2. Restricciones Físicas y de Usabilidad (Mobile-First)
- **Ancho Mínimo Soportado**: `360px`. Las tablas extensas deben envolverse o transformarse a patrón "Card" (tarjetas táctiles).
- **Zonas Táctiles (Touch Targets)**: Cualquier etiqueta interaccionable (`button`, `a`, selectores `input`) tendrá implícitamente asegurado `min-height: 44px` y `min-width: 44px` por accesibilidad móvil.
- **Tipografía**: Exenta de peticiones web (fuente de sistema sin CDN): `font-family: system-ui, -apple-system, sans-serif;`.

## 3. Iconografía y Asistencia Visual
- **Nativo**: Se autorizan exclusivamente etiquetas `<svg viewBox="...">` empaquetadas inline. Queda vetada la importación de scripts de iconos (`<script src="fontawesome...">`).
- **Estados vacíos**: Deben ilustrarse amigablemente con Emojis nativos u omitirse, jamás rompiendo la sobriedad con recursos pesados.
