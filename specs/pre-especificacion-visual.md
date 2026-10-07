# Pre-especificación Visual: Integración y Diseño con Stitch MCP

## 1. Contexto y Propósito

El objetivo de esta pre-especificación es establecer las directrices de diseño, patrones de interfaz y reglas de integración frontend para trabajar con **Stitch MCP** dentro de **PresupuestoPro**.

PresupuestoPro es una Single Page Application (SPA/PWA) local y sin backend orientada a autónomos y freelancers en España. Toda propuesta o artefacto visual generado con Stitch debe someterse a los principios constitucionales del proyecto: **Simplicidad ante todo (YAGNI)**, **Cero alcance fantasma**, **Diseño profesional sobrio** y **Cero dependencias innecesarias**.

---

## 2. Consideraciones Clave del Proyecto (PresupuestoPro)

Dado que este proyecto sigue principios estrictos de simplicidad (YAGNI) y cero dependencias pesadas, cualquier componente o pantalla generado mediante Stitch debe cumplir de forma estricta los siguientes tres pilares:

### 2.1. Tokens a Custom Properties
* En lugar de importar hojas de estilo completas, CDNs o clases de frameworks utilitarios (Tailwind, Bootstrap, etc.) que Stitch pudiera sugerir o generar, se debe **extraer la paleta de colores, tipografías y escalas de espaciado** e incorporarlas como variables nativas dentro de [`public/css/estilos.css`](file:///c:/Users/User/sdd_curso/tema3/presupuestospro/public/css/estilos.css) bajo el prefijo `--pp-`.
* El diseño debe reutilizar o ampliar armónicamente los tokens ya existentes:
  * Paleta corporativa sobria (`--pp-primary`, `--pp-surface`, `--pp-border`, etc.).
  * Semántica de estados (`--pp-badge-borrador-*`, `--pp-badge-enviado-*`, `--pp-badge-aceptado-*`, `--pp-badge-rechazado-*`, `--pp-badge-caducado-*`).
  * Escala modular de espaciados (`--pp-space-1` a `--pp-space-8`).

### 2.2. Adaptación a Preact
* Stitch suele exportar componentes en HTML puro o React estándar.
* Todo componente generado debe ser adaptado por el agente a la arquitectura de **Preact (ES2022+ JSX)**:
  * Empleo de `class` en lugar de `className` (compatible y preferido en Preact).
  * Hooks nativos de Preact (`useState`, `useEffect`, `useMemo`, `useCallback`).
  * Sin envolturas ni capas de abstracción innecesarias (YAGNI).
  * Mantenimiento de la reactividad existente con almacenamiento local en IndexedDB (`idb-keyval`).

### 2.3. Cero dependencias innecesarias
* Queda terminantemente prohibido introducir librerías de componentes UI externas (Radix, HeadlessUI, MUI, Chakra, etc.).
* Cero librerías de iconos pesadas (Lucide React, FontAwesome, React Icons). Si una pantalla requiere iconografía funcional, se deben utilizar:
  1. Iconos **SVG inline nativos** mínimos y optimizados.
  2. Símbolos tipográficos o emojis semánticos compatibles.
* Toda interacción (modales, menús desplegables, pestañas) se resuelve con Preact y CSS nativo.

---

## 3. Catálogo de Vistas y Pantallas Objetivo

Las pantallas y componentes del sistema que se iterarán o evaluarán con Stitch incluyen:

| Vista | Ruta Hash | Componentes Clave | Directrices de Diseño |
| :--- | :--- | :--- | :--- |
| **Inicio / Dashboard** | `#/` | `ResumenMetricas`, `AccesosRapidos`, `ListadoRecientes` | Tarjetas cuantitativas claras, accesos directos de alta visibilidad, badges de estado semánticos. |
| **Listado de Presupuestos** | `#/presupuestos` | `CabeceraAcciones`, `FiltroEstados`, `TablaPresupuestos`, `BotonExportarZip` | Tabla legible y responsive (tarjetas en móvil), botón primario destacado y accesibilidad de acciones rápidas. |
| **Editor de Presupuesto** | `#/presupuestos/nuevo`<br>`#/presupuestos/:id/editar` | `FormularioDatos`, `LineasArticulos`, `DesgloseFiscal`, `VisorPdfLive` | Distribución en dos columnas en escritorio (edición a la izquierda, visor PDF interactivo a la derecha), cálculo en tiempo real. |
| **Clientes** | `#/clientes` | `TablaClientes`, `ModalFormCliente` | Formularios concisos, validación visual de NIF/CIF/NIE y datos de contacto. |
| **Catálogo de Servicios** | `#/catalogo` | `ListaServicios`, `FormServicio` | Presentación de conceptos frecuentes, precios base e IVA sugerido con edición ágil. |
| **Perfil Profesional** | `#/perfil` | `FormPerfilFiscal`, `CargaLogotipo`, `CondicionesLegales` | Configuración clara de datos fiscales del emisor, condiciones por defecto y previsualización de logotipo. |

---

## 4. Flujo de Trabajo para Generar Pantallas con Stitch

Al diseñar o rediseñar pantallas mediante Stitch MCP, se seguirá este procedimiento:

```
+-------------------------------------------------------------+
| 1. Generación del prototipo visual en Stitch MCP             |
|    (Pantalla o variante mediante prompt descriptivo)        |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
| 2. Extracción de Tokens y Estilos                           |
|    - Extraer paleta, sombras y espacios                     |
|    - Añadir/armonizar variables en public/css/estilos.css   |
|    - Redactar clases CSS semánticas (BEM / prefijo pp-)     |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
| 3. Conversión de Marcado a Preact                           |
|    - Traducir HTML/React a componentes JSX de Preact        |
|    - Convertir iconos a SVG inline limpios                  |
|    - Conectar estado y eventos a la lógica existente        |
+------------------------------+------------------------------+
                               |
                               v
+-------------------------------------------------------------+
| 4. Verificación Funcional y Visual                          |
|    - Comprobación en navegador (Desktop y Mobile)           |
|    - Validación con Vitest (`npm test`)                     |
|    - Ausencia total de nuevas dependencias npm              |
+-------------------------------------------------------------+
```

---

## 5. Criterios de Aceptación Visual

1. **Fidelidad y Estética**: Toda pantalla producida luce limpia, sobria y profesional, transmitiendo confianza financiera y fiscal a los clientes del autónomo.
2. **Mobile-First y Responsive**: El diseño se adapta de forma fluida a dispositivos móviles (360px+) sin desbordamiento horizontal y con zonas táctiles cómodas (mínimo 44x44px).
3. **Coherencia con PDF**: Los colores y tipografía de las vistas web guardan consonancia con la plantilla del documento PDF descargable.
4. **Cero Secretos y Cero APIs Externas**: Ningún asset o componente debe solicitar recursos a servidores externos no empaquetados localmente.
