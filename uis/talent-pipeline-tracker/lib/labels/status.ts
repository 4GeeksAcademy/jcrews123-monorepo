import type { CandidateStatus } from "@/types/candidate";

export const STATUS_OPTIONS: { value: CandidateStatus; label: string }[] = [
  { value: "received", label: "Received" },
  { value: "in_progress", label: "In progress" },
  { value: "selected", label: "Selected" },
  { value: "discarded", label: "Discarded" },
];

export function getStatusLabel(status: string): string {
  return STATUS_OPTIONS.find((option) => option.value === status)?.label ?? status;
}
