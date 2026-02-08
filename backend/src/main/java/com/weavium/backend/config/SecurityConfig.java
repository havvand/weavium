package com.weavium.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. Explicitly use the CORS source defined below
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 2. Disable CSRF (Critical for GraphQL)
                .csrf(AbstractHttpConfigurer::disable)

                // 3. Authorization Rules
                .authorizeHttpRequests(auth -> auth
                        // Explicitly allow the pre-flight checks
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                        // Allow the API
                        .requestMatchers("/graphql/**", "/graphiql/**").permitAll()
                        // Lock down everything else
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // THE FIX: Use Origin Pattern instead of specific list.
        // This allows any origin (localhost, 127.0.0.1) while still allowing credentials.
        configuration.addAllowedOriginPattern("*");

        // ALLOW METHODS
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // ALLOW HEADERS
        configuration.setAllowedHeaders(Arrays.asList("*"));

        // ALLOW CREDENTIALS
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}