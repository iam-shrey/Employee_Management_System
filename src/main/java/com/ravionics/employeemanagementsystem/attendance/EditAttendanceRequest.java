package com.ravionics.employeemanagementsystem.attendance;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class EditAttendanceRequest {
    private String userId;
    private LocalDate date;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;
    private Status status;
}
