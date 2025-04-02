package com.ravionics.employeemanagementsystem.attendance;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance/user")
public class AttendanceUserController {

    @Autowired
    private AttendanceService attendanceService;

    @PostMapping("/mark/{userId}")
    public ResponseEntity<String> markAttendance(@PathVariable String userId) {
        String response = attendanceService.markAttendance(userId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/punchOut/{userId}")
    public ResponseEntity<String> punchOut(@PathVariable String userId) {
        String response = attendanceService.punchOut(userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/{date}")
    public ResponseEntity<String> getAttendanceStatus(
            @PathVariable String userId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        String status = attendanceService.getAttendanceStatus(userId, date);
        return ResponseEntity.ok(status);
    }

    @GetMapping("/{userId}")
    public List<Attendance> getAllAttendanceForUser(@PathVariable String userId) {
        return attendanceService.getAttendanceForUser(userId);
    }

    @GetMapping("/{userId}/range")
    public List<Attendance> getAttendanceForUserInRange(@PathVariable String userId, @RequestParam String startDate, @RequestParam String endDate) {
        return attendanceService.getAttendanceForUserInDateRange(userId, LocalDate.parse(startDate), LocalDate.parse(endDate));
    }

}
