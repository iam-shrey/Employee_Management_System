package com.ravionics.employeemanagementsystem.entities;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Data
public class OfferTemplate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name; // Template Name

    @Lob
    private String header; // Header Section

    @Lob
    private String body; // Body Section

    @Lob
    private String footer; // Footer Section
}
