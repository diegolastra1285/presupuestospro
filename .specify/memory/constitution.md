<!--
Sync Impact Report:
- Version change: 1.0.0 → 2.0.0 (2026-10-03)
- Modified principles:
  - II. Idioma y Mercado Español: moneda obligatoria Dólar USD ($) → Euro (€)
    (alineado con el régimen fiscal español de la spec 001-presupuestopro-v1)
- Added sections: Ninguna
- Removed sections: Ninguna
- Follow-up TODOs: Ninguno

Historial previo:
- Version change: 0.0.0 (template) → 1.0.0
- Modified principles:
  - [PRINCIPLE_1_NAME] → I. Simplicidad ante todo
  - [PRINCIPLE_2_NAME] → II. Idioma y Mercado Español
  - [PRINCIPLE_3_NAME] → III. Cero Alcance Fantasma
  - [PRINCIPLE_4_NAME] → IV. Verificable por Personas No Técnicas
  - [PRINCIPLE_5_NAME] → V. Privacidad y Datos con Respeto
- Added sections:
  - Restricciones del Proyecto
  - Flujo de Trabajo y Verificación
  - Governance
- Removed sections: Ninguna
- Follow-up TODOs: Ninguno
-->

# PresupuestosPro Constitution

## Core Principles

### I. Simplicidad ante todo
Ante dos soluciones posibles, se DEBE elegir siempre la más simple. Al tratarse de una versión 1 (V1), queda estrictamente prohibida la complejidad anticipada, las abstracciones innecesarias y la sobreingeniería (principio YAGNI).

### II. Idioma y Mercado Español
Todo el producto —interfaz de usuario, etiquetas, mensajes de error, formatos numéricos y de fechas, y los presupuestos generados en PDF— DEBE estar íntegramente en español de España (es-ES). La moneda obligatoria es el Euro (€).

### III. Cero Alcance Fantasma
Queda prohibido implementar cualquier funcionalidad que no esté explícitamente redactada y acordada en la especificación (`spec.md`). Si surge una nueva idea durante el desarrollo, DEBE registrarse como propuesta futura y NUNCA construirse directamente en la versión en curso.

### IV. Verificable por Personas No Técnicas
Cada criterio de aceptación y resultado esperado DEBE poder comprobarse de forma visual y funcional utilizando la aplicación web, sin requerir inspección de código fuente, consultas a bases de datos ni uso de consola o terminal.

### V. Privacidad y Datos con Respeto
La aplicación DEBE solicitar únicamente la información imprescindible para la confección del presupuesto en PDF. Queda terminantemente prohibido introducir claves de API, contraseñas o cualquier tipo de secreto en el código fuente o repositorios.

## Restricciones del Proyecto

- **Enfoque V1**: Aplicación web orientada exclusivamente a freelancers y profesionales autónomos para crear y descargar presupuestos profesionales en PDF de manera rápida y sin fricción.
- **Seguridad**: Cero secretos o datos sensibles expuestos en el frontend o en el control de versiones.

## Flujo de Trabajo y Verificación

- **Especificación previa obligatoria**: Ningún desarrollo comenzará sin una especificación clara y aprobada.
- **Validación funcional**: Toda entrega se valida directamente en navegador simulando el flujo real del usuario final.

## Governance

- **Supremacía**: Esta constitución rige el desarrollo y prevalece sobre cualquier decisión informal o preferencia técnica.
- **Enmiendas**: Toda modificación o adición de principios exige actualizar este documento, justificar el cambio y registrar la versión correspondiente.
- **Versionado Semántico**:
  - `MAJOR`: Modificación o eliminación de principios existentes.
  - `MINOR`: Incorporación de nuevos principios o directrices materiales.
  - `PATCH`: Clarificaciones de redacción, corrección de erratas y ajustes no semánticos.
- **Cumplimiento**: Cada tarea y revisión de código DEBE verificar el estricto cumplimiento de estos principios.

**Version**: 2.0.0 | **Ratified**: 2026-10-02 | **Last Amended**: 2026-10-03
