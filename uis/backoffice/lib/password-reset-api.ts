import { API_BASE, apiFetch, parseApiError } from "@/lib/api-client";

export async function requestPasswordReset(email: string): Promise<void> {
  const normalized = email.trim().toLowerCase();
  const response = await fetch(`${API_BASE}/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: normalized }),
  });

  if (!response.ok) {
    throw new Error(
      await parseApiError(response, "Could not request password reset."),
    );
  }
}

export async function resetPassword(
  token: string,
  newPassword: string,
): Promise<void> {
  const response = await fetch(`${API_BASE}/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, new_password: newPassword }),
  });

  if (!response.ok) {
    throw new Error(await parseApiError(response, "Reset failed."));
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  await apiFetch("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({
      current_password: currentPassword,
      new_password: newPassword,
    }),
  });
}
