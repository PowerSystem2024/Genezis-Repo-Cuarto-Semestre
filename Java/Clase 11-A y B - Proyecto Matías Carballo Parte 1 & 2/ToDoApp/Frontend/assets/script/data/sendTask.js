/* ======================================================
 * MÓDULO: SENDTASK.JS (Capa de Datos)
 * ======================================================
 * Responsabilidad:
 * 1. Realizar la petición POST a la API para crear una tarea.
 * 2. Si la API responde OK (201), devolver el JSON de la nueva tarea.
 * 3. Si la API responde con error, lanzar un error con el mensaje
 * del backend.
 * ====================================================== */

import { path } from "./path.js";

/**
 * Envía un objeto de tarea a la API backend.
 * @param {object} taskObj - El objeto de tarea (title, date, time)
 * @returns {Promise<object>} La nueva tarea creada por la API (con id)
 * @throws {Error} Lanza un error si la respuesta de la API no es 'ok'.
 */
export const sendTask = async (taskObj) => {
  const url = `${path}create`;

  // 1. Hacemos 'fetch' y esperamos la respuesta (res)
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(taskObj),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // 2. Manejo de Errores de API (ej. 400, 404, 500)
  if (!res.ok) {
    // La API nos devuelve un JSON con el error
    const errorData = await res.json();
    
    // 3. Lanzamos un error que será capturado por el 'catch' en addTask.js
    throw new Error(errorData.message || "No se pudo crear la tarea");
  }

  // 4. Si todo salió bien (201 Created), la API devuelve la nueva tarea.
  // La retornamos para que addTask.js pueda usarla.
  return await res.json();
  
  // 5. ELIMINADO: .then(), .catch(), window.location.href y Swal.fire()
};