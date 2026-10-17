# Laboratorio 3.1 · Mi primera suite automatizada

Laboratorio de **Verificación y validación de software** · Tema 3.1 *Introducción a la automatización de pruebas*.

Van a convertir los casos de prueba **manuales** que ya escribieron para la tienda en pruebas **automatizadas** con [Playwright](https://playwright.dev) y TypeScript, y a usarlas para cazar bugs. La tienda es la misma de las prácticas anteriores:

- 🛒 **Tienda bajo prueba:** https://qa-tienda-pruebas.vercel.app
- 📘 **Guía completa del laboratorio (léanla primero):** https://qa-tienda-pruebas.vercel.app/lab-automatizacion.html
- 📋 **Backlog con las 20 historias y sus criterios de aceptación:** https://qa-tienda-pruebas.vercel.app/backlog-jira.html

## Antes de empezar

Necesitan instalado: **Node.js 20 o superior** (`node -v`), **Git** y, recomendado, **Visual Studio Code**. Reserven ~600 MB y una conexión decente: se descarga un navegador.

## Empezar (todo el equipo, una sola vez)

1. Una persona del equipo presiona **[Use this template → Create a new repository](https://github.com/xaviercardona-ops/qa-automatizacion-lab/generate)** y lo crea **público** con el nombre `equipo-N-automatizacion` (también sirve el botón verde *Use this template* de esta página). Agregue a sus compañeros como colaboradores.
2. Cada integrante clona **el repositorio de su equipo** (no este) y, dentro de la carpeta:

```bash
npm ci
npx playwright install chromium
npx playwright test 00-humo
```

Si la última línea termina en `1 passed`, su entorno funciona y pueden seguir la guía.

## Comandos que van a usar

| Comando | Para qué sirve |
|---|---|
| `npx playwright test` | Ejecuta toda la suite (sin ventana) |
| `npx playwright test 02-carrito` | Ejecuta solo los archivos cuyo nombre contenga ese texto |
| `npx playwright test -g "CA3"` | Ejecuta solo las pruebas cuyo título contenga ese texto |
| `npx playwright test --headed` | Lo mismo, viendo el navegador trabajar |
| `npx playwright test --ui` | Modo interactivo: elegir pruebas, verlas paso a paso y repetirlas |
| `npx playwright test --repeat-each=10` | Repite cada prueba 10 veces (así se descubre una prueba inestable) |
| `npm run report` | Abre el reporte HTML de la última ejecución (capturas y *trace* de lo que falló) |
| `npm run codegen` | Abre un grabador que escribe código mientras ustedes usan la tienda |

## Cómo está organizado

```
tests/            Las pruebas. Cada archivo es un bloque de historias (carrito, descuentos, checkout…)
  00-humo         Prueba de humo: ¿funciona mi entorno?
  01-catalogo     EJEMPLO RESUELTO: léanlo y ejecútenlo primero
  02…05-*         Ejercicios: cada test pendiente tiene un test.fixme(...) que deben borrar al implementarlo
  heredados       Tres pruebas en cuarentena que hay que diagnosticar (Parte 4)
pages/            Page Object de la tienda: esqueleto para la Parte 5
ENTREGA.md        Aquí responden: decisiones, bugs detectados, diagnóstico y reflexión
playwright.config.ts
.github/workflows Ejecuta la suite en GitHub cada vez que hacen push
```

## Qué se entrega

El **enlace al repositorio del equipo** con: mínimo 10 pruebas implementadas (4 o más de ellas "cazabugs"), las 3 heredadas diagnosticadas, el Page Object con 3 pruebas migradas, el `ENTREGA.md` respondido, y la suite corriendo en GitHub Actions. La rúbrica está al final de la guía del laboratorio.

> Dos reglas: la tienda **no se modifica** (es el sistema bajo prueba) y cada prueba debe ser **independiente**: no puede depender de que otra haya corrido antes.
