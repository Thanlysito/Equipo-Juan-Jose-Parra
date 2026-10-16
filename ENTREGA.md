# Entrega · Laboratorio 3.1 · Introducción a la automatización de pruebas

**Equipo:** `equipo-N` · **Integrantes:** Juan José Parra Flórez, José David Cortez, Johan Ospina · **Repositorio:** https://github.com/Thanlysito/Equipo-Juan-Jose-Parra

> Suite: **41 pruebas** (36 escritas o diagnosticadas por el equipo + 5 de ejemplo), de las cuales **17 son fallos esperados** por bugs del producto documentados en Jira (proyecto **TDM**). `npx playwright test` termina sin fallos inesperados.

## 1. ¿Qué automatizamos y por qué? (decisión)

| Criterio (US-xx · CAy) | ¿Automatizamos? | Por qué (frecuencia · riesgo · estabilidad · facilidad de verificar) |
|---|---|---|
| US-04 · CA2 (no agregar más del stock) | Sí | Se ejecuta en cada compra; riesgo alto (vender lo que no hay); el aviso y el carrito vacío se verifican sin ambigüedad. |
| US-04 · CA3 (4 + 4 supera el stock) | Sí | Mismo riesgo que CA2 pero en la combinación que a mano casi nadie prueba; destapó TDM-46. |
| US-05 · CA2 ("+" respeta el stock) | Sí | Caso límite (stock exacto) que se olvida en pruebas manuales; un número en pantalla es fácil de comprobar. |
| US-06 · CA2 ("−" no baja de 1) | Sí | Valor límite clásico; cantidades 0 o negativas afectan el total cobrado (riesgo alto). |
| US-07 · CA2 (quitar el único producto) | Sí | Flujo frecuente y muy estable; regresión barata de mantener. |
| US-09 · CA1 / CA3 (código de descuento y variantes) | Sí | Afecta dinero; las variantes de escritura son ideales para datos (una fila por variante). |
| US-10 · CA1 / CA2 (código inválido) | Sí | Mensaje exacto y total verificables; CA2 destapó TDM-53. |
| US-11 · CA2 y US-12 · CA2 (IVA y total con descuento) | Sí | Riesgo máximo (cobro e impuesto); con un oráculo calculado en la prueba la verificación es exacta. |
| US-13 · CA3 (no pagar con total 0) | Sí | Riesgo alto (pedido sin cobro) y se reproduce siempre igual. |
| US-14 · CA1 / CA2 (campos obligatorios) | Sí | Validaciones que cambian con frecuencia en los formularios; mensajes exactos. |
| US-15 · CA1–CA4 (correos válidos y mal formados) | Sí | 12 combinaciones: a mano es tedioso y propenso al error; con datos es una tabla. |
| US-16 · CA1 (formulario vacío en la compra siguiente) | Sí | Riesgo de privacidad; flujo largo que la automatización repite sin cansarse. |
| US-17 · CA1–CA3 (número de pedido) | Sí | Flujo crítico de punta a punta; CA3 (recarga) destapó TDM-59. |
| US-19 · CA1 (carrito limpio tras comprar) | Sí | Regresión barata y estable. |
| US-03 · CA2 (cantidad negativa congela la página) | Más adelante | Necesita medir "la página no responde": difícil de afirmar de forma estable; primero hay que entender la causa. |
| US-20 (lector de pantalla) | No (solo en parte) | La experiencia real con lector de pantalla requiere una persona; axe-core solo cubre reglas automáticas (etiquetas, contraste). |
| US-18 (resumen del pedido) / diseño responsivo | Más adelante | Se puede automatizar, pero es de menor riesgo que el cobro; queda para la siguiente iteración. |

## 2. Bugs que nuestra suite detecta

| Prueba (archivo › título) | Bug en Jira (clave) | ¿Quedó con `test.fail(...)`? | Evidencia (captura o trace) |
|---|---|---|---|
| 02-carrito › US-04 CA3: 4 + 4 mochilas supera el stock | TDM-46 | Sí | Expected "4" · Received "8" |
| 02-carrito › US-05 CA2: "+" no pasa del stock | TDM-46 | Sí | Expected "6" · Received "7" |
| 02-carrito › US-06 CA2: "−" la deja en 1 | TDM-48 | Sí | Expected "1" · Received "0" |
| 03-descuentos-iva › US-09 CA3: "desc10" y "Desc10" (2 filas) | TDM-52 | Sí (solo esas 2 filas) | "Código de descuento no válido." |
| 03-descuentos-iva › US-10 CA2: inválido no borra el descuento | TDM-53 | Sí | Expected "− $ 6.500" · Received "− $ 0" |
| 03-descuentos-iva › US-11 CA2: IVA sobre el valor descontado | TDM-64 (duplicado: TDM-51) | Sí | Expected "$ 11.115" · Received "$ 12.350" |
| 03-descuentos-iva › US-12 CA2: total con descuento | TDM-54 | Sí | Expected "$ 69.615" · Received "$ 70.850" |
| 04-checkout › US-13 CA3: con total 0 no se puede pagar | **Por crear** (`TDM-POR-CREAR` en el código) | Sí | Expected disabled · Received enabled |
| 04-checkout › US-15 CA1-CA3: correos con `.`, `-`, `+` y `.edu.co` (4 filas) | TDM-57 | Sí (solo esas 4 filas) | No aparece "¡Pedido confirmado!" |
| 05-confirmacion › US-16 CA1: formulario vacío en otra compra | TDM-58 | Sí | Expected "" · Received "Ana Gómez" |
| 05-confirmacion › US-17 CA3: número tras recargar | TDM-59 | Sí | Expected not "1001" · Received "1001" |
| heredados › H2: IVA de 2 mochilas con DESC20 | TDM-64 | Sí | Expected "$ 19.760" · Received "$ 24.700" |

