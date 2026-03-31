import { z } from "zod";

export const registrationSchema = z.object({
  fullName: z.string().trim().min(3, "Full name is required."),
  matricNumber: z.string().trim().min(3, "Matric number is required."),
  department: z.string().trim().min(1, "Department is required."),
  level: z.string().trim().min(1, "Level is required."),
  phoneNumber: z.string().trim().min(7, "Phone number is required."),
});

export const submissionSchema = z.object({
  candidateId: z.string().trim().min(1),
  examSlug: z.string().trim().min(1),
  answers: z.array(
    z.object({
      questionId: z.string().trim().min(1),
      selectedOption: z.string().trim().min(1).optional(),
    }),
  ),
});

export const examSettingsSchema = z.object({
  title: z.string().trim().min(3),
  slug: z.string().trim().min(3),
  instructions: z.string().trim().min(3),
  durationMinutes: z.coerce.number().int().min(1).max(300),
  status: z.enum(["DRAFT", "PUBLISHED", "CLOSED"]),
  departments: z.array(z.string().trim().min(1)).min(1),
  levels: z.array(z.string().trim().min(1)).min(1),
});

export const questionSchema = z.object({
  prompt: z.string().trim().min(5),
  explanation: z.string().trim().optional().or(z.literal("")),
  options: z.array(z.string().trim()).min(2),
  correctOptionIndex: z.coerce.number().int().min(0),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
export type SubmissionInput = z.infer<typeof submissionSchema>;
export type ExamSettingsInput = z.infer<typeof examSettingsSchema>;
export type QuestionInput = z.infer<typeof questionSchema>;
