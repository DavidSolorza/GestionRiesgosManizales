# 🛡️ REPORTE DE AUDITORÍA TÉCNICA — GestionRiesgosManizales
**Rol:** Ingeniero Senior de Seguridad y Calidad (QA/SecOps)  
**Fecha:** 2026-08-13  
**Stack:** React 19 + TypeScript + Zustand + Vite + Supabase REST (HTTP nativo) + TailwindCSS 4  
**Análisis:** Estático (oxlint + tsc), Revisión manual de código, OWASP Top 10 Frontend  

---

## RESUMEN EJECUTIVO

El sistema es una aplicación de gestión de riesgos ciudadanos para Manizales. El código es **funcional y estructuralmente sólido** con una arquitectura de Vertical Slicing bien ejecutada. Sin embargo, se identificaron **12 hallazgos** distribuidos en 3 categorías de severidad. El hallazgo más crítico es una **contraseña de administrador hardcodeada en el código fuente** visible en el repositorio Git. Los demás hallazgos abarcan credenciales expuestas en `.env` versionado, falta de autorización server-side, race conditions y antipatrones de calidad.

---

## [HALLAZGOS]

### 🔴 SEVERIDAD CRÍTICA

#### HALLAZGO-01: Contraseña de Administrador Hardcodeada en Código Fuente
**Archivo:** [`AdminLoginModal.tsx`](file:///d:/escritorio/para%20entregar/GestionRiesgosManizales/src/components/ui/AdminLoginModal.tsx#L14)  
**Línea:** 14  
**OWASP:** A07:2021 – Identification and Authentication Failures  

```typescript
// ❌ CÓDIGO ACTUAL — CRÍTICO
if (password === 'admin123') {
```

La contraseña `admin123` está **embebida en texto plano** directamente en el bundle de JavaScript que se sirve al cliente. **Cualquier usuario** puede inspeccionarla con DevTools → Sources o en el JS minificado del `dist/`. Adicionalmente, el estado de administrador (`isAdmin`) vive únicamente en memoria cliente (Zustand), lo que significa que puede ser manipulado con `__ZUSTAND__` store desde la consola del navegador.

---

#### HALLAZGO-02: `.env` con Credenciales Reales NO está en `.gitignore`
**Archivo:** [`.gitignore`](file:///d:/escritorio/para%20entregar/GestionRiesgosManizales/.gitignore)  
**OWASP:** A02:2021 – Cryptographic Failures / Secret Exposure  

El archivo `.gitignore` usa el patrón `*.local` para ignorar archivos de entorno, pero el archivo `.env` (sin sufijo `.local`) **está siendo versionado**. El `git log` confirma que el repositorio tiene historial. Las credenciales `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` con valores reales están en el repositorio.

```
# .gitignore actual — INCOMPLETO
*.local     # ← Solo ignora .env.local, .env.development.local, etc.
            # ← NO ignora .env, que contiene credenciales reales
```

---

#### HALLAZGO-03: Autorización de Admin Exclusivamente Client-Side (Broken Access Control)
**Archivo:** [`useEmergencyStore.ts`](file:///d:/escritorio/para%20entregar/GestionRiesgosManizales/src/features/emergency_map/application/useEmergencyStore.ts#L56) / [`Sidebar.tsx`](file:///d:/escritorio/para%20entregar/GestionRiesgosManizales/src/features/emergency_map/infrastructure/views/Sidebar.tsx#L5)  
**OWASP:** A01:2021 – Broken Access Control  

El flag `isAdmin: boolean` en el store de Zustand controla el acceso al panel administrativo. Sin embargo:
1. Cualquier usuario puede ejecutar `window.__zustand_store.setState({ isAdmin: true })` en la consola.
2. Las mutaciones de estado (PATCH `/reports?id=eq.X`) se ejecutan con la misma `PUBLISHABLE_KEY` que las lecturas públicas, sin ninguna validación server-side de rol.
3. La `PUBLISHABLE_KEY` usada en `HttpClient.ts` (`Authorization: Bearer <key>`) corresponde a la clave anónima de Supabase que **no tiene privilegios de escritura en producción** si las RLS (Row-Level Security) están configuradas correctamente. Si **no** están configuradas, cualquier visitante puede PATCH sin autenticarse.

---

### 🟠 SEVERIDAD ALTA

#### HALLAZGO-04: Desincronización de Fuentes de Configuración de Entorno
**Archivos:** [`env.ts`](file:///d:/escritorio/para%20entregar/GestionRiesgosManizales/src/core/config/env.ts) vs [`HttpClient.ts`](file:///d:/escritorio/para%20entregar/GestionRiesgosManizales/src/core/http/HttpClient.ts)  

Existe un archivo centralizado de entorno en `src/core/config/env.ts` creado precisamente para ser la **única fuente de verdad** de las variables de entorno. Sin embargo, `HttpClient.ts` accede a `import.meta.env` directamente, ignorando por completo este módulo. Esto genera dos problemas:

- El `env.ts` usa `VITE_SUPABASE_ANON_KEY` pero el `.env` define `VITE_SUPABASE_PUBLISHABLE_KEY` → **la llave del `env.ts` siempre será `'dummy-key'`**.
- Si se cambia el nombre de una variable de entorno, hay que actualizarla en múltiples lugares.

```typescript
// env.ts — Referencia a variable INEXISTENTE en .env
supabaseKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'dummy-key',
//                           ^^^^^^^^^^^^^^^^^^^^^ 
// .env define: VITE_SUPABASE_PUBLISHABLE_KEY
```

---

#### HALLAZGO-05: XSS Incompleto — Sanitización Inconsistente entre Componentes
**Archivos:** [`MapView.tsx`](file:///d:/escritorio/para%20entregar/GestionRiesgosManizales/src/features/emergency_map/infrastructure/views/MapView.tsx#L70-L71) / [`Sidebar.tsx`](file:///d:/escritorio/para%20entregar/GestionRiesgosManizales/src/features/emergency_map/infrastructure/views/Sidebar.tsx#L115)  
**OWASP:** A03:2021 – Injection  

`MapView.tsx` implementa una función `sanitizeHTML` (escape de `<` y `>`) antes de renderizar datos del servidor en el Popup de Leaflet. Sin embargo, `Sidebar.tsx` renderiza los mismos campos **sin ningún tipo de sanitización**:

```tsx
// MapView.tsx — CON sanitización ✅
<h3>{sanitizeHTML(report.title)}</h3>

// Sidebar.tsx — SIN sanitización ❌ (misma data del servidor)
<h3 className="...">{report.title}</h3>
<p className="...">{report.description}</p>
<span>{report.reporterName}</span>
```

> Nota: React escapa el JSX por defecto previniendo XSS DOM-based en renders normales. Sin embargo, si en el futuro se usa `dangerouslySetInnerHTML` (actualmente no se usa en Sidebar), esta inconsistencia se vuelve una vulnerabilidad activa. El Leaflet Popup usa innerHTML internamente, por lo que la sanitización en MapView sí es necesaria y correcta. La inconsistencia debe corregirse de todas formas para estandarizar la defensa.

---

#### HALLAZGO-06: Race Condition en `submitReport` — Validación de Guard Rota
**Archivo:** [`useEmergencyStore.ts`](file:///d:/escritorio/para%20entregar/GestionRiesgosManizales/src/features/emergency_map/application/useEmergencyStore.ts#L122-L124)  

```typescript
// Líneas 122-124
submitReport: async (reportData) => {
  const { selectedLocation, isSubmitting } = get();
  if (!selectedLocation || isSubmitting) return false;
  set({ isSubmitting: true }); // ← Hay un gap entre el check y el set
```

Entre la lectura de `isSubmitting` y el `set({ isSubmitting: true })` existe una ventana de tiempo. En un entorno de React Concurrent Mode o si se dispara el evento `onSubmit` dos veces muy rápido (doble-tap en móvil), ambas llamadas pueden pasar el guard `isSubmitting === false` simultáneamente antes de que el estado sea actualizado, resultando en dos peticiones POST a la API.

---

#### HALLAZGO-07: `emergencyService.ts` — Servicio Fantasma No Conectado
**Archivo:** [`emergencyService.ts`](file:///d:/escritorio/para entregar/GestionRiesgosManizales/src/features/emergency_map/infrastructure/emergencyService.ts)  

El archivo `emergencyService.ts` implementa la interfaz `IEmergencyRepository` con datos en memoria (stub), pero **nunca es importado ni utilizado** en ninguna parte del codebase. El store usa directamente `supabaseService`. Este archivo actúa como código muerto y genera confusión arquitectónica: sugiere que el dominio tiene un repositorio desacoplado, pero la implementación real (supabaseService) no implementa `IEmergencyRepository`.

---

#### HALLAZGO-08: `severity` — Campo de Dominio Ignorado en Persistencia
**Archivo:** [`supabaseService.ts`](file:///d:/escritorio/para entregar/GestionRiesgosManizales/src/features/emergency_map/infrastructure/supabaseService.ts#L12)  

```typescript
// Línea 12 en getReports()
severity: 'high', // Dummy mapping if not in DB
```

El campo `severity` del dominio `EmergencyReport` es hardcodeado a `'high'` para **todos los reportes cargados desde la base de datos**. Esto significa que la selección de severidad que el usuario hace en el formulario (`low | medium | high | critical`) se persiste correctamente al crear (línea 42: `severity: report.severity`), pero se **desecha completamente al leer** desde la BD. El dato existe en la BD pero no se mapea al leer.

---

### 🟡 SEVERIDAD MEDIA

#### HALLAZGO-09: Tiempo Relativo Generado con `Math.random()` — UI No Determinista
**Archivo:** [`Sidebar.tsx`](file:///d:/escritorio/para entregar/GestionRiesgosManizales/src/features/emergency_map/infrastructure/views/Sidebar.tsx#L111)  
**Línea:** 111  

```tsx
<span>Hace {Math.floor(Math.random() * 60) + 1} min</span>
```

El tiempo mostrado al usuario es completamente aleatorio y cambia en cada re-render del componente. Esto hace que la UI sea **no determinista** y confusa: un reporte puede mostrar "Hace 3 min" y al segundo "Hace 47 min". El campo `createdAt: string` está disponible en el dominio y debería usarse para calcular el tiempo relativo real.

---

#### HALLAZGO-10: Polling sin AbortController — Memory Leak Potencial
**Archivo:** [`useEmergencyStore.ts`](file:///d:/escritorio/para entregar/GestionRiesgosManizales/src/features/emergency_map/application/useEmergencyStore.ts#L101-L113)  

El `fetch()` dentro de `fetchReports` y `fetchOffers` no usa `AbortController`. Si el componente se desmonta (o el polling se detiene) mientras una petición HTTP está en vuelo, la respuesta intentará actualizar el estado de un componente ya desmontado. Aunque Zustand maneja esto mejor que el estado local de React, la ausencia de cancelación puede dejar requests huérfanos que consumen banda y procesan respuestas inútilmente.

---

#### HALLAZGO-11: `updateReportStatus` — Error Silenciado sin Logging
**Archivo:** [`useEmergencyStore.ts`](file:///d:/escritorio/para entregar/GestionRiesgosManizales/src/features/emergency_map/application/useEmergencyStore.ts#L176-L178)  

```typescript
} catch(error) {  // ← 'error' capturado pero nunca usado (detectado por oxlint)
  get().showToast('Error al actualizar el estado.');
  return false;
}
```

Cuando falla la actualización de estado de un reporte, el error se silencia completamente. Un operador de emergencias que intente marcar un reporte como "atendido" y falle no tendrá ninguna información de diagnóstico. El oxlint ya detectó esto como warning.

---

#### HALLAZGO-12: `HttpClient` — Sin Timeout Configurado en `fetch()`
**Archivo:** [`HttpClient.ts`](file:///d:/escritorio/para entregar/GestionRiesgosManizales/src/core/http/HttpClient.ts)  

El cliente HTTP no establece un timeout. En escenarios de emergencia (alta carga de red, infraestructura degradada), una petición `fetch()` puede quedar colgada indefinidamente. El browser tiene un timeout por defecto muy largo (varios minutos). El `isLoading` y el `isSubmitting` quedarán en `true` bloqueando la UI del operador.

---

## [COMPARATIVA]

| Área | Estado Actual | Estándar de la Industria |
|:---|:---|:---|
| **Autenticación Admin** | Contraseña en texto plano en el bundle JS | JWT firmado server-side con expiración; validación en cada petición a la API |
| **Secretos** | `.env` versionado con credenciales reales | `.env` en `.gitignore`; gestión con vault (Doppler, GitHub Secrets, Vercel Env) |
| **Autorización** | Flag booleano en estado cliente (manipulable) | RLS en Supabase + token con claim de rol validado en cada request |
| **Configuración de Entorno** | Dos fuentes de verdad desincronizadas | Un único módulo `env.ts` importado por todos; validación con `Zod` al arranque |
| **Sanitización** | Inconsistente entre componentes | Una función centralizada de sanitización aplicada uniformemente; DOMPurify para contenido HTML |
| **Logging de Errores** | `console.error` o silencio total | Sistema estructurado (Sentry, Datadog) con contexto, severidad y trazabilidad |
| **Resiliencia HTTP** | Sin timeout, sin retry, sin AbortController | `AbortController` con timeout; retry exponencial; circuit-breaker pattern |
| **Tiempo Relativo** | `Math.random()` — no determinista | Calculado con `Intl.RelativeTimeFormat` usando el campo `createdAt` real |
| **Código Muerto** | `emergencyService.ts` nunca importado | Sin código muerto; el patrón Repository implementado y vinculado correctamente |

---

## [PLAN DE ACCIÓN Y SOLUCIONES]

### FIX-01 (CRÍTICO): Eliminar Contraseña Hardcodeada del Código

**Paso 1:** Mover la contraseña a una variable de entorno:

```bash
# .env
VITE_ADMIN_PASSWORD_HASH=5e884898da28047151d0e56f8dc6292773603d0d5f2082b83...
# ⚠️ En producción, usar hash bcrypt, no el password en texto plano
```

**Paso 2:** Refactorizar `AdminLoginModal.tsx`:

```typescript
// ✅ SOLUCIÓN — AdminLoginModal.tsx
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // En producción: comparar hash del password con la variable de entorno
  // Por ahora, comparar con variable de entorno (NO en bundle si es VITE_ prefix)
  // MEJOR PRÁCTICA REAL: Crear un endpoint POST /api/admin/login en el backend
  // que valide y devuelva un JWT. Nunca comparar en el cliente.
  
  // Solución mínima viable para este proyecto (sin backend dedicado):
  // Usar un endpoint de Supabase Edge Function para validar
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;
  if (!adminPassword) {
    setError('Sistema de autenticación no configurado.');
    return;
  }
  if (password === adminPassword) {
    setIsAdmin(true);
    setAdminLoginOpen(false);
    showToast('Modo administrador activado');
    setPassword('');
  } else {
    setError('Contraseña incorrecta');
  }
};
```

> ⚠️ **Nota arquitectónica**: La solución definitiva es un endpoint de autenticación server-side que devuelva un JWT con claim `role: 'admin'`, usado para firmar las peticiones PATCH. La solución anterior es un paso intermedio para sacar la contraseña del código fuente.

---

### FIX-02 (CRÍTICO): Proteger el `.env` del Versionado

```bash
# Paso 1: Agregar .env al .gitignore INMEDIATAMENTE
echo ".env" >> .gitignore

# Paso 2: Remover .env del historial de Git (OBLIGATORIO)
git rm --cached .env
git commit -m "security: remove .env from version control"

# Paso 3: Crear .env.example con variables sin valores
```

```bash
# .env.example (SÍ versionar — sin valores reales)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key_here
VITE_ADMIN_PASSWORD=your_admin_password_here
```

```diff
# .gitignore — AÑADIR
+ .env
+ .env.*
  *.local
```

> ⚠️ **Alerta de Seguridad**: Las credenciales actuales (URL y key de Supabase) ya están comprometidas porque están en el historial de Git. Se **debe rotar la API key de Supabase** desde el dashboard de Supabase → Settings → API → Regenerate key, independientemente de si se purga el historial.

---

### FIX-03 (CRÍTICO): Habilitar Row-Level Security en Supabase

Configurar en Supabase SQL Editor para que la `PUBLISHABLE_KEY` solo pueda leer, no escribir:

```sql
-- Habilitar RLS en la tabla reports
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Política: TODOS pueden leer
CREATE POLICY "reports_select_public"
  ON reports FOR SELECT
  USING (true);

-- Política: TODOS pueden insertar (crear reportes es público)
CREATE POLICY "reports_insert_public"
  ON reports FOR INSERT
  WITH CHECK (true);

-- Política: SOLO el rol 'service_role' puede actualizar (requiere key privada server-side)
-- Con la arquitectura actual (sin backend), usar un secret diferente para PATCH:
CREATE POLICY "reports_update_restricted"
  ON reports FOR UPDATE
  USING (auth.role() = 'service_role');

-- Aplicar lo mismo a la tabla offers
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "offers_select_public" ON offers FOR SELECT USING (true);
CREATE POLICY "offers_insert_public" ON offers FOR INSERT WITH CHECK (true);
```

---

### FIX-04 (ALTA): Unificar la Fuente de Configuración de Entorno

Refactorizar `env.ts` para ser la única fuente de verdad con validación:

```typescript
// ✅ SOLUCIÓN — src/core/config/env.ts
const requireEnv = (key: string): string => {
  const value = import.meta.env[key];
  if (!value) {
    // En producción, esto fallará fast y de forma clara
    throw new Error(`[Config Error] Variable de entorno requerida no encontrada: ${key}`);
  }
  return value;
};

export const env = {
  supabaseUrl: requireEnv('VITE_SUPABASE_URL'),
  // CORREGIDO: usar el mismo nombre que está en .env
  supabaseKey: requireEnv('VITE_SUPABASE_PUBLISHABLE_KEY'),
  adminPassword: import.meta.env.VITE_ADMIN_PASSWORD ?? '',
  isProduction: import.meta.env.PROD,
} as const;
```

```typescript
// ✅ SOLUCIÓN — src/core/http/HttpClient.ts
// Importar desde env.ts en lugar de acceder a import.meta.env directamente
import { env } from '../config/env';

export class HttpClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = env.supabaseUrl;
    this.apiKey = env.supabaseKey;
  }
  // ... resto del código
}
```

---

### FIX-05 (ALTA): Corregir el Mapeo de `severity` desde la BD

```typescript
// ✅ SOLUCIÓN — supabaseService.ts, función getReports()
const VALID_SEVERITIES = ['low', 'medium', 'high', 'critical'] as const;
type ValidSeverity = typeof VALID_SEVERITIES[number];

const parseSeverity = (value: unknown): ValidSeverity => {
  if (typeof value === 'string' && VALID_SEVERITIES.includes(value as ValidSeverity)) {
    return value as ValidSeverity;
  }
  return 'high'; // Fallback defensivo, pero con logging
};

// En getReports():
return data.map(item => ({
  id: item.id,
  title: item.title,
  description: item.description,
  severity: parseSeverity(item.severity), // ← Leer desde BD, con fallback seguro
  status: item.status,
  // ... resto del mapeo
}));
```

---

### FIX-06 (ALTA): Resolver Race Condition en `submitReport`

```typescript
// ✅ SOLUCIÓN — useEmergencyStore.ts
submitReport: async (reportData) => {
  // Usar set atómico para leer y actualizar en una sola operación
  let canProceed = false;
  set((state) => {
    if (!state.selectedLocation || state.isSubmitting) {
      return state; // No mutación, no procede
    }
    canProceed = true;
    return { isSubmitting: true }; // Actualización atómica
  });
  
  if (!canProceed) return false;
  
  const { selectedLocation } = get();
  if (!selectedLocation) return false;

  try {
    const newReport = await supabaseService.createReport({
      ...reportData,
      coordinates: selectedLocation,
    });
    set(state => ({ 
      reports: [newReport, ...state.reports],
      selectedLocation: null,
      isSubmitting: false 
    }));
    return true;
  } catch (error) {
    console.error('Failed to submit report', error);
    get().showToast('Error al enviar el reporte.');
    set({ isSubmitting: false });
    return false;
  }
},
```

---

### FIX-07 (ALTA): Agregar Timeout y AbortController al HttpClient

```typescript
// ✅ SOLUCIÓN — src/core/http/HttpClient.ts
import { env } from '../config/env';

const DEFAULT_TIMEOUT_MS = 15000; // 15 segundos

export class HttpClient {
  private baseUrl: string;
  private apiKey: string;

  constructor() {
    this.baseUrl = env.supabaseUrl;
    this.apiKey = env.supabaseKey;
  }

  private get headers() {
    return {
      'Content-Type': 'application/json',
      'apikey': this.apiKey,
      'Authorization': `Bearer ${this.apiKey}`,
      'Prefer': 'return=representation'
    };
  }

  private async fetchWithTimeout(
    url: string, 
    options: RequestInit, 
    timeoutMs = DEFAULT_TIMEOUT_MS
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      return response;
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        throw new Error(`La solicitud excedió el tiempo límite de ${timeoutMs / 1000}s. Verifica tu conexión.`);
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await this.fetchWithTimeout(
      `${this.baseUrl}/rest/v1/${endpoint}`,
      { method: 'GET', headers: this.headers }
    );
    return this.handleResponse<T>(response);
  }

  async post<T>(endpoint: string, body: unknown): Promise<T> {
    const response = await this.fetchWithTimeout(
      `${this.baseUrl}/rest/v1/${endpoint}`,
      { method: 'POST', headers: this.headers, body: JSON.stringify(body) }
    );
    return this.handleResponse<T>(response);
  }

  async patch<T>(endpoint: string, body: unknown): Promise<T> {
    const response = await this.fetchWithTimeout(
      `${this.baseUrl}/rest/v1/${endpoint}`,
      { method: 'PATCH', headers: this.headers, body: JSON.stringify(body) }
    );
    return this.handleResponse<T>(response);
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorBody: { message?: string; details?: string };
      try {
        errorBody = await response.json();
      } catch {
        errorBody = { message: response.statusText };
      }
      // Log estructurado del error
      console.error('[HttpClient] Error de API:', {
        status: response.status,
        url: response.url,
        body: errorBody,
      });
      throw new Error(errorBody.message || errorBody.details || `HTTP ${response.status}: Solicitud fallida`);
    }
    
    const text = await response.text();
    return text ? JSON.parse(text) : {} as T;
  }
}

export const httpClient = new HttpClient();
```

> **Nota:** El parámetro `body` cambió de `any` a `unknown`, forzando tipado explícito en los llamadores.

---

### FIX-08 (MEDIA): Reemplazar `Math.random()` con Tiempo Relativo Real

```typescript
// ✅ SOLUCIÓN — Agregar una función de utilidad
// src/core/utils/dateUtils.ts (NUEVO ARCHIVO)
export function getRelativeTime(isoDateString: string): string {
  const now = Date.now();
  const then = new Date(isoDateString).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMin < 1) return 'hace un momento';
  if (diffMin < 60) return `hace ${diffMin} min`;
  if (diffHr < 24) return `hace ${diffHr} h`;
  return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
}
```

```tsx
// ✅ SOLUCIÓN — Sidebar.tsx línea 111
// ANTES (❌):
<span>Hace {Math.floor(Math.random() * 60) + 1} min</span>

// DESPUÉS (✅):
import { getRelativeTime } from '../../../../core/utils/dateUtils';
<span>{getRelativeTime(report.createdAt)}</span>
```

---

### FIX-09 (MEDIA): Logging Estructurado en `updateReportStatus`

```typescript
// ✅ SOLUCIÓN — useEmergencyStore.ts
updateReportStatus: async (reportId, status) => {
  try {
    await supabaseService.updateReportStatus(reportId, status);
    set(state => ({
      reports: state.reports.map(r => r.id === reportId ? { ...r, status } : r)
    }));
    get().showToast('Estado del reporte actualizado.');
    return true;
  } catch (error) {
    // ✅ Ahora el error es capturado Y loggeado con contexto
    console.error('[Store] Error actualizando estado del reporte:', {
      reportId,
      targetStatus: status,
      error: error instanceof Error ? error.message : String(error),
    });
    get().showToast('Error al actualizar el estado. Intenta de nuevo.');
    return false;
  }
},
```

---

### FIX-10 (MEDIA): Eliminar Código Muerto y Conectar Correctamente el Repository Pattern

```typescript
// OPCIÓN A: Eliminar emergencyService.ts (recomendado si no se usará)
// Ejecutar: git rm src/features/emergency_map/infrastructure/emergencyService.ts

// OPCIÓN B: Hacer que supabaseService implemente IEmergencyRepository
// src/features/emergency_map/infrastructure/supabaseService.ts

import type { IEmergencyRepository } from '../domain/EmergencyReport';

// ✅ SupabaseService AHORA implementa el contrato del dominio
class SupabaseService implements IEmergencyRepository {
  // ... implementación existente (ya es compatible)
}
```

---

## PRIORIZACIÓN DE CORRECCIONES

| Prioridad | Hallazgo | Esfuerzo Estimado | Impacto |
|:---:|:---|:---:|:---:|
| 1️⃣ | FIX-02: Remover `.env` del repo + rotar keys | 15 min | CRÍTICO |
| 2️⃣ | FIX-01: Eliminar contraseña hardcodeada | 30 min | CRÍTICO |
| 3️⃣ | FIX-03: Habilitar RLS en Supabase | 20 min | CRÍTICO |
| 4️⃣ | FIX-04: Unificar configuración de entorno | 20 min | ALTA |
| 5️⃣ | FIX-07: Timeout + AbortController en HttpClient | 45 min | ALTA |
| 6️⃣ | FIX-06: Race condition en submitReport | 20 min | ALTA |
| 7️⃣ | FIX-05: Mapeo de severity desde BD | 15 min | ALTA |
| 8️⃣ | FIX-08: Tiempo relativo real | 20 min | MEDIA |
| 9️⃣ | FIX-09: Logging estructurado de errores | 15 min | MEDIA |
| 🔟 | FIX-10: Eliminar código muerto | 5 min | BAJA |

---

## RESULTADOS DEL ANÁLISIS ESTÁTICO

```
oxlint — 3 warnings, 0 errors (23 archivos, 104 reglas)
  ⚠ useEmergencyStore.ts:176 — Catch 'error' never used
  ⚠ HttpClient.ts:54 — Catch 'e' never used  
  ⚠ scripts/test-supabase.js:1 — 'fs' imported but never used

tsc --noEmit — 0 errores, 0 warnings
  ✅ El código TypeScript compila limpiamente
```

---

*Auditoría generada por Antigravity (QA/SecOps Agent) — GestionRiesgosManizales v0.0.0*
