CREATE TABLE IF NOT EXISTS users (
    id          BIGINT AUTO_INCREMENT PRIMARY KEY,
    email       VARCHAR(255),
    full_name   VARCHAR(255),
    password    VARCHAR(255),
    pin         INTEGER,
    biometric_enabled INTEGER
);