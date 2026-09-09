# Carpeta `scripts`

Scripts auxiliares del monorepo: automatización de desarrollo, utilidades de mantenimiento y tooling interno.

- **Propósito:** Herramientas que no pertenecen a una app, agente o pipeline específico.
- **Convención:** Documentar cada script abajo (qué hace, parámetros, requisitos, ejemplos).

## Scripts

### `analyze.py` — Analizador CSV de incidentes (Fase 1)

Proyecto del syllabus **Company Incident File Analyzer** para Brasaland. Valida y resume exportaciones CSV de incidentes operativos según [`archive/incidents-file-analyzer-plan/incidents-file-analyzer-CONTEXT.md`](../archive/incidents-file-analyzer-plan/incidents-file-analyzer-CONTEXT.md).

| Item | Detalle |
|------|---------|
| **Requisitos** | Python 3.10+; paquete compartido en `packages/incident-analysis/` |
| **Uso** | `python scripts/analyze.py <ruta-al-csv>` |
| **Ejemplo** | `python scripts/analyze.py scripts/incidents-brasaland.csv` |
| **Salida** | Resumen en consola; `results.csv` opcional al confirmar |
| **Archivo de prueba** | `scripts/incidents-brasaland.csv` — muestra de 100 filas del syllabus |

La Fase 2 reutiliza la misma lógica en `services/api/` y `uis/backoffice/app/incidents/`. Ver [`archive/incidents-file-analyzer-plan/`](../archive/incidents-file-analyzer-plan/).

> _English version: [README.md](./README.md)._
