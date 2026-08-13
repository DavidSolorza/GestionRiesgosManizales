# Especificación de API

## `GET /api/v1/risk-assessments`
Obtiene una lista paginada de evaluaciones de riesgo.

### Payload de Respuesta (Éxito)
**`200 OK`**
```json
{
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Riesgo de Inundación",
      "severity_level": 5,
      "status": "open"
    }
  ],
  "meta": {
    "total": 1,
    "page": 1
  }
}
```

## `POST /api/v1/risk-assessments`
Crea una nueva evaluación de riesgo.

### Payload de Entrada
```json
{
  "title": "Riesgo de Inundación",
  "description": "Alta probabilidad de inundación en zona sur",
  "severity_level": 5
}
```

### Matriz de Respuestas
**`201 Created`**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "title": "Riesgo de Inundación",
  "severity_level": 5,
  "status": "open"
}
```

**`400 Bad Request`**
```json
{
  "error_code": "INVALID_SEVERITY",
  "message": "El nivel de severidad debe estar entre 1 y 5."
}
```

**`401 Unauthorized`**
```json
{
  "error_code": "UNAUTHORIZED",
  "message": "Falta token de autenticación o es inválido."
}
```

**`422 Unprocessable Entity`**
```json
{
  "error_code": "VALIDATION_ERROR",
  "message": "El campo 'title' es requerido."
}
```

**`500 Internal Server Error`**
```json
{
  "error_code": "INTERNAL_ERROR",
  "message": "Fallo inesperado del sistema al registrar el riesgo."
}
```
