# Contrato: Rediseño de la Plantilla PDF

**Fuente**: FR-011, FR-012, FR-013, SC-006 · Spec: [spec.md](../spec.md)

Este contrato establece los requerimientos visuales y estructurales para la plantilla y generación del documento PDF del presupuesto.

---

## 1. Coherencia estética y visual

1. **Fondo y contraste**: Fondo blanco puro con textos en tonos oscuros sobrios (`#0f172a` y `#475569`).
2. **Tipografía**: Jerarquía limpia y legible sin fuentes ornamentales ni elementos superfluos.
3. **Colores de acento**: Tono corporativo sobrio (azul marino profundo `#1e3a8a`) aplicado exclusivamente a separadores finos, encabezado de columnas o al total general.
4. **Bordes y tablas**: Líneas sutiles de 0.5pt en gris claro (`#cbd5e1`), con celdas con espaciado vertical cómodo (mínimo 6pt de relleno).

---

## 2. Distribución y jerarquía de bloques

1. **Encabezado**:
   - Bloque superior izquierdo: Logo o datos fiscales principales del emisor (nombre/empresa y NIF).
   - Bloque superior derecho: Título «PRESUPUESTO», código correlativo (ej. `PRE-2026-0042`), fecha de emisión y fecha de validez.
   - Leyenda discreta: «Este documento no es una factura».
2. **Datos de partes**:
   - Bloque de Emisor y bloque de Cliente dispuestos en columnas paralelas con etiquetas sobrias en mayúsculas pequeñas.
3. **Tabla de líneas**:
   - Encabezados claros: Descripción, Cantidad, Precio unitario e Importe total.
   - Cantidades y precios alineados rigurosamente a la derecha con formato monetario español (ej. `1.234,56 €`).
4. **Caja de Totales**:
   - Subtotal / Base imponible.
   - Cuota de IVA (21 %).
   - Retención de IRPF (si aplica, en cifra negativa formateada).
   - **TOTAL DEL PRESUPUESTO** en negrita y tamaño destacado (13-14 pt).
5. **Condiciones y notas**:
   - Bloque inferior con tipografía secundaria para términos de entrega y forma de pago.
6. **Pie de página**:
   - Numeración sobria «Página X de Y».

---

## 3. Integración técnica y compatibilidad

- Se suministra la plantilla estandarizada en [`src/services/plantillas/presupuesto.html`](file:///C:/Users/User/sdd_curso/tema2/presupuestospro/src/services/plantillas/presupuesto.html) para consulta de maquetación limpia.
- La función de construcción en [`src/pdf/generador.js`](file:///C:/Users/User/sdd_curso/tema2/presupuestospro/src/pdf/generador.js) mantiene la compatibilidad absoluta con todos los tests de contrato existentes en [`tests/contract/pdf-definicion.test.js`](file:///C:/Users/User/sdd_curso/tema2/presupuestospro/tests/contract/pdf-definicion.test.js).
