# Verificación de main

## Comprobaciones reproducibles

El generador requiere Python 3.10 o posterior y la suite JavaScript se ejecuta con Node. La revisión de entrega usó Python 3.14.6, Node 24.22.1 y Chromium.

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
| Generación del sitio desde main | Correcta |
| Suite de lógica del HTML generado | 143 pruebas, sin fallos |
| Empaquetado portable | 6 pruebas, sin fallos |
| Enlaces Markdown locales y referencias de archivos | Revisados con nombres y mayúsculas del árbol Git |
| Tecnología | Cinco pantallas verificadas de 320 a 1440 px. Seis enlaces NASA respondieron y la consulta de Chiclayo devolvió 48 registros mensuales. |
| Guía visual y recorrido de Brisa | Se comprobaron el avance, los cinco músicos y la reproducción de sus clips en español e inglés. |

La prueba de voz verificó la selección de Leoni en la solicitud, la exclusión de ElevenLabs de la narración inglesa y la reacción de la API ante una respuesta simulada de cuota agotada. La síntesis de respuestas abiertas depende del servicio y navegador reales.

## Guiones de navegador disponibles

`python scripts/run_browser_checks.py --list` enumera los guiones que el runner conoce en esta rama. Estos requieren Playwright y un navegador instalado. `TERRASONIC_PLAYWRIGHT` puede señalar la ruta absoluta del paquete Playwright; `TERRASONIC_CHROMIUM` permite elegir el ejecutable de Chromium. `TERRASONIC_BROWSER` selecciona el motor en el lanzador compartido.

Hay verificadores heredados que conservan selectores de interfaces previas. Su mera presencia o listado no acredita que pasen con esta versión. No se declaran ejecutadas las matrices históricas de Firefox/WebKit, las mediciones de memoria ni las pruebas físicas. 

Las comprobaciones automatizadas no acreditan certificación WCAG, evaluación con lector de pantalla, escucha humana, vibración de un teléfono físico ni aprobación cultural. Esas validaciones requieren trabajo humano específico. Los navegadores pueden restringir audio, voz y vibración; la explicación escrita permite continuar.

---

[Estado de esta rama](ESTADO_ACTUAL.md) · [Verificación](VERIFICACION.md) · [Inventario completo](../archivos.md)
