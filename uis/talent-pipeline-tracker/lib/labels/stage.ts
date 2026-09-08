import type { CandidateStage } from "@/types/candidate";

export const STAGE_OPTIONS: { value: CandidateStage; label: string }[] = [
  { value: "pending", label: "Pending review" },
  { value: "review", label: "Under review" },
  { value: "personal_interview", label: "Personal interview" },
  { value: "technical_interview", label: "Technical interview" },
  { value: "offer_presented", label: "Offer presented" },
];

export function getStageLabel(stage: string): string {
  return STAGE_OPTIONS.find((option) => option.value === stage)?.label ?? stage;
}
