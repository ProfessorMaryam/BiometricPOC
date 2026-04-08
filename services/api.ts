const BASE_URL = 'http://localhost:8080';
export type AuthUser ={
    id : number;
    email: string ;
    fullName : string;
}

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
