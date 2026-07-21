export type CandidateStatus =
  | "received"
  | "in_progress"
  | "selected"
  | "discarded";

export type CandidateStage =
  | "pending"
  | "review"
  | "personal_interview"
  | "technical_interview"
  | "offer_presented";

export interface Candidate {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url: string | null;
  cv_url: string | null;
  status: CandidateStatus;
  stage: CandidateStage;
  experience_years: number;
  notes_count: number;
  applied_at: string;
  updated_at: string;
  notes?: NoteSummary[];
}

export interface NoteSummary {
  id: string;
  record_id: string;
  content: string;
  created_at: string;
}

export interface CandidateCreate {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  experience_years: number;
  linkedin_url?: string | null;
  cv_url?: string | null;
}

export interface CandidatePatch {
  status?: CandidateStatus | null;
  stage?: CandidateStage | null;
}

export interface CandidatesListResponse {
  total: number;
  page: number;
  limit: number;
  data: Candidate[];
}

export interface CandidatesListParams {
  status?: CandidateStatus | "";
  stage?: CandidateStage | "";
  search?: string;
  page?: number;
  limit?: number;
}
