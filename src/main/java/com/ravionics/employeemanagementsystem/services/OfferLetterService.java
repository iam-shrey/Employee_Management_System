package com.ravionics.employeemanagementsystem.services;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import com.ravionics.employeemanagementsystem.entities.OfferTemplate;
import com.ravionics.employeemanagementsystem.entities.User;
import com.ravionics.employeemanagementsystem.repositories.OfferTemplateRepository;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OfferLetterService {

    private ResourceLoader resourceLoader;

    private EmailService emailService;

    public OfferLetterService(ResourceLoader resourceLoader, EmailService emailService) {
        this.resourceLoader = resourceLoader;
        this.emailService = emailService;
    }

    @Autowired
    private OfferTemplateRepository templateRepository;

    public OfferTemplate getTemplateById(Integer templateId) {
        return templateRepository.findById(templateId)
                .orElseThrow(() -> new RuntimeException("Template not found"));
    }

//    public byte[] generateOfferLetter(String employeeName, String department, int bandLevel, Integer salary) {
//        Document document = new Document();
//        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
//
//        try {
//            PdfWriter.getInstance(document, outputStream);
//            document.open();
//
//            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 20);
//            Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 12);
//
//            Paragraph title = new Paragraph("Offer Letter", titleFont);
//            title.setAlignment(Element.ALIGN_CENTER);
//            document.add(title);
//
//            document.add(new Paragraph("\n"));
//            document.add(new Paragraph("Dear " + employeeName + ",", bodyFont));
//            document.add(new Paragraph("\nWe are pleased to offer you a position at our company in the " + department + " department.", bodyFont));
//            document.add(new Paragraph("Your band level will be: " + bandLevel, bodyFont));
//            document.add(new Paragraph("Your starting salary will be: Rs. " + salary, bodyFont));
//            document.add(new Paragraph("\nWe look forward to working with you.", bodyFont));
//            document.add(new Paragraph("\n\nBest Regards,", bodyFont));
//            document.add(new Paragraph("Company Name", bodyFont));
//
//            document.close();
//        } catch (DocumentException e) {
//            e.printStackTrace();
//        }
//
//        return outputStream.toByteArray();
//    }
    public User sendOfferLetter(Integer templateId, User user) {
            byte[] pdfBytes = this.generateOfferLetter(templateId, user);  // Ensure PDF bytes are generated correctly
            user.setOfferLetterPdf(pdfBytes);
            return user;
    }

    public byte[] generateOfferLetter(Integer templateId, User user) {
        Document document = new Document();
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        try {
            // Fetch template from database
            OfferTemplate template = this.getTemplateById(templateId);

            // Placeholder replacement
            String header = replacePlaceholders(template.getHeader(), user);
            String body = replacePlaceholders(template.getBody(), user);
            String footer = replacePlaceholders(template.getFooter(), user);

            PdfWriter.getInstance(document, outputStream);
            document.open();

            // Generate PDF with separate methods
            addHeader(document, header);
            addBody(document, body);
            addFooter(document, footer);

            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
        }

        return outputStream.toByteArray();
    }

    private String replacePlaceholders(String content, User user) {
        if (content == null) return "";

        return content
                .replace("{employee_name}", user.getFirstName()+" "+user.getLastName())
                .replace("{designation}", user.getDesignation())
                .replace("{department}", user.getDepartment())
                .replace("{joining_date}", user.getJoinDate())
                .replace("{current_date}",LocalDate.now().getDayOfWeek()+", "+ formatWithOrdinalSuffix(LocalDate.now()))
                .replace("{address}", user.getAddress())
                .replace("{reference_number}", "RILOFR/"+String.valueOf(1000000 + (new Random()).nextInt(9000000)));
    }

    private static String formatWithOrdinalSuffix(LocalDate date) {
        DateTimeFormatter monthDayFormatter = DateTimeFormatter.ofPattern("MMM d");
        String monthDay = date.format(monthDayFormatter);
        int dayOfMonth = date.getDayOfMonth();

        // Add the appropriate suffix to the day
        String suffix;
        if (dayOfMonth >= 11 && dayOfMonth <= 13) {
            suffix = "th";
        } else {
            switch (dayOfMonth % 10) {
                case 1: suffix = "st"; break;
                case 2: suffix = "nd"; break;
                case 3: suffix = "rd"; break;
                default: suffix = "th";
            }
        }

        return monthDay + suffix + ", " + date.getYear();
    }

    private void addHeader(Document document, String headerContent) throws DocumentException {
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA, 15);
        Paragraph header = new Paragraph(headerContent, headerFont);
        header.setAlignment(Element.ALIGN_CENTER);
        document.add(header);
        document.add(new Paragraph("\n")); // Add space after header
    }

    private void addBody(Document document, String bodyContent) throws DocumentException {
        Font bodyFont = FontFactory.getFont(FontFactory.HELVETICA, 13);
        Paragraph body = new Paragraph(bodyContent, bodyFont);
        document.add(body);
        document.add(new Paragraph("\n")); // Add space after body
    }

    private void addFooter(Document document, String footerContent) throws DocumentException {
        Font footerFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 13);
        Paragraph footer = new Paragraph(footerContent, footerFont);
        footer.setAlignment(Element.ALIGN_RIGHT);
        document.add(footer);
    }



    public String createOfferLetter(String employeeEmail, User employee) throws MessagingException {
        Map<String, String> templateData = new HashMap<>();
        templateData.put("employeeName", employee.getFirstName()+" "+employee.getLastName());

        // Generate the offer letter HTML
        String offerLetterHtml = populateTemplate(templateData);

        emailService.sendHtmlEmail(employeeEmail, "Your Offer Letter", offerLetterHtml, employee.getOfferLetterPdf(), employee.getFirstName());

        return offerLetterHtml;
    }

    private String populateTemplate(Map<String, String> templateData) {
        String template = readTemplateFromFile();

        for (Map.Entry<String, String> entry : templateData.entrySet()) {
            template = template.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }
        return template;
    }

    private String readTemplateFromFile() {
        Resource resource = resourceLoader.getResource("classpath:templates/offerLetterTemplate.html");
        StringBuilder content = new StringBuilder();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
        }

        return content.toString();
    }


    public String sendRegistrationEmail(User employee, String password) throws MessagingException {
        // Prepare the dynamic data for the email template
        Map<String, String> templateData = new HashMap<>();
        templateData.put("firstName", employee.getFirstName());
        templateData.put("lastName", employee.getLastName());
        templateData.put("email", employee.getEmail());
        templateData.put("temporaryPassword", password);

        // Generate the email HTML content
        String registrationEmailHtml = populateRegistrationTemplate(templateData);

        // Send the email (no attachment in this case)
        emailService.sendHtmlRegistrationEmail(employee.getEmail(), "Welcome to Ravionics! Your Login Details", registrationEmailHtml);

        return registrationEmailHtml;
    }

    private String populateRegistrationTemplate(Map<String, String> templateData) {
        String template = readRegisterTemplateFromFile(); // Ensure this path matches the file location

        for (Map.Entry<String, String> entry : templateData.entrySet()) {
            template = template.replace("{{" + entry.getKey() + "}}", entry.getValue());
        }
        return template;
    }

    private String readRegisterTemplateFromFile() {
        Resource resource = resourceLoader.getResource("classpath:templates/registerTemplate.html");
        StringBuilder content = new StringBuilder();

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()))) {
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }
        } catch (IOException e) {
            e.printStackTrace(); // Handle the exception as needed
        }

        return content.toString();
    }
}
