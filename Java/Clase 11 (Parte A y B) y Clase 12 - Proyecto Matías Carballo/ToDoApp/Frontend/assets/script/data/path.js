/* ======================================================
 * MÓDULO: PATH.JS (Constantes)
 * ======================================================
 * Responsabilidad:
 * 1. Centralizar la URL base de la API para fácil
 * mantenimiento.
 * ====================================================== */

// 1. (FIX CRÍTICO)
// Apuntamos al puerto 8081, que es donde el
// backend (API) está corriendo.
export const path = "http://127.0.0.1:8081/api/v1/tasks/";

// Nota: El resto del path "/api/v1/tasks/" es perfecto,
// ya que nuestros módulos de datos añaden "create", "all", etc.