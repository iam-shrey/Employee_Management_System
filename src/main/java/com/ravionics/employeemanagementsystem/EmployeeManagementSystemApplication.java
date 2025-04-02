package com.ravionics.employeemanagementsystem;

import com.ravionics.employeemanagementsystem.auth.AuthenticationService;
import com.ravionics.employeemanagementsystem.auth.RegisterRequest;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import static com.ravionics.employeemanagementsystem.entities.Role.ADMIN;
import static com.ravionics.employeemanagementsystem.entities.Role.MANAGER;

@SpringBootApplication
public class EmployeeManagementSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(EmployeeManagementSystemApplication.class, args);
    }
}
