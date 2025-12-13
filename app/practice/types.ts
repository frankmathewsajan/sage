export interface Problem {
  id: string;
  url: string;
  title: string;
  notes: string;
  description: string;
  solvedDate: string;
  userId: string;
  neuralPathwayCreated: boolean;
  pattern: string;
  nextReviewDate?: string;
  reviewCount: number;
}

export interface ProblemFormData {
  url: string;
  title: string;
  notes: string;
  description: string;
  solvedDate: string;
  neuralPathwayCreated: boolean;
  pattern: string;
}

export interface CalendarDay {
  date: string;
  count: number;
}
