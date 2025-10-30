/* ======================================================
 * MÓDULO: GETTASKS.JS (Capa de Datos)
 * ======================================================
 * Responsabilidad:
 * 1. Realizar la petición GET a la API para obtener TODAS las tareas.
 * 2. Si la API responde OK (200), devolver el array de tareas.
 * 3. Si la API responde con error, lanzar un error con el mensaje
 * del backend.
 * ====================================================== */

// 1. ¡FIX RUTA!
// Corregimos la ruta de importación.
import { path } from "./path.js";

export const getTasks = async () => {
  try {
    const response = await fetch(path + "all");

    // 2. Manejo de errores HTTP (404, 500, etc.)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al obtener las tareas");
    }

    // 3. Si todo va bien, devolvemos las tareas
    const tasks = await response.json();
    return tasks;

  } catch (error) {
    // 4. Manejo de errores de red (ej. servidor caído)
    console.error("Error en getTasks:", error);
    // Lanzamos el error para que sea capturado por el 'catch'
    // en script.js (en la carga inicial).
    throw new Error(error.message);
  }
};