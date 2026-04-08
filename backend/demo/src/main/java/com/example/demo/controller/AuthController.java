package com.example.demo.controller;

import com.example.demo.config.JwtUtil;
import com.example.demo.model.User;
import com.example.demo.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;
    private final JwtUtil jwtUtil;

    public AuthController(AuthService authService, JwtUtil jwtUtil) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        try {
            User user = authService.register(
                body.get("email"),
                body.get("fullName"),
                body.get("password")
            );
            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "token", token
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/pin")
    public ResponseEntity<?> savePin(@RequestBody Map<String, String> body) {
        try {
            authService.savePin(body.get("email"), Integer.parseInt(body.get("pin")));
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/verify-pin")
    public ResponseEntity<?> verifyPin(@RequestBody Map<String, String> body) {
        try {
            boolean valid = authService.verifyPin(body.get("email"), Integer.parseInt(body.get("pin")));
            return ResponseEntity.ok(Map.of("valid", valid));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/biometric")
    public ResponseEntity<?> updateBiometric(@RequestBody Map<String, String> body) {
        try {
            boolean enabled = Boolean.parseBoolean(body.get("enabled"));
            authService.updateBiometricEnabled(body.get("email"), enabled);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            User user = authService.login(body.get("email"), body.get("password"));
            String token = jwtUtil.generateToken(user.getEmail());
            return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "token", token,
                "biometricEnabled", user.isBiometricEnabled()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
