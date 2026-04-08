const BASE_URL = 'http://192.168.8.119:8080';
export type AuthUser = {
  id: number;
  email: string;
  fullName: string;
  token: string;
  biometricEnabled: boolean;
};

export async function registerUser(
  email: string,
  fullName: string,
  password: string
): Promise<AuthUser> {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, fullName, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Registration failed');
  return data as AuthUser;
}

export async function savePin(email: string, pin: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/pin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, pin }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? 'Failed to save PIN');
  }
}

export async function verifyPin(email: string, pin: string): Promise<boolean> {
  const res = await fetch(`${BASE_URL}/auth/verify-pin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, pin }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Failed to verify PIN');
  return data.valid === true;
}

export async function updateBiometricPreference(email: string, enabled: boolean): Promise<void> {
  const res = await fetch(`${BASE_URL}/auth/biometric`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, enabled: String(enabled) }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? 'Failed to update biometric preference');
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthUser> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? 'Login failed');
  return data as AuthUser;
}
