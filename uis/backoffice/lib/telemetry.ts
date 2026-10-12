"use client";

const ENDPOINT =
  process.env.NEXT_PUBLIC_TELEMETRY_ENDPOINT ?? "/backend/telemetry/events";
const SCHEMA_VERSION = "1.0.0";
const MAX_BATCH_SIZE = 20;
const FLUSH_INTERVAL_MS = 10_000;
const MAX_RETRIES = 3;
const SESSION_KEY = "brasaland_telemetry_session_id";

export type TelemetryProperties = Record<string, string | number>;

type TelemetryEvent = {
  eventId: string;
  timestamp: string;
  sessionId: string;
  userId: string | null;
  event_type: string;
  schemaVersion: string;
  requestId: string;
  properties: TelemetryProperties;
};

const queue: TelemetryEvent[] = [];
let userId: string | null = null;
let flushTimer: ReturnType<typeof setTimeout> | null = null;
let flushing: Promise<void> | null = null;
let initialized = false;

function uuid(): string {
  return crypto.randomUUID();
}

function getSessionId(): string {
  const existing = sessionStorage.getItem(SESSION_KEY);
  if (existing) return existing;
  const created = uuid();
  sessionStorage.setItem(SESSION_KEY, created);
  return created;
}

function scheduleFlush(): void {
  if (flushTimer || queue.length === 0) return;
  flushTimer = setTimeout(() => {
    flushTimer = null;
    void flush();
  }, FLUSH_INTERVAL_MS);
}

async function postBatch(events: TelemetryEvent[]): Promise<void> {
  let lastError: unknown;
  for (let attempt = 0; attempt < MAX_RETRIES; attempt += 1) {
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events }),
        keepalive: true,
      });
      if (!response.ok) throw new Error(`Telemetry HTTP ${response.status}`);
      return;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, 250 * 2 ** attempt),
        );
      }
    }
  }
  console.warn("Telemetry batch discarded after retries.", lastError);
}

export function flush(): Promise<void> {
  if (flushing) return flushing;
  if (queue.length === 0) return Promise.resolve();

  const events = queue.splice(0, MAX_BATCH_SIZE);
  flushing = postBatch(events).finally(() => {
    flushing = null;
    if (queue.length > 0) scheduleFlush();
  });
  return flushing;
}

function flushWithBeacon(): void {
  if (queue.length === 0 || !navigator.sendBeacon) return;
  const events = queue.splice(0, queue.length);
  const body = new Blob([JSON.stringify({ events })], {
    type: "application/json",
  });
  const accepted = navigator.sendBeacon(ENDPOINT, body);
  if (!accepted) queue.unshift(...events);
}

export function setTelemetryUser(nextUserId: string | null): void {
  userId = nextUserId;
}

export function track(
  eventType: string,
  properties: TelemetryProperties,
): void {
  if (typeof window === "undefined") return;
  queue.push({
    eventId: uuid(),
    timestamp: new Date().toISOString(),
    sessionId: getSessionId(),
    userId,
    event_type: eventType,
    schemaVersion: SCHEMA_VERSION,
    requestId: uuid(),
    properties,
  });
  if (queue.length >= MAX_BATCH_SIZE) void flush();
  else scheduleFlush();
}

export function initializeTelemetry(): () => void {
  if (initialized || typeof window === "undefined") return () => undefined;
  initialized = true;

  const onVisibilityChange = () => {
    if (document.visibilityState === "hidden") flushWithBeacon();
  };
  document.addEventListener("visibilitychange", onVisibilityChange);

  return () => {
    document.removeEventListener("visibilitychange", onVisibilityChange);
    if (flushTimer) clearTimeout(flushTimer);
    flushTimer = null;
    initialized = false;
  };
}
