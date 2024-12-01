package com.ravionics.employeemanagementsystem.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {

    @Id
    private String id;
    private String firstName;
    private String lastName;
    private String gender;

    @Lob
    @JsonIgnore
    private byte[] profilePicture;

    @Column(unique = true, nullable = false)
    private String email;

    private String password;
    private String address;
    private String pincode;
    private String birthDate;

    private String collegeName;
    private String degree;
    private String graduationYear;
    private String CGPA;
    private String collegeAddress;

    private String aadharNumber;
    private String phoneNumber;
    private String accNumber;

    private String department;
    private String designation;
    private String joinDate;
    private Integer bandLevel;
    private Integer salary;

    private Boolean onboarded = false;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] offerLetterPdf;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Experience> experiences = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private Role role;

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return role.getAuthorities();
    }

    @Override
    @JsonIgnore
    public String getPassword() {
        return this.password;
    }

    @JsonIgnore
    public List<Experience> getExperiences() { return this.experiences; }

    @Override
    public String getUsername() {
        return this.email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
