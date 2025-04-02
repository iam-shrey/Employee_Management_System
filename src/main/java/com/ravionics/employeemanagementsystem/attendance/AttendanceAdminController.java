package com.ravionics.employeemanagementsystem.attendance;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance/admin")
public class AttendanceAdminController {

    @Autowired
    private AttendanceService attendanceService;

    @GetMapping()
    public ResponseEntity<List<Attendance>> getAllUsersAttendance() {
        List<Attendance> attendanceList = attendanceService.findEveryAttendance();
        return ResponseEntity.ok(attendanceList);
    }

    @GetMapping("/range")
    public ResponseEntity<List<Attendance>> getAttendanceByDateRange(
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        List<Attendance> attendanceList = attendanceService.findDateBetweenAttendance(startDate, endDate);
        return ResponseEntity.ok(attendanceList);
    }

    @GetMapping("/rang")
    public ResponseEntity<List<Attendance>> getAttendanceByDateRang(
            @RequestParam("startDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
            @RequestParam("endDate") @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate) {
        List<Attendance> attendanceList = attendanceService.findDateBetweenAttendance(startDate, endDate);
        return ResponseEntity.ok(attendanceList);
    }

    @PutMapping("/edit")
    public ResponseEntity<String> editAttendance(@RequestBody EditAttendanceRequest request) {
        try {
            String response = attendanceService.editAttendance(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("settings")
    public ResponseEntity<Map<String, Integer>> getSettings() {
        Map<String, Integer> settings = new HashMap<>();
        settings.put("insufficientTimeCutoff", attendanceService.getInsufficientTimeCutoff());
        settings.put("halfDayCutoff", attendanceService.getHalfDayCutoff());
        return ResponseEntity.ok(settings);
    }

    @PostMapping("settings")
    public ResponseEntity<String> updateSettings(@RequestBody Map<String, Integer> settings) {
        try {
            int insufficientTimeCutoff = settings.get("insufficientTimeCutoff");
            int halfDayCutoff = settings.get("halfDayCutoff");
            attendanceService.updateSettings(insufficientTimeCutoff, halfDayCutoff);
            return ResponseEntity.ok("Settings updated successfully.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving settings: " + e.getMessage());
        }
    }
}
