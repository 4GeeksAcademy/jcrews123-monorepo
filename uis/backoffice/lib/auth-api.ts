import { API_BASE, apiFetch, parseApiError } from "@/lib/api-client";
import { clearStoredToken, setStoredToken } from "@/lib/auth-storage";

export type UserRole = "admin" | "manager" | "user";

export type AuthProfile = {
  id: number;
  user_id: number;
  name: string;
  phone: string;
  address: string;
};

export type AuthUser = {
  email: string;
  role: UserRole;
  profile: AuthProfile;
};

export type RegisterInput = {
  email: string;
  password: string;
  name?: string;
  phone?: string;
  address?: string;
};

export async function login(email: string, password: string): Promise<void> {
  const response = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Incorrect email or password."),
    );
  }

  const data = (await response.json()) as { access_token: string };
  setStoredToken(data.access_token);
}

export async function register(input: RegisterInput): Promise<void> {
  const response = await fetch(`${API_BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response, "Registration failed."));
  }
}

export async function fetchCurrentUser(): Promise<AuthUser> {
  return apiFetch<AuthUser>("/auth/me");
}

export async function updateProfile(input: {
  name?: string;
  phone?: string;
  address?: string;
}): Promise<AuthProfile> {
  return apiFetch<AuthProfile>("/profiles/me", {
    method: "PUT",
    body: JSON.stringify(input),
  });
}

export function logout(): void {
  clearStoredToken();
}
