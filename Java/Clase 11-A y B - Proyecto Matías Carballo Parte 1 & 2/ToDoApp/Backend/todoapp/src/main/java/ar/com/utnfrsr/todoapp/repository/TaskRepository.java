package ar.com.utnfrsr.todoapp.repository;

import ar.com.utnfrsr.todoapp.model.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Interfaz de Repositorio para la entidad Task.
 * Hereda de JpaRepository para obtener métodos CRUD básicos.
 */
@Repository // Buena práctica: Añadir @Repository (aunque JpaRepository ya lo implica)
public interface TaskRepository extends JpaRepository<Task, Long> {

    /**
     * Actualiza el estado 'finished' de una Task específica usando JPQL.
     *
     * @param id       El ID de la tarea a actualizar.
     * @param finished El nuevo estado (true o false).
     */
    @Modifying // Requerido para consultas que modifican datos (UPDATE/DELETE)
    // REFACTORIZADO:
    // 1. Se usa JPQL (sobre la entidad "Task") en lugar de SQL nativo (sobre la tabla "TASK").
    // 2. Se quitó "nativeQuery = true".
    // 3. "Task" es el nombre de tu clase Entidad, "t" es un alias.
    // 4. "t.finished" y "t.id" son los nombres de los atributos en tu clase Java.
    @Query(value = "UPDATE Task t SET t.finished = :finished WHERE t.id = :id")
    void markTaskAsFinished(@Param("id") Long id, @Param("finished") boolean finished);
}