package com.ravionics.employeemanagementsystem.entities;

import jakarta.persistence.Entity;
import lombok.Data;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Data
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    private User user;

    private LocalDate date;
    private String status;
}
