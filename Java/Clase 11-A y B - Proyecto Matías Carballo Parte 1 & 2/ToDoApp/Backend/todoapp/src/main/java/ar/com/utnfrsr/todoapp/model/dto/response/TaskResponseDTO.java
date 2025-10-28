package ar.com.utnfrsr.todoapp.model.dto.response;

import lombok.Data;

import java.time.LocalDate; // <-- REFACTORIZADO
import java.time.LocalDateTime; // <-- AÑADIDO
import java.time.LocalTime;
// import java.util.Date; // <-- ELIMINADO

/**
 * DTO para la respuesta de una Tarea.
 * Define la estructura de datos que el cliente RECIBIRÁ.
 * Oculta campos internos de la BBDD (como 'enabled').
 */
@Data
public class TaskResponseDTO {

    private Long id;
    private String title;

    // REFACTORIZADO: Se cambió del obsoleto 'java.util.Date' al moderno 'java.time.LocalDate'.
    private LocalDate date;

    private LocalTime time;
    private boolean finished;

    // AÑADIDO: Es buena práctica incluir la fecha de creación en la respuesta.
    // (Necesitaremos ajustar el TaskMapper para que rellene esto).
    private LocalDateTime createdDate;
}