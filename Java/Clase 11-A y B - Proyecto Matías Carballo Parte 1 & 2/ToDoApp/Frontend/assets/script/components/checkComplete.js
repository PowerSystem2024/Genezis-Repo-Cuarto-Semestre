/* ======================================================
 * MÓDULO: CHECKCOMPLETE.JS (Componente de UI)
 * ======================================================
 * Responsabilidad:
 * 1. (checkComplete): Crear el icono de 'check'.
 * 2. (completeTask): Manejar el clic, llamar a la API
 * y actualizar la UI *después* de la confirmación.
 * ====================================================== */

import { checkTask } from "../data/checkTask.js";

/**
 * Factory que crea el icono <i> de 'check'.
 * @param {number} id - El ID de la tarea
 * @param {boolean} finished - El estado inicial de la tarea
 * @returns {HTMLElement} El elemento <i>
 */
const checkComplete = (id, finished) => {
  const i = document.createElement("i");
  // 1. Clases base que nunca cambian
  i.classList.add("fa-check-square", "icon");

  // 2. Clases de estado inicial (basadas en 'finished')
  if (finished) {
    i.classList.add("fas", "completeIcon"); // 'fas' = Sólido (completado)
  } else {
    i.classList.add("far"); // 'far' = Regular (pendiente)
  }

  // 3. Adjuntamos el handler, pasando solo el 'id'
  i.addEventListener("click", (event) => completeTask(event, id));
  
  return i;
};

/**
 * Handler asíncrono que maneja el clic en el 'check'.
 */
const completeTask = async (event, id) => {
  const element = event.target; // El icono <i>
  const card = element.closest(".card"); // El <li> padre

  // 4. (FIX BUG 1: Stale State)
  // Determinamos el *nuevo* estado leyendo la UI actual.
  // Si el icono 'fas' (sólido) está presente, significa que
  // la tarea ESTÁ completada, y la nueva acción es INCOMPLETARLA.
  const isCurrentlyFinished = element.classList.contains("fas");
  const newFinishedState = !isCurrentlyFinished; // ¡El estado opuesto!

  try {
    // 5. (FIX BUG 2: UI Sync)
    // Primero llamamos a la API con el *nuevo* estado y esperamos.
    await checkTask(id, newFinishedState);

    // 6. SI LA API TIENE ÉXITO, actualizamos la UI:
    // Toggling 'fas' (sólido) y 'far' (regular)
    element.classList.toggle("fas");
    element.classList.toggle("far");
    element.classList.toggle("completeIcon");

    // 7. Actualizamos el <li> padre para el estilo (ej. tachar texto)
    card.classList.toggle("task-finished");

  } catch (error) {
    // 8. SI LA API FALLA, mostramos un error y NO cambiamos la UI.
    console.error("Error al actualizar la tarea:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `No se pudo actualizar la tarea. ${error.message}`,
    });
  }
};

export default checkComplete;