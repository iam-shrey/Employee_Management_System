package com.ravionics.employeemanagementsystem.services;

import com.ravionics.employeemanagementsystem.entities.User;
import com.ravionics.employeemanagementsystem.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {

    private UserRepository userRepository;

    private PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public User saveUser(User user) {
        if(user.getId()==null)user.setId(UUID.randomUUID().toString());
        if(user.getPassword()==null)user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Override
    public User updateUser(User User) {
        return userRepository.save(User);
    }

    @Override
    public User getUserByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);
        return user.orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public User getUserById(String id) {
        Optional<User> user = userRepository.findById(id);
        return user.orElseThrow(() -> new RuntimeException("User not found with email: " + id));
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User deleteUserById(String id) {
        User user = getUserById(id);
        userRepository.deleteById(id);
        return user;
    }



    @Override
    public String currentLoggedInUser(Authentication loggedInUser) {
        User user=(User) loggedInUser.getPrincipal();
        return user.getFirstName();
    }

    public void uploadProfilePicture(String userId, MultipartFile file) throws IOException {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setProfilePicture(file.getBytes());
        userRepository.save(user);
    }

    public byte[] getProfilePicture(String userEmail) {
        User user = userRepository.findByEmail(userEmail).orElseThrow(() -> new RuntimeException("User not found"));
        return user.getProfilePicture();
    }

}
