# Sistema de Gestión de Colposcopía Especializada

Este es un sistema médico integral diseñado específicamente para la práctica de colposcopía. Permite la gestión profesional de pacientes, la creación de informes de estudios detallados, el control de citas y la visualización de una agenda diaria automatizada.

## 🚀 Características Principales

### 1. Dashboard Inteligente (Inicio)
- **Widgets de Utilidad**: Incluye reloj digital en tiempo real, calendario interactivo y clima local (Celaya, Gto).
- **Agenda de Hoy**: Visualización inmediata de los pacientes programados para el día actual.
- **Próximas Citas**: Pestaña dedicada para ver la agenda futura de un vistazo.
- **Interfaz Premium**: Diseño moderno con modo oscuro en barra lateral y estética de alta gama.

### 2. Gestión de Pacientes
- **Registro Detallado**: Control de información personal, contacto (teléfono/correo) y antecedentes.
- **Historial Clínico**: Acceso rápido a todos los estudios realizados por cada paciente.
- **Búsqueda Avanzada**: Localización rápida de expedientes existentes.

### 3. Estudios de Colposcopía
- **Formularios Especializados**: Captura de datos gineco-obstétricos, calidad de colposcopía, estado del cérvix, test de Schiller y descripción de hallazgos.
- **Carga de Imágenes**: Soporte para hasta 4 fotografías por estudio.
- **Generación de Reportes**: Formato profesional listo para impresión en A4, incluyendo:
    - Logotipo médico personalizado.
    - Credenciales profesionales (RFC, CURP, Cédulas, SSA).
    - Esquema de cérvix para anotaciones.
    - Firma digitalizada y dirección del consultorio.

### 4. Sistema de Citas
- **Programador**: Agenda citas vinculadas directamente a la base de datos de pacientes.
- **Recordatorios**: El sistema notifica automáticamente en el dashboard sobre las citas pendientes.
- **Control de Flujo**: Gestión de motivos de consulta y estados de cita.

---

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React.js con Vite (Interfaz rápida y moderna).
- **Estilos**: Tailwind CSS (Diseño responsive y estético).
- **Iconografía**: Lucide React.
- **Backend**: FastAPI (Python) - API de alto rendimiento.
- **Base de Datos**: MySQL 8.0 (Almacenamiento seguro y relacional).
- **Contenedores**: Docker & Docker Compose (Para portabilidad y fácil despliegue).

---

## 🔧 Instalación y Despliegue

### Requisitos Técnicos
- **Docker Desktop** instalado y funcionando.

### Pasos para iniciar:
1. Clonar o copiar la carpeta del proyecto.
2. Asegurarse de que el archivo `.env` esté presente con las credenciales necesarias.
3. Abrir una terminal en la carpeta del proyecto y ejecutar:
   ```bash
   docker-compose up --build
   ```
4. Acceder al sistema en: `http://localhost:5173`

---

## 📂 Estructura del Proyecto

```text
Colposcopia/
├── backend/            # Lógica del servidor, API y Base de Datos
│   ├── models/         # Modelos de datos (Pacientes, Estudios, Citas)
│   ├── routers/        # Endpoints de la API
│   └── uploads/        # Almacenamiento de imágenes de estudios
├── frontend/           # Interfaz de usuario (React)
│   ├── src/pages/      # Vistas (Dashboard, Citas, Pacientes)
│   └── src/components/ # Componentes reutilizables (Layout, Formularios)
├── docker-compose.yml  # Configuración del entorno completo
└── .env                # Variables de entorno y contraseñas
```

