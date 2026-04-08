package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        try {
            User user = authService.register(
                body.get("email"),
                body.get("fullName"),
                body.get("password")
            );
            return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "fullName", user.getFullName()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            User user = authService.login(body.get("email"), body.get("password"));
            return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "fullName", user.getFullName()
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
