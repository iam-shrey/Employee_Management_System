package com.ravionics.employeemanagementsystem.leave.leavebalance;

import com.ravionics.employeemanagementsystem.leave.LeaveBalanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leave-balances")
public class LeaveBalanceController {

    private final LeaveBalanceService leaveBalanceService;

    @Autowired
    public LeaveBalanceController(LeaveBalanceService leaveBalanceService) {
        this.leaveBalanceService = leaveBalanceService;
    }

    // Get all leave balances for a specific user
    @GetMapping("/user/{userId}")
    public List<LeaveBalance> getLeaveBalancesForUser(@PathVariable String userId) {
        return leaveBalanceService.getLeaveBalancesForUser(userId);
    }

    // Get specific leave balance for a user and leave type
    @GetMapping("/user/{userId}/leaveType/{leaveTypeId}")
    public ResponseEntity<LeaveBalance> getLeaveBalance(@PathVariable String userId, @PathVariable Long leaveTypeId) {
        LeaveBalance leaveBalance = leaveBalanceService.getLeaveBalance(userId, leaveTypeId);
        return leaveBalance != null ? ResponseEntity.ok(leaveBalance) : ResponseEntity.notFound().build();
    }

    // Create or update leave balance
    @PostMapping
    public ResponseEntity<LeaveBalance> createOrUpdateLeaveBalance(@RequestBody LeaveBalance leaveBalance) {
        LeaveBalance savedLeaveBalance = leaveBalanceService.createOrUpdateLeaveBalance(leaveBalance);
        return ResponseEntity.ok(savedLeaveBalance);
    }
}
