import { clearStoredToken, getStoredToken } from "@/lib/auth-storage";
import { setTelemetryUser, track } from "@/lib/telemetry";

export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "/backend";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function parseApiError(
  response: Response,
  fallback: string,
): Promise<string> {
  const body = (await response.json().catch(() => null)) as {
    detail?: string | { msg?: string }[];
  } | null;
  if (!body?.detail) return fallback;
  if (typeof body.detail === "string") return body.detail;
  if (Array.isArray(body.detail) && body.detail[0]?.msg) {
    return body.detail[0].msg;
  }
  return fallback;
}

type ApiFetchOptions = RequestInit & {
  auth?: boolean;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { auth = true, headers: initHeaders, ...rest } = options;
  const headers = new Headers(initHeaders);

  if (auth) {
    const token = getStoredToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  if (
    rest.body &&
    !(rest.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  const method = (rest.method ?? "GET").toUpperCase();
  const endpoint = path.split("?")[0];
  const startedAt = performance.now();
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...rest,
      headers,
    });
  } catch (error) {
    track("api_request_failed", { endpoint, method, status: 0 });
    throw error;
  }

  track("api_latency_recorded", {
    endpoint,
    method,
    duration_ms: Math.max(0, performance.now() - startedAt),
    status: response.status,
  });

  if (response.status === 401 && auth) {
    track("session_expired", {
      route: typeof window === "undefined" ? "/" : window.location.pathname,
    });
    setTelemetryUser(null);
    clearStoredToken();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw new ApiError("Session expired. Please sign in again.", 401);
  }

  if (!response.ok) {
    track("api_request_failed", {
      endpoint,
      method,
      status: response.status,
    });
    throw new ApiError(
      await parseApiError(response, `Request failed (${response.status})`),
      response.status,
    );
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
