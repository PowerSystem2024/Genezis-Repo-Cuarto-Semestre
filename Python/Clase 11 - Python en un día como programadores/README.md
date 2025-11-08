## 📝 Documentación de Actividad: Primer Día de Programación en Python

**Fecha de Creación:** 07 de noviembre de 2025
**Objetivo:** Configurar un entorno de desarrollo en Python, utilizar comandos básicos de terminal y Git, y comprender el uso del gestor de paquetes `pip`.

-----

### I. 📂 Configuración del Espacio de Trabajo Local

Esta sección detalla el proceso de inicialización del proyecto, incluyendo la creación de directorios y la configuración del control de versiones (Git).

| \# | Tarea Realizada | Comando Ejecutado | Detalle / Propósito |
| :-- | :--- | :--- | :--- |
| **1** | Apertura de Terminal | *Git Bash / Terminal Linux* | Se inició una terminal con privilegios de administrador (en Windows) para garantizar la ejecución de todos los comandos. |
| **2** | Creación del Directorio | `mkdir python-final` | Se creó la carpeta raíz del proyecto, nombrada `python-final`. |
| **3** | Navegación al Directorio | `cd python-final` | Se accedió al directorio creado para comenzar la configuración interna. |
| **4** | Inicialización de Git | `git init` | Se inicializó un repositorio Git local, preparando el proyecto para el seguimiento de cambios y el control de versiones. |
| **5** | Creación del Archivo Fuente | `touch finales.py` | Se creó el archivo de Python (`finales.py`) donde se alojará el código del proyecto. |
| **6** | Apertura en IDE | `code .` | Se abrió Visual Studio Code (VSC) en el contexto del directorio actual (`.`) para iniciar la edición. |

-----

### II. 🐍 Gestión del Entorno Python

Esta etapa se centró en la verificación de la instalación de Python y la creación de un entorno virtual aislado para el proyecto.

| \# | Tarea Realizada | Comando Ejecutado | Detalle / Propósito |
| :-- | :--- | :--- | :--- |
| **7** | Verificación de Versión | `python -V` / `python3 -V` | Se confirmó la versión de Python instalada en el sistema para asegurar la compatibilidad. |
| **8** | Creación de Entorno Virtual | `python3 -m venv venv` | Se creó un entorno virtual (`venv`) para aislar las dependencias de este proyecto del sistema global de Python. |
| **9** | Activación del Entorno | *Linux/macOS:* `source venv/bin/activate` <br> *Windows:* `venv\scripts\activate` | Se activó el entorno virtual. La presencia de `(venv)` en el *prompt* de la terminal indica que está activo. |
| **10** | Actualización de `pip` | `python3 -m pip install --upgrade pip` | Se actualizó el gestor de paquetes `pip` a su versión más reciente para mejorar el rendimiento y la seguridad. |

### III. 💡 Análisis: ¿Qué es pip y por qué se actualiza?

En este punto, se investigó y documentó la función del gestor de paquetes `pip` y la razón detrás de su actualización constante.

#### A. Definición de `pip`

**`pip`** (siglas que a menudo se refieren a **P**refered **I**nstaller **P**rogram) es el **sistema de gestión de paquetes estándar** en Python.

  * **Función Clave:** Permite a los desarrolladores instalar, desinstalar y administrar librerías y módulos de terceros (paquetes) alojados en el **Python Package Index (PyPI)**.
  * **Importancia:** Es fundamental para cualquier proyecto moderno, ya que permite incorporar funcionalidades complejas (como manejo de datos, desarrollo web, o machine learning) sin tener que codificarlas desde cero.

#### B. Justificación de la Actualización de `pip`

La ejecución del comando de actualización (`python3 -m pip install --upgrade pip`) es una práctica estándar de mantenimiento por las siguientes razones:

1.  **Seguridad:** Las actualizaciones suelen contener parches para vulnerabilidades de seguridad que podrían explotarse durante la descarga e instalación de paquetes.
2.  **Rendimiento y Estabilidad:** Las nuevas versiones incorporan mejoras en el algoritmo de resolución de dependencias, haciendo que las instalaciones sean más rápidas y menos propensas a errores.
3.  **Compatibilidad:** Se asegura la compatibilidad con las últimas versiones de Python y con los nuevos formatos de distribución de paquetes que se publican en PyPI.

-----

### IV. 🌐 Cierre y Control de Versiones Remoto (Git)

Finalmente, se registraron los archivos creados en el control de versiones de Git y se enlazó el trabajo con un repositorio remoto.

| \# | Tarea Realizada | Comando Ejecutado | Detalle / Propósito |
| :-- | :--- | :--- | :--- |
| **12.a**| Preparación de Archivos | `git add .` | Se agregaron todos los archivos del directorio actual (`.`) al área de *staging* para ser incluidos en el *commit*. |
| **12.b**| Registro del Historial | `git commit -m "feat: Inicialización del proyecto y configuración de entorno virtual"` | Se creó el primer *commit*, marcando el estado inicial del proyecto con una descripción clara. |
| **12.c**| Conexión Remota | `git remote add origin https://aws.amazon.com/es/what-is/repo/` | Se estableció el enlace al repositorio remoto (ej. GitHub), dándole el alias `origin`. |
| **12.d**| Subida de Cambios | `git push -u origin main` (o `master`) | Se subieron los *commits* locales a la rama principal del repositorio remoto, completando el envío del trabajo. |
| **13** | Enlace Final | *[GrupoGenezis - Cuarto Semestre](https://github.com/PowerSystem2024/Genezis-Repo-Cuarto-Semestre/tree/main/Python)* | Este documento (`README.md`) y el archivo `finales.py` están disponibles en el repositorio remoto. |
