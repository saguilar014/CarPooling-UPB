# CarPooling UPB

## Descripción general del producto
Plataforma web diseñada para estudiantes de la Universidad Pontificia Bolivariana (UPB) en Medellín, cuyo objetivo es facilitar la coordinación segura y eficiente de viajes compartidos (carpooling) hacia o desde el campus universitario.

## Contexto del problema y propuesta de solución
Actualmente, los estudiantes coordinan sus trayectos de forma desorganizada a través de múltiples grupos de WhatsApp o redes sociales, lo que genera pérdida de tiempo, falta de información sobre cupos y poca confianza. 
**Solución:** CarPooling UPB centraliza la publicación de viajes, la búsqueda filtrada por horarios/rutas, la reserva de cupos y la gestión de perfiles estudiantiles utilizando el correo institucional para garantizar pertenencia a la comunidad.

## Guía de instalación y ejecución del proyecto
*PENDIENTE*
1. Clonar el repositorio.
2. Instalar dependencias con `npm install` (o el framework que uses).
3. Configurar la base de datos local en PostgreSQL usando Prisma ORM.
4. Ejecutar el servidor con `npm run dev`.

## Guía básica de uso de la aplicación (Release 1)

El uso del primer release funcional de **CarPooling UPB** abarca los flujos del estudiante (conductor/pasajero) a través de las 4 secciones principales del sistema: **Inicio**, **Buscar**, **Mis viajes** y **Perfil**.

### 1. Registro, Autenticación y Perfil
* **Registro Institucional:** Crear una cuenta ingresando un correo válido con dominio institucional UPB y definir el rol (Conductor o Pasajero).
* **Inicio de Sesión:** Autenticarse en la plataforma con las credenciales registradas.
* **Resumen del Perfil:** Consultar la información personal del usuario desde la sección **Perfil**.

### 2. Flujo del Estudiante Conductor
* **Definición y Publicación de Viaje:** Desde el menú principal (**Inicio**), acceder al formulario para definir origen, destino, fecha, hora de salida, punto de encuentro exacto y cupos disponibles, publicando el viaje en el sistema.
* **Gestión de Viajes Publicados:** Consultar la lista de trayectos ofertados en la pestaña **Mis viajes** (sección *Publicados*).

### 3. Flujo del Estudiante Pasajero
* **Búsqueda de Viajes:** Filtrar trayectos disponibles por origen y destino desde la pestaña **Buscar**.
* **Consulta de Información:** Seleccionar un viaje de los resultados para revisar el perfil del conductor, los cupos disponibles en tiempo real y el detalle del trayecto.
* **Reserva de Cupo:** Confirmar la reserva de un cupo disponible con el botón **Reservar un cupo**.
* **Gestión de Reservas:** Consultar las reservas activas y su resumen desde la pestaña **Mis viajes** (sección *Mis reservas*).

## Enlaces
- **Tablero de Jira:** https://carpoolingupb.atlassian.net/jira/software/projects/SCRUM/boards/1?filter=&groupBy=none&atlOrigin=eyJpIjoiMTJjZWEzMTA2MThjNDg3Njg2YjVkYTEzZDk0OWE3MjciLCJwIjoiaiJ9
- **Prototipo de Media Fidelidad (Figma):** (PENDIENTE)

## Integrantes del equipo
- Samuel Aguilar Ruiz
- Samuel Delgado Zapata
- Sofía Duque Gallo
- Juan José Lastra Hernández
