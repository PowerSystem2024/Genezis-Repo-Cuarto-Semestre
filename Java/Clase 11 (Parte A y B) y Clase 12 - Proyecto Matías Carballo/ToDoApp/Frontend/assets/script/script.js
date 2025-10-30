/* ======================================================
 * SCRIPT.JS (Punto de Entrada Principal)
 * ======================================================
 * Responsabilidad:
 * 1. Inicializar la aplicación.
 * 2. Conectar los eventos del DOM (ej. submit) con los módulos
 * que contienen la lógica de negocio (ej. addTask).
 * ====================================================== */

import { addTask } from "./components/addTask.js";
import { displayTasks } from "./components/displayTasks.js";

// IIFE (Immediately Invoked Function Expression) para encapsular
// la lógica de inicialización de la app.
(async () => {
  // 1. Seleccionamos el formulario (no el botón)
  // Usamos el ID que definimos en el index.html refactorizado.
  const taskForm = document.querySelector("#taskForm");

  // 2. Escuchamos el evento 'submit', no 'click'
  // La función 'addTask' recibirá el evento 'submit'
  taskForm.addEventListener("submit", addTask);

  // 3. Carga inicial de tareas
  // Envolvemos la carga inicial en un try...catch.
  // Si la API falla al cargar (ej. backend caído),
  // le mostraremos un error al usuario en lugar de una
  // pantalla en blanco.
  try {
    // 'displayTasks' es (y debe ser) una función asíncrona,
    // ya que tiene que hacer un fetch a la API.
    await displayTasks();
  } catch (error) {
    console.error("Error al cargar las tareas iniciales:", error);
    
    // Usamos SweetAlert para notificar al usuario (opcional pero recomendado)
    Swal.fire({
      icon: "error",
      title: "Error de Conexión",
      text: "No se pudieron cargar las tareas. Por favor, intente recargar la página.",
    });
  }
})();