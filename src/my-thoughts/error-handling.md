---
title: "Error Handling & Observability"
category: "Software Engineering"
tags: ["error-handling", "observability", "UX", "architecture"]
interviewRelevance: "high"
difficulty: "intermediate"
date: "2026-06-23"
summary: "Clasificación de errores, principio fail-fast, diseño para dos audiencias y patrones de observability estructurado"
---

## El problema de fondo

Un error no es solo un mensaje. Es una señal para dos audiencias distintas con necesidades opuestas:

- **Desarrollador/soporte**: necesita el detalle técnico completo — stack trace, contexto, versión, entorno
- **Usuario final**: necesita un mensaje accionable — qué pasó, qué hacer, un código para reportar

El anti-pattern más común es dejar que el mensaje técnico llegue al usuario, o al revés: mostrar algo tan genérico que el desarrollador no puede diagnosticar.

## Taxonomía de errores

| Tipo | Ejemplo | ¿Se resuelve solo? | HTTP correcto |
|------|---------|-------------------|---------------|
| **Configuración** | Clave privada inválida | No | 500 |
| **Autenticación** | Token expirado | A veces | 401 |
| **Permisos** | Sin acceso al recurso | No | 403 |
| **Infraestructura** | Red caída, timeout | Sí | 503 + Retry-After |
| **Lógica** | Bug en el código | No | 500 |
| **Usuario** | Input inválido | N/A | 400 |

La clasificación importa porque define la **acción correcta**: retry, contactar soporte, corregir configuración, o cambiar el request.

## Principios

### Fail-Fast

Detectar errores de configuración lo antes posible — idealmente al iniciar el proceso, no cuando el primer usuario toca la pantalla.

**Caso real**: Una app conectada a Google Sheets via service account arrancaba bien pero fallaba en el primer request real con `error:1E08010C:DECODER routines::unsupported`. El error era una clave privada incompatible con OpenSSL 3.x (Node 22). La app debería haberlo detectado en el startup con un health check.

### Error codes referenciables

Un código estable (`ERR_KEY_FORMAT`, `ERR_PERMISSION`, `ERR_NETWORK`) permite:
- Buscar en logs con precisión
- Configurar alertas específicas por tipo
- Que soporte diagnostique sin reproducir el entorno

### Logging estructurado

En lugar de:
```
console.error("Google Sheets error: " + error.message)
```

Preferir:
```typescript
console.error("[Google Sheets] Error fetching range:", {
  code: classified.code,
  spreadsheetId,
  technical: classified.message,
})
```

El objeto estructurado permite indexar por campo en cualquier sistema de logs (Datadog, CloudWatch, etc.).

## Patrón: Error Classification

```typescript
export type SheetsErrorCode =
  | "INVALID_KEY_FORMAT"  // deterministic — needs human action
  | "AUTH_FAILED"
  | "PERMISSION_DENIED"
  | "SHEET_NOT_FOUND"
  | "NETWORK_ERROR"       // transient — retryable
  | "UNKNOWN";

export class SheetsError extends Error {
  constructor(
    public readonly code: SheetsErrorCode,
    public readonly userMessage: string,  // shown to user
    technicalDetail: string               // logged only
  ) {
    super(technicalDetail);
    this.name = "SheetsError";
  }

  get isRetryable() {
    return this.code === "NETWORK_ERROR";
  }
}

function classifyError(error: unknown): SheetsError {
  const msg = error instanceof Error ? error.message : String(error);

  if (msg.includes("DECODER routines")) {
    return new SheetsError(
      "INVALID_KEY_FORMAT",
      "Error de configuración [ERR_KEY_FORMAT]: la clave del service account no puede ser procesada.",
      `OpenSSL failed to parse private key: ${msg}`
    );
  }
  if (msg.includes("ENOTFOUND") || msg.includes("ETIMEDOUT")) {
    return new SheetsError(
      "NETWORK_ERROR",
      "Error de conexión [ERR_NETWORK]: reintentá en unos minutos.",
      msg
    );
  }
  // ... más casos
}
```

## Preguntas de entrevista

### "¿Cómo diseñarías el manejo de errores para un sistema que depende de credenciales externas?"

Respuesta que suma puntos:
1. Clasificar el error: ¿de configuración, transiente, de permisos?
2. Detectarlo temprano: health check al startup
3. Dos mensajes: técnico para logs, humanizado para el usuario
4. Código de error referenciable para soporte y alertas
5. Logging estructurado (objeto `{ code, context, technical }`, no strings)
6. HTTP status correcto: `503` para errores transientes (con `Retry-After`), `500` para configuración rota

### "¿Qué es el fail-fast principle?"

Detectar errores lo antes posible en el ciclo de vida del proceso. Beneficios:
- El error se descubre en el deploy, no en producción con usuarios
- Mensaje claro ("la clave está mal") vs experiencia degradada ("la app no funciona")
- Reduce el tiempo de diagnóstico

### "¿Cuál es la diferencia entre un error de configuración y uno de infraestructura?"

Los de **configuración** son deterministas: no se resuelven solos, necesitan intervención humana. Hacer retry es inútil — la respuesta HTTP correcta es `500`.

Los de **infraestructura** son transitorios: la condición que causó el error puede desaparecer. La respuesta correcta es `503 Service Unavailable` con header `Retry-After: 30`.

## Prevención sistémica

1. **Health endpoint** — `GET /api/health` consultable por monitores externos (Vercel, UptimeRobot). Si devuelve 503 post-deploy, el problema es de configuración.
2. **Validación de env vars al startup** — usar Zod para parsear variables de entorno a tipos concretos; la app falla con mensaje claro si algo falta.
3. **CI/CD check** — verificar que las variables críticas existen (no su valor, por seguridad) antes de cada deploy.
