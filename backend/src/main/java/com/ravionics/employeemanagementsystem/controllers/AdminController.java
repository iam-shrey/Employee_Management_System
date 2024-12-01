package com.ravionics.employeemanagementsystem.controllers;

import com.ravionics.employeemanagementsystem.auth.AuthenticationService;
import com.ravionics.employeemanagementsystem.auth.RegisterRequest;
import com.ravionics.employeemanagementsystem.entities.Experience;
import com.ravionics.employeemanagementsystem.entities.OfferTemplate;
import com.ravionics.employeemanagementsystem.entities.Role;
import com.ravionics.employeemanagementsystem.entities.User;
import com.ravionics.employeemanagementsystem.repositories.OfferTemplateRepository;
import com.ravionics.employeemanagementsystem.repositories.UserRepository;
import com.ravionics.employeemanagementsystem.services.OfferLetterService;
import com.ravionics.employeemanagementsystem.services.OfferTemplateService;
import com.ravionics.employeemanagementsystem.services.UserService;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')") //can also make role based authentication at class level
public class AdminController {

    @Autowired
    public OfferTemplateRepository templateRepository;

    private final OfferTemplateService templateService;

    @Autowired
    public UserService userService;

    @Autowired
    public OfferLetterService offerLetterService;

    @Autowired
    private final PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationService authenticationService;
    @Autowired
    private UserRepository userRepository;

    public AdminController(OfferTemplateService templateService, PasswordEncoder passwordEncoder) {
        this.templateService = templateService;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    @PreAuthorize("hasAuthority('admin:read')")
    public String get() {
        return "GET:: admin controller";
    }

    @PostMapping
    @PreAuthorize("hasAuthority('admin:create')")
    public String post() {
        return "POST:: admin controller";
    }

    @PutMapping
    @PreAuthorize("hasAuthority('admin:update')")
    public String put() {
        return "PUT:: admin controller";
    }

    @DeleteMapping
    @PreAuthorize("hasAuthority('admin:delete')")
    public String delete() {
        return "DELETE:: admin controller";
    }


    @GetMapping("/templates/names")
    public ResponseEntity<List<Map<String, Object>>> getAllTemplateNames() {
        return ResponseEntity.ok(templateService.getAllTemplateNames());
    }

    @GetMapping("/templates/{id}")
    public ResponseEntity<OfferTemplate> getTemplateById(@PathVariable Integer id) {
        return ResponseEntity.ok(templateService.getTemplateById(id));
    }

    @PatchMapping("/templates/{id}")
    public ResponseEntity<String> updateTemplate(@PathVariable Integer id, @RequestBody OfferTemplate updatedTemplate) {
        templateService.updateTemplate(id, updatedTemplate);
        return ResponseEntity.ok("Template updated successfully");
    }


    @GetMapping("/offer-letter/generate")
    public ResponseEntity<String> generateOfferLetter(@RequestParam("templateId") int templateId,
                                                      @RequestParam("id") String employeeId) {
        try {
            byte[] pdfContent = offerLetterService.generateOfferLetter(templateId, userService.getUserById(employeeId));
            String encodedPdf = Base64.getEncoder().encodeToString(pdfContent);

            return ResponseEntity.ok(encodedPdf);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body("Error generating the offer letter");
        }
    }

    @PostMapping("/offer-letter/send")
    public ResponseEntity<String> generateAndSendOfferLetter(@RequestParam("templateId") int templateId,@RequestParam("id") String employeeId) {
        try {
            User u = offerLetterService.sendOfferLetter(templateId,userService.getUserById(employeeId));
            userService.saveUser(u);
            return ResponseEntity.ok(this.sendOfferLetter(u));

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/employees/{id}")
    public void deleteUser(@PathVariable String id) {
        userService.deleteUserById(id);
    }

    @PostMapping("/register")
    public ResponseEntity<String> addUser(@RequestBody User user) throws MessagingException {
        String password = UUID.randomUUID().toString();
        user.setRole(Role.valueOf("USER"));
        user.setPassword(passwordEncoder.encode(password));
        Random random = new Random();
        Integer randomNumber = 100000 + random.nextInt(900000);
        user.setId("RAV"+randomNumber.toString());
        offerLetterService.sendRegistrationEmail(user, password);
        userRepository.save(user);
        return ResponseEntity.ok("User registered and Email sent successfully");
    }

    public String sendOfferLetter(User user) throws MessagingException {
        System.out.println("email: "+user.getEmail());
        offerLetterService.createOfferLetter(user.getEmail(), user);
        return "Offer letter generated and sent to " + user.getEmail();
    }

    @GetMapping("/{employeeId}/experiences")
    public List<Experience> getExperiencesByEmployeeId(@PathVariable String employeeId) {
        User user = userService.getUserById(employeeId);
        return user.getExperiences();
    }

    @Data
    @NoArgsConstructor
    public static class TemporaryUserProfileDTO {

        private String firstName;

        private String lastName;

        private String email;

        private String password;

        private String address;

        private String collegeName;

        private String aadharNumber;

        private String phoneNumber;

        private String pincode;

        private String gender;

        private String birthDate;

        private String degree;

        private String graduationYear;

        private String CGPA;

        private String collegeAddress;

        private String accNumber;
    }

    @PatchMapping("/{employeeId}/update-profile")
    public ResponseEntity<String> updateUserProfile(@PathVariable String employeeId,
                                                    @Valid @RequestBody AdminController.TemporaryUserProfileDTO profileDTO) {
        User user = userService.getUserById(employeeId);
        user.setFirstName(profileDTO.getFirstName());
        user.setLastName(profileDTO.getLastName());
        user.setEmail(profileDTO.getEmail());
        user.setAddress(profileDTO.getAddress());
        user.setAadharNumber(profileDTO.getAadharNumber());
        user.setPhoneNumber(profileDTO.getPhoneNumber());
        user.setPincode(profileDTO.getPincode());
        user.setGender(profileDTO.getGender());
        user.setBirthDate(profileDTO.getBirthDate());
        user.setAccNumber(profileDTO.getAccNumber());
        user.setCollegeName(profileDTO.getCollegeName());
        user.setCGPA(profileDTO.getCGPA());
        user.setCollegeAddress(profileDTO.getCollegeAddress());
        user.setDegree(profileDTO.getDegree());
        user.setGraduationYear(profileDTO.getGraduationYear());
        userService.saveUser(user);
        return ResponseEntity.ok("User profile updated successfully");
    }

}
