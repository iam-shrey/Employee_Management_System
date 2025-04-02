package com.ravionics.employeemanagementsystem.leave;

import com.ravionics.employeemanagementsystem.entities.User;
import com.ravionics.employeemanagementsystem.leave.leavetype.LeaveType;
import com.ravionics.employeemanagementsystem.leave.leavetype.LeaveTypeRepository;
import com.ravionics.employeemanagementsystem.leave.leavebalance.LeaveBalanceRepository;
import com.ravionics.employeemanagementsystem.leave.leavebalance.LeaveBalance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class LeaveRequestService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    @Autowired
    private LeaveTypeRepository leaveTypeRepository;

    @Autowired
    private LeaveBalanceRepository leaveBalanceRepository;

    // For user to create leave request
    @Transactional
    public LeaveRequest createLeaveRequest(User user, Long leaveTypeId, LocalDate startDate, LocalDate endDate, String reason) {
        // Validate the leave type
        Optional<LeaveType> leaveTypeOpt = leaveTypeRepository.findById(leaveTypeId);
        if (leaveTypeOpt.isEmpty()) {
            throw new IllegalArgumentException("Leave type not found.");
        }

        LeaveType leaveType = leaveTypeOpt.get();

        // Check if user has sufficient balance
        Optional<LeaveBalance> leaveBalanceOpt = leaveBalanceRepository.findByUserIdAndLeaveTypeId(user.getId(), leaveTypeId);
        if (leaveBalanceOpt.isEmpty()) {
            throw new IllegalArgumentException("Leave balance not found for this leave type.");
        }

        LeaveBalance leaveBalance = leaveBalanceOpt.get();
        int requestedDays = startDate.datesUntil(endDate.plusDays(1)).toList().size(); // Includes both start and end date
        if (leaveBalance.getBalance() < requestedDays) {
            throw new IllegalArgumentException("Not enough leave balance.");
        }

        LeaveRequest leaveRequest = new LeaveRequest();
        leaveRequest.setUser(user);
        leaveRequest.setLeaveType(leaveType);
        leaveRequest.setLeaveTypeName(leaveType.getName());
        leaveRequest.setEmployeeName(user.getFirstName()+" "+user.getLastName());
        leaveRequest.setStartDate(startDate);
        leaveRequest.setEndDate(endDate);
        leaveRequest.setReason(reason);
        leaveRequest.setStatus(LeaveStatus.PENDING);
        return leaveRequestRepository.save(leaveRequest);
    }

    // Admin approves or rejects leave request
    public String updateLeaveRequestStatus(Long leaveRequestId, LeaveStatus status) throws Exception {
        Optional<LeaveRequest> leaveRequestOpt = leaveRequestRepository.findById(leaveRequestId);
        if (leaveRequestOpt.isEmpty()) {
            throw new IllegalArgumentException("Leave request not found.");
        }

        LeaveRequest leaveRequest = leaveRequestOpt.get();
        leaveRequest.setStatus(status);

        if (status == LeaveStatus.APPROVED) {
            Optional<LeaveBalance> leaveBalanceOpt = leaveBalanceRepository.findByUserIdAndLeaveTypeId(leaveRequest.getUser().getId(), leaveRequest.getLeaveType().getId());
            if (leaveBalanceOpt.isEmpty()) {
                throw new IllegalArgumentException("Leave balance not found for this user and leave type.");
            }

            LeaveBalance leaveBalance = leaveBalanceOpt.get();
            int requestedDays = leaveRequest.getStartDate().datesUntil(leaveRequest.getEndDate().plusDays(1)).toList().size();
            if (leaveBalance.getBalance() < requestedDays) {
                throw new Exception("Insufficient balance to approve the request.");
            }
            leaveBalance.setBalance(leaveBalance.getBalance() - requestedDays);
            leaveBalanceRepository.save(leaveBalance);
        }

        return "Updated Leave Request Status";
    }

    // Get all leave requests for admin
    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAllByOrderByCreatedAtDesc();
    }

    // Get leave requests by user
    public List<LeaveRequest> getLeaveRequestsByUser(String userId) {
        return leaveRequestRepository.findByUserId(userId);
    }
}
