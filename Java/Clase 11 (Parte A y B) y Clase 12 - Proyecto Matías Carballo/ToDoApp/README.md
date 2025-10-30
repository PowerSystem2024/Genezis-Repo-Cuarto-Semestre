
-----

# Aplicación Full-Stack de Gestión de Tareas (ToDo App)

![Java](https://img.shields.io/badge/Java-17-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![Maven](https://img.shields.io/badge/Maven-3.x-red)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow)
![HTML5](https://img.shields.io/badge/HTML5-E34F26)
![CSS3](https://img.shields.io/badge/CSS3-1572B6)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-blueviolet)

Este repositorio contiene una aplicación **Full-Stack** de "ToDo List". El proyecto ha sido profundamente analizado y refactorizado para seguir las mejores prácticas de arquitectura de software, tanto en el backend como en el frontend.

* **Backend (API):** Una API RESTful robusta, escalable y segura construida con Java y Spring Boot.
* **Frontend (UI):** Una interfaz de usuario moderna, modular y 100% responsiva construida con **HTML, CSS y JavaScript Vainilla (ES6+)**.

El propósito es servir como una base de código completa, demostrando una arquitectura limpia y desacoplada en ambas partes de la aplicación.

-----

## Arquitectura y Características

### Backend (API)

Este no es un CRUD básico. La arquitectura de esta API incluye:

* **Arquitectura Limpia en Capas:** Separación estricta de responsabilidades (Controlador, Servicio, Repositorio).
* **Patrón DTO (Data Transfer Object):** Se utilizan DTOs (`TaskRequestDTO`, `TaskResponseDTO`) para desacoplar el contrato de la API de la entidad de la base de datos.
* **Inyección de Dependencias (SOLID):** Se adhiere al Principio de Inversión de Dependencias (inyectando `ITaskService`).
* **Borrado Lógico (Soft Delete):** Las tareas no se eliminan físicamente (`@SQLDelete` y `@Where`).
* **Auditoría de Entidades:** El campo `createdDate` se rellena automáticamente (`@CreatedDate`).
* **Manejo Centralizado de Excepciones:** Un `@ControllerAdvice` (`ExceptionHandler`) para respuestas de error JSON limpias.
* **Validación de API:** Se utiliza `jakarta.validation` (`@Valid`, `@NotBlank`) en el Controlador.
* **Documentación Automática:** API documentada con `Springdoc OpenAPI (Swagger)`.
* **Configuración Segura:** Credenciales de BBDD gestionadas a través de Variables de Entorno.
* **CORS Configurado:** Permite peticiones desde el frontend (`http://127.0.0.1:5501`) de forma segura.

### Frontend (UI)

La interfaz de usuario fue construida desde cero sin frameworks, enfocándose en la modularidad y el rendimiento.

* **Stack "Vanilla":** Construido con HTML5 semántico, CSS3 moderno y JavaScript Vainilla (ES6+).
* **Arquitectura Modular (ES6 Modules):** El código está organizado en carpetas con responsabilidades claras:
    * `/components`: Módulos que crean y manejan elementos del DOM (ej. `addTask.js`, `deleteIco.js`).
    * `/data`: Módulos de "capa de datos" que manejan **exclusivamente** la comunicación `fetch` con la API.
* **Separación de Responsabilidades (SoC):**
    * La **Capa de UI** (`/components`) maneja los eventos (`click`, `submit`).
    * La **Capa de Datos** (`/data`) es `async` y usa `throw` para lanzar errores.
    * La UI llama a la capa de datos dentro de bloques `try...catch` para manejar el éxito o el error (mostrando alertas `SweetAlert2`).
* **Rendimiento (Experiencia SPA):**
    * **¡Sin recargas de página!** La aplicación nunca usa `window.location.reload()`.
    * Las tareas se añaden (`appendChild`) y eliminan (`remove`) del DOM instantáneamente, creando una experiencia de usuario fluida y rápida.
    * La lógica de carga (`displayTasks`) usa un `Map` para agrupar tareas (O(n)), evitando bucles anidados O(n²).
* **CSS Moderno y Responsivo:**
    * **Mobile-First:** El diseño está construido para móviles primero y escala a escritorio.
    * **Variables CSS:** Todos los colores y tamaños están centralizados en `:root` para un fácil mantenimiento.
    * **Modo Oscuro (Dark Mode) Automático:** La aplicación respeta la preferencia del sistema operativo del usuario usando `@media (prefers-color-scheme: dark)`.
* **Accesibilidad (A11y):** Se aseguran los indicadores de foco (`:focus`) para la navegación por teclado.

-----

## Tecnologías Utilizadas

| Stack | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Backend** | Java 17 | Lenguaje principal |
| **Backend** | Spring Boot 3.x | Framework de la API |
| **Backend** | Spring Data JPA | Persistencia de datos (Hibernate) |
| **Backend** | MySQL 8 | Base de datos relacional |
| **Backend** | Maven | Gestor de dependencias |
| **Backend** | Lombok | Reducción de boilerplate |
| **Backend** | Springdoc OpenAPI | Documentación (Swagger) |
| **Frontend**| HTML 5 | Estructura semántica |
| **Frontend**| CSS 3 | Estilos (Variables, Flexbox, Dark Mode) |
| **Frontend**| JavaScript (ES6+) | Lógica de UI (Módulos, `async/await`, `fetch`) |
| **Frontend**| SweetAlert2 | Alertas y modales de confirmación |
| **Frontend**| Live Server (VSCode) | Entorno de desarrollo local |

-----

## Puesta en Marcha (Getting Started)

Sigue estos pasos para ejecutar el proyecto **Full-Stack** en tu máquina local.

### 1. Prerrequisitos

Asegúrate de tener instalado:

* Git
* JDK 17 (o superior)
* Apache Maven 3.x
* Un servidor de MySQL 8
* Visual Studio Code
* La extensión [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) en VSCode.

### 2. Clonar el Repositorio

```bash
git clone [https://github.com/fernando-alma/ToDo-App-Full-Stack-API-REST-Frontend-.git](https://github.com/fernando-alma/ToDo-App-Full-Stack-API-REST-Frontend-.git)
````

### 3\. Configurar la Base de Datos (Backend)

1.  Abre tu cliente de MySQL.
2.  Crea una nueva base de datos (schema) llamada `db_todo_api`.
    ```sql
    CREATE DATABASE db_todo_api;
    ```
3.  La aplicación **creará las tablas automáticamente** (`ddl-auto: update`).

### 4\. Configurar Variables de Entorno (Backend)

La aplicación **no funcionará** si no se configuran las credenciales de la BBDD.

Si usas **IntelliJ IDEA**:

1.  Ve a "Edit Configurations...".
2.  Busca tu `TodoAppApplication`.
3.  Haz clic en "Modify options" -\> "Add environment variables".
4.  Añade las siguientes dos variables:
      * **`DB_USER`**: `root` (o tu usuario de MySQL)
      * **`DB_PASS`**: `tu_contraseña_secreta`

### 5\. Ejecutar el Backend (API)

1.  Abre la carpeta `/Backend` en IntelliJ.
2.  Deja que Maven descargue las dependencias.
3.  Ejecuta `src/main/java/.../TodoAppApplication.java`.
4.  La consola debe mostrar:
    `Tomcat started on port(s): 8081 (http)`
5.  **¡El backend ya está listo\!**

### 6\. Ejecutar el Frontend (UI)

1.  Abre la carpeta raíz del proyecto en **Visual Studio Code**.
2.  Navega a la carpeta `/Frontend`.
3.  Haz clic derecho en el archivo `index.html`.
4.  Selecciona **"Open with Live Server"**.
5.  Tu navegador se abrirá automáticamente en `http://127.0.0.1:5501` (o un puerto similar).
6.  **¡La aplicación Full-Stack está funcionando\!**

-----

## Documentación de la API (Endpoints)

Una vez que el **backend** esté corriendo, puedes acceder a la documentación interactiva de Swagger:

➡️ **`http://localhost:8081/swagger-ui/index.html`**

| Método | URL | Descripción |
| :--- | :--- | :--- |
| `POST` | `/api/v1/tasks/create` | Crea una nueva tarea. |
| `GET` | `/api/v1/tasks/all` | Obtiene la lista de todas las tareas (no "borradas"). |
| `PATCH` | `/api/v1/tasks/mark_as_finished/{id}/{finished}` | Marca una tarea como finalizada (`true`) o pendiente (`false`). |
| `DELETE`| `/api/v1/tasks/delete/{id}` | Realiza un borrado lógico de la tarea. |

### Ejemplo de Body (JSON) para `POST /create`

```json
{
  "title": "Refactorizar el ExceptionHandler",
  "date": "2025-10-29",
  "time": "10:00:00"
}
```

-----

## Próximas Implementaciones (Roadmap)

Este proyecto es la base. Las siguientes mejoras planificadas para llevar esta API a un nivel de producción completo son:

  * **1. Seguridad (Spring Security & JWT):**

      * Implementar autenticación de usuarios (registro e inicio de sesión).
      * Proteger los endpoints de tareas con JSON Web Tokens (JWT) para que cada usuario solo pueda ver y gestionar sus propias tareas.

  * **2. Pruebas Unitarias (JUnit & Mockito):**

      * Escribir pruebas unitarias para la capa de servicio (`TaskService`) para garantizar que la lógica de negocio sea correcta.

  * **3. Contenerización (Docker):**

      * Crear un `Dockerfile` y un `docker-compose.yml` para empaquetar la API y su base de datos MySQL, permitiendo un despliegue fácil y consistente.

<!-- end list -->
