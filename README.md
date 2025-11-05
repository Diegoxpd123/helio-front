# Reto Técnico - Helios

Sistema de gestión de departamentos organizacionales desarrollado con Laravel 12 (backend) y React 18 (frontend).

## Inicio Rápido

### 1. Backend (Terminal 1)
```bash
cd backend
composer install
cp .env.example .env
# Configurar .env con credenciales de MySQL
php artisan key:generate
php artisan migrate:fresh --seed
php artisan serve
```
Backend disponible en: http://localhost:8000

### 2. Frontend (Terminal 2)
```bash
cd frontend
npm install
npm run dev
```
Frontend disponible en: http://localhost:3000

**El archivo `.env` ya está configurado con: `VITE_API_URL=http://localhost:8000/api`**

**Nota**: Asegúrate de crear la base de datos MySQL `helios_departments` antes de ejecutar las migraciones.

## Características

### Backend (Laravel 12)
- API RESTful completa para gestión de departamentos
- Base de datos MySQL con relaciones jerárquicas
- Seeders con datos de prueba
- Validaciones y manejo de errores
- CORS configurado para desarrollo
- Endpoints para CRUD completo y listado de subdepartamentos

### Frontend (React 18 + Vite)
- Interfaz moderna con Ant Design 5
- Tabla interactiva con todas las funcionalidades requeridas:
  - Búsqueda global
  - Filtros por columna
  - Ordenamiento ascendente/descendente
  - Paginación configurable
- Diseño responsive
- Estilos con Less
- TypeScript para mayor seguridad de tipos

## Requisitos Previos

- PHP >= 8.2
- Composer
- Node.js >= 18
- MySQL >= 8.0
- npm o yarn

## Instalación

### Backend (Laravel)

1. **Navegar al directorio del backend**
   ```bash
   cd backend
   ```

2. **Instalar dependencias de PHP**
   ```bash
   composer install
   ```

3. **Configurar el archivo de entorno**
   ```bash
   cp .env.example .env
   ```

4. **Generar la clave de aplicación**
   ```bash
   php artisan key:generate
   ```

5. **Configurar la base de datos**
   
   Editar el archivo `.env` y configurar las credenciales de MySQL:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=helios_departments
   DB_USERNAME=root
   DB_PASSWORD=tu_password
   ```

6. **Crear la base de datos**
   ```bash
   mysql -u root -p
   CREATE DATABASE helios_departments;
   exit;
   ```

7. **Ejecutar migraciones y seeders**
   ```bash
   php artisan migrate:fresh --seed
   ```

8. **Iniciar el servidor de desarrollo**
   ```bash
   php artisan serve
   ```
   
   El backend estará disponible en: `http://localhost:8000`

### Frontend (React)

1. **Navegar al directorio del frontend**
   ```bash
   cd frontend
   ```

2. **Instalar dependencias de Node**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Crear un archivo `.env` en la raíz de `frontend` (puedes copiar desde `.env.example`):
   ```bash
   cp .env.example .env
   ```
   
   O crear manualmente el archivo `.env` con:
   ```env
   VITE_API_URL=http://localhost:8000/api
   ```

4. **Iniciar el servidor de desarrollo**
   ```bash
   npm run dev
   ```
   
   El frontend estará disponible en: `http://localhost:3000`
   
   **IMPORTANTE - Problemas Comunes**:
   
   Si ves una página en blanco o errores de importación:
   1. Detén el servidor (Ctrl+C)
   2. En Windows, ejecuta: `.\REINICIAR.bat`
   3. En Linux/Mac, ejecuta: `./REINICIAR.sh`
   
   O manualmente:
   - Windows: `rmdir /s /q node_modules\.vite` y luego `npm run dev`
   - Linux/Mac: `rm -rf node_modules/.vite` y luego `npm run dev`
   
   Si el problema persiste:
   - Asegúrate de tener el archivo `.env` con: `VITE_API_URL=http://localhost:8000/api`
   - Refresca el navegador con Ctrl+Shift+R (recarga forzada)

## API Endpoints

### Departamentos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/departments` | Listar todos los departamentos (con paginación, filtros y ordenamiento) |
| GET | `/api/departments/{id}` | Obtener un departamento específico |
| POST | `/api/departments` | Crear un nuevo departamento |
| PUT | `/api/departments/{id}` | Actualizar un departamento |
| DELETE | `/api/departments/{id}` | Eliminar un departamento |
| GET | `/api/departments/{id}/subdepartments` | Listar subdepartamentos de un departamento |

### Parámetros de Query para listado

