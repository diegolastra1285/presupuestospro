# Research: Rediseño visual, página de inicio y navegación compartida

**Feature**: `002-redisenio-visual-inicio` | **Fecha**: 2026-10-05 | **Spec**: [spec.md](./spec.md)

Este documento recoge las decisiones de diseño arquitectónico y de presentación adoptadas para la implementación de la especificación 002, respetando íntegramente las convenciones de la especificación 001.

---

### D1. Centralización del sistema visual en variables CSS dentro de `public/css/estilos.css`

- **Decisión**: Crear y centralizar todos los tokens de diseño (paleta cromática sobria, escala tipográfica, espaciados, bordes, sombras y badges de estado) en variables CSS (`:root`) dentro del archivo [`public/css/estilos.css`](file:///C:/Users/User/sdd_curso/tema2/presupuestospro/public/css/estilos.css), enlazándolo como hoja de estilo principal en la aplicación.
- **Justificación**: Cumple la instrucción explícita del usuario de centralizar el sistema visual en un único archivo (`public/css/estilos.css`). El uso de Custom Properties estándar de CSS no introduce dependencias adicionales, es nativo, reactivo ante cambios y compatible con navegadores modernos y modo responsive.
- **Alternativas consideradas**:
  - *Mantener estilos fragmentados en múltiples archivos*: Descartado porque dispersa la paleta de colores y contradice el requisito de definición en un único lugar.
  - *Adoptar Tailwind CSS o Bootstrap*: Descartado categóricamente para cumplir la prohibición de añadir nuevas dependencias y respetar el Principio I (Simplicidad ante todo).

---

### D2. Enrutamiento y punto de entrada para la Página de Inicio (Index)

- **Decisión**: Configurar la ruta raíz (`#/` o sin hash inicial) para que cargue por defecto la nueva vista de **Página de Inicio** (`PaginaInicio`), mientras que el listado histórico de presupuestos se mantiene accesible en `#/presupuestos`. Las secciones restantes (`#/clientes`, `#/catalogo`, `#/perfil`, `#/presupuesto/:id`) preservan sus identificadores de ruta.
- **Justificación**: Permite que al entrar al servidor en `/` el usuario acceda de forma inmediata al panel de bienvenida con el resumen de actividad, facilitando una navegación natural y sin fricciones.
- **Alternativas consideradas**:
  - *Forzar la redirección automática a `#/presupuestos`*: Descartado porque la spec exige una página de inicio independiente que sirva como puerta de entrada.
  - *Incorporar una librería externa de routing (e.g., react-router)*: Descartado para respetar la arquitectura ligera basada en el evento nativo `hashchange`.

---

### D3. Navegación compartida permanente en todas las vistas

- **Decisión**: Actualizar el componente de cabecera común y la barra de navegación móvil para incluir permanentemente los accesos a las cinco secciones clave: **Inicio** (`#/`), **Presupuestos** (`#/presupuestos`), **Clientes** (`#/clientes`), **Catálogo** (`#/catalogo`) y **Perfil** (`#/perfil`), destacando con un indicador de estilo activo la sección en curso.
- **Justificación**: Garantiza que el usuario pueda saltar entre secciones con un solo clic o toque en cualquier momento, eliminando la dependencia del botón «Atrás» del navegador.
- **Alternativas consideradas**:
  - *Navegación tipo migas de pan (breadcrumbs)*: Descartado por ser insuficiente para cambiar entre áreas principales de forma directa.
  - *Menús ocultos en hamburguesa en pantallas grandes*: Descartado porque oculta las secciones y añade clics innecesarios.

---

### D4. Cálculo y visualización del resumen de actividad

- **Decisión**: El resumen de actividad en la página de inicio se computa en memoria a partir del estado ya cargado en cliente (`estado.presupuestos`), calculando los totales de presupuestos y el desglose en sus estados: *Borrador*, *Enviado*, *Aceptado*, *Rechazado* y *Caducado*.
- **Justificación**: Mantiene intacto el esquema de datos en IndexedDB y el contrato de copia de seguridad de la especificación 001. No requiere migraciones de datos ni llamadas asíncronas adicionales.
- **Alternativas consideradas**:
  - *Añadir una tabla o clave separada de estadísticas en IndexedDB*: Descartado por riesgo de inconsistencias y violación del principio de no modificar el esquema de datos.

---

### D5. Distintivos visuales y semántica para estados de presupuestos

- **Decisión**: Definir clases de estilo sobrias y distintivas para los cinco estados con alto contraste y colores equilibrados:
  - **Borrador**: Gris pizarra neutro (fondo `#f1f5f9`, borde `#cbd5e1`, texto `#475569`).
  - **Enviado**: Azul marino / petróleo sobrio (fondo `#f0f9ff`, borde `#bae6fd`, texto `#0369a1`).
  - **Aceptado**: Verde bosque moderado (fondo `#f0fdf4`, borde `#bbf7d0`, texto `#15803d`).
  - **Rechazado**: Borgoña / teja contenido (fondo `#fef2f2`, borde `#fecaca`, texto `#b91c1c`).
  - **Caducado**: Ámbar tostado apagado (fondo `#fffbeb`, borde `#fde68a`, texto `#b45309`).
- **Justificación**: Los cinco estados resultan inmediatamente diferenciables para personas no técnicas y cumplen las pautas de contraste de accesibilidad sin recurrir a colores estridentes.
- **Alternativas consideradas**:
  - *Usar únicamente texto sin color*: Descartado porque no permite una lectura rápida en tablas y cuadros de mando.

---

### D6. Rediseño de la plantilla PDF con estética profesional coherente

- **Decisión**: Sincronizar el diseño del generador de PDF (`src/pdf/generador.js`) y suministrar la plantilla HTML estandarizada en `src/services/plantillas/presupuesto.html` con la misma tipografía limpia, paleta sobria de grises y azules marinos, bordes finos y jerarquía clara en el desglose de totales (IVA 21%, IRPF e importe final en euros €).
- **Justificación**: Da respuesta a la indicación del usuario de actualizar la plantilla del PDF (`src/services/plantillas/presupuesto.html`) a la vez que garantiza que todos los tests de contrato existentes en Vitest (`tests/contract/pdf-definicion.test.js`) sigan pasando al 100%.
- **Alternativas consideradas**:
  - *Reemplazar el motor de generación pdfmake por uno basado en renderizado de HTML*: Descartado porque rompería los contratos y tests unitarios vigentes de la v1 y añadiría librerías pesadas.
