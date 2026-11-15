# Programación del audio en V3

> Revisión documental: **14/11/2026 20:29:05 (UTC-05:00)** · EarthRhythm `V3`.
> El alcance se refiere al código y los recursos de esta rama. Las fechas de observaciones y los avisos de licencia conservan su significado original.

El secuenciador de la aplicación está en `prototipos/I11-eic/Main.dc.html`. Programa los ataques sobre `AudioContext.currentTime` y mantiene una cola para actualizar el estado visible cuando corresponde a la reproducción. Un callback anterior no debe restaurar una reproducción cancelada.

Pausa, cambio de disco, archivo, volumen o mezcla invalidan las fuentes y estados que ya no pertenecen a la sesión activa. La interfaz conserva las descripciones escritas de los eventos.

Web Audio sintetiza la música localmente. Melodía utiliza perfiles, escalas, acordes y ritmo del código; Datos también transforma los niveles derivados en sonido y no representa una señal científica sin interpretación. La reproducción requiere una acción del usuario. Pausa, reanudación, selección de fecha, mezcla, volumen, silencio y repetición pertenecen al mismo reproductor.

Las pruebas de lógica ejercitan reloj simulado, programación, cancelación y relación entre estado oído y mostrado. Eso no mide la latencia del hardware ni sustituye una escucha humana. Los scripts de medición de audio y memoria se conservan en `scripts/`; sus resultados dependen del sitio generado, el navegador y el perfil utilizado. No se trasladan cifras de ejecuciones anteriores a esta versión.

---

[Estado de esta rama](ESTADO_ACTUAL.md) · [Verificación](VERIFICACION.md) · [Inventario completo](../archivos.md)
