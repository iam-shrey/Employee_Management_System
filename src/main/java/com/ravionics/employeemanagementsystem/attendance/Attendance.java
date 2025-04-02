package com.ravionics.employeemanagementsystem.attendance;

import com.ravionics.employeemanagementsystem.entities.User;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@Table(
        name = "attendance",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "date"})
)
public class Attendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false) // Maps the foreign key column
    private User user;

    private LocalDate date;

    private LocalDateTime checkInTime;

    private LocalDateTime checkOutTime;

    @Enumerated(EnumType.STRING)
    private Status status;
}