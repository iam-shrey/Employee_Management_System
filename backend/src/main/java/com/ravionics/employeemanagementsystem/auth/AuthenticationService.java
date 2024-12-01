package com.ravionics.employeemanagementsystem.auth;

import com.ravionics.employeemanagementsystem.config.JwtHelper;
import com.ravionics.employeemanagementsystem.entities.Role;
import com.ravionics.employeemanagementsystem.entities.User;
import com.ravionics.employeemanagementsystem.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtHelper jwtHelper;
    private final AuthenticationManager authenticationManager;

    @Autowired
    private JavaMailSender mailSender;


    public User register(RegisterRequest request) {
        var user = User.builder().id(UUID.randomUUID().toString())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();
        if(!Objects.equals(user.getRole().toString(), "USER"))
            user.setOnboarded(true);
        return userRepository.save(user);
    }

    public ResponseEntity<JwtResponse> authenticate(JwtRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword()
                )
        );
        var user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        var jwtToken = jwtHelper.generateToken(user);
        JwtResponse jwtResponse=new JwtResponse(jwtToken, Map.of("name",user.getFirstName(),"role", user.getRole().toString()));
        System.out.println(jwtResponse);
        return new ResponseEntity<>(jwtResponse, HttpStatus.OK);
    }

    public ResponseEntity<User> getLoggedInUser(Authentication authentication) {
        User user=(User)authentication.getPrincipal();
        return new ResponseEntity<>(user, HttpStatus.OK);

    }

    private UserResponse mapToUserResponse(User user) {
        UserResponse userResponse=new UserResponse();
        userResponse.setFirstName(user.getFirstName());
        userResponse.setLastName(user.getLastName());
        userResponse.setId(user.getId());
        userResponse.setRole(user.getRole());
        userResponse.setOnboarded(user.getOnboarded());
        return userResponse;

    }

    //Forgot Password Service

    private final Map<String, Integer> otpStore = new HashMap<>();

    public void sendOtp(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        int otp = (int) (Math.random() * 900000) + 100000; // 6-digit OTP
        otpStore.put(email, otp);

        String subject = "Password Reset OTP";
        String body = "Your OTP for password reset is: " + otp;
        System.out.println(otp);

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject(subject);
        message.setText(body);

        mailSender.send(message);
    }

    public void resetPassword(String email, int otp, String newPassword) {
        if (!(otpStore.containsKey(email) && otpStore.get(email) == otp)) {
            throw new RuntimeException("Invalid OTP!");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new RuntimeException("The new password cannot be the same as the current password.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        otpStore.remove(email);
    }

}
