package com.ravionics.employeemanagementsystem.services;

import com.ravionics.employeemanagementsystem.entities.Attendance;
import com.ravionics.employeemanagementsystem.entities.User;
import com.ravionics.employeemanagementsystem.repositories.AttendanceRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AttendanceService {

    private final AttendanceRepository attendanceRepository;

    public AttendanceService(AttendanceRepository attendanceRepository) {
        this.attendanceRepository = attendanceRepository;
    }

    public String markAttendance(User user, String status) {
        LocalDate today = LocalDate.now();

        // Check if attendance is already marked
        if (attendanceRepository.findByUserAndDate(user, today).isPresent()) {
            return "Attendance already marked for today";
        }

        Attendance attendance = new Attendance();
        attendance.setUser(user);
        attendance.setDate(today);
        attendance.setStatus(status);

        attendanceRepository.save(attendance);
        return "Attendance marked successfully";
    }

    public List<Attendance> getAttendanceByuser(User user) {
        return attendanceRepository.findByUser(user);
    }

    public List<Attendance> getAttendanceByDate(LocalDate date) {
        return attendanceRepository.findByDate(date);
    }

}
