# CarPooling UPB

## Descripción general del producto
Plataforma web diseñada para estudiantes de la Universidad Pontificia Bolivariana (UPB) en Medellín, cuyo objetivo es facilitar la coordinación segura y eficiente de viajes compartidos (carpooling) hacia o desde el campus universitario.

## Contexto del problema y propuesta de solución
Actualmente, los estudiantes coordinan sus trayectos de forma desorganizada a través de múltiples grupos de WhatsApp o redes sociales, lo que genera pérdida de tiempo, falta de información sobre cupos y poca confianza. 
**Solución:** CarPooling UPB centraliza la publicación de viajes, la búsqueda filtrada por horarios/rutas, la reserva de cupos y la gestión de perfiles estudiantiles utilizando el correo institucional para garantizar pertenencia a la comunidad.

## Guía de instalación y ejecución del proyecto
*(Instrucciones básicas para correr la app)*
1. Clonar el repositorio.
2. Instalar dependencias con `npm install` (o el framework que uses).
3. Configurar la base de datos local en PostgreSQL usando Prisma ORM[cite: 1].
4. Ejecutar el servidor con `npm run dev`.

## Guía básica de uso de la aplicación

El flujo de uso de **CarPooling UPB** se divide en dos roles principales según las necesidades de movilidad de la comunidad universitaria:
* **Registro e Inicio de sesión:** El usuario ingresa a la plataforma y se autentica utilizando su correo institucional de la UPB.
* * **Rol de Usuario:** El usuario puede decidir si registrarse como conductor o como pasajero.

### 1. Flujo del Estudiante Conductor
* **Publicación de trayectos:** El conductor puede publicar un nuevo viaje especificando el punto de origen, destino, fecha, horario de salida, punto de encuentro específico (ej. portería principal o bloques) y el número de cupos disponibles en su vehículo.
* **Gestión de viajes:** El conductor tiene la capacidad de consultar las reservas realizadas por los pasajeros, editar la información del viaje si lo requiere antes de su realización, o cancelar el trayecto en caso de imprevistos.

### 2. Flujo del Estudiante Pasajero
* **Búsqueda y filtrado:** El pasajero busca viajes disponibles ingresando los criterios de su trayecto (origen, destino y horario aproximado). El sistema realiza un emparejamiento mostrando las mejores opciones coincidentes.
* **Consulta de detalles:** Al seleccionar un viaje, el pasajero puede visualizar la información detallada del conductor (incluyendo su programa académico, semestre, calificación promedio y datos del vehículo) y la información resumida del viaje.
* **Reserva de cupos:** El pasajero puede reservar un cupo disponible en el viaje con un botón.
* **Gestión de reservas** El pasajero puede consultar sus reservas activas.

## Enlaces
- **Tablero de Jira:** https://carpoolingupb.atlassian.net/jira/software/projects/SCRUM/boards/1?filter=&groupBy=none&atlOrigin=eyJpIjoiMTJjZWEzMTA2MThjNDg3Njg2YjVkYTEzZDk0OWE3MjciLCJwIjoiaiJ9
- **Prototipo de Media Fidelidad (Figma):** [Insertar enlace a Figma aquí]

## Integrantes del equipo
- Samuel Aguilar Ruiz
- Samuel Delgado Zapata
- Sofía Duque Gallo
- Juan José Lastra Hernández
