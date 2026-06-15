export const VISUAL_LESSONS_STORAGE_KEY = 'pdr_visual_lessons_progress';

export interface VisualLessonsProgress {
  /** questionId → selected option index */
  answers: Record<string, number>;
  /** questionId → whether answer was submitted */
  submitted: Record<string, boolean>;
  miniQuizScore: { correct: number; total: number };
}

export const DEFAULT_PROGRESS: VisualLessonsProgress = {
  answers: {},
  submitted: {},
  miniQuizScore: { correct: 0, total: 0 },
};

export function loadVisualLessonsProgress(): VisualLessonsProgress {
  try {
    const stored = localStorage.getItem(VISUAL_LESSONS_STORAGE_KEY);
    if (!stored) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(stored) as Partial<VisualLessonsProgress>;
    return {
      answers: parsed.answers ?? {},
      submitted: parsed.submitted ?? {},
      miniQuizScore: parsed.miniQuizScore ?? { correct: 0, total: 0 },
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function saveVisualLessonsProgress(progress: VisualLessonsProgress): void {
  try {
    localStorage.setItem(VISUAL_LESSONS_STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.error(e);
  }
}
