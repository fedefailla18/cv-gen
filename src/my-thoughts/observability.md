---
title: "Observability: Diagnosing Production Bugs From a Log Line"
category: "Software Engineering"
tags: ["observability", "debugging", "logging", "monitoring", "SRE"]
interviewRelevance: "high"
difficulty: "intermediate"
date: "2026-09-12"
summary: "Un método paso a paso para pasar de un stack trace crudo a la causa raíz confirmada, usando un incidente real (Binance API 400) como caso de estudio"
---

## Por qué esto importa para seniority

"Observability awareness" aparece explícitamente en cómo se evalúa a un ingeniero senior: no es "¿usás Datadog?", es **¿podés reconstruir qué pasó en un sistema que no podés reproducir localmente, usando solo lo que el sistema ya te dijo?** Esa es la habilidad. Las herramientas (logs, métricas, traces) son el medio; la disciplina de investigación es el skill que se evalúa.

Ver también [Error Handling & Observability](error-handling.md) para la taxonomía de errores y el patrón de clasificación — esta nota se enfoca en el **método de diagnóstico**, no en cómo estructurar el error una vez identificado.

## Observability vs. Monitoring (la distinción que te van a preguntar)

- **Monitoring** responde preguntas que ya sabías que ibas a hacer: "¿está caído el servicio?", "¿cuánta memoria usa?". Dashboards y alertas predefinidas — *known unknowns*.
- **Observability** te permite responder preguntas que **no sabías que ibas a necesitar hacer**, sin deployar código nuevo — *unknown unknowns*. "¿Por qué ESTE usuario, con ESTOS datos, en ESTE momento, tuvo un 400?"

Un sistema bien monitoreado te avisa que algo anda mal. Un sistema observable te deja **entender por qué**, con la telemetría que ya existe.

## Los tres pilares (y por qué ninguno solo alcanza)

| Pilar | Responde | Ejemplo en este caso |
|---|---|---|
| **Logs** | "¿Qué pasó exactamente, en esta instancia, en este momento?" | El stack trace con la URL completa de la request a Binance |
| **Métricas** | "¿Cuánto, con qué frecuencia, con qué tendencia?" | (No lo teníamos acá — ver gap más abajo) |
| **Traces** | "¿Por dónde viajó esta request específica, entre qué componentes?" | No aplica en un monolito de un solo servicio, pero es crítico en microservicios |

El caso de abajo se resolvió casi enteramente con logs — porque no había métricas de "tasa de error por endpoint externo". Ese es precisamente un gap de observability real, no hipotético (ver sección final).

---

## Caso de estudio real: el 400 de Binance

Esto pasó tal cual, en `investracker` (backend de tracking de portfolio cripto), 2026-09-12.

### El síntoma

```
ERROR ... WebClientResponseException$BadRequest: 400 Bad Request from GET
https://api.binance.com/api/v3/myTrades?symbol=BTCUSDT&startTime=1577836800000
&endTime=1593388800000&limit=1000&timestamp=...&recvWindow=60000&signature=...
```

Reacción equivocada común: "la API de Binance debe haber cambiado, hay que revisar los tests." Es una hipótesis razonable — pero es una hipótesis, no un diagnóstico. El método importa más que la primera corazonada.

### Paso 1 — Leer el error literalmente, no por encima

El stack trace **ya contenía la causa raíz**, solo había que leerlo con atención:

- `startTime=1577836800000` → convertido: 2020-01-01
- `endTime=1593388800000` → convertido: 2020-06-29
- Diferencia: exactamente 180 días

Un ingeniero junior ve "400 Bad Request" y piensa "algo está roto". Un ingeniero senior ve los parámetros exactos de la request que falló y empieza ahí — la URL completa en el log **es** el dato más valioso que vas a tener.

### Paso 2 — Usar telemetría existente para poner el bug en el tiempo, no solo en el código

Antes de tocar una línea de código, consulté la tabla `external_api_log` (un audit trail que la propia app ya escribía — cada llamada saliente a Binance/MexC quedaba loggeada con status + timestamp). Esto es observability en su forma más simple: **datos que el sistema ya generaba, sin que nadie los mirara hasta que hizo falta.**

```sql
SELECT endpoint, response_status, timestamp
FROM external_api_log
WHERE provider = 'BINANCE'
ORDER BY timestamp DESC;
```

