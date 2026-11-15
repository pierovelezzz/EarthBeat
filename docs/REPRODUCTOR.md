# Reproductor de V1

> Revisión documental: **14/11/2026 20:29:05 (UTC-05:00)** · EarthRhythm `V1`.
> El alcance se refiere al código y los recursos de esta rama. Las fechas de observaciones y los avisos de licencia conservan su significado original.

Web Audio sintetiza la música localmente. Melodía utiliza perfiles, escalas, acordes y ritmo del código; Datos también transforma los niveles derivados en sonido y no representa una señal científica sin interpretación. La reproducción requiere una acción del usuario. Pausa, reanudación, selección de fecha, mezcla, volumen, silencio y repetición pertenecen al mismo reproductor.

Escuchar tiene dos pasos: Elige un disco y Escucha. Los dos catálogos tienen cinco discos y cada disco conserva seis fechas seleccionables. La cuadrícula contiene 448 celdas y el barrido tiene 28 columnas. La selección de fecha cambia el fotograma; los controles de transporte conservan la pausa y la mezcla explícita del usuario.

Los controles permiten elegir protagonista y silenciar músicos. La leyenda distingue la paleta y el tipo de entrada; la presencia de una función en V3 no implica que esta rama tenga la misma leyenda interactiva.

| Perfil de Melodía | Tempo base del código, pulsaciones/minuto |
|---|---:|
| Mamacocha | 60 |
| Inti | 72 |
| Silbo | 76 |
| Yaku | 96 |
| Yaku cálido, variante menor | 76 |
| Illapa | 66 |

Son valores base de los perfiles `MUSIC`. Los controles de velocidad y la regla editorial documentada para Pacora pueden modificar el resultado. Las escalas y los acordes se prueban contra las notas sintetizadas en `scripts/test_guides.cjs`.

La disponibilidad de Web Audio depende del navegador y de la interacción del usuario. Si no está disponible, se muestra información escrita. Los textos del modo Datos no deben interpretarse como grados ni como una sonificación sin decisiones artísticas.

---

[Estado de esta rama](ESTADO_ACTUAL.md) · [Verificación](VERIFICACION.md) · [Inventario completo](../archivos.md)
