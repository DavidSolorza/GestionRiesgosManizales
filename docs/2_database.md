# Documento de Base de Datos
## Script DDL Inmaculado

```sql
CREATE TABLE risk_assessments (
    id UUID PRIMARY KEY NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    severity_level INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE risk_mitigations (
    id UUID PRIMARY KEY NOT NULL,
    risk_assessment_id UUID NOT NULL,
    action_plan TEXT NOT NULL,
    assigned_to UUID NOT NULL,
    status VARCHAR(50) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_risk_assessment
        FOREIGN KEY (risk_assessment_id)
        REFERENCES risk_assessments(id)
        ON DELETE CASCADE
);
```

## Diccionario de Datos Exhaustivo

### Tabla: `risk_assessments`
| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción Detallada |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, NOT NULL` | Identificador único global e inmutable del riesgo. |
| `title` | `VARCHAR(255)` | `NOT NULL` | Título corto que describe el riesgo. |
| `description` | `TEXT` | `NULL` | Descripción detallada del riesgo evaluado. |
| `severity_level` | `INTEGER` | `NOT NULL` | Nivel de severidad del riesgo (ej. 1 a 5). |
| `status` | `VARCHAR(50)` | `NOT NULL` | Estado actual (ej. `open`, `mitigated`, `closed`). |
| `created_at` | `TIMESTAMP` | `NOT NULL` | Fecha de creación del registro. |
| `updated_at` | `TIMESTAMP` | `NOT NULL` | Fecha de última modificación. |

### Tabla: `risk_mitigations`
| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción Detallada |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, NOT NULL` | Identificador único global de la mitigación. |
| `risk_assessment_id` | `UUID` | `FOREIGN KEY, NOT NULL` | Relación con el riesgo a mitigar. |
| `action_plan` | `TEXT` | `NOT NULL` | Plan de acción detallado para mitigar el riesgo. |
| `assigned_to` | `UUID` | `NOT NULL` | ID del usuario responsable de la mitigación. |
| `status` | `VARCHAR(50)` | `NOT NULL` | Estado de la mitigación (ej. `pending`, `in_progress`, `completed`). |
| `created_at` | `TIMESTAMP` | `NOT NULL` | Fecha de registro de la mitigación. |
