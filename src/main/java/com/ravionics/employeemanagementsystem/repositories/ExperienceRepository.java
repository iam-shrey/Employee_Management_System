package com.ravionics.employeemanagementsystem.repositories;

import com.ravionics.employeemanagementsystem.entities.Experience;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExperienceRepository extends JpaRepository<Experience, Long> {
}