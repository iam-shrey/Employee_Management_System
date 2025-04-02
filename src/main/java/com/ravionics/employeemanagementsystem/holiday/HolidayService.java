package com.ravionics.employeemanagementsystem.holiday;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class HolidayService {

    private final HolidayRepository holidayRepository;

    public HolidayService(HolidayRepository holidayRepository) {
        this.holidayRepository = holidayRepository;
    }

    public List<Holiday> getAllHolidays() {
        return holidayRepository.findAll();
    }

    public Holiday addHoliday(Holiday holiday) {
        if (holidayRepository.existsByDate(holiday.getDate())) {
            throw new RuntimeException("Holiday already exists for the given date!");
        }
        return holidayRepository.save(holiday);
    }

    public boolean isHoliday(LocalDate date) {
        return holidayRepository.existsByDate(date);
    }

    public Optional<Holiday> getHoliday(Long id) {
        return holidayRepository.findById(id);
    }

    public void deleteHoliday(Long id) {
        holidayRepository.deleteById(id);
    }
}
