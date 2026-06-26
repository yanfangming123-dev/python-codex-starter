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
  kind?: "模仿" | "补全" | "改错" | "独立" | "综合";
}

export interface WorkbookUnit {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  focus: string[];
  exercises: Exercise[];
}

export type StudyMode = "textbook" | "workbook" | "exam";
export type TrackId = "beginner" | "intermediate";

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
  workbookCompleted: string[];
  workbookCode: Record<string, string>;
  lastWorkbookUnit: string;
  examCompleted: string[];
  examCode: Record<string, string>;
  lastExamExercise: string;
  lastTrack: TrackId;
  lastMode: StudyMode;
}

export interface LearningTrack {
  id: TrackId;
  title: string;
  shortTitle: string;
  levelLabel: string;
  description: string;
  textbookLabel: string;
  workbookLabel: string;
  examLabel: string;
  heroBadge: string;
  heroTone: string;
  graduationTitle: string;
  graduationText: string;
  lessons: Lesson[];
  workbookUnits: WorkbookUnit[];
  examExercises: Exercise[];
}

export interface RunResult {
  output: string;
  error: string;
}
