package com.ravionics.employeemanagementsystem.leave.leavebalance;

import com.ravionics.employeemanagementsystem.entities.User;
import com.ravionics.employeemanagementsystem.leave.leavetype.LeaveType;
import jakarta.persistence.*;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

@Data
@Entity
public class LeaveBalance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "leave_type_id", nullable = false)
    private LeaveType leaveType;

    @Column(nullable = false)
    private Integer balance;
}
