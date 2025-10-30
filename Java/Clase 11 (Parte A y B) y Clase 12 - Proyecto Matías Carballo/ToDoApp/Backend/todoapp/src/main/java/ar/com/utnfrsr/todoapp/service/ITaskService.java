package ar.com.utnfrsr.todoapp.service;

import ar.com.utnfrsr.todoapp.model.dto.request.TaskRequestDTO;
import ar.com.utnfrsr.todoapp.model.dto.response.TaskResponseDTO;

import java.util.List;

/**
 * Interfaz (Contrato) para el Servicio de Tareas.
 * Define las operaciones de negocio que se pueden realizar con las Tareas,
 * abstrayendo la lógica de la implementación y usando DTOs para la comunicación.
 */
public interface ITaskService {

    /**
     * Crea una nueva tarea basada en los datos de un DTO de petición.
     * @param taskRequestDTO Datos de la nueva tarea.
     * @return El DTO de la tarea recién creada.
     */
    TaskResponseDTO createTask(TaskRequestDTO taskRequestDTO);

    /**
     * Obtiene una lista de todas las tareas (visibles).
     * @return Lista de DTOs de tareas.
     */
    List<TaskResponseDTO> findAll();

    /**
     * Actualiza el estado 'finished' de una tarea específica.
     * @param id El ID de la tarea a modificar.
     * @param finished El nuevo estado (true o false).
     */
    void updateTaskAsFinished(Long id, boolean finished);

    /**
     * Elimina una tarea por su ID (usando borrado lógico).
     * @param id El ID de la tarea a eliminar.
     */
    void deleteById(Long id);
}