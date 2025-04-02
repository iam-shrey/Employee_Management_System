package com.ravionics.employeemanagementsystem.payroll;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import com.itextpdf.text.pdf.draw.LineSeparator;
import com.ravionics.employeemanagementsystem.attendance.AttendanceRepository;
import com.ravionics.employeemanagementsystem.attendance.Status;
import com.ravionics.employeemanagementsystem.entities.User;
import com.ravionics.employeemanagementsystem.holiday.HolidayRepository;
import com.ravionics.employeemanagementsystem.leave.LeaveRequest;
import com.ravionics.employeemanagementsystem.leave.LeaveRequestRepository;
import com.ravionics.employeemanagementsystem.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.Base64;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
@RequiredArgsConstructor
public class PayrollService {

    private final PayrollRepository payrollRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final UserRepository userRepository;
    private final HolidayRepository holidayRepository;


    public Payroll generatePayroll(String userId, YearMonth yearMonth) {
        User user = userRepository.findById(userId).orElseThrow();
        int salary = user.getSalary();
        int totalDaysInMonth = yearMonth.lengthOfMonth();
        LocalDate firstDayOfMonth = yearMonth.atDay(1);
        LocalDate lastDayOfMonth = yearMonth.atEndOfMonth();

        // Calculate Sundays
        Set<LocalDate> sundays = IntStream.rangeClosed(1, totalDaysInMonth)
                .mapToObj(day -> yearMonth.atDay(day))
                .filter(date -> date.getDayOfWeek().getValue() == 7) // Sunday
                .collect(Collectors.toSet());

        // Fetch holidays
        List<LocalDate> officialHolidays = holidayRepository.findAll().stream()
                .map(holiday -> holiday.getDate())
                .filter(date -> !date.isBefore(firstDayOfMonth) && !date.isAfter(lastDayOfMonth))
                .collect(Collectors.toList());

        // Combine Sundays and official holidays
        Set<LocalDate> holidays = new HashSet<>(officialHolidays);
        holidays.addAll(sundays);

        // Fetch attendance for the month
        List<Status> attendanceRecords = attendanceRepository.findByUserIdAndMonth(user.getId(), firstDayOfMonth, lastDayOfMonth);

        // Calculate salary based on attendance
        int totalWorkingDays = totalDaysInMonth - holidays.size();
        double dailySalary = (double) salary / totalWorkingDays;
        double totalSalary = 0.0;
        int presentDays = attendanceRecords.size();

        for (Status status : attendanceRecords) {
            if (status == Status.PRESENT) {
                totalSalary += dailySalary;
            } else if (status == Status.HALF_DAY) {
                totalSalary += dailySalary / 2;
            }
        }

        // Handle leave requests for the month
        List<LeaveRequest> leaveRequests = leaveRequestRepository.findApprovedLeaveRequests(user.getId(), firstDayOfMonth, lastDayOfMonth);

        // Collect all leave days for the approved leave requests
        Set<LocalDate> leaveDays = new HashSet<>();
        for (LeaveRequest leaveRequest : leaveRequests) {
            LocalDate leaveStart = leaveRequest.getStartDate();
            LocalDate leaveEnd = leaveRequest.getEndDate();

            leaveDays.addAll(
                    leaveStart.datesUntil(leaveEnd.plusDays(1))
                            .filter(date -> !date.isBefore(firstDayOfMonth) && !date.isAfter(lastDayOfMonth))
                            .collect(Collectors.toSet())
            );
        }

        int leaveCount = leaveDays.size();
        totalSalary += leaveCount * dailySalary; // Assume full pay for approved leaves

        int effectiveAbsentDays = totalWorkingDays - (presentDays + leaveCount);

        // Create payroll
        Payroll payroll = new Payroll();
        payroll.setUser(user);
        payroll.setMonth(firstDayOfMonth); // Reference the first day
        payroll.setNetSalary(totalSalary);
        payroll.setTotalWorkingDays(totalWorkingDays);
        payroll.setPresentDays(presentDays);
        payroll.setLeaveDays(leaveCount);
        payroll.setAbsentDays(effectiveAbsentDays);

        return payrollRepository.save(payroll);
    }


    public String generatePayslipBase64(Long payrollId) throws DocumentException, IOException {
        Payroll payroll = payrollRepository.findById(payrollId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid payroll ID"));

        // Create a new document
        Document document = new Document(PageSize.A4);

        // Create an output stream to write the PDF content
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        // Create PdfWriter instance
        PdfWriter.getInstance(document, baos);

        // Open the document to write content
        document.open();

        // Set up fonts and styles
        Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, BaseColor.BLUE);
        Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, BaseColor.BLACK);
        Font contentFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL, BaseColor.BLACK);

        // Title Section
        Paragraph title = new Paragraph("Payslip for " + payroll.getUser().getFirstName() + " " + payroll.getUser().getLastName(), titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20);
        document.add(title);

        // Month Section
        Paragraph month = new Paragraph("Month: " + payroll.getMonth().format(DateTimeFormatter.ofPattern("MMMM yyyy")), headerFont);
        month.setSpacingAfter(10);
        document.add(month);

        // Add a separator line
        document.add(new Chunk(new LineSeparator()));

        // Table for payroll details
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(20);

        // Adding header cells
        table.addCell(createCell("Net Salary:", headerFont));
        table.addCell(createCell("₹" + payroll.getNetSalary(), contentFont));

        table.addCell(createCell("Total Working Days:", headerFont));
        table.addCell(createCell(String.valueOf(payroll.getTotalWorkingDays()), contentFont));

        table.addCell(createCell("Present Days:", headerFont));
        table.addCell(createCell(String.valueOf(payroll.getPresentDays()), contentFont));

        table.addCell(createCell("Leave Days:", headerFont));
        table.addCell(createCell(String.valueOf(payroll.getLeaveDays()), contentFont));

        table.addCell(createCell("Absent Days:", headerFont));
        table.addCell(createCell(String.valueOf(payroll.getAbsentDays()), contentFont));

        document.add(table);

        // Add a separator line
        document.add(new Chunk(new LineSeparator()));

        // Footer Section
        Paragraph footer = new Paragraph("Thank you for your hard work!", contentFont);
        footer.setAlignment(Element.ALIGN_CENTER);
        footer.setSpacingBefore(20);
        document.add(footer);

        // Close the document
        document.close();

        // Convert the PDF content into a byte array and then Base64 encode it
        byte[] pdfBytes = baos.toByteArray();
        return Base64.getEncoder().encodeToString(pdfBytes); // Return the Base64-encoded PDF string
    }

    // Helper method to create table cells
    private PdfPCell createCell(String content, Font font) {
        PdfPCell cell = new PdfPCell(new Phrase(content, font));
        cell.setBorder(Rectangle.NO_BORDER);
        cell.setPadding(5);
        return cell;
    }

    public List<Payroll> findByUserId(String userId) {
        return payrollRepository.findByUserId(userId);
    }

    public Payroll findByUserIdAndMonth(String userId, LocalDate month) {
        return payrollRepository.findByUserIdAndMonth(userId, month);
    }
}