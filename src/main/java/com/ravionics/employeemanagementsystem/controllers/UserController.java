package com.ravionics.employeemanagementsystem.controllers;

import com.ravionics.employeemanagementsystem.attendance.AttendanceService;
import com.ravionics.employeemanagementsystem.entities.Experience;
import com.ravionics.employeemanagementsystem.entities.User;
import com.ravionics.employeemanagementsystem.leave.LeaveBalanceService;
import com.ravionics.employeemanagementsystem.leave.leavebalance.LeaveBalance;
import com.ravionics.employeemanagementsystem.leave.leavetype.LeaveType;
import com.ravionics.employeemanagementsystem.leave.leavetype.LeaveTypeService;
import com.ravionics.employeemanagementsystem.repositories.ExperienceRepository;
import com.ravionics.employeemanagementsystem.repositories.UserRepository;
import com.ravionics.employeemanagementsystem.services.OfferLetterService;
import com.ravionics.employeemanagementsystem.services.UserServiceImpl;
import jakarta.mail.MessagingException;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.security.Principal;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    private final ExperienceRepository experienceRepository;

    private final LeaveTypeService leaveTypeService;

    private final LeaveBalanceService leaveBalanceService;

    private UserServiceImpl userService;

    private final PasswordEncoder passwordEncoder;

    private OfferLetterService offerLetterService;

    private AttendanceService attendanceService;

    public UserController(ExperienceRepository experienceRepository, LeaveTypeService leaveTypeService, LeaveBalanceService leaveBalanceService, UserServiceImpl userService, OfferLetterService offerLetterService, AttendanceService attendanceService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.experienceRepository = experienceRepository;
        this.leaveTypeService = leaveTypeService;
        this.leaveBalanceService = leaveBalanceService;
        this.userService = userService;
        this.offerLetterService = offerLetterService;
        this.attendanceService = attendanceService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @GetMapping("/{email}")
    public User getUserByEmail(@PathVariable String email) {
        return userService.getUserByEmail(email);
    }

    @GetMapping("/current-user")
    public User getLoggedInUser(Principal principal){
        return userService.getUserByEmail(principal.getName());
    }

    @GetMapping("/current-user-name")
    public String getLoggedInUserName(Authentication loggedInUser) {
        return userService.currentLoggedInUser(loggedInUser);
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping("/emailLetter")
    public String generateOfferLetter(Principal principal) throws MessagingException {
        String email = principal.getName();
        System.out.println("email: "+email);
        offerLetterService.createOfferLetter(email, userService.getUserByEmail(email));
        return "Offer letter generated and sent to " + email;
    }

    @GetMapping("/offer-letter/download")
    public ResponseEntity<byte[]> downloadOfferLetter(Principal principal) {
        try {
            User user = userService.getUserByEmail(principal.getName());
            byte[] pdfBytes = user.getOfferLetterPdf();

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.builder("attachment")
                    .filename("Offer_Letter_" + user.getFirstName() + ".pdf")
                    .build());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(null);
        }
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

    @PatchMapping("/update-profile")
    public ResponseEntity<String> updateUserProfile(Principal principal,
            @Valid @RequestBody TemporaryUserProfileDTO profileDTO) {
        User user = userRepository.findByEmail(principal.getName()).get();
        user.setFirstName(profileDTO.getFirstName());
        user.setLastName(profileDTO.getLastName());
        user.setEmail(profileDTO.getEmail());
        user.setPassword(passwordEncoder.encode(profileDTO.getPassword()));
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


    @PostMapping("experiences")
    public ResponseEntity<String> saveExperiences(
            Principal principal,
            @RequestParam List<String> experience,
            @RequestParam List<String> companyName,
            @RequestParam List<String> duration,
            @RequestParam List<String> role,
            @RequestParam(required = false) List<MultipartFile> experienceLetter,
            @RequestParam(required = false) List<MultipartFile> offerLetter
    ) throws IOException {
        User u = userRepository.findByEmail(principal.getName()).get();
        List<Experience> experienceList = new ArrayList<>();
        for (int i = 0; i < experience.size(); i++) {
            Experience e = new Experience();
            e.setExperience(experience.get(i));
            e.setCompanyName(companyName.get(i));
            e.setDuration(duration.get(i));
            e.setRole(role.get(i));
            e.setUser(u);

            if (experienceLetter != null && experienceLetter.size() > i) {
                e.setExperienceLetter(experienceLetter.get(i).getBytes());
            }
            if (offerLetter != null && offerLetter.size() > i) {
                e.setOfferLetter(offerLetter.get(i).getBytes());
            }

            experienceRepository.save(e);
            experienceList.add(e);
        }
        u.setOnboarded(true);
        List<LeaveType> leaveTypes = leaveTypeService.getAllLeaveTypes();
        List<LeaveBalance> leaveBalances = createLeaveBalancesForUser(u, leaveTypes);
//        u.setLeaveBalances(leaveBalances);
        userService.saveUser(u);

        return ResponseEntity.ok("Experiences saved successfully");
    }

    @PostMapping("/{userId}/upload-dp")
    public ResponseEntity<String> uploadProfilePicture(@PathVariable String userId,
                                                       @RequestParam("file") MultipartFile file) {
        try {
            userService.uploadProfilePicture(userId, file);
            return ResponseEntity.ok("Profile picture uploaded successfully");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error uploading profile picture");
        }
    }

    @GetMapping("/{userEmail}/dp")
    public ResponseEntity<String> getProfilePicture(@PathVariable String userEmail) {
        byte[] image = userService.getProfilePicture(userEmail);
        if (image==null) {
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile picture not found");
        }

        String base64 = Base64.getEncoder().encodeToString(image);

        return ResponseEntity.ok(base64);
    }

    @DeleteMapping("/{userId}/dp")
    public ResponseEntity<String> deleteProfilePicture(@PathVariable String userId) {
        User user = userService.getUserById(userId);
        user.setProfilePicture(null);
        userService.updateUser(user);
        return ResponseEntity.ok("Profile picture deleted successfully");
    }

    private List<LeaveBalance> createLeaveBalancesForUser(User user, List<LeaveType> leaveTypes) {
        return leaveTypes.stream()
                .map(leaveType -> {
                    LeaveBalance leaveBalance = new LeaveBalance();
                    leaveBalance.setUser(user);
                    leaveBalance.setLeaveType(leaveType);
                    leaveBalance.setBalance(leaveType.getQuota());
                    return leaveBalanceService.createOrUpdateLeaveBalance(leaveBalance);
                })
                .toList();
    }

}
