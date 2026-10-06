# Contrato: Sistema Visual Centralizado (`public/css/estilos.css`)

**Fuente**: FR-006, FR-007, FR-008, FR-009, SC-004, SC-005 · Spec: [spec.md](../spec.md)

Este contrato formaliza la definición de estilos, tokens y componentes visuales que gobiernan la apariencia sobria y profesional de toda la aplicación.

---

## 1. Tokens de diseño (Variables CSS en `:root`)

Todas las variables están centralizadas obligatoriamente en `public/css/estilos.css`:

```css
:root {
  /* Paleta Corporativa Sobria */
  --pp-primary: #1e3a8a;          /* Azul marino profundo profesional */
  --pp-primary-hover: #1e40af;
  --pp-primary-light: #eff6ff;
  --pp-primary-contrast: #ffffff;

  /* Superficies y Neutros */
  --pp-bg: #f8fafc;               /* Gris pizarra muy claro */
  --pp-surface: #ffffff;          /* Blanco puro para tarjetas y formularios */
  --pp-surface-subtle: #f1f5f9;   /* Gris neutro para cabeceras de tablas */
  --pp-border: #cbd5e1;           /* Borde neutro equilibrado */
  --pp-border-light: #e2e8f0;

  /* Tipografía y Textos */
  --pp-text: #0f172a;             /* Texto de alto contraste */
  --pp-text-muted: #64748b;       /* Texto secundario y descriptivo */
  --pp-text-inverse: #ffffff;
  --pp-font-sans: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
  --pp-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Escala de Espaciado */
  --pp-space-1: 0.25rem;  /* 4px */
  --pp-space-2: 0.5rem;   /* 8px */
  --pp-space-3: 0.75rem;  /* 12px */
  --pp-space-4: 1rem;     /* 16px */
  --pp-space-6: 1.5rem;   /* 24px */
  --pp-space-8: 2rem;     /* 32px */

  /* Estados de Presupuestos (Badges) */
  --pp-badge-borrador-bg: #f1f5f9;
  --pp-badge-borrador-text: #475569;
  --pp-badge-borrador-border: #cbd5e1;

  --pp-badge-enviado-bg: #f0f9ff;
  --pp-badge-enviado-text: #0369a1;
  --pp-badge-enviado-border: #bae6fd;

  --pp-badge-aceptado-bg: #f0fdf4;
  --pp-badge-aceptado-text: #15803d;
  --pp-badge-aceptado-border: #bbf7d0;

  --pp-badge-rechazado-bg: #fef2f2;
  --pp-badge-rechazado-text: #b91c1c;
  --pp-badge-rechazado-border: #fecaca;

  --pp-badge-caducado-bg: #fffbeb;
  --pp-badge-caducado-text: #b45309;
  --pp-badge-caducado-border: #fde68a;

  /* Bordes y Sombras */
  --pp-radius-sm: 4px;
  --pp-radius-md: 6px;
  --pp-radius-lg: 8px;
  --pp-shadow-card: 0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.04);
}
```

---

## 2. Componentes estandarizados

1. **Insignias de estado (`.badge`)**:
   - Elemento tipo píldora con altura estándar (24px), relleno horizontal de 8px, tipografía en seminegrita (0.75rem / 12px), bordes de 1px redondeados.
   - Variantes obligatorias: `.badge--borrador`, `.badge--enviado`, `.badge--aceptado`, `.badge--rechazado`, `.badge--caducado`.

2. **Tarjetas de resumen (`.metric-card`)**:
   - Fondo blanco `--pp-surface`, borde `--pp-border-light`, radio `--pp-radius-md` y sombra `--pp-shadow-card`.
   - Cifra cuantitativa en tamaño grande (1.75rem / 28px) en `--pp-text` con etiqueta explicativa en `--pp-text-muted`.

3. **Jerarquía de títulos**:
   - Título principal (`h1` / `.page-title`): 1.5rem / 24px, color `--pp-text`, margen inferior `--pp-space-4`.
   - Subtítulos y secciones (`h2` / `.section-title`): 1.125rem / 18px, borde inferior tenue opcional.
   - Textos auxiliares: 0.875rem / 14px en `--pp-text-muted`.

4. **Tablas profesionales**:
   - Encabezados con fondo `--pp-surface-subtle`, texto en mayúsculas sobrias (0.75rem), alineaciones a la derecha para importes monetarios.
   - Filas con separadores de 1px en `--pp-border-light` y efecto hover sutil en escritorio.

5. **Panel de Totales**:
   - Cuadro destacado con borde izquierdo o fondo neutro delimitado, base imponible, desgloses de IVA e IRPF alineados y total en tamaño destacado (1.25rem).
