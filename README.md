# BiometricPOC

A proof of concept demonstrating how biometric authentication works on native mobile devices. The goal of this project is to show how fingerprint and face recognition can be integrated into a React Native app using the device's built-in biometric hardware, with a Spring Boot backend handling user registration, login, and session management.

## What this demonstrates

- How native biometric prompts (fingerprint / Face ID) are triggered from a mobile app
- The app never stores or processes biometric data — the OS handles everything using hardware already enrolled on the device (set up in phone Settings)
- A fallback PIN flow when biometrics fail or are cancelled
- JWT-based authentication with token storage in SecureStore
- Per-user biometric preference persisted in a backend database

## Authentication flow

1. **Register** — create an account with email, full name, and password
2. **Set up PIN** — choose a 6-digit PIN saved to the backend
3. **Enable biometrics** — opt in to fingerprint/face login (uses whatever is enrolled in phone Settings)
4. **Login** — enter credentials; if biometrics are enabled, the fingerprint/face prompt appears immediately after validation
   - Success → home screen
   - Fail / cancel → PIN entry screen

## Tech stack

| Layer | Technology |
|---|---|
| Mobile | React Native (Expo), expo-local-authentication, expo-secure-store |
| Routing | Expo Router (file-based) |
| Backend | Spring Boot 4, JDBC, H2 (in-memory) |
| Auth | JWT (jjwt 0.12) |

## Platform notes

- **Android**: biometrics work in Expo Go and in production APKs
- **iOS**: biometrics require a custom development build — Expo Go on iOS does not support `LocalAuthentication` due to missing `NSFaceIDUsageDescription` entitlement. Use `eas build --platform ios --profile development` or test on the iOS simulator via Features → Face ID → Matching Face

## Running the project

### Backend

```bash
cd backend/demo
./mvnw spring-boot:run
```

Runs on `http://localhost:8080`. Update `BASE_URL` in `services/api.ts` to your machine's local IP if testing on a physical device.

### Frontend

```bash
npm install
npx expo start
```

Scan the QR code with Expo Go (Android) or run on a simulator.

## API endpoints

| Method | Path | Description |
|---|---|---|
| POST | /auth/register | Register a new user |
| POST | /auth/login | Login and receive JWT |
| POST | /auth/pin | Save user PIN |
| POST | /auth/verify-pin | Verify PIN for fallback login |
| POST | /auth/biometric | Update biometric preference |
