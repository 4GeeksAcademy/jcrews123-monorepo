"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useReportWebVitals } from "next/web-vitals";

import { initializeTelemetry, track } from "@/lib/telemetry";

function sectionForRoute(route: string): string {
  const section = route.split("/").filter(Boolean)[0];
  return section ?? "dashboard";
}

function errorCode(value: unknown): string {
  if (value instanceof Error && value.name) return value.name.slice(0, 120);
  return "unknown_error";
}

export function TelemetryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useReportWebVitals((metric) => {
    track("web_vital_recorded", {
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
      route: window.location.pathname,
    });
  });

  useEffect(() => initializeTelemetry(), []);

  useEffect(() => {
    track("page_viewed", {
      route: pathname,
      section: sectionForRoute(pathname),
    });
  }, [pathname]);

  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      track("frontend_error", {
        error_kind: "error",
        route: window.location.pathname,
        message_code: errorCode(event.error),
      });
    };
    const onUnhandledRejection = (event: PromiseRejectionEvent) => {
      track("frontend_error", {
        error_kind: "unhandled_rejection",
        route: window.location.pathname,
        message_code: errorCode(event.reason),
      });
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
    };
  }, []);

  return children;
}
