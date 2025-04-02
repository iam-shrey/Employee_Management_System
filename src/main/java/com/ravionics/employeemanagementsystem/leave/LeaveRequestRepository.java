package com.ravionics.employeemanagementsystem.leave;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {

    List<LeaveRequest> findByUserId(String userId);

    List<LeaveRequest> findAllByOrderByCreatedAtDesc();

    @Query("SELECT lr FROM LeaveRequest lr WHERE lr.user.id = :userId AND lr.status = 'APPROVED' AND " +
            "(lr.startDate <= :endDate AND lr.endDate >= :startDate)")
    List<LeaveRequest> findApprovedLeaveRequests(@Param("userId") String userId,
                                                 @Param("startDate") LocalDate startDate,
                                                 @Param("endDate") LocalDate endDate);


}
