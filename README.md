Aplicación de gestión de usuarios y tareas
============================================================

Una aplicación web y móvil para administrar usuarios y organizar
tareas en un tablero Kanban. Construida con Angular e Ionic, integra
una API REST para autenticación y operaciones de usuarios y tareas.


DEMOSTRACIÓN
------------

Demo web indicada en la documentación actual:
https://usuarios-test.onrender.com/


FUNCIONALIDADES
---------------
• Inicio de sesión conectado a la API y opción de acceso invitado
  para explorar la aplicación con datos de demostración.
• Control de acceso a pantallas mediante sesión y roles.
• Administración de usuarios: consulta, búsqueda, alta, edición y
  eliminación.
• Tablero Kanban con los estados Por hacer, En curso y Finalizado.
• Creación, edición, búsqueda y eliminación de tareas.
• Cambio de estado de tareas mediante drag and drop, con persistencia
  en la API.
• Perfil con selección de imagen desde cámara o galería y carga a la
  API; las imágenes se comprimen antes de enviarse.
• Interfaz adaptable a móvil y escritorio, con componentes de Ionic,
  formularios y ventanas modales.


TECNOLOGÍAS
-----------
• Angular 22 y TypeScript
• Ionic 9
• Capacitor 8 para capacidades móviles
• Angular Router, formularios reactivos y carga diferida de pantallas
• Angular Signals y RxJS para estado y flujos asíncronos
• Angular CDK para interacciones drag and drop
• Jasmine y Karma para pruebas unitarias
• SCSS para estilos


ARQUITECTURA DEL REPOSITORIO
----------------------------
src/app/features/auth/       Inicio de sesión y autenticación
src/app/features/users/      Pantalla y servicios de usuarios
src/app/features/dashboard/  Tablero y gestión de tareas
src/app/features/profile/    Perfil e imagen de usuario
src/app/core/                Guards, interceptors y servicios comunes
src/app/shared/              Componentes reutilizables y utilidades
src/environments/            Configuración de entorno y URL de API
android/                     Proyecto nativo Android con Capacitor


REQUISITOS
----------
• Node.js y npm compatibles con la versión instalada de Angular CLI. 
   (en este caso, node 24.19.0, Angular CLI 22.1.7 y Ionic CLI 7.2.1)
• Acceso a la API configurada para autenticación y datos.


EJECUCIÓN LOCAL
---------------
1. Instala las dependencias:

   npm ci

2. Revisa la URL base de la API en:

   src/environments/environment.ts

   La configuración actual apunta a:
   https://usuarios-api-test.onrender.com

3. Inicia el servidor de desarrollo:

   ionic serve -o

   Abre http://localhost:8100 en el navegador.


COMANDOS
--------
Iniciar en desarrollo:  npm start
Compilar:                npm run build
Ejecutar pruebas:        npm test
Analizar estilo:         npm run lint


CONSIDERACIONES
---------------
Este repositorio contiene el cliente Angular/Ionic. La API se consume
desde una URL configurada por entorno y no forma parte de este código.

El proyecto también incluye configuración Android de Capacitor. La
disponibilidad de cámara y galería depende de los permisos y del
dispositivo o entorno donde se ejecute.


PERFIL PROFESIONAL
------------------
Proyecto de portafolio que demuestra experiencia práctica en:

• Desarrollo de interfaces híbridas con Angular e Ionic.
• Integración de frontend con API REST.
• Diseño de aplicaciones por funcionalidades y componentes
  reutilizables.
• Flujos de autenticación, autorización por roles y navegación
  protegida.
• Gestión reactiva de estado, formularios y operaciones asíncronas.
• Interacciones de usuario avanzadas, como un tablero Kanban con
  drag and drop.
• Pruebas unitarias y configuración de compilación para web y Android.

Autor: Alberto Valdez
GitHub: https://github.com/albertovaldez434-svg
