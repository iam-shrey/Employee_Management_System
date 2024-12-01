package com.ravionics.employeemanagementsystem.repositories;

import com.ravionics.employeemanagementsystem.entities.Attendance;
import com.ravionics.employeemanagementsystem.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {
    List<Attendance> findByUser(User user);
    List<Attendance> findByDate(LocalDate date);
    Optional<Attendance> findByUserAndDate(User user, LocalDate date);
}
