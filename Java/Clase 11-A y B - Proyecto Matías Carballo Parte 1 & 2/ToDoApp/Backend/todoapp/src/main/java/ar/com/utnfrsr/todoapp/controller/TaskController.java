package ar.com.utnfrsr.todoapp.controller;

import ar.com.utnfrsr.todoapp.model.dto.request.TaskRequestDTO;
import ar.com.utnfrsr.todoapp.model.dto.response.TaskResponseDTO;
// REFACTORIZADO: Se importa la INTERFAZ, no la implementación
import ar.com.utnfrsr.todoapp.service.ITaskService;
// REFACTORIZADO: Se importa @Valid para activar las validaciones del DTO
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// Imports para la documentación de Swagger (OpenAPI)
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;

// 1. =======================================================
//   ¡IMPORTA ESTA CLASE!
// ==========================================================
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("api/v1/tasks")
// 2. =======================================================
//   ¡AÑADE ESTA ANOTACIÓN AQUÍ!
//   Esto le da permiso a tu frontend (en el puerto 5501)
// ==========================================================
@CrossOrigin(origins = "http://127.0.0.1:5501")
@RequiredArgsConstructor
@Tag(name = "Gestión de Tareas", description = "Endpoints para crear, leer, actualizar y eliminar tareas")
public class TaskController {

    // REFACTORIZADO: Inyectamos la Interfaz (Contrato), no la Clase (Implementación).
    // Esto cumple con el Principio de Inversión de Dependencias (SOLID).
    private final ITaskService taskService;

    @Operation(summary = "Crear una nueva tarea")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Tarea creada exitosamente"),
            @ApiResponse(responseCode = "400", description = "Datos de entrada inválidos (ej. título vacío)")
    })
    @PostMapping("/create")
    public ResponseEntity<TaskResponseDTO> createTask(
            // REFACTORIZADO: @Valid activa las validaciones (@NotBlank, @NotNull)
            // que definimos en TaskRequestDTO.
            @Valid @RequestBody TaskRequestDTO taskRequestDTO) {

        TaskResponseDTO task = taskService.createTask(taskRequestDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(task);
    }

    @Operation(summary = "Obtener todas las tareas")
    @ApiResponse(responseCode = "200", description = "Lista de tareas obtenida")
    @GetMapping("/all")
    public ResponseEntity<List<TaskResponseDTO>> findAll() {
        List<TaskResponseDTO> tasks = taskService.findAll();
        return ResponseEntity.ok(tasks);
    }

    @Operation(summary = "Marcar una tarea como finalizada o pendiente")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Estado de la tarea actualizado"),
            @ApiResponse(responseCode = "404", description = "Tarea no encontrada")
    })
    @PatchMapping("/mark_as_finished/{id}/{finished}")
    public ResponseEntity<Void> markAsFinished(
            @PathVariable("id") Long id,
            @PathVariable("finished") boolean finished) {

        this.taskService.updateTaskAsFinished(id, finished);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Eliminar una tarea (Borrado Lógico)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Tarea eliminada exitosamente"),
            @ApiResponse(responseCode = "404", description = "Tarea no encontrada")
    })
    // REFACTORIZADO: Se añadió el "/" inicial por consistencia.
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable("id") Long id) {
        this.taskService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}