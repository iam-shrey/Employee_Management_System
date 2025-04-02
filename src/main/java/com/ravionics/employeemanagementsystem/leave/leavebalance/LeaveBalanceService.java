package com.ravionics.employeemanagementsystem.leave;

import com.ravionics.employeemanagementsystem.leave.leavebalance.LeaveBalance;
import com.ravionics.employeemanagementsystem.leave.leavebalance.LeaveBalanceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveBalanceService {

    private final LeaveBalanceRepository leaveBalanceRepository;

    public LeaveBalanceService(LeaveBalanceRepository leaveBalanceRepository) {
        this.leaveBalanceRepository = leaveBalanceRepository;
    }

    public List<LeaveBalance> getLeaveBalancesForUser(String userId) {
        return leaveBalanceRepository.findByUserId(userId);
    }

    public LeaveBalance createOrUpdateLeaveBalance(LeaveBalance leaveBalance) {
        return leaveBalanceRepository.save(leaveBalance);
    }

    public LeaveBalance getLeaveBalance(String userId, Long leaveTypeId) {
        return leaveBalanceRepository.findByUserIdAndLeaveTypeId(userId, leaveTypeId).get();
    }
}
