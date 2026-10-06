# UX and Visual Design Quality Checklist: Rediseño visual, página de inicio y navegación compartida

**Purpose**: Validar la completitud, claridad, consistencia y cobertura de los requisitos de experiencia de usuario (UX), sistema visual centralizado, diseño mobile-first y accesibilidad antes de la implementación.
**Created**: 2026-10-05
**Feature**: [spec.md](../spec.md) | [plan.md](../plan.md)

**Note**: Esta lista de verificación personalizada ha sido generada por el comando `/speckit-checklist` a partir de la especificación y el contexto técnico de la funcionalidad 002.
**Review Ownership**: Este documento es un artefacto de revisión de calidad de requisitos propiedad del revisor. Marque un elemento con `[x]` únicamente cuando el revisor determine que el criterio de calidad de redacción del requisito está plenamente satisfecho.
**Marker Semantics**: `[x]` significa que el criterio de especificación ha sido revisado y cumple los estándares de calidad. NO significa que el código o la implementación estén terminados.

---

## 1. Requirement Completeness (Tokens visuales y componentes)

- [x] CHK001 ¿Están explícitamente catalogados todos los tokens visuales fundamentales (paleta sobria, tonos neutros, semántica de estados, escala tipográfica, espaciados y radios) en un único punto del sistema? [Completeness, Spec §FR-006]
- [x] CHK002 ¿Se encuentran completamente especificadas las propiedades visuales y estilos de insignias para los 5 estados de presupuesto (Borrador, Enviado, Aceptado, Rechazado, Caducado)? [Completeness, Spec §FR-008]
- [x] CHK003 ¿Están definidos los requisitos del indicador visual de estado activo tanto para la barra de navegación de escritorio como para la navegación móvil? [Completeness, Spec §FR-005]
- [x] CHK004 ¿Están documentados los requisitos de diseño y mensaje para el estado inicial vacío (cero presupuestos registrados) en las tarjetas de actividad? [Completeness, Spec §US2.2]
- [x] CHK005 ¿Están completamente descritos los bloques estructurales de la página de inicio (panel de bienvenida, métricas de estado y accesos directos)? [Completeness, Spec §FR-002, §FR-003]

---

## 2. Requirement Clarity & Measurability (Jerarquía y legibilidad)

- [x] CHK006 ¿Está definida la escala tipográfica con proporciones o dimensiones concretas entre títulos principales, subtítulos, cuerpo y etiquetas auxiliares? [Clarity, Spec §FR-007]
- [x] CHK007 ¿Se encuentra el concepto de «apariencia profesional y sobria» cuantificado con criterios visuales objetivos (gama cromática contenida, sin estridencias, fuentes sans-serif nítidas)? [Clarity, Spec §FR-006]
- [x] CHK008 ¿Están las reglas de espaciado y márgenes normalizadas bajo una escala uniforme cuantificada en lugar de descripciones relativas ambiguas? [Clarity, Spec §FR-009]
- [x] CHK009 ¿Está especificada la jerarquía visual de los importes y totales en pantalla y PDF con criterios medibles de peso tipográfico y alineación? [Measurability, Spec §SC-004]
- [x] CHK010 ¿Es verificable de forma objetiva el criterio de éxito de carga inmediata (< 1 segundo) para la página de inicio en condiciones de uso estándar? [Measurability, Spec §SC-001]

---

## 3. Requirement Consistency (Navegación y estados de interfaz)

- [x] CHK011 ¿Coinciden de manera idéntica los destinos y nomenclatura de las 5 secciones entre la cabecera superior y el menú móvil? [Consistency, Spec §FR-004]
- [x] CHK012 ¿Se mantienen homogéneas las etiquetas de texto («Borrador», «Enviado», «Aceptado», «Rechazado», «Caducado») y sus colores asociados entre las tarjetas de inicio y las tablas de presupuestos? [Consistency, Spec §FR-002, §FR-008]
- [x] CHK013 ¿Comparten los elementos interactivos (botones, enlaces, tarjetas clicables) estados visuales consistentes de interacción (hover, focus-visible, active)? [Consistency, Plan §contrato-sistema-visual]
- [x] CHK014 ¿Se exige la misma convención de formateo monetario en euros (`1.234,56 €`) en el resumen de métricas, formularios, detalle y PDF? [Consistency, Spec §FR-012]

---

## 4. Scenario & Edge Case Coverage (Mobile-first y pantallas estrechas)

- [x] CHK015 ¿Están definidos los requisitos de diseño adaptativo para anchos de pantalla mínimos de 320 px a 360 px sin desbordamiento horizontal? [Edge Case, Spec §Edge Cases, §SC-007]
- [x] CHK016 ¿Se detallan las reglas de ajuste o truncamiento para nombres de clientes o conceptos largos dentro de tarjetas y tablas en móviles? [Edge Case, Spec §Edge Cases]
- [x] CHK017 ¿Se especifica que la navegación móvil persistente no debe solaparse ni bloquear botones flotantes, modales o la barra fija de totales? [Edge Case, Spec §Edge Cases]
- [x] CHK018 ¿Están cubiertos los requisitos de comportamiento visual ante cambios de orientación o puntos de corte intermedios en tabletas? [Coverage, Spec §FR-010]
- [x] CHK019 ¿Especifica el documento si el texto dentro de las insignias de estado debe permanecer en una sola línea en pantallas pequeñas? [Edge Case, Spec §Edge Cases]

---

## 5. Non-Functional Requirements & Accessibility (A11y y contraste)

- [x] CHK020 ¿Se especifican ratios mínimos de contraste cromático (WCAG AA ≥ 4.5:1 para texto normal) para los 5 colores de estado sobre sus respectivos fondos? [Accessibility, Spec §SC-004]
- [x] CHK021 ¿Están cuantificadas las dimensiones mínimas para objetivos táctiles (mínimo 44 × 44 px) en enlaces de navegación y botones móviles? [Accessibility, Spec §FR-010]
- [x] CHK022 ¿Se exige un indicador de foco visible y accesible para la navegación asistida mediante teclado en todas las pantallas? [Accessibility, Plan §contrato-sistema-visual]
- [x] CHK023 ¿Está contemplada la compatibilidad o aislamiento del tema claro/oscuro respecto a la nueva paleta centralizada en `public/css/estilos.css`? [Coverage, Plan §contrato-sistema-visual]
- [x] CHK024 ¿Se garantiza que la identificación de los estados no dependa únicamente del color, incluyendo siempre el texto identificativo en español de España? [Accessibility, Spec §FR-008]

---

## Notes

- Marque los elementos con `[x]` únicamente tras confirmar que el criterio de calidad de la especificación está formalmente resuelto en los documentos de requisitos.
- Deje los elementos desmarcados (`[ ]`) mientras requieran discusión, aclaración o redacción adicional en la especificación.
- La herramienta de implementación (`/speckit-implement`) lee este estado como barrera de calidad y no altera los marcadores.
- Todos los identificadores están numerados secuencialmente desde CHK001 hasta CHK024 para facilitar su trazabilidad en revisiones por pares.
