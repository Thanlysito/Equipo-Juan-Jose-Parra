# Entrega · Laboratorio 3.1 · Introducción a la automatización de pruebas

**Equipo:** `equipo-N` · **Integrantes:** _nombres_ · **Repositorio:** _enlace a este repositorio_

> Respondan aquí, en este archivo, y háganle commit. Sean breves y concretos: una frase buena vale más que un párrafo.

## 1. ¿Qué automatizamos y por qué? (decisión)

Elijan **mínimo 10 criterios de aceptación** de los que automatizaron (o descartaron). Un buen candidato es repetitivo, estable, de riesgo alto y fácil de verificar por una máquina.

| Criterio (US-xx · CAy) | ¿Automatizamos? | Por qué (frecuencia · riesgo · estabilidad · facilidad de verificar) |
|---|---|---|
| _US-04 · CA2_ | Sí / No / Más adelante | _…_ |

## 2. Bugs que nuestra suite detecta

Una fila por cada prueba que falló por un bug **del producto**. Enlacen el bug con su clave de Jira y agreguen en Jira un comentario con el nombre de la prueba que lo detecta.

| Prueba (archivo › título) | Bug en Jira (clave) | ¿Quedó con `test.fail(...)`? | Evidencia (captura o trace) |
|---|---|---|---|
| _02-carrito › CA3: 4 + 4 mochilas…_ | _PRJ-12_ | Sí | _…_ |

## 3. Pruebas heredadas: nuestro diagnóstico

| Prueba | Veredicto (producto / prueba / inestable / entorno) | Cómo lo comprobamos | Qué hicimos |
|---|---|---|---|
| H1 · el catálogo tiene 6 productos | | | |
| H2 · el IVA de 2 mochilas con DESC20… | | | |
| H3 · agregar un cuaderno justo después de cargar | | | |

## 4. Medidas

- Casos de prueba de nuestro plan en Jira: **\_\_** · automatizados en este laboratorio: **\_\_** (**\_\_ %**)
- Tiempo que nos tomó escribir las pruebas automatizadas: **\_\_ min** · tiempo de ejecutar toda la suite: **\_\_ s**
- Tiempo estimado de ejecutar **a mano** esos mismos casos: **\_\_ min**
- Con esos números, ¿en cuántas ejecuciones se paga la automatización? (inversión ÷ ahorro por ejecución): **\_\_**

## 5. Reflexión (máximo 5 líneas cada una)

1. ¿Qué casos de nuestro plan **no** automatizaríamos y por qué?
2. Si la tienda cambia el HTML de un botón, ¿qué parte de nuestro código se rompe y cuál no? ¿Qué aportó el Page Object?
3. Una prueba roja nuestra que **no** era un bug del producto: ¿cómo nos dimos cuenta?
4. ¿Qué bug o riesgo **no** habría encontrado la automatización por sí sola?
5. ¿Qué haríamos distinto en un proyecto real?
