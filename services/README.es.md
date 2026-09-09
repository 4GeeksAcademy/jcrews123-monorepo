# Carpeta `services`

Todos los servicios backend (APIs y workers) del monorepo Brasaland Digital.

Cada subcarpeta es **un servicio** con su propio README, instrucciones de ejecución y dependencias.

## Servicios

| Servicio | Ruta | Puerto | Descripción |
|----------|------|--------|-------------|
| **Brasaland API** | [`api/`](./api/) | 8000 | FastAPI — análisis CSV de incidentes (`POST /api/incidents/analyze`, `GET /api/incidents/results/export`). Primer servicio backend; inventario y otros dominios ampliarán esta app más adelante. |

Ver [`api/README.md`](./api/README.md) para configuración y endpoints.

> _English version: [README.md](./README.md)._
