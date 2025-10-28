package ar.com.utnfrsr.todoapp.model.mapper;

import ar.com.utnfrsr.todoapp.model.dto.request.TaskRequestDTO;
import ar.com.utnfrsr.todoapp.model.dto.response.TaskResponseDTO;
import ar.com.utnfrsr.todoapp.model.entity.Task;
import org.springframework.stereotype.Component;

// import java.time.LocalDateTime; // <-- ¡Ya no se necesita!
import java.util.List;
import java.util.stream.Collectors; // <-- Limpiando el import

@Component
public class TaskMapper {

    /**
     * REFACTORIZADO:
     * Se quitó la lógica de negocio (setCreatedDate).
     * El mapper ahora SOLO mapea.
     */
    public Task toTask(TaskRequestDTO taskRequestDTO) {
        Task task = new Task();
        task.setTitle(taskRequestDTO.getTitle());
        // task.setCreatedDate(LocalDateTime.now()); // <-- ¡ELIMINADO!
        task.setDate(taskRequestDTO.getDate());
        task.setTime(taskRequestDTO.getTime());
        return task;
    }

    public TaskResponseDTO toDTO(Task task) {
        TaskResponseDTO taskResponseDTO = new TaskResponseDTO();
        taskResponseDTO.setId(task.getId());
        taskResponseDTO.setTitle(task.getTitle());
        taskResponseDTO.setDate(task.getDate());
        taskResponseDTO.setTime(task.getTime());
        taskResponseDTO.setFinished(task.isFinished());
        taskResponseDTO.setCreatedDate(task.getCreatedDate());
        return taskResponseDTO;
    }

    public List<TaskResponseDTO> toDTOList(List<Task> tasks) {
        // Refactorizado: Usando un import más limpio para Collectors
        return tasks.stream().map(this::toDTO).collect(Collectors.toList());
    }
}