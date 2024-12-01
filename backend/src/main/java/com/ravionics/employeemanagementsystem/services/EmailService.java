package com.ravionics.employeemanagementsystem.services;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendHtmlEmail(String to, String subject, String htmlContent, byte[] attachment, String firstName) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true); // 'true' for multipart message

        try {
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // 'true' indicates the content is HTML

            // Add attachment
            if (attachment != null) {
                helper.addAttachment("Offer_Letter_"+firstName, new ByteArrayResource(attachment), "application/pdf");
            }

            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace(); // Handle the exception as needed
        }
    }

    public void sendHtmlRegistrationEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true); // 'true' for multipart message

        try {
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // 'true' indicates the content is HTML
            mailSender.send(message);
        } catch (MessagingException e) {
            e.printStackTrace(); // Handle the exception as needed
        }
    }

}
