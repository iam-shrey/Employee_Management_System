package com.ravionics.employeemanagementsystem.attendance;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Configuration
@PropertySource("classpath:attendance-settings.properties")
public class AttendanceSettingsConfig {

    @Value("${insufficient_time_cutoff}")
    private int insufficientTimeCutoff;

    @Value("${half_day_cutoff}")
    private int halfDayCutoff;

    public int getInsufficientTimeCutoff() {
        return insufficientTimeCutoff;
    }

    public int getHalfDayCutoff() {
        return halfDayCutoff;
    }
}
