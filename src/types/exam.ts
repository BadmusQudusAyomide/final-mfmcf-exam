export type ExamStatus = "draft" | "published" | "closed";

export interface ExamQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctOption: number;
  explanation?: string;
}

export interface CandidateSubmission {
  id: string;
  candidateName: string;
  phoneNumber: string;
  department: string;
  level: string;
  submittedAt: string;
  score: number;
  totalQuestions: number;
}

export interface ExamSummary {
  id: string;
  title: string;
  durationMinutes: number;
  status: ExamStatus;
  questionCount: number;
  totalCandidates: number;
  submittedCount: number;
}
