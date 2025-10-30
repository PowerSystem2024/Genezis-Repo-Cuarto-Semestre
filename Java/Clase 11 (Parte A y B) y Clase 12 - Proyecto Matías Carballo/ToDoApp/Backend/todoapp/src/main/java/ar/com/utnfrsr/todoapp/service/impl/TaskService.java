package ar.com.utnfrsr.todoapp.service.impl;

import ar.com.utnfrsr.todoapp.exceptions.ToDoExceptions;
import ar.com.utnfrsr.todoapp.model.dto.request.TaskRequestDTO;
import ar.com.utnfrsr.todoapp.model.dto.response.TaskResponseDTO;
import ar.com.utnfrsr.todoapp.model.entity.Task;
import ar.com.utnfrsr.todoapp.model.mapper.TaskMapper;
import ar.com.utnfrsr.todoapp.repository.TaskRepository;
import ar.com.utnfrsr.todoapp.service.ITaskService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Implementación del Servicio de Tareas (Cerebro de la Aplicación).
 * Utiliza Inyección de Dependencias por Constructor (vía @RequiredArgsConstructor).
 */
@Service
@RequiredArgsConstructor
public class TaskService implements ITaskService {

    // Dependencias finales inyectadas por el constructor de Lombok
    private final TaskRepository repository;
    private final TaskMapper mapper;

    /**
     * Crea una nueva tarea.
     * Flujo: DTO -> Entidad -> repository.save() -> Entidad con ID -> DTO de respuesta
     */
    @Override
    public TaskResponseDTO createTask(TaskRequestDTO taskRequestDTO) {
        Task task = mapper.toTask(taskRequestDTO);
        Task savedTask = repository.save(task);
        return mapper.toDTO(savedTask);
    }

    /**
     * Devuelve todas las tareas "enabled = true"
     * (El filtro @Where en la Entidad Task se aplica automáticamente aquí).
     */
    @Override
    public List<TaskResponseDTO> findAll() {
        List<Task> tasks = repository.findAll();
        return mapper.toDTOList(tasks);
    }

    /**
     * Actualiza el estado 'finished' de una tarea.
     * Es transaccional: si falla, se revierte.
     */
    @Override
    @Transactional
    public void updateTaskAsFinished(Long id, boolean finished) {
        // "Guard Clause": Asegurarse de que la tarea exista antes de actualizar.
        Optional<Task> optionalTask = this.repository.findById(id);
        if (optionalTask.isEmpty()) {
            throw new ToDoExceptions("Task with ID " + id + " not found", HttpStatus.NOT_FOUND);
        }

        // REFACTORIZADO: Se eliminó la línea "finished = !finished;", que era un bug.
        // Ahora se usa el valor 'finished' que vino como parámetro.
        this.repository.markTaskAsFinished(id, finished);
    }

    /**
     * Elimina (lógicamente) una tarea.
     * La anotación @SQLDelete en la Entidad Task intercepta esta llamada.
     */
    @Override
    public void deleteById(Long id) {
        // "Guard Clause": Asegurarse de que la tarea exista antes de eliminar.
        Optional<Task> optionalTask = this.repository.findById(id);
        if (optionalTask.isEmpty()) {
            throw new ToDoExceptions("Task with ID " + id + " not found", HttpStatus.NOT_FOUND);
        }

        this.repository.deleteById(id);
    }
}