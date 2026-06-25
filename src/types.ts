export type ValidationRule =
  | { type: "outputIncludes"; values: string[] }
  | { type: "codeIncludes"; values: string[] }
  | { type: "both"; output: string[]; code: string[] };

export interface Exercise {
  id: string;
  title: string;
  task: string;
  starterCode: string;
  expected: string;
  input?: string[];
  hints: string[];
  answer: string;
  validation: ValidationRule;
}

export interface Lesson {
  id: string;
  number: number;
  title: string;
  eyebrow: string;
  duration: string;
  goal: string;
  analogy: string;
  explanation: string[];
  keyPoints: string[];
  exampleCode: string;
  exampleInput?: string[];
  exercises: Exercise[];
  codexTip: string;
}

export interface ProgressState {
  completedLessons: string[];
  completedExercises: string[];
  codeByExercise: Record<string, string>;
  lastLessonId: string;
}

export interface RunResult {
  output: string;
  error: string;
}
