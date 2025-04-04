package com.ravionics.employeemanagementsystem.holiday;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;

public interface HolidayRepository extends JpaRepository<Holiday, Long> {

    Optional<Holiday> findByDate(LocalDate date);

    boolean existsByDate(LocalDate date);
}
