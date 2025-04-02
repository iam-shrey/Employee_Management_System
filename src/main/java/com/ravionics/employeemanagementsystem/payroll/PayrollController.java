package com.ravionics.employeemanagementsystem.payroll;

import com.itextpdf.text.DocumentException;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @PostMapping("/generate/{userId}/{year}/{month}")
    public Payroll generatePayroll(@PathVariable String userId, @PathVariable int year, @PathVariable int month) {
        YearMonth yearMonth = YearMonth.of(year, month);
        return payrollService.generatePayroll(userId, yearMonth);
    }

    @GetMapping("/{userId}")
    public List<Payroll> getPayrollByUser(@PathVariable String userId) {
        return payrollService.findByUserId(userId);
    }

    @GetMapping("/{userId}/{month}")
    public Payroll getPayrollByUserAndMonth(@PathVariable String userId, @PathVariable String month) {
        String fullDateString = month + "-01";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LocalDate date = LocalDate.parse(fullDateString, formatter);
        return payrollService.findByUserIdAndMonth(userId, date);
    }

    @GetMapping("/generate-payslip/{payrollId}")
    public ResponseEntity<String> generatePayslip(@PathVariable Long payrollId) {
        try {
            String base64Payslip = payrollService.generatePayslipBase64(payrollId);
            return ResponseEntity.ok(base64Payslip);  // Return the Base64 string in the response
        } catch (IOException | DocumentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();  // Handle any errors
        }
    }
}