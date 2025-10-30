/* ======================================================
 * MÓDULO: CHECKTASK.JS (Capa de Datos)
 * ======================================================
 * Responsabilidad:
 * 1. Realizar la petición PATCH a la API para actualizar el
 * estado 'finished' de una tarea.
 * 2. Si la API responde OK (204), resolver la promesa.
 * 3. Si la API responde con error, lanzar un error.
 * ====================================================== */

// 1. ¡FIX RUTA!
import { path } from "./path.js";

/**
 * Llama a la API para marcar una tarea como 'finished' (true/false)
 * @param {number} id - El ID de la tarea
 * @param {boolean} finished - El *nuevo* estado (true o false)
 * @throws {Error} Lanza un error si la respuesta de la API no es 'ok'.
 */
export const checkTask = async (id, finished) => {
  // 2. Usamos template literals para una URL más limpia
  const url = `${path}mark_as_finished/${id}/${finished}`;

  try {
    const response = await fetch(url, {
      method: "PATCH",
    });

    // 3. Manejo de errores HTTP (404, 400, 500)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "No se pudo actualizar la tarea");
    }

    // 4. ¡Éxito!
    // La API devuelve 204 No Content (sin cuerpo).
    // Simplemente dejamos que la función termine.
    // Esto resuelve la promesa y le permite al 'await'
    // en 'checkComplete.js' continuar.

  } catch (error) {
    // 5. Manejo de errores de red o los errores que lanzamos arriba
    console.error("Error en checkTask:", error);
    // Lanzamos el error para que 'checkComplete.js' lo atrape
    throw new Error(error.message);
  }

  // 6. ELIMINADO: .then(), .catch(), window.location.href y Swal.fire()
};