# CarPooling UPB

## Descripción general del producto
Plataforma web diseñada para estudiantes de la Universidad Pontificia Bolivariana (UPB) en Medellín, cuyo objetivo es facilitar la coordinación segura y eficiente de viajes compartidos (carpooling) hacia o desde el campus universitario.

## Contexto del problema y propuesta de solución
Actualmente, los estudiantes coordinan sus trayectos de forma desorganizada a través de múltiples grupos de WhatsApp o redes sociales, lo que genera pérdida de tiempo, falta de información sobre cupos y poca confianza.

**Solución:** CarPooling UPB centraliza la publicación de viajes, la búsqueda filtrada por horarios/rutas, la reserva de cupos y la gestión de perfiles estudiantiles utilizando el correo institucional para garantizar pertenencia a la comunidad.

---

## Guía de instalación y ejecución del proyecto

**Tecnologías:**
- **Frontend:** React + Vite + TypeScript (puerto `5173`)
- **Backend:** Node.js + Express + Prisma ORM + TypeScript (puerto `4000`)
- **Base de datos:** PostgreSQL alojado en Neon (nube; no es necesario instalar PostgreSQL localmente)

> **Importante:** el backend y el frontend se ejecutan al mismo tiempo, cada uno en su propia terminal.

### A. Programas necesarios

1. Instalar **Git**: https://git-scm.com/downloads
2. Instalar **Node.js versión LTS** (20 o 22): https://nodejs.org
3. Verificar la instalación abriendo una terminal (CMD, PowerShell o Terminal de Mac) y ejecutando:
   ```bash
   git --version
   node -v
   npm -v
   ```
   Los tres comandos deben mostrar un número de versión.

### B. Descargar el proyecto

4. Clonar el repositorio y entrar a la carpeta del proyecto:
   ```bash
   git clone https://github.com/saguilar014/CarPooling-UPB.git
   cd CarPooling-UPB
   ```

### C. Backend (terminal 1)

5. Entrar a la carpeta del backend:
   ```bash
   cd app/backend
   ```
6. Si existe una carpeta `node_modules`, borrarla; si no existe, continuar con el siguiente paso. (Una carpeta instalada en otro computador puede fallar porque `bcrypt` y Prisma usan archivos específicos de cada sistema operativo).
   - Windows: `rmdir /s /q node_modules`
   - Mac/Linux: `rm -rf node_modules`
7. Instalar las dependencias:
   ```bash
   npm install
   ```
8. Verificar que exista el archivo `app/backend/.env`. Ya viene incluido en el repositorio con la conexión a la base de datos de Neon y el puerto (`PORT=4000`). **No es necesario modificarlo.** Tiene este formato:
   ```env
   DATABASE_URL="postgresql://USUARIO:CONTRASEÑA@HOST.neon.tech/neondb?sslmode=require&channel_binding=require"
   PORT=4000
   ```
9. Generar el cliente de Prisma:
   ```bash
   npx prisma generate
   ```
10. Iniciar el servidor:
    ```bash
    npm run dev
    ```
    Debe aparecer el mensaje `Servidor escuchando en http://localhost:4000`. **Dejar esta terminal abierta.**

### D. Frontend (terminal 2, nueva)

11. Abrir una **segunda terminal**, ubicarse en la raíz del proyecto (`CarPooling-UPB`) y entrar a la carpeta del frontend:
    ```bash
    cd app/frontend
    ```
12. Si existe una carpeta `node_modules`, borrarla; si no existe, continuar con el siguiente paso.
    - Windows: `rmdir /s /q node_modules`
    - Mac/Linux: `rm -rf node_modules`
13. Instalar las dependencias:
    ```bash
    npm install
    ```
14. Iniciar la aplicación:
    ```bash
    npm run dev
    ```
15. Abrir en el navegador la dirección que muestre la terminal, normalmente **http://localhost:5173**

> El frontend envía todas las peticiones `/api/...` al backend (`http://localhost:4000`) mediante el proxy de Vite. Por eso **las dos terminales deben estar encendidas al mismo tiempo**.

