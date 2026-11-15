# Verificación de main

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
| Suite de lógica del HTML generado | 135 pruebas, sin fallos |
| Enlaces Markdown locales y referencias de archivos | Revisados con nombres y mayúsculas del árbol Git |
| Código y recursos ajenos a documentación | Conservados |

En Chromium se probó la portada, el selector EN/ES con teclado, la reproducción del mapa de la portada, la leyenda y la banda en 320 × 568, 390 × 844, 768 × 1024, 844 × 390 y 1440 × 900. En 390 × 844 se comprobó también la apertura de preferencias y el cierre de la presentación.

## Guiones de navegador disponibles

`python scripts/run_browser_checks.py --list` enumera los guiones que el runner conoce en esta rama. Estos requieren Playwright y un navegador instalado. `TERRASONIC_PLAYWRIGHT` puede señalar la ruta absoluta del paquete Playwright; `TERRASONIC_CHROMIUM` permite elegir el ejecutable de Chromium. `TERRASONIC_BROWSER` selecciona el motor en el lanzador compartido.

Hay verificadores heredados que conservan selectores de interfaces previas. Su mera presencia o listado no acredita que pasen con esta versión. No se declaran ejecutadas las matrices históricas de Firefox/WebKit, las mediciones de memoria ni las pruebas físicas. 

Las comprobaciones automatizadas no acreditan certificación WCAG, evaluación con lector de pantalla, escucha humana, vibración de un teléfono físico ni aprobación cultural. Esas validaciones requieren trabajo humano específico. Los navegadores pueden restringir audio, voz y vibración; la explicación escrita permite continuar.

---

[Estado de esta rama](ESTADO_ACTUAL.md) · [Verificación](VERIFICACION.md) · [Inventario completo](../archivos.md)