Resultado clave: `/api/v3/myTrades` había respondido **200 con datos reales el 2026-05-04**, y no se había vuelto a llamar con éxito desde entonces. Esto convierte "¿qué está roto?" en una pregunta bisectable: *¿qué cambió entre el 4 de mayo y ahora?* — y la respuesta, vía `git log` sobre el archivo específico, fue: **nada.** El código no había cambiado. Eso descarta de un solo golpe la hipótesis de "rompimos algo con un commit reciente" y apunta a: o bien nunca se ejecutó con un rango de fechas real, o algo externo cambió.

> **Lección de método:** cuando algo "dejó de funcionar", la primera pregunta no es "qué hace mal el código" — es "¿cuándo funcionó por última vez, y qué cambió entre ese momento y ahora?". Si la respuesta es "nada cambió en el código", el bug es más viejo de lo que parece: simplemente nadie lo había disparado con esos datos antes.

### Paso 3 — Encontrar el código exacto responsable

Con los parámetros exactos del log (`symbol`, `startTime`, `endTime` ambos seteados), un `grep` dirigido encontró el único call site que arma una request con esa forma: un loop que particiona el rango pedido en ventanas de 180 días y llama a la API con **ambos** timestamps seteados en cada ventana.

### Paso 4 — No asumir el comportamiento de un sistema externo: verificarlo contra la fuente primaria

Acá es donde la disciplina de observability se cruza con la disciplina de "no confiar en tu memoria". Mi hipótesis inicial (por conocimiento previo) era que Binance limita `/myTrades` a ventanas de 24hs cuando se pasan ambos timestamps. Pero una hipótesis no verificada es solo eso — una hipótesis. Fui a la documentación oficial de Binance (no a un foro, no a un blog viejo) y confirmé el texto exacto:

> "The time between `startTime` and `endTime` can't be longer than 24 hours."

Y de paso confirmé que **no es un cambio reciente** — buscando en el changelog de la API, esa restricción existe desde hace años (antes incluso era más estricta, 1 hora). Esto descartó del todo la hipótesis original del usuario ("¿cambió la API de Binance?") con evidencia, no con una suposición contraria.

> **Lección de método:** verificar contra la fuente primaria (la doc oficial, el código real, un log real) es más lento que confiar en la memoria — y es la diferencia entre un diagnóstico y una apuesta. En una entrevista, decir "asumí que..." es una bandera roja; decir "verifiqué contra..." es la señal que un entrevistador senior busca.

### Paso 5 — Buscar el mismo patrón en otros lugares antes de dar el bug por cerrado

Un bug rara vez está solo. El mismo endpoint (`/allOrders`) y el mismo controller usaban la misma ventana de 180 días para `/deposits` y `/withdrawals` — que tienen un límite real de **90 días**, no 24hs, pero igual estaba mal. Nadie lo había reportado todavía porque nadie había ejercitado ese código con un rango amplio — pero el bug ya estaba ahí, dormido. Encontrarlo proactivamente (en vez de esperar el próximo ticket) es lo que separa "arreglé el síntoma reportado" de "arreglé la clase de bug".

### Paso 6 — Arreglar, y dejar el sistema más observable de lo que estaba

Dos cosas separadas:
1. **El fix real**: paginar por ID (patrón que YA existía, funcionando, en otro método del mismo código — reutilizarlo en vez de reinventar) en lugar de por ventana de tiempo con ambos límites seteados.
2. **Un incidente separado, encontrado en el camino**: al investigar un 400 similar de MexC, noté que el logging solo guardaba `e.getMessage()` del error — que para una `WebClientResponseException` es apenas "400 Bad Request from GET ...", **no el cuerpo real de la respuesta** que el exchange mandó (que normalmente trae el código de error específico). Ese es un gap de observability real: el sistema tenía el dato, pero lo tiraba antes de guardarlo. Lo arreglé para que loguee `getResponseBodyAsString()` — así el próximo incidente similar se diagnostica en minutos, no repitiendo esta arqueología.

> **Principio**: cada incidente es una oportunidad de mejorar la observability del sistema, no solo de arreglar el síntoma. Si tuviste que hacer arqueología para encontrar algo, dejá una migaja de pan (mejor log, una métrica, un test de regresión) para que la próxima persona (vos mismo en 6 meses) no tenga que repetir el trabajo.

### Paso 7 — Convertir el incidente en un test permanente

