package com.ravionics.employeemanagementsystem.auth;

import com.ravionics.employeemanagementsystem.entities.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserResponse {

    private String id;
    private String firstName;
    private String lastName;
    private Boolean onboarded;
    private Role role;

}