- `search`: Búsqueda global por nombre o embajador
- `sortField`: Campo por el cual ordenar (name, level, employees_count, etc.)
- `sortOrder`: Orden ascendente o descendente (asc/desc)
- `perPage`: Cantidad de registros por página (default: 10)
- `page`: Número de página actual
- `filters`: JSON con filtros por columna

### Ejemplo de uso

```bash
# Listar departamentos con búsqueda
GET http://localhost:8000/api/departments?search=Marketing

# Listar con ordenamiento
GET http://localhost:8000/api/departments?sortField=name&sortOrder=asc

# Listar con paginación
GET http://localhost:8000/api/departments?page=2&perPage=20
```

## Estructura del Proyecto

```
HELIO/
├── backend/                    # Laravel 12 API
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   │       └── Api/
│   │   │           └── DepartmentController.php
│   │   └── Models/
│   │       └── Department.php
│   ├── database/
│   │   ├── migrations/
│   │   │   └── 2025_11_04_233508_create_departments_table.php
│   │   └── seeders/
│   │       ├── DatabaseSeeder.php
│   │       └── DepartmentSeeder.php
│   ├── routes/
│   │   └── api.php
│   └── config/
│       └── cors.php
│
└── frontend/                   # React 18 + Vite
    ├── src/
    │   ├── components/
    │   │   ├── DepartmentsView.tsx
    │   │   └── DepartmentsView.less
    │   ├── services/
    │   │   └── api.ts
    │   ├── App.tsx
    │   ├── App.less
    │   └── main.tsx
    ├── vite.config.ts
    └── package.json
```

## Tecnologías Utilizadas

### Backend
- **Laravel 12**: Framework PHP moderno
- **MySQL**: Sistema de gestión de base de datos
- **PHP 8.2+**: Lenguaje de programación

### Frontend
- **React 18**: Librería para interfaces de usuario
- **TypeScript**: Superset de JavaScript con tipado
- **Vite**: Build tool y dev server ultrarrápido
- **Ant Design 5**: Framework de componentes UI
- **Less**: Preprocesador CSS
- **Axios**: Cliente HTTP para peticiones API

## Modelo de Datos

### Departamento (Department)

| Campo | Tipo | Descripción |
|-------|------|-------------|
| id | bigint | ID único del departamento |
| name | string(45) | Nombre único del departamento |
| parent_department_id | bigint nullable | ID del departamento superior |
| level | integer | Nivel del departamento (generado aleatoriamente) |
| employees_count | integer | Cantidad de colaboradores (generado aleatoriamente) |
| ambassador_name | string nullable | Nombre completo del embajador |
| created_at | timestamp | Fecha de creación |
| updated_at | timestamp | Fecha de última actualización |

### Relaciones
- Un departamento puede tener un departamento superior (relación many-to-one)
- Un departamento puede tener múltiples subdepartamentos (relación one-to-many)

## Funcionalidades Implementadas

### Backend
- CRUD completo de departamentos
- Listado con paginación
- Búsqueda global por nombre y embajador
- Filtrado por columnas
- Ordenamiento configurable
- Listado de subdepartamentos
- Validaciones de negocio (nombre único, máximo 45 caracteres, etc.)
- Prevención de referencias circulares
- Seeders con datos de prueba realistas

### Frontend
- Interfaz fiel al diseño de Figma
- Header con navegación y usuario
- Tabs para Divisiones y Colaboradores
- Vista de Listado y Árbol (botones)
- Búsqueda global en tiempo real
- Tabla interactiva con:
  - Ordenamiento por cualquier columna
  - Filtros por columna (División)
  - Paginación con selector de elementos por página
  - Indicador de total de colaboradores
- Diseño responsive
- Carga asíncrona de datos

## Scripts Disponibles

### Backend
```bash
# Ejecutar migraciones
php artisan migrate

# Ejecutar seeders
php artisan db:seed

# Limpiar y repoblar base de datos
php artisan migrate:fresh --seed

# Ver rutas disponibles
php artisan route:list

# Ejecutar tests (si los hubiera)
php artisan test
```

### Frontend
```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Preview de build
npm run preview

# Linting
npm run lint
```

## Notas Adicionales

- El proyecto está completamente funcional y listo para desarrollo
- Los datos de prueba son generados aleatoriamente para level y employees_count
- El sistema incluye más de 30 departamentos de ejemplo con relaciones jerárquicas
- La API incluye CORS habilitado para desarrollo local
- El frontend está configurado con proxy para evitar problemas de CORS

## Autor

Desarrollado como parte del Reto Técnico para Helios

## Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

