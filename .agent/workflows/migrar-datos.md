---
description: Rescata datos de un volumen de Docker antiguo y los mueve a la nueva carpeta mysql_data
---

Este flujo de trabajo ayuda al usuario a mover sus datos de la configuración antigua (volumen nombrado) a la nueva configuración portátil (bind mount).

### Pasos de Ejecución

1. **Detectar volumen antiguo**:
   - Comprobar si existe un volumen llamado `colposcopia_db_data` o similar.

2. **Detener servicios actuales**:
   // turbo
   - Ejecutar `docker-compose down` para liberar archivos.

3. **Rescatar datos (Exportar)**:
   - Iniciar un contenedor temporal para extraer el SQL del volumen antiguo.
   // turbo
   - Comando sugerido: `docker run --rm -v colposcopia_db_data:/old_data -v ${PWD}:/backup alpine tar cvf /backup/old_data_backup.tar /old_data` (o un dump de MySQL si el contenedor está vivo).

4. **Restaurar en la nueva carpeta**:
   - Una vez que los servicios inicien con la nueva carpeta `mysql_data`, importar el respaldo.

5. **Verificar**:
   - Confirmar con el usuario que los pacientes aparecen en la lista.

> [!NOTE]
> Si el usuario simplemente está moviendo la carpeta actualizada a una PC donde NUNCA ha corrido el sistema, **no necesita este flujo**. Los datos ya irán dentro de `mysql_data`.
