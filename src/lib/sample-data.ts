import type { CandidateSubmission, ExamQuestion, ExamSummary } from "@/types/exam";

export const examSummary: ExamSummary = {
  id: "discipleship-2026",
  title: "Discipleship and Stewardship Class Exam",
  durationMinutes: 35,
  status: "published",
  questionCount: 50,
  totalCandidates: 164,
  submittedCount: 121,
};

export const recentSubmissions: CandidateSubmission[] = [
  {
    id: "sub_001",
    candidateName: "Deborah Afolabi",
    phoneNumber: "0803 000 1111",
    department: "Choir",
    level: "300",
    submittedAt: "2026-03-31T08:12:00.000Z",
    score: 42,
    totalQuestions: 50,
  },
  {
    id: "sub_002",
    candidateName: "Tobi Akanji",
    phoneNumber: "0706 222 3333",
    department: "Technical",
    level: "400",
    submittedAt: "2026-03-31T08:18:00.000Z",
    score: 38,
    totalQuestions: 50,
  },
  {
    id: "sub_003",
    candidateName: "Grace Adeyemi",
    phoneNumber: "0814 555 8888",
    department: "Prayer",
    level: "200",
    submittedAt: "2026-03-31T08:27:00.000Z",
    score: 46,
    totalQuestions: 50,
  },
];

export const sampleQuestions: ExamQuestion[] = [
  {
    id: "q1",
    prompt:
      "Brother Peter has recently been appointed as a fellowship leader. According to the teaching on anointing, what is most likely missing in his ministry if he relies only on physical strength?",
    options: [
      "More financial support",
      "The anointing of the Holy Spirit",
      "More personal discipline",
      "The approval of his peers",
    ],
    correctOption: 1,
    explanation:
      "Ministry effectiveness relies on the empowerment of the Holy Spirit, not just human effort.",
  },
  {
    id: "q2",
    prompt:
      "A student has been avoiding Christian gatherings but engages consistently on social media. Which evangelistic strategy fits best?",
    options: [
      "Mass evangelism only",
      "Social media evangelism",
      "Ignore the student",
      "Delay outreach",
    ],
    correctOption: 1,
    explanation: "Meet people where they already are and create a bridge to discipleship.",
  },
  {
    id: "q3",
    prompt:
      "Many fellowship members are struggling academically and skipping meetings. What should leadership do?",
    options: [
      "Condemn them immediately",
      "Ignore the issue",
      "Organize academic support while teaching time management",
      "Cancel all fellowship meetings",
    ],
    correctOption: 2,
    explanation:
      "The fellowship should support both spiritual growth and practical responsibility.",
  },
];

export const dashboardStats = [
  {
    label: "Registered Candidates",
    value: examSummary.totalCandidates.toString(),
    note: "Students who started registration for this exam window.",
  },
  {
    label: "Completed Submissions",
    value: examSummary.submittedCount.toString(),
    note: "Papers graded and stored by the server.",
  },
  {
    label: "Average Score",
    value: "81%",
    note: "This should come from server-side aggregation later.",
  },
  {
    label: "Flagged Sessions",
    value: "6",
    note: "Suspicious attempts, disconnects, or duplicate device activity.",
  },
] as const;
