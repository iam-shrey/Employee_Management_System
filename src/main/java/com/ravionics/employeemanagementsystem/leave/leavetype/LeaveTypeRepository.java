package com.ravionics.employeemanagementsystem.leave.leavetype;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LeaveTypeRepository extends JpaRepository<LeaveType, Long> {

    LeaveType findByName(String name);
}
