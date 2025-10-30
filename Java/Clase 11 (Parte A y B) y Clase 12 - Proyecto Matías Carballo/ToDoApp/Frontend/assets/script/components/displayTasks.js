/* ======================================================
 * MÓDULO: DISPLAYTASKS.JS
 * ====================================================== */

import { createTask } from "./addTask.js";
import dateElement from "./dateElement.js";
import { getTasks } from "./../data/getTasks.js";

export const displayTasks = async () => {
  const list = document.querySelector("[data-list]");
  let tasks = [];

  try {
    // Intenta obtener las tareas
    tasks = await getTasks();
  } catch (error) {
    // Si getTasks falla (ej. backend caído), detenemos la función aquí
    // para evitar que el código de abajo (que usa 'tasks') falle.
    console.error("No se pudieron obtener las tareas para mostrar.", error);
    return;
  }

  // 1. DEFINICIÓN:
  // 'groupedTasks' DEBE definirse aquí, después de obtener las tareas
  // y fuera de cualquier 'catch'.
  const groupedTasks = new Map();

  tasks.forEach((task) => {
    const date = task.date;
    if (!groupedTasks.has(date)) {
      groupedTasks.set(date, []);
    }
    groupedTasks.get(date).push(task);
  });

  const sortedDates = [...groupedTasks.keys()].sort();

  list.innerHTML = "";

  sortedDates.forEach((date) => {
    list.appendChild(dateElement(date));

    // 2. USO:
    // Ahora usamos 'groupedTasks' (que ya existe)
    const tasksForDate = groupedTasks.get(date);

    // (Mejora Opcional que incluimos para ordenar por hora)
    const sortedTasks = tasksForDate.sort((a, b) => {
      return a.time.localeCompare(b.time);
    });

    sortedTasks.forEach((task) => {
      list.appendChild(createTask(task));
    });
  });
};