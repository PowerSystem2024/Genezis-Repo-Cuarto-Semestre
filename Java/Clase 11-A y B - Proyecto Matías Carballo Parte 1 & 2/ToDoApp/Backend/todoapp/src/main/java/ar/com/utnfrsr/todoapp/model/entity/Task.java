package ar.com.utnfrsr.todoapp.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
// ¡Nuevos imports para Auditing!
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "tasks")
@SQLDelete(sql = "UPDATE tasks SET enabled = false WHERE id = ?")
@Where(clause = "enabled = true")
// REFACTORIZADO: Le decimos a la entidad que use el "oyente" de Auditoría de JPA
@EntityListeners(AuditingEntityListener.class)
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 256)
    private String title;

    // REFACTORIZADO:
    // 1. @CreatedDate le dice a JPA: "Rellena este campo al crear".
    // 2. updatable = false: Asegura que esta fecha NUNCA se pueda modificar.
    @CreatedDate
    @Column(name = "created_date", nullable = false, updatable = false)
    private LocalDateTime createdDate;

    // (Usaremos LocalDate de nuestro refactor anterior de la Entidad)
    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private LocalTime time;

    @Column(nullable = false)
    private boolean finished;

    @Column(name = "enabled")
    private boolean enabled = true;
}