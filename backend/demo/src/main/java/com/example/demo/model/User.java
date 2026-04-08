package com.example.demo.model;

public class User {
    private Long id;
    private String email;
    private String fullName;
    private String password;
    private Integer pin;
    private boolean biometricEnabled;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public Integer getPin() { return pin; }
    public void setPin(Integer pin) { this.pin = pin; }

    public boolean isBiometricEnabled() { return biometricEnabled; }
    public void setBiometricEnabled(boolean biometricEnabled) { this.biometricEnabled = biometricEnabled; }
}
