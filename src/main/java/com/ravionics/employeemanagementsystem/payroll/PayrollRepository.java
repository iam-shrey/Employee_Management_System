package com.ravionics.employeemanagementsystem.payroll;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    List<Payroll> findByMonth(LocalDate month);
    List<Payroll> findByUserId(String userId);
    Payroll findByUserIdAndMonth(String userId, LocalDate month);
}