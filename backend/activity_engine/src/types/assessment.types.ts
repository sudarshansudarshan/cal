import { AssessmentAttemptStatusEnum } from '@prisma/client';

// Answer Types
export interface NATAnswer {
  questionId: string;
  value: string;
}

export interface DescriptiveAnswer {
  questionId: string;
  answerText: string;
}

export interface MCQAnswer {
  questionId: string;
  choiceId: string;
}

export interface MSQAnswer {
  questionId: string;
  choiceIds: string[];
}

// Combined Answer Type
export interface SubmissionAnswers {
  natAnswers: NATAnswer[];
  descriptiveAnswers: DescriptiveAnswer[];
  mcqAnswers: MCQAnswer[];
  msqAnswers: MSQAnswer[];
}

// Solution Types
export interface NATSolution {
  questionId: string;
  type: 'NAT';
  value: string;
  toleranceMin: number;
  toleranceMax: number;
  decimalPrecision: number;
}

export interface DescriptiveSolution {
  questionId: string;
  type: 'DESCRIPTIVE';
  modelSolution: string;
  minWordLimit: number;
  maxWordLimit: number;
}

export interface MCQSolution {
  questionId: string;
  type: 'MCQ';
  correctChoiceId: string;
}

export interface MSQSolution {
  questionId: string;
  type: 'MSQ';
  correctChoiceIds: string[];
}

// Combined Solution Type
export type QuestionSolution = NATSolution | DescriptiveSolution | MCQSolution | MSQSolution;

// Grading Result Type
export interface GradingResult {
  correctAnswers: number;
  totalQuestions: number;
  status: AssessmentAttemptStatusEnum;
}
