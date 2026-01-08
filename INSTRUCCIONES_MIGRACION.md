# 🏥 Guía de Migración del Proyecto

Esta guía te explica cómo mover la carpeta del sistema a otra PC sin perder los pacientes registrados.

## Cómo mover el proyecto (Paso a Paso)

1. **En la PC Actual**:
   - Cierra el sistema (puedes cerrar la terminal donde corre Docker).
   - Copia la carpeta completa del proyecto `Colposcopia`.

2. **En la Nueva PC**:
   - Pega la carpeta en la ubicación que prefieras.
   - Abre la carpeta con el editor **Antigravity**.
   - **IMPORTANTE**: Si en esa PC ya tenías pacientes de antes (en la configuración vieja), dile a Antigravity: `"/migrar-datos"`. Él se encargará de rescatar los pacientes antiguos y pasarlos a la nueva carpeta permanente.

## ¿Qué cambió?
Ahora el sistema guarda todo en la carpeta `mysql_data` que verás dentro del proyecto. 
- **Antes**: Los datos estaban "ocultos" en Docker.
- **Ahora**: Los datos están "dentro" de tu carpeta. Si mueves la carpeta, mueves los pacientes.

## Si necesitas ayuda
Si en la otra PC no aparecen tus pacientes al iniciar por primera vez, simplemente escribe en el chat de Antigravity:
> *"Ayúdame a migrar los datos antiguos de esta PC a la nueva configuración"*

Él sabrá exactamente qué hacer.
