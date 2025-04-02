package com.ravionics.employeemanagementsystem.leave.leavetype;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LeaveTypeService {

    private final LeaveTypeRepository leaveTypeRepository;

    public LeaveTypeService(LeaveTypeRepository leaveTypeRepository) {
        this.leaveTypeRepository = leaveTypeRepository;
    }

    public List<LeaveType> getAllLeaveTypes() {
        return leaveTypeRepository.findAll();
    }

    public Optional<LeaveType> getLeaveTypeById(Long id) {
        return leaveTypeRepository.findById(id);
    }

    public LeaveType createOrUpdateLeaveType(LeaveType leaveType) {
        return leaveTypeRepository.save(leaveType);
    }

    public void deleteLeaveType(Long id) {
        leaveTypeRepository.deleteById(id);
    }

    public LeaveType getLeaveTypeByName(String name) {
        return leaveTypeRepository.findByName(name);
    }
}
