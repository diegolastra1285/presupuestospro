# AGENTS.md — Memoria Técnica

## 1. Definición
PresupuestoPro es una Single Page Application (SPA/PWA) local y sin backend para que autónomos y freelancers en España creen, gestionen y descarguen presupuestos profesionales en PDF con vista previa en tiempo real.

## 2. Stack y Decisiones Técnicas Vigentes
- **Frontend & Reactividad**: Preact + Vite (JavaScript moderno ES2022+, sin TypeScript ni frameworks CSS externos).
- **Estilos**: CSS nativo con Custom Properties centralizadas (`public/css/estilos.css`), responsive mobile-first y diseño sobrio.
- **Persistencia**: 100% cliente en IndexedDB (`idb-keyval`, clave `presupuestopro:estado`), autosave con debounce y respaldo JSON.
- **Documentos**: Generación de PDF en cliente mediante `pdfmake` con carga diferida (*lazy loading*).
- **Empaquetado y Compresión**: [003] Compresión ZIP 100% en cliente mediante `fflate` (~8 KB, ESM puro), sin backend ni servicios externos.
- **PWA / Offline**: Service Worker con `vite-plugin-pwa` para funcionamiento autónomo sin conexión tras la primera carga.
- **Lógica de negocio**: Aritmética entera en céntimos (cálculos fiscales exactos de IVA/IRPF) y enrutamiento por hash (`#/`).

## 3. Arranque y Pruebas en Local
- **Instalación**: `npm install`
- **Desarrollo**: `npm run dev` (servidor local en `http://localhost:5173`)
- **Compilación / Preview**: `npm run build` | `npm run preview`
- **Pruebas**: `npm test` (ejecuta suite unitaria con Vitest)

## 4. Convenciones
- **Idioma y Mercado**: Todo en español de España (`es-ES`), moneda Euro (`€`), fechas y validación de NIF/NIE/CIF.
- **Simplicidad (YAGNI)**: Cero librerías redundantes; resolver siempre con la solución más limpia y ligera.
- **Cero Alcance Fantasma**: Limitarse estrictamente a los requerimientos especificados en la `spec.md` activa.
- **Privacidad y Seguridad**: Datos 100% locales; sin telemetría, sin backend y cero secretos o API keys en código.
- **Exportaciones ZIP**: [003] Estructura plana en la raíz con nombre `presupuestospro-copia-AAAA-MM-DD.zip`, conteniendo `datos.json` íntegro y PDFs `{Número} - {Cliente}.pdf` sanitizados (caracteres prohibidos eliminados, máx. 60 caracteres y sufijos `_${i}` ante colisión).
- Cuando te pida "cerrar la feature", ejecuta: verificar working tree limpio y commitear pendientes, correr test (parar si fallan), checjout master, merge --no-ff de la rama de la feature con mensaje "Merge feature NNN": <nombre>", borrar la rama local, y mostrar git log --online --graph -10. 

Las reglas de producto viven en .specify/memory/constitution.md y el estado del producto en specs/README.md
