package com.ravionics.employeemanagementsystem.payroll;

import com.ravionics.employeemanagementsystem.entities.User;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Data
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDate month;
    private Double netSalary;
    private Integer totalWorkingDays;
    private Integer presentDays;
    private Integer leaveDays;
    private Integer absentDays;
}
