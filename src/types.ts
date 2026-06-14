export type AppTab = 'home' | 'topics' | 'visual-learning' | 'learning' | 'testing' | 'stats' | 'ai-chat';

export interface PdrTopic {
  id: string;
  number: string;
  title: string;
  category: string;
  shortDescription: string;
  iconName: string;
  content: string[]; // List of rule paragraphs
  warnings?: string[]; // Critical safety / legal cautions
  fines?: {
    violation: string;
    description: string;
    amount: string; // e.g. "340 грн" or "510 грн або позбавлення прав"
  }[];
  questionsCount: number;
}

export interface Question {
  id: string;
  topicId: string;
  topicTitle: string;
  text: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  articleNumber?: string; // Standard law source references (e.g. "п. 8.4")
}

export interface TestSession {
  type: 'exam' | 'random' | 'topic';
  topicId?: string;
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, number>; // questionId -> selectedOptionIndex (can include non-selected if skipped)
  timeRemaining: number; // in seconds (20 mins * 60 = 1200)
  isCompleted: boolean;
  score: {
    total: number;
    correct: number;
    incorrect: number;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
  progress: number; // 0 to 100
  category: 'knowledge' | 'tests' | 'exam' | 'streak';
}

export interface UserStats {
  completedTopicIds: string[];
  totalTestsTaken: number;
  examsTakenCount: number;
  examsPassedCount: number;
  totalAnswersCount: number;
  correctAnswersCount: number;
  dailyStreak: number;
  lastActiveDate: string;
  weeklyPerformance: { day: string; answered: number; correct: number }[];
  topicDistribution: { category: string; value: number }[];
}