Las capturas y el *trace* de cada fila están en el reporte HTML (`npm run report`) y en el artefacto `reporte-playwright` de GitHub Actions.

**¿US-11 CA2 y US-12 CA2 son el mismo bug?** Es **un solo defecto** (el IVA se calcula sobre el subtotal y no sobre subtotal − descuento) que produce **dos fallas** visibles. En Jira hay 3 issues para eso (TDM-51, TDM-64 y TDM-54): TDM-51 y TDM-64 son duplicados exactos y deberían enlazarse como "duplicado", y TDM-54 "se debe a" TDM-64.

## 3. Pruebas heredadas: nuestro diagnóstico

| Prueba | Veredicto (producto / prueba / inestable / entorno) | Cómo lo comprobamos | Qué hicimos |
|---|---|---|---|
| H1 · el catálogo tiene 6 productos | **Defecto de la prueba** | Expected 6 · Received 8. A mano la tienda muestra 8 productos, que es lo que exige US-01 CA1 (el ejemplo 01-catalogo también afirma 8). Dato viejo. | Corregimos el valor esperado a 8 y el título. Pasa. |
| H2 · el IVA de 2 mochilas con DESC20… | **Bug del producto** | Oráculo: 2 × 65.000 = 130.000 − 20 % = 104.000 → IVA = 19.760 (la prueba estaba bien). La tienda muestra $ 24.700 (19 % de 130.000). Se reproduce a mano y falla siempre igual. | `test.fail(true, 'TDM-64 · …')`. Mismo defecto que US-11 CA2. |
| H3 · agregar un cuaderno justo después de cargar | **Inestable** | `--repeat-each=30`: **5 de 30 fallaron** sin cambiar nada. Usaba `waitUntil: 'domcontentloaded'` y hacía clic antes de que la página conectara los eventos del botón: el clic se perdía. | Esperamos la condición correcta (`page.goto('/')`, que espera la carga) y ubicamos el botón por su tarjeta, no por `.first()`. Después: **50 de 50** en verde, también en paralelo. Sin `waitForTimeout`. |

## 4. Medidas

- Casos de prueba de nuestro plan en Jira: **20** (TDM-22 a TDM-41, uno por historia) · automatizados en este laboratorio: **15 historias** (US-01, 04, 05, 06, 07, 09, 10, 11, 12, 13, 14, 15, 16, 17 y 19) (**75 %**) con **41 pruebas**.
- Tiempo que nos tomó escribir las pruebas automatizadas: **\_\_ min** _(completar con el tiempo real del equipo)_ · tiempo de ejecutar toda la suite: **≈ 115 s** con 1 worker; **≈ 50 s por pasada** con 4 workers en paralelo.
- Tiempo estimado de ejecutar **a mano** esos mismos casos: **≈ 80 min** (41 casos × ≈ 2 min; los de compra completa toman más).
- Con esos números, ¿en cuántas ejecuciones se paga la automatización? (inversión ÷ ahorro por ejecución): **inversión ÷ ≈ 78 min**. Ej.: si la escritura tomó 240 min → 240 ÷ 78 ≈ **3 ejecuciones**.

## 5. Reflexión (máximo 5 líneas cada una)

**Parte 1 · preguntas:**
(1) Al terminar, la pestaña (y su contexto) se cierra y se descarta: la siguiente prueba arranca sin carrito ni `localStorage`. Por eso las pruebas son independientes y pueden correr en cualquier orden o en paralelo.
(2) Porque las aserciones `expect(locator)` reintentan solas hasta 5 s: esperan una *condición*, no un *tiempo*. Una pausa fija es lenta cuando sobra y falla cuando falta.
(3) La aserción comparó lo esperado (`Expected: 9`) con lo encontrado (`Received: 8`); el *Call log* mostró los reintentos y el reporte guardó captura y *trace*.

1. **¿Qué no automatizaríamos?** La experiencia con lector de pantalla (US-20) y la percepción visual del diseño: requieren juicio humano. Tampoco la "página congelada" de US-03 hasta entender su causa, porque una prueba que mide "no responde" tiende a ser inestable.
2. **Si cambia el HTML de un botón:** en 02-carrito habría que corregir cada prueba que repite el localizador; en 03, 04 y 05 solo se toca `pages/TiendaPage.ts` y las pruebas siguen intactas. El Page Object convirtió una compra de 4 pasos en `tienda.comprar(...)` y puso el "cómo" en un solo lugar.
3. **Un rojo que no era bug:** H1 esperaba 6 productos; a mano vimos 8 y el criterio pide 8, así que el error era un dato viejo de la prueba. H3 tampoco era bug: con `--repeat-each` daba resultados mezclados.
4. **Lo que la automatización sola no habría encontrado:** que `getByLabel` no funcione porque las etiquetas del formulario no están asociadas a sus campos (lo descubrimos al escribir la prueba, y es un problema de accesibilidad), y la decisión de si un código con espacios "debe" aceptarse: la máquina solo verifica lo que alguien decidió afirmar.
5. **En un proyecto real:** pediríamos `data-testid` o etiquetas bien asociadas para localizadores estables, correríamos la suite en cada *pull request*, agregaríamos Firefox/WebKit y móvil, y quitaríamos cada `test.fail` apenas se corrija su bug.
