package com.ravionics.employeemanagementsystem.attendance;

import com.ravionics.employeemanagementsystem.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Integer> {

    Optional<Attendance> findByUserIdAndDate(String userId, LocalDate date);

    List<Attendance> findAllByUserId(String userId);

    List<Attendance> findByUserOrderByDateDesc(User user);

    List<Attendance> findAllByDate(LocalDate date);

    @Query("SELECT a.user.id FROM Attendance a WHERE a.date = :date AND a.user.onboarded = true")
    List<Integer> findUserIdsByDate(@Param("date") LocalDate date);

    List<Attendance> findByUser(User user);

    List<Attendance> findByUserAndDateBetween(User user, LocalDate startDate, LocalDate endDate);

    List<Attendance> findByDateBetween(LocalDate startDate, LocalDate endDate);

    @Query("SELECT a.status FROM Attendance a WHERE a.user.id = :userId AND a.date BETWEEN :startDate AND :endDate")
    List<Status> findByUserIdAndMonth(@Param("userId") String userId, @Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);
}
