# Carpeta `packages`

Paquetes compartidos del monorepo: librerías internas, tipos y código reutilizable entre apps, servicios o scripts.

Cada subcarpeta es **un paquete versionable** con su propio README.

## Paquetes

| Paquete | Lenguaje | Consumidores | Descripción |
|---------|----------|--------------|-------------|
| [`shared/`](./shared/) | TypeScript | Frontends (futuro) | `@repo/shared-types` — tipos TS compartidos |
| [`incident-analysis/`](./incident-analysis/) | Python | `scripts/analyze.py`, `services/api/` | Validación CSV de incidentes Brasaland, métricas, export |

Añade paquetes aquí cuando la lógica se comparta entre dos o más entregables.

> _English version: [README.md](./README.md)._
