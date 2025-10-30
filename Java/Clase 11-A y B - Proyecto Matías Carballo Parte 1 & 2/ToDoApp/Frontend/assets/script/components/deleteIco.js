/* ======================================================
 * MÓDULO: DELETEICO.JS (Componente de UI)
 * ======================================================
 * Responsabilidad:
 * 1. (createDelIcon): Crear el icono <i> de 'borrar'.
 * 2. (dumpTask): Pedir confirmación, llamar a la API
 * y eliminar la tarjeta del DOM *después* de la confirmación.
 * ====================================================== */

import { deleteTask } from "./../data/deleteTask.js";
// 1. ELIMINADO: 'displayTasks' ya no es necesario.

const createDelIcon = (id) => {
  const i = document.createElement("i");
  i.classList.add("fas", "fa-trash-alt", "trashIcon", "icon");
  
  // 2. Pasamos el 'event' al handler para poder encontrar la tarjeta
  i.addEventListener("click", (event) => dumpTask(event, id));
  
  return i;
};

/**
 * Handler asíncrono que maneja el clic en el 'borrar'.
 */
const dumpTask = async (event, id) => {
  
  // 3. (FIX UX) Pedimos confirmación al usuario
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No podrás revertir la eliminación de esta tarea!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, ¡bórrala!",
    cancelButtonText: "Cancelar",
  });

  // Si el usuario presiona "Cancelar", no hacemos nada.
  if (!result.isConfirmed) {
    return;
  }

  // 4. (FIX PARPADEO)
  // Obtenemos la tarjeta <li> más cercana al icono que se clickeó
  const card = event.target.closest(".card");

  try {
    // 5. (FIX SYNC) Llamamos a la API y esperamos
    await deleteTask(id);

    // 6. (FIX PARPADEO)
    // Si la API tuvo éxito, eliminamos *solo* la tarjeta del DOM.
    card.remove();

    Swal.fire({
      icon: "success",
      title: "¡Tarea Eliminada!",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
    });

  } catch (error) {
    // 7. (FIX SYNC) Si la API falla, mostramos error y NO tocamos la UI
    console.error("Error al eliminar la tarea:", error);
    Swal.fire({
      icon: "error",
      title: "Error",
      text: `No se pudo eliminar la tarea. ${error.message}`,
    });
  }

  // 8. ELIMINADO:
  // const list = document.querySelector("[data-list]");
  // list.innerHTML = "";
  // displayTasks();
};

export default createDelIcon;