# Research & Technical Decisions: 002-redisenio-visual-inicio

## 1. Sistema de Estilos y Custom Properties (Tokens)
- **Decision**: Centralizar todos los colores, espaciados y tipografías en `src/styles/variables.css` utilizando variables CSS nativas prefijadas con `--pp-`. No se utilizarán preprocesadores (SASS/LESS) ni frameworks externos (Tailwind/Bootstrap).
- **Rationale**: Cumple el mandato de simplicidad (YAGNI) estipulado en la Constitución y facilita el mantenimiento a largo plazo de un proyecto offline. La gestión del "sistema de diseño" es predecible y altamente performante.
- **Alternatives considered**: Tailwind CSS (descartado por añadir peso de compilación y complejidad), CSS-in-JS (descartado por saturar el hilo de JS sin justificación).

## 2. Iconografía y Recursos Gráficos
- **Decision**: Uso exclusivo de iconos SVG inline en los componentes JSX o símbolos unicode semánticos. Los SVG se mantendrán mínimos.
- **Rationale**: Evita peticiones de red externas a CDNs, previene bloqueos de renderizado y asegura el funcionamiento 100% offline (FR-017).
- **Alternatives considered**: FontAwesome o librerías pesadas como Lucide React (descartados por peso y peticiones de red externas requeridas).

## 3. Composición del Editor en Dos Columnas (Escritorio)
- **Decision**: Uso de CSS Grid y Flexbox combinado con Media Queries (`@media (min-width: 1024px)`) para el editor de presupuestos. El visor interactivo (`VisorPdfLive`) se inyectará a la derecha actualizándose al detectar mutaciones en el modelo reactivo.
- **Rationale**: Preact actualizará el estado global eficientemente, y el generador PDF usará `pdfmake` para proveer la URL blob local sin bloquear la interacción con los campos de entrada de la columna izquierda (FR-009 y FR-010).
- **Alternatives considered**: Modales superpuestos para previsualizar, pero violarían el requisito de feedback en "tiempo real" y la experiencia "side-by-side".

## 4. Adaptación del Generador PDF
- **Decision**: Reconfigurar las estructuras (`content` y `styles`) internas del objeto que consume `pdfmake` en `src/pdf/generador.js` para usar la misma paleta y márgenes lógicos de la web.
- **Rationale**: Garantiza coherencia entre la visualización en pantalla y el documento final entregado al cliente (FR-019).
