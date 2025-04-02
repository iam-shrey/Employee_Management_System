package com.ravionics.employeemanagementsystem.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import static com.ravionics.employeemanagementsystem.entities.Permission.*;
import static com.ravionics.employeemanagementsystem.entities.Role.ADMIN;
import static com.ravionics.employeemanagementsystem.entities.Role.MANAGER;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
@EnableMethodSecurity
public class SecurityConfig {


    @Autowired
    private JwtAuthenticationFilter filter;

    private final DaoAuthenticationProvider doDaoAuthenticationProvider;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {

        http.cors(cors -> cors.configurationSource(request -> {
                    var corsConfiguration = new org.springframework.web.cors.CorsConfiguration();
                    corsConfiguration.addAllowedOrigin("http://localhost:5173"); // or your frontend's URL
                    corsConfiguration.addAllowedOrigin("http://localhost:5183"); // or your frontend's URL
                    corsConfiguration.addAllowedMethod("*"); // Allow all HTTP methods (GET, POST, etc.)
                    corsConfiguration.addAllowedHeader("*"); // Allow all headers
                    corsConfiguration.setAllowCredentials(true); // Enable credentials if needed
                    return corsConfiguration;
                }))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req ->
                            req.requestMatchers("api/users/**").authenticated()
                    .requestMatchers("/api/auth/**",
                            "/swagger-ui/**",
                            "/swagger-ui.html",
                            "/v3/api-docs",
                            "/v2/api-docs/**",
                            "/v3/api-docs/**",
                            "swagger-resources",
                            "swagger-resources/**",
                            "configuration/ui",
                            "configuration/security",
                            "webjars/**")
                    .permitAll()

                //access
                .requestMatchers("api/management/**").hasAnyRole(ADMIN.name(), MANAGER.name())

                //operations
                .requestMatchers(HttpMethod.GET, "api/management/**").hasAnyAuthority(ADMIN_READ.name(), MANAGER_READ.name())
                .requestMatchers(HttpMethod.POST, "api/management/**").hasAnyAuthority(ADMIN_CREATE.name(), MANAGER_CREATE.name())
                .requestMatchers(HttpMethod.PUT, "api/management/**").hasAnyAuthority(ADMIN_UPDATE.name(), MANAGER_UPDATE.name())
                .requestMatchers(HttpMethod.DELETE, "api/management/**").hasAnyAuthority(ADMIN_DELETE.name(), MANAGER_DELETE.name())



                            //did this in controller itself
                //access
//                .requestMatchers("api/admin/**").hasRole(ADMIN.name())
//
//                //operations
//                .requestMatchers(HttpMethod.GET, "api/admin/**").hasAuthority(ADMIN_READ.name())
//                .requestMatchers(HttpMethod.POST, "api/admin/**").hasAuthority(ADMIN_CREATE.name())
//                .requestMatchers(HttpMethod.PUT, "api/admin/**").hasAuthority(ADMIN_UPDATE.name())
//                .requestMatchers(HttpMethod.DELETE, "api/admin/**").hasAuthority(ADMIN_DELETE.name())

                .anyRequest()
                .authenticated()
                )
                .sessionManagement(session-> session.sessionCreationPolicy(STATELESS))
                .authenticationProvider(doDaoAuthenticationProvider)
                .addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class);
//                .logout(logout ->
//                        logout.logoutUrl("/api/auth/logout")
//                .addLogoutHandler());

        return http.build();
    }

}