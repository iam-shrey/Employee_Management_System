package com.ravionics.employeemanagementsystem.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Experience {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String experience;
    private String companyName;
    private String duration;
    private String role;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] experienceLetter;

    @Lob
    @Basic(fetch = FetchType.LAZY)
    private byte[] offerLetter;

}