### E. Prueba rápida de funcionamiento

16. Pulsar **Registrarse** y crear una cuenta con un correo que termine en **@upb.edu.co** (obligatorio) y una contraseña.
17. Iniciar sesión con las credenciales creadas.
18. Entrar a **Perfil**, elegir el rol (Conductor, Pasajero o Ambos) y guardar.
19. Como conductor, publicar un viaje desde **Inicio**.
20. Como pasajero, ir a **Buscar**, filtrar por origen y destino, abrir un viaje y pulsar **Reservar un cupo**. Consultar la reserva en **Mis viajes**.

### F. Base de datos Neon / PostgreSQL

21. **Opción recomendada:** usar la base de datos de Neon del equipo, que ya viene configurada en el archivo `.env`. No es necesario instalar PostgreSQL ni crear tablas.
    - **No ejecutar `npx prisma db push` sobre esta base**, porque Prisma podría intentar eliminar columnas que existen en Neon pero no están definidas en `schema.prisma`.
    - Neon (plan gratuito) suspende la base por inactividad, por lo que la primera petición (registro o inicio de sesión) puede tardar unos segundos.
22. **Opción alternativa: usar una base de datos propia en Neon:**
    1. Crear una cuenta gratuita en https://neon.tech y un proyecto nuevo.
    2. En el Dashboard, copiar la **Connection string** y pegarla como valor de `DATABASE_URL` en `app/backend/.env`.
    3. Dentro de `app/backend`, crear la tabla `User`:
       ```bash
       npx prisma db push
       ```
    4. En Neon, abrir el **SQL Editor** y agregar las columnas de perfil y estadísticas que el código utiliza:
       ```sql
       ALTER TABLE "User"
         ADD COLUMN IF NOT EXISTS roles TEXT,
         ADD COLUMN IF NOT EXISTS telefono TEXT,
         ADD COLUMN IF NOT EXISTS programa TEXT,
         ADD COLUMN IF NOT EXISTS semestre TEXT,
         ADD COLUMN IF NOT EXISTS viajes_realizados INTEGER DEFAULT 0,
         ADD COLUMN IF NOT EXISTS km_compartidos DOUBLE PRECISION DEFAULT 0,
         ADD COLUMN IF NOT EXISTS calificacion DOUBLE PRECISION DEFAULT 0;
       ```
    5. Reiniciar el backend (`Ctrl + C` y luego `npm run dev`).

### G. Solución de problemas comunes

23. **`Cannot find module` o error relacionado con `bcrypt`:** no se borró `node_modules` o falta ejecutar `npm install`. Repetir los pasos 6 y 7 (backend) o 12 y 13 (frontend).
24. **`@prisma/client did not initialize yet`:** ejecutar `npx prisma generate` dentro de `app/backend`.
25. **`Can't reach database server`:** verificar que el archivo `.env` esté en `app/backend` y tenga la URL completa. Si Neon estaba suspendida, esperar unos segundos y reintentar.
26. **Error al registrarse o iniciar sesión en el navegador:** el backend no está corriendo. Revisar la terminal 1.
27. **Puerto ocupado:** cerrar el programa que lo usa o cambiar `PORT` en el `.env`. Si se cambia el puerto 4000, también debe actualizarse en `app/frontend/vite.config.ts`.

### H. Notas sobre el alcance del Release 1

28. El buscador de viajes (`GET /api/trips`) utiliza **datos de ejemplo** definidos en el backend (`trip.controller.ts`). Las reservas se gestionan en el frontend (`viajesData.ts`).
29. Usuarios, inicio de sesión (JWT) y perfil sí usan la base de datos real de Neon.

---

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
- **Prototipo de Media Fidelidad (Figma):** https://www.figma.com/make/7BtcD3CIBgsBLEZc111FkA/Dating-app-carpooling?fullscreen=1&t=H6hW6WDIpFi0HeAr-1&code-node-id=0-6

## Integrantes del equipo
- Samuel Aguilar Ruiz
- Samuel Delgado Zapata
- Sofía Duque Gallo
- Juan José Lastra Hernández
