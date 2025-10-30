package ar.com.utnfrsr.todoapp.exceptions;

import lombok.Getter; // ¡Volvemos a usar Lombok!
import org.springframework.http.HttpStatus;

/**
 * Excepción personalizada, ahora usando Lombok (@Getter)
 * ya que el "Annotation Processing" está activado.
 */
@Getter // <-- @Getter es inmutable (sin setters), mejor que @Data
public class ToDoExceptions extends RuntimeException {

    // El campo 'message' se hereda de RuntimeException
    private final HttpStatus httpStatus;

    public ToDoExceptions(String message, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }

    // REFACTORIZADO:
    // Ya no necesitamos el método manual getHttpStatus()
    // ¡Lombok @Getter lo creará por nosotros!
}