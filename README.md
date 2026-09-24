# TaskFlow

Aplicación Full-Stack para la gestión de usuarios y tareas, desarrollada con **Angular + Ionic** en el frontend y **ASP.NET Core 10** en el backend.

El proyecto incluye autenticación mediante JWT, gestión de usuarios, tablero Kanban, creación y administración de tareas, carga de imágenes, validación de formularios, pruebas unitarias y automatización de procesos mediante **GitHub Actions**.

La aplicación está desplegada en la nube como proyecto de portafolio:

* **Frontend:** Firebase Hosting
* **Backend API:** Render
* **Base de datos de producción:** Supabase / PostgreSQL
* **Desarrollo local:** SQL Server

---

## 🚀 Demo

**Aplicación en producción:**
usuarios-kanban-demo.web.app

### Credenciales de demostración

```text
Usuario: albertovaldez434@gmail.com
Contraseña: admin123@
```

> La aplicación de demostración utiliza una base de datos independiente de la configuración local de desarrollo.

---

## 📸 Vista previa

### Login

![Login](https://hdsarnayyialwynbafhw.supabase.co/storage/v1/object/sign/capturas/Timeline1-ezgif.com-video-to-webp-converter.webp)

### Cambio de tema

![Cambio de tema](https://hdsarnayyialwynbafhw.supabase.co/storage/v1/object/sign/capturas/Timeline2-ezgif.com-video-to-webp-converter.webp)

### Carga y cambio de imagen

![Carga de imágenes](https://hdsarnayyialwynbafhw.supabase.co/storage/v1/object/sign/capturas/Timeline3-ezgif.com-video-to-webp-converter.webp)

### Administración de usuarios

![CRUD de usuarios](https://hdsarnayyialwynbafhw.supabase.co/storage/v1/object/sign/capturas/Timeline4-ezgif.com-video-to-webp-converter.webp)

### Búsqueda de tareas

![Búsqueda de tareas](https://hdsarnayyialwynbafhw.supabase.co/storage/v1/object/sign/capturas/Timeline5-ezgif.com-video-to-webp-converter.webp)

### Navegación del tablero

![Navegación](https://hdsarnayyialwynbafhw.supabase.co/storage/v1/object/sign/capturas/Timeline6-ezgif.com-video-to-webp-converter.webp)

### Drag & Drop

![Drag and Drop](https://hdsarnayyialwynbafhw.supabase.co/storage/v1/object/sign/capturas/Timeline7-ezgif.com-video-to-webp-converter.webp)

### Creación de tareas

![Crear tarea](https://hdsarnayyialwynbafhw.supabase.co/storage/v1/object/sign/capturas/Timeline8-ezgif.com-video-to-webp-converter.webp)

---

# ✨ Características

## 🔐 Autenticación y seguridad

* Inicio de sesión mediante JWT
* Rutas protegidas
* Route Guards
* Validación de sesión
* Manejo del token de autenticación
* Hashing de contraseñas mediante BCrypt
* Autorización basada en roles

## 👥 Usuarios

* Creación de usuarios
* Consulta de usuarios
* Actualización de usuarios
* Eliminación de usuarios
* Administración de información de usuario
* Perfil de usuario
* Carga y actualización de imagen de perfil

## 📋 Gestión de tareas

* Creación de tareas
* Edición de tareas
* Eliminación de tareas
* Consulta de tareas
* Estados de trabajo
* Tablero Kanban
* Drag & Drop entre estados
* Búsqueda de tareas
* Dashboard

## 🎨 Interfaz

* Diseño responsive
* Tema claro/oscuro
* Componentes reutilizables
* Formularios reactivos
* Validaciones de formularios
* Loading states
* Toast notifications
* Navegación optimizada para dispositivos móviles

---

# 🏗️ Arquitectura

El proyecto está dividido en dos aplicaciones independientes:

```text
┌─────────────────────────────────────────────┐
│              Angular + Ionic                │
│                 Frontend                    │
│                                             │
│  Features · Core · Shared · Signals · RxJS │
└──────────────────────┬──────────────────────┘
                       │
                       │ HTTP / REST
                       ▼
┌─────────────────────────────────────────────┐
│              ASP.NET Core 10                │
│                   Web API                   │
│                                             │
│ Controllers · Services · DTOs · JWT        │
│ Entity Framework Core · BCrypt              │
└───────────────┬─────────────────┬───────────┘
                │                 │
                │                 │
                ▼                 ▼
       ┌────────────────┐   ┌────────────────┐
       │    Supabase    │   │ Supabase       │
       │   PostgreSQL   │   │ Storage        │
       └────────────────┘   └────────────────┘
```

### Infraestructura

```text
                       GitHub
                          │
             ┌────────────┴────────────┐
             │                         │
             ▼                         ▼
       Frontend Repo              Backend Repo
             │                         │
      GitHub Actions                  CI/CD
             │                         │
             ▼                         ▼
       Firebase Hosting              Render
                                       │
                                       ▼
                                  ASP.NET Core
                                       │
                                       ▼
                                   Supabase
```

---

# 🖥️ Frontend

El frontend está construido con **Angular 20** e **Ionic 8**, utilizando una arquitectura orientada a funcionalidades.

### Tecnologías principales

* Angular 20
* Ionic 8
* TypeScript
* RxJS
* Angular Signals
* Angular Router
* Reactive Forms
* Angular CDK
* Drag & Drop
* Capacitor
* SCSS
* ESLint

### Arquitectura

```text
src/app
│
├── core
│   ├── guards
│   ├── interceptors
│   ├── services
│   └── models
│
├── shared
│   ├── components
│   ├── directives
│   └── pipes
│
├── features
│   ├── auth
│   │   └── login
│   │
│   ├── dashboard
│   │
│   ├── users
│   │
│   ├── profile
│   │
│   └── tasks
│
└── assets
```

La aplicación separa la infraestructura transversal en `core`, los componentes reutilizables en `shared` y las funcionalidades de negocio dentro de `features`.

---

# 🧠 Manejo de estado

El frontend utiliza **Angular Signals** para manejar el estado reactivo de la aplicación.

Entre los casos de uso se encuentran:

* Estado de autenticación
* Datos de usuario
* Tareas
* Estado de las tareas
* Listas derivadas mediante `computed`
* Actualizaciones reactivas de la interfaz

Esto permite mantener actualizada la interfaz sin depender exclusivamente de `BehaviorSubject` u otros mecanismos tradicionales de estado.

---

# 🔑 Autenticación

La autenticación utiliza **JSON Web Tokens (JWT)**.

Flujo general:

```text
Usuario
   │
   ▼
Login
   │
   ▼
ASP.NET Core API
   │
   ├── Valida credenciales
   ├── Genera JWT
   │
   ▼
Frontend
   │
   └── Mantiene sesión
           │
           ▼
      HTTP Requests
           │
           ▼
      JWT Bearer Token
```

Las rutas protegidas utilizan guards y las solicitudes HTTP incorporan la información necesaria para autenticación.

---

# 📋 Tablero Kanban

Una de las funcionalidades principales es el tablero Kanban para administrar las tareas.

El usuario puede:

* Visualizar tareas por estado
* Crear nuevas tareas
* Modificar tareas
* Cambiar el estado de una tarea
* Mover tareas mediante Drag & Drop
* Buscar tareas
* Organizar el trabajo visualmente

El Drag & Drop está implementado utilizando **Angular CDK**.

---

# ⚙️ Backend

La API REST está desarrollada utilizando **ASP.NET Core 10**.

### Tecnologías principales

* .NET 10
* ASP.NET Core Web API
* Entity Framework Core
* PostgreSQL / Npgsql
* SQL Server para desarrollo local
* Supabase
* JWT Bearer Authentication
* BCrypt.Net
* Dapper
* Dependency Injection
* REST API
* Entity Framework Core Migrations

El proyecto utiliza **Entity Framework Core como principal mecanismo de acceso a datos**.

Dapper se incluye como una alternativa explorada dentro del proyecto para experimentar con acceso a datos de bajo nivel.

---

# 🗄️ Base de datos

El proyecto utiliza diferentes motores dependiendo del entorno.

### Desarrollo local

```text
ASP.NET Core
      │
      ▼
Entity Framework Core
      │
      ▼
SQL Server
```

### Producción

```text
ASP.NET Core
      │
      ▼
Entity Framework Core
      │
      ▼
Npgsql
      │
      ▼
PostgreSQL
      │
      ▼
Supabase
```

Esta separación permite trabajar localmente con SQL Server y utilizar PostgreSQL administrado mediante Supabase en el entorno de producción.

---

# ☁️ Supabase

Supabase se utiliza en producción como infraestructura para:

* Base de datos PostgreSQL
* Storage para imágenes

Las imágenes de perfil se almacenan utilizando Supabase Storage, mientras que los datos de la aplicación se manejan mediante PostgreSQL y Entity Framework Core.

---

# 🧪 Testing

El frontend cuenta con pruebas unitarias utilizando:

* Jasmine
* Karma
* ChromeHeadless
* Angular TestBed

Las pruebas se ejecutan automáticamente mediante GitHub Actions.

El workflow de testing se ejecuta cuando:

* Se hace push a `development`
* Se crea un Pull Request hacia `development`
* Se crea un Pull Request hacia `main`

El pipeline ejecuta:

```text
npm ci
   │
   ▼
Unit Tests
   │
   ▼
Angular Build
```

El objetivo es detectar errores antes de integrar cambios a las ramas principales.

---

# 🔄 CI/CD

El proyecto utiliza **GitHub Actions** para automatizar procesos de integración y despliegue.

## Frontend — Testing

En la rama `development` se ejecutan automáticamente las pruebas y el build:

```text
Push / Pull Request
        │
        ▼
GitHub Actions
        │
        ├── npm ci
        │
        ├── Unit Tests
        │
        └── npm run build
```

El workflow utiliza Node.js 22 y ChromeHeadless para ejecutar las pruebas en un entorno Linux.

## Frontend — Deployment

Cuando los cambios llegan a `main`, GitHub Actions realiza:

```text
Push → main
   │
   ▼
Install dependencies
   │
   ▼
Install Ionic CLI
   │
   ▼
ionic build --prod
   │
   ▼
Firebase CLI
   │
   ▼
Firebase Hosting
```

El deploy utiliza un secreto de GitHub para autenticar Firebase.

## Backend

La API se encuentra desplegada en **Render** para el entorno de producción.

El proceso de CI/CD del backend se mantiene separado del frontend para permitir administrar de forma independiente la API y la aplicación cliente.

---

# 📁 Repositorios

### Frontend

```text
Angular + Ionic + Capacitor
```

### Backend

```text
ASP.NET Core 10 Web API
```

Ambos repositorios forman parte de la misma aplicación Full-Stack.

---

# 🛠️ Instalación local

## Requisitos

Antes de ejecutar el proyecto localmente se requiere:

* Node.js 22+
* npm
* Angular CLI
* Ionic CLI
* .NET 10 SDK
* SQL Server
* Git

---

## Frontend

Clonar el repositorio:

```bash
git clone https://github.com/albertovaldez434-svg/usuarios-test.git
```

Entrar al proyecto:

```bash
cd usuarios-test
```

Instalar dependencias:

```bash
npm install
```

Ejecutar la aplicación:

```bash
ionic serve
```

La aplicación estará disponible normalmente en:

```text
http://localhost:8100
```

---

## Backend

Clonar el repositorio de la API y entrar al proyecto:

```bash
cd WSTestJSON_API
```

Configurar la conexión a SQL Server en la configuración de desarrollo.

Después ejecutar:

```bash
dotnet restore
```

Crear/aplicar las migraciones correspondientes:

```bash
dotnet ef database update
```

Ejecutar la API:

```bash
dotnet run
```

---

# 🔐 Configuración

Las credenciales, claves JWT, conexiones a bases de datos y credenciales de servicios externos **no deben almacenarse directamente en el repositorio**.

Para producción se utilizan variables y secretos de entorno proporcionados por la infraestructura correspondiente.

Ejemplos de configuración:

```text
JWT_SECRET
DATABASE_CONNECTION
SUPABASE_URL
SUPABASE_KEY
```

> Los nombres exactos de las variables deben coincidir con la configuración utilizada por cada entorno.

---

# 📱 Capacitor

El frontend utiliza **Capacitor**, lo que permite mantener la aplicación preparada para ejecutarse también como aplicación móvil.

La misma base de código puede utilizarse como aplicación web y como base para plataformas móviles compatibles con Capacitor.

---

# 📈 Objetivos del proyecto

Este proyecto comenzó como un proyecto personal para practicar desarrollo Full-Stack y evolucionó hacia una aplicación más completa, incorporando progresivamente:

* Arquitectura basada en funcionalidades
* Angular Signals
* RxJS
* Autenticación JWT
* REST APIs
* Entity Framework Core
* SQL Server
* PostgreSQL
* Supabase
* Testing
* GitHub Actions
* CI/CD
* Cloud deployment
* Firebase Hosting
* Render
* Capacitor

El objetivo principal es continuar mejorando la calidad del código, arquitectura, pruebas automatizadas y experiencia de usuario.

---

# 🗺️ Próximas mejoras

Algunas áreas que continúan en desarrollo:

* Incrementar la cobertura de pruebas unitarias
* Ampliar pruebas de integración
* Mejorar observabilidad y manejo de errores
* Continuar optimizando la arquitectura
* Mejorar el pipeline de CI/CD
* Incorporar nuevas funcionalidades al sistema de tareas

---

# 👨‍💻 Autor

**Alberto Valdez**

Frontend Developer especializado en Angular, con experiencia adicional en desarrollo backend con .NET y SQL.

### Tecnologías principales

```text
Angular · Ionic · TypeScript · JavaScript
C# · ASP.NET Core · Entity Framework Core
SQL Server · PostgreSQL
RxJS · Angular Signals
Git · GitHub Actions
Firebase · Supabase · Render
```

### Contacto

* GitHub: albertovaldez434-svg
* LinkedIn: albertovaldez434
