package com.ravionics.employeemanagementsystem.leave.leavebalance;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LeaveBalanceRepository extends JpaRepository<LeaveBalance, Long> {
    Optional<LeaveBalance> findByUserIdAndLeaveTypeId(String userId, Long leaveTypeId);
    List<LeaveBalance> findByUserId(String userId);
}
