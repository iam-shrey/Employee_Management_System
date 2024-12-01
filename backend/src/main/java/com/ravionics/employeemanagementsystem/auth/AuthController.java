package com.ravionics.employeemanagementsystem.auth;

import com.ravionics.employeemanagementsystem.entities.User;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private AuthenticationManager manager;

    @Autowired
    private AuthenticationService authenticationService;

    public AuthController(AuthenticationManager manager) {
        this.manager = manager;
    }

    private Logger logger = LoggerFactory.getLogger(AuthController.class);


    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request){
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @GetMapping("loggedInUser")
    public ResponseEntity<User> getLoggedInUser(Authentication authentication){
        return authenticationService.getLoggedInUser(authentication);
    }

    @PostMapping("/login")
    public ResponseEntity<JwtResponse> login(@RequestBody JwtRequest request){
        return authenticationService.authenticate(request);
    }

    @ExceptionHandler(BadCredentialsException.class)
    public String exceptionHandler() {
        return "Credentials Invalid !!";
    }


    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body("Error: Email cannot be null or empty");
            }
            authenticationService.sendOtp(email);
            return ResponseEntity.ok("OTP sent successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, Object> request) {
        try {
            String email = (String) request.get("email");
            int otp = Integer.parseInt(request.get("otp").toString());
            String newPassword = (String) request.get("newPassword");
            authenticationService.resetPassword(email, otp, newPassword);
            return ResponseEntity.ok("Password reset successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }

    }



}
