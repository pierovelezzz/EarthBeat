# Módulo heredado: app

> Revisión documental: **14/11/2026 20:29:05 (UTC-05:00)** · EarthBeat `V1`.
> El alcance se refiere al código y los recursos de esta rama. Las fechas de observaciones y los avisos de licencia conservan su significado original.

Este directorio pertenece al prototipo modular que arranca desde el `index.html` de la raíz; no es una dependencia importada por el build de I11.

main.js importa los módulos heredados, carga el manifiesto y coordina un barrido con el bus. bus.js contiene el emisor/suscriptor. No es el punto de entrada que utiliza scripts/build_pages.py.

| Archivo | Exports presentes |
|---|---|
| `bus.js` | `bus` |
| `main.js` | Entrada con inicialización; sin exports |

Para modificar el producto que se construye y sirve en V1, revisar `prototipos/I11-eic/Main.dc.html` y `scripts/build_pages.py`. Los contratos de este material se conservan como explicación de archivos existentes, no como una promesa de módulos implementados para el sitio actual.

---

[Estado de esta rama](../../docs/ESTADO_ACTUAL.md) · [Verificación](../../docs/VERIFICACION.md) · [Inventario completo](../../archivos.md)
