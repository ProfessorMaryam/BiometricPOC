package com.example.demo.service;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User register(String email, String fullName, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email already in use.");
        }
        User user = new User();
        user.setEmail(email);
        user.setFullName(fullName);
        user.setPassword(password);
        userRepository.save(user);
        return userRepository.findByEmail(email).orElseThrow();
    }

    public void savePin(String email, int pin) {
        userRepository.updatePin(email, pin);
    }

    public boolean verifyPin(String email, int pin) {
        return userRepository.verifyPin(email, pin);
    }

    public void updateBiometricEnabled(String email, boolean enabled) {
        userRepository.updateBiometricEnabled(email, enabled);
    }

    public User login(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));
        if (!user.getPassword().equals(password)) {
            throw new IllegalArgumentException("Invalid email or password.");
        }
        return user;
    }
}
