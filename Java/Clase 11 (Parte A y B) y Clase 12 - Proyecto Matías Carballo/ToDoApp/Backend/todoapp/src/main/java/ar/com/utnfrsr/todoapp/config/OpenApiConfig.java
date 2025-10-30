package ar.com.utnfrsr.todoapp.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License; // Import opcional para info extra
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración personalizada para la documentación de OpenAPI (Swagger).
 * Define la información de la API y los esquemas de seguridad.
 */
@Configuration
public class OpenApiConfig {

    @Bean
    // REFACTORIZADO: Nombre del método genérico y claro
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
                // 1. Información principal de la API
                .info(new Info()
                        .title("ToDo API")
                        .description("API REST para la gestión de tareas (Proyecto de estudio).")
                        .version("v1.0.0")
                        .license(new License().name("Apache 2.0").url("http://springdoc.org"))) // Opcional, pero profesional

                // REFACTORIZADO: Se eliminó el .externalDocs() vacío.

                // REFACTORIZADO: Se eliminó .addSecurityItem(...)
                // Esto es CRÍTICO. No debemos aplicar seguridad globalmente.
                // La seguridad se debe aplicar por endpoint en el Controller (con @SecurityRequirement)
                // o a través de Spring Security.

                // 2. Definición del Esquema de Seguridad (JWT)
                // Esto HABILITA el botón "Authorize" en Swagger UI,
                // pero no "fuerza" la seguridad en todos los endpoints.
                .components(new Components()
                        .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                                .name(securitySchemeName)
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}