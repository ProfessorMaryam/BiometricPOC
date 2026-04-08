import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'auth_token';
const BIOMETRICS_KEY = 'biometrics_enabled';
const EMAIL_KEY = 'auth_email';

export async function saveToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
}

export async function getToken(): Promise<string | null> {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export async function deleteToken(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
}

export async function saveEmail(email: string): Promise<void> {
  await SecureStore.setItemAsync(EMAIL_KEY, email);
}

export async function getEmail(): Promise<string | null> {
  return SecureStore.getItemAsync(EMAIL_KEY);
}

export async function clearSession(): Promise<void> {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(EMAIL_KEY);
  // BIOMETRICS_KEY is intentionally kept — preference survives logout
}

export async function setBiometricsEnabled(enabled: boolean): Promise<void> {
  await SecureStore.setItemAsync(BIOMETRICS_KEY, enabled ? 'true' : 'false');
}

export async function isBiometricsEnabled(): Promise<boolean> {
  const val = await SecureStore.getItemAsync(BIOMETRICS_KEY);
  return val === 'true';
}