El controller no tenía ningún test. Se agregó uno que fija exactamente el comportamiento correcto: nunca llamar a Binance con ambos timestamps seteados, y que la paginación por ID avance bien. Un bug sin test de regresión es un bug que va a volver.

---

## Checklist: de un log crudo a una causa raíz confirmada

1. **Leé el error literal** — no la clase de excepción, los *parámetros exactos* de la request/operación que falló.
2. **Preguntá "¿cuándo funcionó por última vez?"** antes de preguntar "¿qué hace mal el código?". Usá cualquier telemetría existente (logs persistidos, tablas de auditoría, métricas) para poner el bug en una línea de tiempo.
3. **Cruzá esa fecha contra `git log`/`git blame`** del código sospechoso. Si el código no cambió en ese rango, el bug es preexistente, no una regresión — cambia dónde buscás la causa.
4. **Encontrá el código exacto** con los datos reales del log como ancla (no una búsqueda genérica).
5. **Verificá cualquier suposición sobre un sistema externo contra su fuente primaria** (doc oficial, changelog) antes de asumir "puede haber cambiado".
6. **Buscá el mismo patrón en otros lugares** antes de cerrar el bug — rara vez está solo.
7. **Arreglá, y de paso mejorá la observability** del punto donde tuviste que hacer arqueología (mejor log, una métrica, un test).
8. **Documentá el hallazgo** (commit message, PR description, o un doc) para que la próxima persona no repita la investigación.

## Qué falta acá (honestidad sobre el gap real)

Este caso se resolvió con logs + una tabla de auditoría manual — no había métricas (¿cuántos errores 4xx por minuto, por endpoint externo?) ni alertas (nadie se enteró de esto hasta que un usuario lo reportó, días después de que empezara a fallar). Un sistema "observable" de verdad hubiese alertado *antes* de que el usuario lo notara. Eso es intencional acá — es un proyecto local/personal, no producción — pero es exactamente la brecha que hay que saber nombrar en una entrevista: **"local" no es excusa para no entender cuál sería el gap en un sistema real.**

## Preguntas de entrevista

### "¿Cuál es la diferencia entre monitoring y observability?"

Monitoring responde preguntas predefinidas (dashboards, alertas conocidas) — *known unknowns*. Observability te permite responder preguntas que no anticipaste, usando la telemetría que el sistema ya expone, sin deployar código nuevo — *unknown unknowns*. Un sistema puede estar muy monitoreado y ser poco observable (muchas alertas, pero cuando disparan nadie puede explicar *por qué* sin agregar logging nuevo y esperar a que pase de nuevo).

### "Contame de un bug difícil de diagnosticar que resolviste"

Estructura de respuesta (usando este caso real): síntoma (un stack trace con una URL completa) → hipótesis descartada por evidencia, no por intuición (revisé `git log`, el código no había cambiado) → dato clave (una tabla de logs propia me dio una fecha de quiebre) → verificación contra fuente primaria (documentación oficial, no memoria) → fix + generalización (busqué el mismo patrón en 3 endpoints más) → cierre (test de regresión + mejor logging para la próxima).

### "¿Cómo decidís qué loguear?"

Lo suficiente para reconstruir la decisión sin reproducir el bug: los parámetros de entrada relevantes, el resultado, y — crítico y frecuentemente olvidado — **el cuerpo de la respuesta cuando falla una llamada externa**, no solo el mensaje de la excepción. Un log que dice "400 Bad Request" sin el cuerpo de la respuesta es casi tan inútil como no loguear nada.

### "¿Qué son los tres pilares de observability?"

Logs (qué pasó en un evento puntual), métricas (agregados numéricos a lo largo del tiempo — tasas, percentiles), traces (el camino de una request específica a través de múltiples componentes/servicios). Ninguno reemplaza a los otros dos; en este caso, la ausencia de métricas fue justamente lo que retrasó la detección — nadie vio "tasa de 400 en `/myTrades` subió a 100%" porque esa métrica no existía.

### "¿Cómo evitás que el mismo bug vuelva a pasar?"

Test de regresión que fija el comportamiento correcto (no solo "no rompe", sino "hace exactamente esto"), y — más importante para el largo plazo — mejorar la observability del punto ciego que hizo que el diagnóstico tardara. Si tuviste que hacer arqueología, el sistema te está diciendo que le falta una señal.
