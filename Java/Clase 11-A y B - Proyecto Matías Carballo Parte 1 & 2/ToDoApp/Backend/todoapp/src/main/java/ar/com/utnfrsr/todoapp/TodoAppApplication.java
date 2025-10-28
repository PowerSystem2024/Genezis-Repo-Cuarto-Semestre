package ar.com.utnfrsr.todoapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
// ¡Nuevo import!
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

// REFACTORIZADO: Se añade la anotación para activar la auditoría
@SpringBootApplication
@EnableJpaAuditing // <-- ¡AQUÍ!
public class TodoAppApplication {

	public static void main(String[] args) {
		SpringApplication.run(TodoAppApplication.class, args);
	}

}