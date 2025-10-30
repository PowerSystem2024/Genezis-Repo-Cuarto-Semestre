package ar.com.utnfrsr.todoapp.config;

import org.springframework.beans.factory.annotation.Value; // ¡Importar @Value!
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    // REFACTORIZADO: Inyectamos el valor desde application.yml
    // El ':${app.cors.allowed-origins}' es un valor por defecto por si no lo encuentra
    @Value("${app.cors.allowed-origins:*}")
    private String allowedOrigins;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // REFACTORIZADO: Usamos la lista de orígenes del application.yml
        // Ya no usamos el comodín "*" inseguro
        configuration.setAllowedOrigins(Arrays.asList(allowedOrigins.split(",")));

        // Usamos "*" para cabeceras y métodos, lo cual es más limpio y común
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));

        // ¡IMPORTANTE! Permite que el frontend envíe credenciales (como cookies o tokens JWT)
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public FilterRegistrationBean<CorsFilter> corsFilter() {
        FilterRegistrationBean<CorsFilter> bean =
                new FilterRegistrationBean<>(new CorsFilter(corsConfigurationSource()));
        bean.setOrder(Ordered.HIGHEST_PRECEDENCE);
        return bean;
    }
}