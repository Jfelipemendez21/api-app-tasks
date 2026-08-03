# Gestión de Proyectos y Tareas - Senior Full Stack Challenge

Solución completa y profesional para la prueba técnica Full Stack utilizando un stack moderno: Node.js, Express, TypeScript, PostgreSQL (backend) y React 18, Material UI, TanStack Query, Zustand/Context (frontend).

## 🚀 Tecnologías Utilizadas

### Backend
- **Node.js + Express**: Framework web rápido y minimalista.
- **TypeScript**: Tipado estático estricto para mayor mantenibilidad.
- **TypeORM**: ORM para PostgreSQL (generación exclusiva por migraciones, `synchronize=false`).
- **PostgreSQL**: Base de datos relacional robusta.
- **Zod**: Validación estricta de esquemas (Body, Query Params).
- **JWT & bcrypt**: Autenticación segura y hashing de contraseñas.
- **Swagger / OpenAPI**: Documentación interactiva de la API.

### Frontend
- **React 18 + Vite**: Interfaz de usuario ultrarrápida.
- **TypeScript**: Tipado consistente de extremo a extremo.
- **Material UI (MUI v5)**: Diseño moderno, responsive, soporte Dark/Light mode y glassmorphism.
- **TanStack Query (React Query)**: Manejo avanzado de caché, fetching y mutaciones de datos.
- **React Hook Form + Zod**: Manejo de formularios performante con validación integrada.
- **Axios**: Cliente HTTP con interceptores (inyección de token JWT, auto-logout en expiración).

---

## 🛠 Arquitectura

El proyecto sigue principios SOLID, Clean Architecture (en su variante de capas) y separación de responsabilidades:
- **Controladores (`controllers/`)**: Manejo exclusivo de req/res HTTP.
- **Servicios (`services/`)**: Reglas de negocio puras, cálculos de `usedTime` y transiciones de estados automáticas (ej: recalcular estado de Proyecto al cambiar tareas).
- **Validaciones (`validations/`)**: Schemas reutilizables con Zod acoplados a middlewares de Express.
- **Manejo de Errores (`middlewares/error.middleware.ts`)**: Respuestas JSON estandarizadas en toda la API.

---

## ⚙️ Reglas de Negocio Implementadas

1. **Gestión de Tiempos (`usedTime`)**: El campo `initialDateTime` se registra de forma inmutable la primera vez que una tarea pasa a `in_progress`. El `finishedDateTime` se registra de forma inmutable cuando pasa a `finished`. El backend retorna un texto legible dinámico (ej: *2 horas 30 minutos*) si la tarea está completada; de lo contrario, `null`. No se almacena este string en BD, se computa on the fly.
2. **Estado Dinámico del Proyecto**: El estado del proyecto se recalcula en base al estado de sus tareas (`created`, `in_progress`, `finished`, `canceled`).
3. **Roles (Admin vs Regular)**: Middleware dinámico asegura que solo administradores puedan consultar, crear o modificar usuarios. En frontend el menú se adapta ocultando las opciones no permitidas.

---

## 💻 Instrucciones de Ejecución (Docker)

El proyecto viene listo para ser desplegado con contenedores.

### Requisitos previos
- Tener [Docker](https://www.docker.com/) y [Docker Compose](https://docs.docker.com/compose/) instalados.

### Pasos

1. Clonar el repositorio.
2. En la raíz del proyecto, asegúrate de que el puerto `4000`, `5432` y `80` estén libres en tu máquina anfitrión.
3. Ejecutar:
   ```bash
   docker-compose up --build -d
   ```
4. El proceso levantará 3 servicios: `db` (Postgres 16), `backend` (Express API) y `frontend` (Nginx + React SPA).
5. Las **migraciones y el seeder del usuario administrador** se ejecutan automáticamente en el inicio del contenedor backend.

**Accesos:**
- **Frontend App**: [http://localhost](http://localhost) (Puerto 80 por defecto)
- **Backend API**: [http://localhost:4000/api](http://localhost:4000/api)
- **Swagger Docs**: [http://localhost:4000/api-docs](http://localhost:4000/api-docs)

---

## 👨‍💻 Ejecución Local (Sin Docker)

Si prefieres levantar el proyecto manualmente para desarrollo:

1. Levanta una instancia de PostgreSQL y crea la base de datos `task_management_db`.
2. Dirígete a la carpeta `/backend` y crea tu archivo `.env` basándote en `.env.example`.
3. Dirígete a `/frontend` y crea tu archivo `.env` basándote en `.env.example`.

### Backend:
```bash
cd backend
npm install
npm run build
npm run migration:run
npm run seed
npm run dev
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Credenciales por Defecto (Admin)

Al correr el sistema (ya sea Docker o local con el comando `npm run seed`), se autogenera este usuario administrador:

- **Email**: `admin@test.com`
- **Password**: `Admin123*`

Utiliza esta cuenta para acceder a la plataforma y explorar el CRUD restringido de usuarios.
