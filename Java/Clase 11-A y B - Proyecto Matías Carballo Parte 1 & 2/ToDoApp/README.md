
# API REST para Gestión de Tareas (ToDo App) - Backend
![Java](https://img.shields.io/badge/Java-17-blue)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.x-green)
![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)
![Maven](https://img.shields.io/badge/Maven-3.x-red)
![Swagger](https://img.shields.io/badge/Swagger-OpenAPI-blueviolet)

Este repositorio contiene el backend completo para una aplicación de "ToDo List", desarrollado como parte de la Clase 11 (a y b). El proyecto ha sido profundamente analizado y refactorizado para seguir las mejores prácticas de arquitectura de software, principios SOLID y patrones de diseño de nivel empresarial.

El propósito es servir como una base de código robusta, escalable y mantenible para una aplicación de gestión de tareas, exponiendo una API RESTful segura y bien documentada.

---

### Características Principales

Este no es un CRUD básico. La arquitectura de esta API incluye:

* **Arquitectura Limpia en Capas:** Separación estricta de responsabilidades (Capa de Controlador, Servicio y Repositorio).
* **Patrón DTO (Data Transfer Object):** Se utilizan DTOs (`TaskRequestDTO`, `TaskResponseDTO`) para desacoplar el contrato de la API de la entidad de la base de datos, mejorando la seguridad y la flexibilidad.
* **Inyección de Dependencias (SOLID):** Se adhiere al Principio de Inversión de Dependencias, inyectando la interfaz (`ITaskService`) en el controlador.
* **Borrado Lógico (Soft Delete):** Las tareas no se eliminan físicamente. Se utiliza `@SQLDelete` y `@Where` para "ocultarlas", preservando la integridad de los datos.
* **Auditoría de Entidades (JPA Auditing):** El campo `createdDate` se rellena automáticamente en el momento de la creación gracias a `@CreatedDate`.
* **Manejo Centralizado de Excepciones:** Un `@ControllerAdvice` (`ExceptionHandler`) intercepta las excepciones personalizadas (`ToDoExceptions`) para enviar respuestas de error JSON limpias y estandarizadas (ej. 404).
* **Validación de API:** Se utiliza `jakarta.validation` (con `@Valid`, `@NotBlank`) en la capa de Controlador para rechazar peticiones inválidas.
* **Documentación Automática:** La API se documenta a sí misma usando `Springdoc OpenAPI (Swagger)`.
* **Configuración Segura:** La información sensible (usuario y contraseña de BBDD) se gestiona a través de Variables de Entorno, no hardcodeada en el `application.yml`.
* **CORS Configurado:** Permite peticiones desde un frontend (ej. `localhost:3000`) de forma segura.

---

##  Tecnologías Utilizadas

* **Java 17**
* **Spring Boot 3.x**
* **Spring Data JPA (Hibernate)**: Para la persistencia de datos.
* **MySQL 8**: Como base de datos relacional.
* **Maven**: Como gestor de dependencias y construcción del proyecto.
* **Lombok**: Para reducir el código repetitivo (boilerplate).
* **Springdoc OpenAPI (Swagger)**: Para la documentación de la API.
* **Insomnia/Postman**: Para pruebas de endpoints.

---

##  Puesta en Marcha (Getting Started)

Sigue estos pasos para ejecutar el proyecto en tu máquina local.

### 1. Prerrequisitos

Asegúrate de tener instalado:
* Git
* JDK 17 (o superior)
* Apache Maven 3.x
* Un servidor de MySQL 8 (como el Community Server o XAMPP)

### 2. Clonar el Repositorio

```bash
git clone [https://github.com/tu-usuario/tu-repositorio.git](https://github.com/tu-usuario/tu-repositorio.git)
cd tu-repositorio
```
### 3\. Configurar la Base de Datos

1.  Abre tu cliente de MySQL (Workbench, XAMPP, etc.).
2.  Crea una nueva base de datos (schema) llamada `db_todo_api`.
    ```sql
    CREATE DATABASE db_todo_api;
    ```
3.  La aplicación **creará las tablas automáticamente** la primera vez que se ejecute (gracias a `ddl-auto: update`).

### 4\. Configurar las Variables de Entorno (¡Importante\!)

La aplicación **no funcionará** si no se configuran las credenciales de la base de datos.

Si usas **IntelliJ IDEA** (recomendado):

1.  En la esquina superior derecha, haz clic en "Edit Configurations...".
2.  Busca tu configuración de `TodoAppApplication`.
3.  Haz clic en "Modify options" y selecciona "Add environment variables".
4.  Añade las siguientes dos variables:
      * **`DB_USER`**: `root` (o tu usuario de MySQL)
      * **`DB_PASS`**: `tu_contraseña_secreta`

### 5\. Ejecutar la Aplicación

1.  Abre el proyecto en IntelliJ.
2.  Deja que Maven descargue las dependencias.
3.  Navega al archivo `src/main/java/.../TodoAppApplication.java` y presiona el botón "Play" (▶).
4.  La consola debería mostrar el mensaje:
    `Tomcat started on port(s): 8081 (http)`

-----

##  Documentación de la API (Endpoints)

Una vez que la aplicación esté corriendo, puedes acceder a la documentación interactiva de Swagger en tu navegador:

➡️ **`http://localhost:8081/swagger-ui/index.html`**

### Endpoints Principales

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

##  Próximas Implementaciones (Roadmap)

Este proyecto es la base. Las siguientes mejoras planificadas para llevar esta API a un nivel de producción completo son:

  * **1. Seguridad (Spring Security & JWT):**

      * Implementar autenticación de usuarios (registro e inicio de sesión).
      * Proteger los endpoints de tareas con JSON Web Tokens (JWT) para que cada usuario solo pueda ver y gestionar sus propias tareas.

  * **2. Pruebas Unitarias (JUnit & Mockito):**

      * Escribir pruebas unitarias para la capa de servicio (`TaskService`) para garantizar que la lógica de negocio sea correcta y prevenir regresiones.

  * **3. Contenerización (Docker):**

      * Crear un `Dockerfile` y un `docker-compose.yml` para empaquetar la API y su base de datos MySQL, permitiendo un despliegue fácil y consistente en cualquier entorno con un solo comando.

  * **4. Integración con Frontend:**

      * Consumir esta API desde una aplicación cliente (React, Angular, Vue, etc.) para completar la aplicación Full-Stack.

<!-- end list -->