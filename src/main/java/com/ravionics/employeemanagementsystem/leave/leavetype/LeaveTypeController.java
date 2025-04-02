package com.ravionics.employeemanagementsystem.leave.leavetype;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/leave-types")
public class LeaveTypeController {

    private final LeaveTypeService leaveTypeService;

    public LeaveTypeController(LeaveTypeService leaveTypeService) {
        this.leaveTypeService = leaveTypeService;
    }

    @GetMapping
    public List<LeaveType> getAllLeaveTypes() {
        return leaveTypeService.getAllLeaveTypes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveType> getLeaveTypeById(@PathVariable Long id) {
        Optional<LeaveType> leaveType = leaveTypeService.getLeaveTypeById(id);
        return leaveType.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<LeaveType> createOrUpdateLeaveType(@RequestBody LeaveType leaveType) {
        LeaveType savedLeaveType = leaveTypeService.createOrUpdateLeaveType(leaveType);
        return new ResponseEntity<>(savedLeaveType, HttpStatus.CREATED);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLeaveType(@PathVariable Long id) {
        leaveTypeService.deleteLeaveType(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<LeaveType> getLeaveTypeByName(@PathVariable String name) {
        LeaveType leaveType = leaveTypeService.getLeaveTypeByName(name);
        return leaveType != null ? ResponseEntity.ok(leaveType) : ResponseEntity.notFound().build();
    }
}
