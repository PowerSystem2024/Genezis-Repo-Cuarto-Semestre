/* ======================================================
 * MÓDULO: DATEELEMENT.JS (Componente de UI)
 * ======================================================
 * Responsabilidad:
 * 1. Recibir un string de fecha (ej. "2025-10-29").
 * 2. Formatearlo a un formato legible para el usuario.
 * 3. Devolver el elemento <li> del DOM.
 * ====================================================== */

/**
 * Crea un elemento <li> que sirve como encabezado de fecha.
 * @param {string} date - La fecha en formato "YYYY-MM-DD"
 * @returns {HTMLLIElement} El elemento <li> del DOM
 */
export default (date) => {
  const dateElement = document.createElement("li");
  dateElement.classList.add("date");

  // 1. (REFACTOR)
  // Usamos 'moment' (cargado globalmente) para formatear la fecha.
  
  // Primero, le decimos a moment que estamos en español.
  moment.locale("es"); 

  // Parseamos el string "YYYY-MM-DD" y le damos un formato amigable.
  // .format("dddd, D [de] MMMM") -> ej: "miércoles, 29 de octubre"
  const formattedDate = moment(date, "YYYY-MM-DD").format("dddd, D [de] MMMM");

  // 2. Insertamos la fecha formateada
  dateElement.innerHTML = formattedDate;
  
  return dateElement;
};