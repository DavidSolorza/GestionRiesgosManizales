# Contratos de API (PostgREST Supabase)
**Módulo:** Integración Backend Supabase
**Fecha:** 2026-08-13
**Autor:** Agente 6 (Technical Writer & QA)

Este documento especifica los contratos exactos de red requeridos para comunicarse con la base de datos sin utilizar el SDK. Todas las peticiones deben incluir las cabeceras:
- `apikey: VITE_SUPABASE_PUBLISHABLE_KEY`
- `Authorization: Bearer VITE_SUPABASE_PUBLISHABLE_KEY`
- `Content-Type: application/json`
- `Prefer: return=representation` (Para que los POST devuelvan el objeto creado)

---

## 1. Obtener Reportes (GET)
**Endpoint:** `GET /rest/v1/reports?order=created_at.desc`
**Propósito:** Retorna todos los reportes ordenados por fecha de creación descendente para llenar el mapa y el dashboard.

### Matriz de Respuestas
- **`200 OK`**:
```json
[
  {
    "id": "e9b2512a-3511-4770-8b43-42eab021df6a",
    "title": "Derrumbe en Vía Panamericana",
    "description": "Deslizamiento bloquea ambos carriles...",
    "latitude": 5.06889,
    "longitude": -75.51738,
    "status": "requiere_ayuda",
    "reporter_name": "Carlos Ruiz",
    "reporter_phone": "3001234567",
    "needs": "Rescate",
    "created_at": "2026-08-13T10:00:00Z"
  }
]
```

---

## 2. Crear Reporte (POST)
**Endpoint:** `POST /rest/v1/reports`
**Propósito:** Registrar una nueva emergencia médica o desastre.

### Payload Completo de Entrada
```json
{
  "title": "Inundación en el Centro",
  "description": "El agua ha subido 1 metro en la plaza.",
  "latitude": 5.06889,
  "longitude": -75.51738,
  "reporter_name": "Ana Gómez",
  "reporter_phone": "3119876543",
  "needs": "Refugio"
}
```

### Matriz de Respuestas
- **`201 Created`**: Devuelve el mismo JSON del payload de entrada adjuntando el `id` autogenerado y el `created_at`.
- **`400 Bad Request`**: (Ej. Tipo de dato inválido)
```json
{
  "code": "22P02",
  "details": "Invalid input syntax for type numeric",
  "hint": null,
  "message": "invalid input syntax for type numeric: \"abc\""
}
```

---

## 3. Actualizar Estado de Reporte (PATCH)
**Endpoint:** `PATCH /rest/v1/reports?id=eq.{id}`
**Propósito:** Cambiar el estado de un reporte desde el Panel Admin.

### Payload de Entrada
```json
{
  "status": "en_proceso"
}
```

### Matriz de Respuestas
- **`200 OK`**: Devuelve el registro modificado.

---

## 4. Obtener Ofrecimientos (GET)
**Endpoint:** `GET /rest/v1/offers?order=created_at.desc`
**Propósito:** Listar la solidaridad ciudadana para el dashboard.

### Matriz de Respuestas
- **`200 OK`**: Lista JSON de objetos `Offer`.

---

## 5. Crear Ofrecimiento (POST)
**Endpoint:** `POST /rest/v1/offers`
**Propósito:** Registrar una donación o voluntariado.

### Payload de Entrada
```json
{
  "provider_name": "Fundación Solidaridad",
  "provider_phone": "8885555",
  "category": "Alimentos",
  "description": "Ofrecemos 100 raciones de comida caliente."
}
```

### Matriz de Respuestas
- **`201 Created`**: Objeto creado con UUID autogenerado.
- **`400 Bad Request`**: Si la categoría no está en la restricción CHECK.
