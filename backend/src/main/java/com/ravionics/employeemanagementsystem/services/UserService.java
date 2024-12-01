package com.ravionics.employeemanagementsystem.services;

import com.ravionics.employeemanagementsystem.entities.User;
import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface UserService {

    User saveUser(User User);

    User updateUser(User User);

    User getUserByEmail(String email);

    List<User> getAllUsers();

    User deleteUserById(String id);

    User getUserById(String id);

    String currentLoggedInUser(Authentication loggedInUser);
}
