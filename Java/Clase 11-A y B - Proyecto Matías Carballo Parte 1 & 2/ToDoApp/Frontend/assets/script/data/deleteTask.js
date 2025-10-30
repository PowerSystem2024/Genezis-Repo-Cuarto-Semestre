/* ======================================================
 * MÓDULO: DELETETASK.JS (Capa de Datos)
 * ======================================================
 * Responsabilidad:
 * 1. Realizar la petición DELETE a la API para eliminar una tarea.
 * 2. Si la API responde OK (204), resolver la promesa.
 * 3. Si la API responde con error, lanzar un error.
 * ====================================================== */

// 1. ¡FIX RUTA!
import { path } from "./path.js";

/**
 * Llama a la API para eliminar (borrado lógico) una tarea.
 * @param {number} id - El ID de la tarea a eliminar
 * @throws {Error} Lanza un error si la respuesta de la API no es 'ok'.
 */
export const deleteTask = async (id) => {
  // 2. Usamos template literals para una URL más limpia
  const url = `${path}delete/${id}`;

  try {
    const response = await fetch(url, {
      method: "DELETE",
    });

    // 3. Manejo de errores HTTP (404, 500)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "No se pudo eliminar la tarea");
    }

    // 4. ¡Éxito!
    // La API devuelve 204 No Content (sin cuerpo).
    // Simplemente dejamos que la función termine.
    // Esto resuelve la promesa y le permite al 'await'
    // en 'deleteIco.js' continuar.

  } catch (error) {
    // 5. Manejo de errores de red o los errores que lanzamos arriba
    console.error("Error en deleteTask:", error);
    // Lanzamos el error para que 'deleteIco.js' lo atrape
    throw new Error(error.message);
  }

  // 6. ELIMINADO: .then(), .catch(), Swal.fire(), setTimeout() y window.location.href
};