# Sistema de Colposcopia

Este es un proyecto de software médico para la gestión de pacientes y exámenes de colposcopia, desarrollado con tecnologías modernas y listo para desplegar en Windows o cualquier sistema mediante Docker.

## Tecnologías

- **Frontend**: React, Vite, TailwindCSS (Interfaz Moderna y Responsiva).
- **Backend**: Python, FastAPI, SQLAlchemy (API Robusta).
- **Base de Datos**: MySQL 8.0.
- **Infraestructura**: Docker & Docker Compose.

## Requisitos Previos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y ejecutándose.

## Cómo Ejecutar el Proyecto

1. Abrir una terminal en la carpeta del proyecto.
2. Ejecutar el siguiente comando para construir e iniciar los servicios:

   ```bash
   docker-compose up --build
   ```

3. Esperar a que los contenedores inicien (la base de datos puede tardar unos segundos en la primera vez).
4. Acceder al sistema:

   - **Frontend (Aplicación Web)**: [http://localhost:5173](http://localhost:5173)
   - **Backend (Documentación API)**: [http://localhost:8000/docs](http://localhost:8000/docs)

## Características

- **Gestión de Pacientes**: Crear y listar pacientes con cálculo automático de edad.
- **Exámenes Colposcópicos**: Formulario detallado basado en estándares médicos (Calidad, Cervix, Zona de Transformación, Hallazgos, etc.).
- **Persistencia**: Todos los datos se guardan en la base de datos MySQL.

## Desarrollo Local (Opcional)

Si deseas ejecutarlo sin Docker (requiere Python, Node.js y MySQL instalados):

- **Backend**: `cd backend` -> `pip install -r requirements.txt` -> `uvicorn main:app --reload`.
- **Frontend**: `cd frontend` -> `npm install` -> `npm run dev`.
