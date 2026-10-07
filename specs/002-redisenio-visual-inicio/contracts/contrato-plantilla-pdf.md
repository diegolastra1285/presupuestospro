# Contrato: Plantilla de Generación PDF

Dictamina la traducción de los tokens web (FR-015) hacia el documento estático inmutable exportado vía PDFMake (FR-019).

## Especificación Estética

### Formato Dimensional
- **Estándar**: A4 Vertical.
- **Márgenes Perimetrales**: Equilibrados y sobrios (`40px` en cada borde recomendado por PDFMake).

### Consistencia de Estilos (Web -> PDF)
- **Paleta de Color**: Los tonos corporativos definidos en las variables CSS `--pp-primary` se mapearán hacia códigos hexadecimales estrictos (ej. `#1e3a8a`) dentro del array de estilos del generador `pdfmake`.
- **Insignias**: El badge de estado puede suprimirse del PDF formal impreso o presentarse como marca de agua si el negocio lo demanda, priorizando un enfoque minimalista y serio hacia el cliente final.

### Maquetación de Tablas de Conceptos
- **Columnas**: Código/Artículo, Unidades, Precio Unitario Base, Importe (sin impuestos).
- **Alineaciones**:
  - Encabezados: Resaltados (negrita) e inferidos visualmente, con fondo claro (gris muy tenue) y borde inferior visible.
  - Textos descriptivos: Tabulación a la izquierda.
  - Valores Numéricos (precios, montos totales): Alineación absoluta estricta a la derecha para facilitar suma rápida.
- **Formatos Monetarios**: Todos los enteros en céntimos consumidos desde la BD serán convertidos dividiendo entre 100, con dos decimales exactos y el sufijo ` €`.

### Bloque de Resumen (Desglose Tributario)
- Separado claramente al final de la hoja.
- Desglosa por filas tabuladas a la derecha:
  - Base Imponible.
  - % IVA y cuota tributaria sumada.
  - % Retención IRPF (si aplica) y cuota restada.
  - Total Definitivo (Pagar).
