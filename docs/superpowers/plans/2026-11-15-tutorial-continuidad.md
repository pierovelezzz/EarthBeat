# Tutorial único y reanudable

Este plan histórico cubrió el tutorial práctico de tres pasos, la ayuda contextual de una tarjeta y la reanudación después de cerrar o saltar la guía.

- [x] Añadir regresiones para pausa/reanudación en pasos 2 y 3, recarga, finalización y reinicio explícito, datos guardados inválidos y almacenamiento bloqueado. Observar fallos antes de implementar.
- [x] Guardar un progreso versionado independiente de las preferencias y del estado de retorno. Persistir solo pasos, acciones y selección NASA; nunca archivos locales ni reproducción automática.
- [x] Reanudar con el botón Brisa cuando exista progreso pendiente. Conservar el estado previo al entrar y restaurarlo al pausar, sin borrar el progreso del tutorial. Ofrecer reinicio explícito.
- [x] Presentar la ayuda contextual como una única tarjeta con Entendido, sin contador, Siguiente/Anterior ni invitación a otro tutorial. Mantener su consulta explícita durante el tutorial.
- [x] Ofrecer entrada al tutorial desde las preferencias de bienvenida y Formas de usar. Permitir el segundo paso sin sonido y el tercero mediante significados escritos de la leyenda.
- [x] Verificar lógica, flujo real de navegador, teclado, idioma, reanudación tras recarga y accesibilidad automática. Revisar el cambio y documentar resultados antes de guardar el commit.

Decisiones: la reanudación no inicia audio; solo Terminar marca el recorrido como completado. Cerrar y Saltar guía conservan el paso. La escritura en almacenamiento puede fallar sin impedir reanudar durante la sesión actual.

Evidencia: las nuevas pruebas se observaron fallar antes de implementar; la suite final aprueba 146 pruebas. La revisión identificó que el retorno entre colecciones debía reiniciar la carga de un mapa todavía pendiente; se añadió una regresión, se observó fallar y se corrigió. El recorrido de navegador verifica cierre en paso 2, reanudación por Brisa, recarga mientras está abierto, continuación escrita, pausa y reanudación en paso 3, finalización y reinicio. Las fuentes demoradas y el panel compacto se comprobaron con el verificador de Formas de usar.
