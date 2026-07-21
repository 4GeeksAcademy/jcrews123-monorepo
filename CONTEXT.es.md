# CONTEXTO — Brasaland · Hito 3: Talent Pipeline Tracker

> **Ruta en el repositorio:** `uis/talent-pipeline-tracker/`

---

## Tu empresa

Formas parte del equipo **Brasaland Digital**, la unidad tecnológica interna de Brasaland, una cadena de restaurantes de comida a la parrilla con 14 sedes en Colombia y Florida. Tu trabajo es construir las herramientas que los equipos operativos usan cada día.

---

## El encargo

Ashley Turner, People Manager, ha enviado el siguiente correo con Nicolás Park, CTO, en copia:

> **Para:** Nicolás Park (CTO)
> **CC:** Equipo Brasaland Digital
> **Asunto:** URGENTE — Necesitamos la herramienta de gestión de candidatos esta semana
>
> Nicolás,
>
> Te escribo directamente porque ya no podemos gestionar el proceso de selección de **Executive Assistant** en una hoja de Google. Tenemos más de cien postulaciones y tres personas editando el mismo archivo a la vez. Esta mañana perdimos los datos de dos candidatos por un conflicto de guardado.
>
> Entiendo que el backend está listo. Necesito que alguien del equipo construya el frontend esta semana — esto no puede esperar más.
>
> Lo que necesito que haga la herramienta:
>
> - Mostrar todos los candidatos de un vistazo: nombre, puesto, estado y etapa.
> - Filtrar por estado y etapa, y buscar por nombre o correo sin recargar la página.
> - Abrir el detalle de un candidato y actualizar su estado o etapa desde ahí.
> - Añadir notas internas después de cada llamada o entrevista, y eliminarlas cuando ya no hagan falta.
> - Registrar candidatos que postulan por otros canales y corregir datos cuando lleguen mal.
>
> Gracias por escalarlo.
>
> Ashley

---

## Contexto de la búsqueda activa

| Campo    | Valor                                                                                         |
| -------- | --------------------------------------------------------------------------------------------- |
| Puesto   | Executive Assistant                                                                           |
| Empresa  | Brasaland                                                                                     |
| Ubicación| Sede corporativa, Medellín                                                                    |
| Perfil   | Experiencia en apoyo ejecutivo, gestión de agenda y viajes, inglés profesional                |

---

## API y datos

La API mock está desplegada de forma central y se comparte entre todos los contextos de empresa del curso. Campos, valores y estructura son los de la especificación técnica del backend. No hace falta adaptarlos.

URL base: `https://playground.4geeks.com/tracker/api/v1`

### Valores de `status`

| Valor API     | Etiqueta UI   |
| ------------- | ------------- |
| `received`    | Received      |
| `in_progress` | In progress   |
| `selected`    | Selected      |
| `discarded`   | Discarded     |

### Valores de `stage`

| Valor API             | Etiqueta UI         |
| --------------------- | ------------------- |
| `pending`             | Pending review      |
| `review`              | Under review        |
| `personal_interview`  | Personal interview  |
| `technical_interview` | Technical interview |
| `offer_presented`     | Offer presented     |

> Los valores crudos de la API (`in_progress`, `personal_interview`, etc.) nunca deben verse en la interfaz. Usa siempre las etiquetas de esta tabla.

---

## Criterios de aceptación específicos

- Los campos de estado y etapa muestran etiquetas legibles, nunca valores crudos de la API.
- Las notas solo son visibles en la vista de detalle del candidato.
- El formulario de registro incluye todos los campos requeridos por la API.

---

_Documento interno — 4Geeks Academy · AI Engineering Track_
