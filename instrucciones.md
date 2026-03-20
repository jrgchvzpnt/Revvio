### 1. Modo de Planificación por Defecto (Plan Mode Default)
- **Entra en modo de planificación para CUALQUIER tarea no trivial** (3 o más pasos, o arquitectura).
- Define AMBOS pasos: ejecución y verificación.
- Si algo falla -> DETENTE y vuelve a planificar.
- Escribe especificaciones detalladas para eliminar la ambigüedad.

### 2. Estrategia de Subagentes (Subagent Strategy)
- **Usa subagentes agresivamente** para problemas complejos.
- Divide las tareas: investigación, ejecución, análisis.
- Una tarea por agente para mayor claridad.
- Paraleliza el pensamiento, no solo la ejecución.

### 3. Bucle de Mejora Continua (Self-Improvement Loop)
- Después de CUALQUIER error -> regístralo en `gotchas.md`.
- Convierte los errores en reglas.
- Revisa las lecciones pasadas antes de empezar.
- Itera hasta que la tasa de errores disminuya.

### 4. Verificación Antes de Terminar (Verification Before Done)
- **Nunca marques como terminado sin pruebas.**
- Ejecuta pruebas, revisa registros (logs), simula el uso real.
- Compara el comportamiento esperado frente al real.
- Pregúntate: "¿Aprobaría esto un ingeniero senior?".

### 5. Exige Elegancia (Demand Elegance)
- Pregúntate: "¿Existe una forma más simple / limpia?".
- Evita las soluciones provisionales o "parches" (hacky fixes).
- Optimiza para la mantenibilidad a largo plazo.
- Evita la sobreingeniería para correcciones pequeñas.

### 6. Corrección Autónoma de Errores (Autonomous Bug Fixing)
- Errores (Bugs) -> corrígelos inmediatamente (sin esperar asistencia).
- Rastrea logs, errores y pruebas fallidas.
- Encuentra la causa raíz, no los síntomas.
- Corrige los fallos de Integración Continua (CI) proactivamente.

### 7. Habilidades = Capa del Sistema (Skills = System Layer)
- Las habilidades NO son solo archivos markdown.
- Incluyen código, scripts, datos y flujos de trabajo.
- Usa las habilidades para:
  - verificación
  - automatización
  - análisis de datos
  - andamiaje (scaffolding)
- Habilidades = inteligencia reutilizable.

### 8. Sistema de Archivos = Motor de Contexto (File System = Context Engine)
- Usa carpetas para:
  - `references/` (referencias)
  - `scripts/`
  - `templates/` (plantillas)
- Habilita la divulgación progresiva de información.
- La estructura mejora la calidad del razonamiento.

### 9. Evita Restringir en Exceso a la IA (Avoid Over-Constraining AI)
- No fuerces pasos rígidos.
- Proporciona contexto, no microgestión.
- Deja que la IA se adapte al problema.
- Flexibilidad > instrucciones estrictas.

---

## Gestión de Tareas (Task Management)
1. Planifica primero -> escribe las tareas con una lista de verificación (checklist).
2. Verifica antes de la ejecución.
3. Haz un seguimiento del progreso continuamente.
4. Explica los cambios en cada paso.
5. Documenta los resultados claramente.
6. Captura las lecciones después de la finalización.

## Principios Fundamentales (Core Principles)
- Simplicidad primero -> soluciones mínimas y limpias.
- Sistemas > Prompts.
- Verificación > Generación.
- Iteración > Perfección.
- Cero correcciones perezosas -> resuelve la causa raíz.