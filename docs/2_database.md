# Modelo y Diccionario de Datos (Supabase / PostgreSQL)
**Módulo:** Integración Backend Supabase
**Fecha:** 2026-08-13
**Autor:** Agente 3 (Principal DBA)

## 1. Script DDL (Data Definition Language)
Este script debe ser ejecutado en el **SQL Editor** de Supabase para inicializar las tablas con las restricciones exactas requeridas por el negocio.

```sql
-- Habilitar extensión para UUIDs (si no está habilitada)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------
-- TABLA: reports (Reportes de Emergencia)
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    latitude NUMERIC(10, 7) NOT NULL,
    longitude NUMERIC(10, 7) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'requiere_ayuda' CHECK (status IN ('requiere_ayuda', 'en_proceso', 'atendidos')),
    reporter_name VARCHAR(150) NOT NULL,
    reporter_phone VARCHAR(50) NOT NULL,
    needs VARCHAR(255) DEFAULT 'Otros',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Índices para optimizar búsquedas por estado y ubicación
CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON public.reports(created_at DESC);

-- ----------------------------------------------------
-- TABLA: offers (Ofrecimientos de Ayuda)
-- ----------------------------------------------------
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_name VARCHAR(150) NOT NULL,
    provider_phone VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL CHECK (category IN ('Alimentos', 'Agua', 'Refugio', 'Voluntariado', 'Herramientas', 'Atención Médica', 'Otro')),
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_offers_created_at ON public.offers(created_at DESC);

-- Habilitar RLS (Row Level Security) para permitir inserciones públicas pero lectura pública sin restricciones 
-- (Al ser una app de emergencia pública sin Auth, abrimos los policies básicos)
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

-- Políticas públicas
CREATE POLICY "Allow public read access on reports" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Allow public insert on reports" ON public.reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on reports" ON public.reports FOR UPDATE USING (true);

CREATE POLICY "Allow public read access on offers" ON public.offers FOR SELECT USING (true);
CREATE POLICY "Allow public insert on offers" ON public.offers FOR INSERT WITH CHECK (true);
```

## 2. Diccionario de Datos Exhaustivo

### Tabla: `reports`
| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción Detallada |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, NOT NULL` | Identificador único global autogenerado. |
| `title` | `VARCHAR(255)` | `NOT NULL` | Título breve de la emergencia. |
| `description` | `TEXT` | `NOT NULL` | Descripción detallada de la situación y requerimientos. |
| `latitude` | `NUMERIC(10, 7)` | `NOT NULL` | Coordenada geográfica (Latitud). |
| `longitude` | `NUMERIC(10, 7)` | `NOT NULL` | Coordenada geográfica (Longitud). |
| `status` | `VARCHAR(50)` | `NOT NULL, DEFAULT 'requiere_ayuda'` | Estado de la emergencia. Restringido a: `requiere_ayuda`, `en_proceso`, `atendidos`. |
| `reporter_name` | `VARCHAR(150)` | `NOT NULL` | Nombre completo del ciudadano que reporta. Obligatorio. |
| `reporter_phone`| `VARCHAR(50)` | `NOT NULL` | Número telefónico de contacto para rescate/verificación. |
| `needs` | `VARCHAR(255)` | `DEFAULT 'Otros'` | Categoría de necesidad principal (Ej. Agua, Rescate). |
| `created_at` | `TIMESTAMPZ` | `NOT NULL, DEFAULT now()` | Marca de tiempo UTC de creación del reporte. |

### Tabla: `offers`
| Nombre de Columna | Tipo de Datos Exacto | Restricciones | Regla de Negocio / Descripción Detallada |
| :--- | :--- | :--- | :--- |
| `id` | `UUID` | `PRIMARY KEY, NOT NULL` | Identificador único global autogenerado. |
| `provider_name` | `VARCHAR(150)` | `NOT NULL` | Nombre completo del donante / voluntario. |
| `provider_phone`| `VARCHAR(50)` | `NOT NULL` | Número de contacto del donante. |
| `category` | `VARCHAR(100)` | `NOT NULL` | Categoría de la ayuda ofrecida. Restringida por CHECK. |
| `description` | `TEXT` | `NOT NULL` | Detalles de lo que se ofrece (cantidades, tiempos, etc). |
| `created_at` | `TIMESTAMPZ` | `NOT NULL, DEFAULT now()` | Marca de tiempo UTC de registro de la oferta. |
