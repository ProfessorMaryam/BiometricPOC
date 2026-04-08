package com.example.demo.repository;

import com.example.demo.model.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbc;

    public UserRepository(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    private final RowMapper<User> rowMapper = (rs, rowNum) -> {
        User u = new User();
        u.setId(rs.getLong("id"));
        u.setEmail(rs.getString("email"));
        u.setFullName(rs.getString("full_name"));
        u.setPassword(rs.getString("password"));
        u.setPin(rs.getInt("pin"));
        u.setBiometricEnabled(rs.getInt("biometric_enabled") == 1);
        return u;
    };

    public void save(User user) {
        jdbc.update(
            "INSERT INTO users (email, full_name, password, pin, biometric_enabled) VALUES (?, ?, ?, ?, ?)",
            user.getEmail(),
            user.getFullName(),
            user.getPassword(),
            user.getPin(),
            user.isBiometricEnabled() ? 1 : 0
        );
    }

    public Optional<User> findByEmail(String email) {
        var results = jdbc.query(
            "SELECT * FROM users WHERE email = ?",
            rowMapper,
            email
        );
        return results.isEmpty() ? Optional.empty() : Optional.of(results.get(0));
    }

    public void updatePin(String email, int pin) {
        jdbc.update("UPDATE users SET pin = ? WHERE email = ?", pin, email);
    }

    public boolean verifyPin(String email, int pin) {
        return findByEmail(email)
            .map(u -> u.getPin() != null && u.getPin() == pin)
            .orElse(false);
    }

    public void updateBiometricEnabled(String email, boolean enabled) {
        jdbc.update(
            "UPDATE users SET biometric_enabled = ? WHERE email = ?",
            enabled ? 1 : 0,
            email
        );
    }

    public boolean existsByEmail(String email) {
        Integer count = jdbc.queryForObject(
            "SELECT COUNT(*) FROM users WHERE email = ?",
            Integer.class,
            email
        );
        return count != null && count > 0;
    }
}
