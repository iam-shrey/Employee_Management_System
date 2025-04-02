package com.ravionics.employeemanagementsystem.attendance;

import com.ravionics.employeemanagementsystem.entities.User;
import com.ravionics.employeemanagementsystem.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.io.BufferedWriter;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.Properties;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AttendanceSettingsConfig settingsConfig;

    public String markAttendance(String userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new IllegalArgumentException("User not found.");
        }

        Optional<Attendance> existingAttendance = attendanceRepository.findByUserIdAndDate(userId, LocalDate.now());

        if (existingAttendance.isPresent()) {
            return "Attendance already marked for today!";
        }

        User user = userOpt.get();
        Attendance attendance = new Attendance();
        attendance.setUser(user);
        attendance.setDate(LocalDate.now());
        attendance.setCheckInTime(LocalDateTime.now());
        attendance.setCheckOutTime(null); // Punch-out time is null initially
        attendance.setStatus(Status.NOT_PUNCHED_OUT);
        attendanceRepository.save(attendance);

        return "Punch-in Successful";
    }

    // Punch-Out and Update Status
    public String punchOut(String userId) {
        Optional<Attendance> attendanceOpt = attendanceRepository.findByUserIdAndDate(userId, LocalDate.now());
        if (attendanceOpt.isEmpty()) {
            throw new IllegalArgumentException("No punch-in record found for today.");
        }

        Attendance attendance = attendanceOpt.get();

        if (attendance.getCheckOutTime() != null) {
            return "Already punched out.";
        }

        attendance.setCheckOutTime(LocalDateTime.now());

        // Calculate hours worked
        Duration duration = Duration.between(attendance.getCheckInTime(), attendance.getCheckOutTime());
        long hoursWorked = duration.toHours();

        // Set status based on hours worked
        if (hoursWorked < getInsufficientTimeCutoff()) {
            attendance.setStatus(Status.INSUFFICIENT_TIME);
        } else if (hoursWorked >= getInsufficientTimeCutoff() && hoursWorked < getHalfDayCutoff()) {
            attendance.setStatus(Status.HALF_DAY);
        } else {
            attendance.setStatus(Status.PRESENT);
        }

        attendanceRepository.save(attendance);

        return "Punch-out Successful";
    }

    public String getAttendanceStatus(String userId, LocalDate date) {
        Optional<Attendance> attendance = attendanceRepository.findByUserIdAndDate(userId, date);

        return attendance.map(a -> a.getStatus().name()).orElse("ABSENT");
    }

    public List<Attendance> getAttendanceForUser(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return attendanceRepository.findByUserOrderByDateDesc(user);
    }

    public List<Attendance> getAttendanceForUserInDateRange(String userId, LocalDate startDate, LocalDate endDate) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return attendanceRepository.findByUserAndDateBetween(user, startDate, endDate);
    }

    public List<Attendance> findEveryAttendance() {
        return attendanceRepository.findAll(Sort.by(Sort.Order.desc("date"), Sort.Order.desc("checkOutTime")));
    }

    public List<Attendance> findDateBetweenAttendance(LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findByDateBetween(startDate, endDate);
    }

    public String editAttendance(EditAttendanceRequest request) {
        Optional<Attendance> attendanceOpt = attendanceRepository.findByUserIdAndDate(request.getUserId(), request.getDate());

        if (attendanceOpt.isEmpty()) {
            throw new IllegalArgumentException("Attendance record not found for the specified date.");
        }

        Attendance attendance = attendanceOpt.get();

        attendance.setCheckInTime(request.getCheckInTime());
        attendance.setCheckOutTime(request.getCheckOutTime());
        attendance.setStatus(request.getStatus());

        attendanceRepository.save(attendance);

        return "Attendance updated successfully.";
    }

    public int getInsufficientTimeCutoff() {
        return settingsConfig.getInsufficientTimeCutoff();
    }

    public int getHalfDayCutoff() {
        return settingsConfig.getHalfDayCutoff();
    }

    public void updateSettings(int insufficientTimeCutoff, int halfDayCutoff) throws IOException {

        String content =
                "insufficient_time_cutoff=" + insufficientTimeCutoff + "\n" +
                        "half_day_cutoff=" + halfDayCutoff;

        try (BufferedWriter writer = new BufferedWriter(new FileWriter("./src/main/resources/attendance-settings.properties"))) {
            writer.write(content);
        }

        System.out.println("File content updated completely.");
    }

}
