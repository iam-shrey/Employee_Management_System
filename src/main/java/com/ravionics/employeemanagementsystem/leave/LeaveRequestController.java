package com.ravionics.employeemanagementsystem.leave;

import com.ravionics.employeemanagementsystem.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/leave-requests")
public class LeaveRequestController {

    @Autowired
    private LeaveRequestService leaveRequestService;

    @Autowired
    private UserRepository userRepository;

    // User: Create a leave request
    @PostMapping("/create")
    public LeaveRequest createLeaveRequest(Principal principal, @Valid @RequestBody LeaveRequestDTO leaveRequestDTO) {
        var user = userRepository.findByEmail(principal.getName());
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        return leaveRequestService.createLeaveRequest(
                user.get(),
                leaveRequestDTO.getLeaveTypeId(),
                leaveRequestDTO.getStartDate(),
                leaveRequestDTO.getEndDate(),
                leaveRequestDTO.getReason()
        );
    }

    @PutMapping("/update/{leaveRequestId}")
    public ResponseEntity<String> updateLeaveRequestStatus(@PathVariable Long leaveRequestId,
                                                   @RequestParam String status) {
        LeaveStatus leaveStatus = LeaveStatus.valueOf(status.toUpperCase());
        try {
            String responseMessage = leaveRequestService.updateLeaveRequestStatus(leaveRequestId, leaveStatus);
            return ResponseEntity.ok(responseMessage);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/admin")
    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestService.getAllLeaveRequests();
    }

    @GetMapping("/user/{userId}")
    public List<LeaveRequest> getLeaveRequestsByUser(@PathVariable String userId) {
        return leaveRequestService.getLeaveRequestsByUser(userId);
    }
}
