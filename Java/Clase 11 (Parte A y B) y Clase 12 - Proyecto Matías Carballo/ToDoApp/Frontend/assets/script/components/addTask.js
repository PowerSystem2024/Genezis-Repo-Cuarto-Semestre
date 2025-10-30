/* ======================================================
 * MÓDULO: ADDTASK.JS
 * ======================================================
 * Responsabilidades:
 * 1. (addTask): Manejar el evento 'submit' del formulario.
 * 2. (createTask): Crear el elemento <li> de una tarea.
 * ====================================================== */

import checkComplete from "./checkComplete.js";
// Asumo que el nombre del archivo es 'deleteIco.js' como en tu import
import createDelIcon from "./deleteIco.js"; 
import { sendTask } from "../data/sendTask.js";

/**
 * Manejador del evento 'submit' del formulario.
 * Se encarga de recolectar los datos, enviarlos a la API
 * y añadir la nueva tarea al DOM sin recargar toda la lista.
 */
export const addTask = async (event) => {
  // 1. Prevenir la recarga de la página
  event.preventDefault();

  const form = event.target; // 'event.target' es el <form>
  const list = document.querySelector("[data-list]");

  // 2. Obtenemos los 3 inputs del formulario
  const input = form.querySelector("[data-form-input]");
  const dateInput = form.querySelector("[data-form-date]");
  const timeInput = form.querySelector("[data-form-time]");

  const title = input.value;
  const date = dateInput.value;
  const time = timeInput.value;

  // 3. Validación simple (aunque 'required' en HTML ya ayuda)
  if (title === "" || date === "" || time === "") {
    Swal.fire({
      icon: "warning",
      title: "Campos incompletos",
      text: "Por favor, complete todos los campos.",
    });
    return;
  }

  // 4. ¡FIX API! Aseguramos formato HH:MM:SS
  // El <input type="time"> devuelve "HH:MM".
  const timeFormatted = time.length === 5 ? `${time}:00` : time;

  const taskObj = {
    title,
    date,
    time: timeFormatted,
    finished: false, // 'finished' siempre es false al crear
  };

  try {
    // 5. ¡FIX RENDIMIENTO!
    // Enviamos la tarea y esperamos la respuesta de la API,
    // que incluye la tarea con su nuevo ID.
    const newTask = await sendTask(taskObj);

    // 6. Creamos el elemento HTML <li>
    const taskElement = createTask(newTask);

    // 7. ¡FIX RENDIMIENTO!
    // En lugar de borrar todo, solo añadimos la nueva tarea al final.
    // Esto es instantáneo y no requiere otra llamada a la API.
    list.appendChild(taskElement);

    // 8. Reseteamos el formulario y damos feedback
    form.reset(); // Limpia todos los inputs del formulario
    Swal.fire({
      icon: "success",
      title: "¡Tarea Creada!",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
    });

  } catch (error) {
    // 9. Manejo de errores de la API
    console.error("Error al crear la tarea:", error);
    Swal.fire({
      icon: "error",
      title: "Error de API",
      text: `No se pudo crear la tarea. ${error.message}`,
    });
  }
  
  // 10. ¡ELIMINADO!
  // list.innerHTML = "";
  // displayTasks();
};

/**
 * Función "Factory" para crear un elemento <li> (Task)
 * Recibe un objeto de tarea y devuelve el nodo del DOM.
 */
export const createTask = ({ id, title, time, finished }) => {
  const task = document.createElement("li");
  task.classList.add("card");
  // Si la tarea está 'finished', la marcamos visualmente
  if (finished) {
    task.classList.add("task-finished");
  }

  const taskContent = document.createElement("div");

  // 11. Pasamos el 'id' y el estado 'finished' al componente check
  const check = checkComplete(id, finished);

  const titleTask = document.createElement("span");
  titleTask.classList.add("task");
  titleTask.innerText = title;
  taskContent.appendChild(check);
  taskContent.appendChild(titleTask);

  const dateElement = document.createElement("span");
  
  // 12. (Opcional) Formateamos la hora para no mostrar segundos
  // La API nos da "HH:MM:SS", mostramos "HH:MM"
  dateElement.innerHTML = time.substring(0, 5); 

  task.appendChild(taskContent);
  task.appendChild(dateElement);
  task.appendChild(createDelIcon(id));
  return task;
};