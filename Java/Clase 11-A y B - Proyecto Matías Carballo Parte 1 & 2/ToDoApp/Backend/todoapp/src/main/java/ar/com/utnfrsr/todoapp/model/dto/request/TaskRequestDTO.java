package ar.com.utnfrsr.todoapp.model.dto.request;

// REFACTORIZADO: Se importa la anotación de validación correcta para Strings
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

// REFACTORIZADO: Se importan solo las clases de 'java.time' necesarias
import java.time.LocalDate;
import java.time.LocalTime;
// Se eliminan 'java.util.Date' y 'java.time.LocalDateTime'

/**
 * DTO para la creación de una Tarea.
 * Define la estructura de datos que el cliente DEBE enviar.
 */
@Data
public class TaskRequestDTO {

    /**
     * REFACTORIZADO:
     * Se usa @NotBlank en lugar de @NotNull.
     * @NotBlank valida (not null, not empty, not whitespace).
     * El mensaje provee una respuesta de error clara para el frontend.
     */
    @NotBlank(message = "El título no puede estar vacío")
    private String title;

    /**
     * REFACTORIZADO:
     * Se eliminó el campo 'createdDate'.
     * El cliente NUNCA debe definir este valor.
     * El servidor lo asignará automáticamente usando JPA Auditing (@CreatedDate).
     */

    /**
     * REFACTORIZADO:
     * Se cambió del obsoleto 'java.util.Date' al moderno 'java.time.LocalDate'.
     */
    @NotNull(message = "La fecha no puede ser nula")
    private LocalDate date;

    @NotNull(message = "La hora no puede ser nula")
    private LocalTime time;
}