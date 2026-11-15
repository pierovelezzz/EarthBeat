# Verificación de V3

> Revisión documental: **14/11/2026 20:29:05 (UTC-05:00)** · EarthBeat `V3`.
> El alcance se refiere al código y los recursos de esta rama. Las fechas de observaciones y los avisos de licencia conservan su significado original.

## Comprobaciones reproducibles

Python 3.10 o posterior sirve para construir y verificar fuentes; esta revisión usa 3.12.14. La suite JavaScript se ejecuta con Node; esta revisión utiliza 26.13.0. El producto no necesita Node durante su uso.

```bash
python scripts/verify_fonts.py
python scripts/build_pages.py _site
node scripts/test_guides.cjs _site/index.html
python scripts/run_browser_checks.py --list
```

## Resultados de esta revisión

| Comprobación | Resultado |
|---|---|
| Huellas y tamaños de fuentes y avisos | 12 archivos verificados |
| Generación del sitio desde esta rama | Correcta |
| Suite de lógica del HTML generado | 134 pruebas, sin fallos |
| Enlaces Markdown locales y referencias de archivos | Revisados con nombres y mayúsculas del árbol Git |
| Código y recursos ajenos a documentación | Conservados |

La comprobación básica de navegador de esta revisión usa Chromium con contexto limpio: carga local, montaje de aplicación, navegación principal, títulos visibles, selector de imágenes, retrato de Brisa según la rama, cambio a inglés y ausencia de errores de recursos. Se comprobaron 1342 × 768 y 390 × 844 píxeles. No equivale a ejecutar todos los guiones históricos de regresión.

## Guiones de navegador disponibles

`python scripts/run_browser_checks.py --list` enumera los guiones que el runner conoce en esta rama. Estos requieren Playwright y un navegador instalado. `TERRASONIC_PLAYWRIGHT` puede señalar la ruta absoluta del paquete Playwright; `TERRASONIC_CHROMIUM` permite elegir el ejecutable de Chromium. `TERRASONIC_BROWSER` selecciona el motor en el lanzador compartido.

Hay verificadores heredados que conservan selectores de interfaces previas. Su mera presencia o listado no acredita que pasen con esta versión. No se declaran ejecutadas las matrices históricas de Firefox/WebKit, las mediciones de memoria ni las pruebas físicas. El guion adicional `scripts/verify_experiencia_v3.cjs` pertenece a esta rama y utiliza el sitio y el directorio de resultados como argumentos; no forma parte del resultado básico anterior.

Las comprobaciones automatizadas no acreditan certificación WCAG, evaluación con lector de pantalla, escucha humana, vibración de un teléfono físico ni aprobación cultural. Esas validaciones requieren trabajo humano específico. Los navegadores pueden restringir audio, voz y vibración; la explicación escrita permite continuar.

---

[Estado de esta rama](ESTADO_ACTUAL.md) · [Verificación](VERIFICACION.md) · [Inventario completo](../archivos.md)
