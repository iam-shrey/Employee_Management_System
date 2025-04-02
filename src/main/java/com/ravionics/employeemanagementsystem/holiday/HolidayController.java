package com.ravionics.employeemanagementsystem.holiday;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/holidays")
public class HolidayController {

    private final HolidayService holidayService;

    public HolidayController(HolidayService holidayService) {
        this.holidayService = holidayService;
    }

    @GetMapping
    public ResponseEntity<List<Holiday>> getAllHolidays() {
        List<Holiday> holidays = holidayService.getAllHolidays();
        return new ResponseEntity<>(holidays, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Holiday> getHoliday(@PathVariable Long id) {
        Optional<Holiday> holiday = holidayService.getHoliday(id);
        if (holiday.isPresent()) {
            return new ResponseEntity<>(holiday.get(), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteHoliday(@PathVariable Long id) {
        holidayService.deleteHoliday(id);
        return ResponseEntity.ok("Holiday Deleted Successfully");
    }

    @PostMapping
    public ResponseEntity<Holiday> addHoliday(@RequestBody Holiday holiday) {
        try {
            Holiday createdHoliday = holidayService.addHoliday(holiday);
            return new ResponseEntity<>(createdHoliday, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(null, HttpStatus.CONFLICT);
        }
    }

    @GetMapping("/is-holiday/{date}")
    public ResponseEntity<Boolean> isHoliday(@PathVariable String date) {
        try {
            boolean isHoliday = holidayService.isHoliday(LocalDate.parse(date));
            return new ResponseEntity<>(isHoliday, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
        }
    }
}
