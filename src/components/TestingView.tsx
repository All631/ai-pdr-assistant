import React, { useState } from 'react';
import { AppTab } from '../types';
import rawQuestions from '../data/questions.json';
import { 
  CheckCircle2, 
  XCircle, 
  ChevronLeft, 
  ChevronRight, 
  RefreshCw, 
  Play, 
  Award, 
  BookOpen, 
  AlertCircle, 
  HelpCircle,
  Home,
  Check,
  Zap,
  Flame,
  Info,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface JSONQuestion {
  id: string;
  question: string;
  image: string | null;
  answers: string[];
  correctAnswer: number;
  explanation: string;
}

const questionsPool = rawQuestions as JSONQuestion[];

const QUESTION_TOPIC_MAP: Record<string, { topicId: string, topicTitle: string }> = {
  'q-1': { topicId: 'learning-speed', topicTitle: 'Швидкісний режим' },
  'q-2': { topicId: 'learning-intersections', topicTitle: 'Проїзд перехресть' },
  'q-3': { topicId: 'learning-intersections', topicTitle: 'Проїзд перехресть' },
  'q-4': { topicId: 'learning-parking', topicTitle: 'Зупинка та стоянка' },
  'q-5': { topicId: 'learning-parking', topicTitle: 'Зупинка та стоянка' },
  'q-6': { topicId: 'learning-signs', topicTitle: 'Дорожні знаки' },
  'q-7': { topicId: 'learning-intersections', topicTitle: 'Проїзд перехресть' },
  'q-8': { topicId: 'learning-speed', topicTitle: 'Швидкісний режим' },
  'q-9': { topicId: 'learning-intersections', topicTitle: 'Проїзд перехресть' },
  'q-10': { topicId: 'learning-speed', topicTitle: 'Швидкісний режим' },
  'q-11': { topicId: 'learning-signs', topicTitle: 'Дорожні знаки' },
  'q-12': { topicId: 'learning-parking', topicTitle: 'Зупинка та стоянка' },
  'q-13': { topicId: 'learning-speed', topicTitle: 'Швидкісний режим' },
  'q-14': { topicId: 'learning-markings', topicTitle: 'Дорожня розмітка' },
  'q-15': { topicId: 'learning-speed', topicTitle: 'Швидкісний режим' },
  'q-16': { topicId: 'learning-speed', topicTitle: 'Швидкісний режим' },
  'q-17': { topicId: 'learning-signs', topicTitle: 'Дорожні знаки' },
  'q-18': { topicId: 'learning-intersections', topicTitle: 'Проїзд перехресть' },
  'q-19': { topicId: 'learning-markings', topicTitle: 'Дорожня розмітка' },
  'q-20': { topicId: 'learning-parking', topicTitle: 'Зупинка та стоянка' },
};

interface TestingViewProps {
  onRegisterTestCompleted: (correctCount: number, totalQuestions: number, isExam: boolean, isExamPassed: boolean) => void;
  setActiveTab: (tab: AppTab) => void;
  bookmarkedQuestionIds: string[];
  onToggleBookmark: (questionId: string) => void;
}

export default function TestingView({ onRegisterTestCompleted, setActiveTab, bookmarkedQuestionIds, onToggleBookmark }: TestingViewProps) {
  // Test game states
  const [activeSession, setActiveSession] = useState<{
    questions: JSONQuestion[];
    currentQuestionIndex: number;
    userAnswers: Record<string, number>; // question id -> answer index
    isCompleted: boolean;
    mode: 'mini' | 'marathon';
  } | null>(null);

  // Diagnostic simulation hook
  React.useEffect(() => {
    const handleSimulate = (event: Event) => {
      const customEvent = event as CustomEvent;
      const forcePass = customEvent.detail?.pass !== false; // pass by default, or random

      const selectedQuestions = [...questionsPool];
      const userAnswers: Record<string, number> = {};
      let correct = 0;

      selectedQuestions.forEach((q, i) => {
        // To make it look realistic, let's create a mix
        // Let's make 17 correct (pass) or 12 correct (fail)
        const targetCorrectCount = forcePass ? 18 : 12;
        const answerCorrectly = i < targetCorrectCount;
        if (answerCorrectly) {
          userAnswers[q.id] = q.correctAnswer;
          correct++;
        } else {
          // Select wrong answer index
          userAnswers[q.id] = (q.correctAnswer + 1) % q.answers.length;
        }
      });

      const isExamPassed = correct >= 18;

      // Sync with global stats
      onRegisterTestCompleted(correct, 20, true, isExamPassed);

      // Open completed session
      setActiveSession({
        questions: selectedQuestions,
        currentQuestionIndex: 0,
        userAnswers,
        isCompleted: true,
        mode: 'marathon'
      });
    };

    window.addEventListener('simulate-exam', handleSimulate);
    return () => {
      window.removeEventListener('simulate-exam', handleSimulate);
    };
  }, [onRegisterTestCompleted]);

  // Starts the test session
  const startTest = (mode: 'mini' | 'marathon') => {
    let selectedQuestions: JSONQuestion[] = [];
    if (mode === 'mini') {
      // Shuffle and pick 10 questions
      selectedQuestions = [...questionsPool].sort(() => 0.5 - Math.random()).slice(0, 10);
    } else {
      // Full 20 questions
      selectedQuestions = [...questionsPool];
    }

    setActiveSession({
      questions: selectedQuestions,
      currentQuestionIndex: 0,
      userAnswers: {},
      isCompleted: false,
      mode
    });
  };

  const handleSelectAnswer = (questionId: string, answerIndex: number) => {
    if (!activeSession || activeSession.isCompleted) return;
    
    // Lock answer immediately in practice mode
    if (activeSession.userAnswers[questionId] !== undefined) return;

    setActiveSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        userAnswers: {
          ...prev.userAnswers,
          [questionId]: answerIndex
        }
      };
    });
  };

  const handleNext = () => {
    if (!activeSession) return;

    if (activeSession.currentQuestionIndex < activeSession.questions.length - 1) {
      setActiveSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          currentQuestionIndex: prev.currentQuestionIndex + 1
        };
      });
    } else {
      // Finish session and calculate results
      let correct = 0;
      activeSession.questions.forEach(q => {
        if (activeSession.userAnswers[q.id] === q.correctAnswer) {
          correct++;
        }
      });

      const isExamPassed = correct >= (activeSession.mode === 'mini' ? 9 : 18); // 90%+ pass rate

      // Sync with global system statistics
      onRegisterTestCompleted(
        correct, 
        activeSession.questions.length, 
        true, // treats as exam
        isExamPassed
      );

      setActiveSession(prev => {
        if (!prev) return null;
        return {
          ...prev,
          isCompleted: true
        };
      });
    }
  };

  const handlePrev = () => {
    if (!activeSession || activeSession.currentQuestionIndex === 0) return;
    setActiveSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        currentQuestionIndex: prev.currentQuestionIndex - 1
      };
    });
  };

  const handleCancel = () => {
    if (window.confirm("Ви дійсно хочете перервати тестування? Ваші поточні відповіді не збережуться.")) {
      setActiveSession(null);
    }
  };

  // Pre-calculate stats for the raw layout if completed
  let totalCount = 0;
  let correctCount = 0;
  let errorsCount = 0;
  let successPercentage = 0;
  const topicStats: Record<string, { title: string; total: number; mistakes: number; correct: number }> = {};

  if (activeSession && activeSession.isCompleted) {
    totalCount = activeSession.questions.length;
    activeSession.questions.forEach(q => {
      const mapping = QUESTION_TOPIC_MAP[q.id] || { topicId: 'learning-speed', topicTitle: 'Швидкісний режим' };
      const topicId = mapping.topicId;
      const topicTitle = mapping.topicTitle;

      if (!topicStats[topicId]) {
        topicStats[topicId] = { title: topicTitle, total: 0, mistakes: 0, correct: 0 };
      }

      topicStats[topicId].total++;

      if (activeSession.userAnswers[q.id] === q.correctAnswer) {
        correctCount++;
        topicStats[topicId].correct++;
      } else {
        errorsCount++;
        topicStats[topicId].mistakes++;
      }
    });
    successPercentage = Math.round((correctCount / totalCount) * 100);
  }

  // Determine preparation level
  let prepLevel = "Низький";
  let prepLevelColor = "text-rose-700 bg-rose-50 border-rose-100";
  if (successPercentage >= 90) {
    prepLevel = "Високий (Чудова готовність)";
    prepLevelColor = "text-emerald-700 bg-emerald-50 border-emerald-100";
  } else if (successPercentage >= 75) {
    prepLevel = "Середній (Задовільна готовність)";
    prepLevelColor = "text-amber-700 bg-amber-50 border-amber-100";
  } else {
    prepLevel = "Низький (Потрібне серйозне повторення)";
    prepLevelColor = "text-rose-700 bg-rose-50 border-rose-100";
  }

  // Dynamic Exam Forecast
  let examForecast = "";
  if (successPercentage >= 95) {
    examForecast = "Відмінна готовність! Прогноз успішності на офіційному іспиті у сервісному центрі МВС високий — понад 98%. Ви чудово володієте матеріалом!";
  } else if (successPercentage >= 90) {
    examForecast = "Добра готовність. Шанс скласти реальний іспит оцінюється у 85%-90%. Наявні дрібні помилки, які бажано усунути перед виїздом.";
  } else if (successPercentage >= 75) {
    examForecast = "Задовільна готовність. Прогноз успішного складання — близько 50%. На реальному іспиті допускається лише 2 помилки, тому вам необхідно ще потренуватися.";
  } else {
    examForecast = "Низька готовність до іспиту. Рівень ризику провалу іспиту вкрай високий. Наполегливо рекомендуємо перечитати кожну слабку тему та пройти додаткові тести.";
  }

  // Filter weak topics representing topics where user made mistakes
  const weakTopics = Object.entries(topicStats)
    .filter(([_, stats]) => stats.mistakes > 0)
    .map(([id, stats]) => ({
      id,
      title: stats.title,
      mistakes: stats.mistakes,
      total: stats.total,
      suggestedQuestions: stats.mistakes * 5, // Recommendation: solve 5 times the number of mistakes in questions
    }));

  return (
    <div className="py-2" id="testing-root-wrapper">
      {!activeSession ? (
        /* Welcome / Mode selection page */
        <div className="space-y-8" id="testing-setup-screen">
          <div>
            <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
              Локальне тестування v2.0
            </span>
            <h1 className="mt-2 font-display text-2xl font-bold text-slate-800 sm:text-3xl">Екзаменаційний тренажер ПДР</h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Перевірте свій теоретичний рівень за допомогою нашої нової локальної бази з 20 деталізованих питань. Отримуйте миттєві роз&apos;яснення правил негайно під час тесту!
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2" id="testing-modes-container">
            {/* 10 Questions Smart Test */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:scale-[1.01] hover:shadow-md flex flex-col justify-between">
              <div className="absolute top-0 right-0 rounded-bl-xl bg-blue-500 px-3 py-1 text-4xs font-bold uppercase tracking-wider text-white">
                ШВИДКИЙ СТАРТ
              </div>
              <div className="space-y-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-inner">
                  <Zap className="h-5.5 w-5.5" />
                </div>
                <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Малий тренажер (10 питань)</h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  Випадковий експрес-тест із 10 питань з нашої бази даних. Ідеальний вибір для щоденного швидкого повторення за чашкою кави.
                </p>
                <div className="space-y-1.5 text-4xs font-mono font-bold uppercase tracking-wider text-blue-600">
                  <p>• Вибіркові 10 запитань</p>
                  <p>• Миттєві підказки та ПДР коментар</p>
                  <p>• Проходьте у власному темпі</p>
                </div>
              </div>
              <button
                onClick={() => startTest('mini')}
                id="start-mini-test-btn"
                className="mt-6 w-full rounded-xl bg-blue-600 hover:bg-blue-500 text-white py-3 text-xs font-bold shadow-md shadow-blue-100 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <Play className="h-4 w-4 fill-white" />
                Запустити тренажер
              </button>
            </div>

            {/* 20 Questions Full Marathon */}
            <div className="group relative overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:scale-[1.01] hover:shadow-md flex flex-col justify-between">
              <div className="absolute top-0 right-0 rounded-bl-xl bg-indigo-600 px-3 py-1 text-4xs font-bold uppercase tracking-wider text-white">
                ПОВНИЙ ІСПИТ
              </div>
              <div className="space-y-4">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 shadow-inner">
                  <Award className="h-5.5 w-5.5" />
                </div>
                <h3 className="font-display text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">Повний марафон (Всі 20 питань)</h3>
                <p className="text-xs leading-relaxed text-slate-500">
                  Комплексна перевірка за повною лінійкою з 20 питань. Охоплює обмеження швидкості, знаки, перехрестя, регулювальників та медичну допомогу.
                </p>
                <div className="space-y-1.5 text-4xs font-mono font-bold uppercase tracking-wider text-indigo-600">
                  <p>• Повний обсяг з 20 запитань</p>
                  <p>• Детальна робота над помилками</p>
                  <p>• Лише 2 помилки дозволено для проходження</p>
                </div>
              </div>
              <button
                onClick={() => startTest('marathon')}
                id="start-marathon-test-btn"
                className="mt-6 w-full rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-3 text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
              >
                <Play className="h-4 w-4 fill-white" />
                Почати марафон
              </button>
            </div>
          </div>

          {/* Quick legal checklist card */}
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 flex items-start gap-4">
            <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-slate-600 hidden sm:block">
              <Info className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-display font-semibold text-xs text-slate-950">Стандарти оцінювання</h4>
              <p className="text-xs leading-relaxed text-slate-500">
                Тестування спроектовано за офіційними лекалами Сервісного Центру МВС України: для успішного заліку необхідно дати не менше 90% правильних відповідей. Тренуйтеся до досягнення відмітки 100% успішності!
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Active quiz session */
        <div id="active-quiz-panel" className="space-y-6">
          {/* Header navigation and progress */}
          <div className="rounded-2xl border border-slate-100 bg-white p-4.5 shadow-sm flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-0.5 text-3xs font-bold text-blue-700 uppercase tracking-wider">
                Режим: {activeSession.mode === 'mini' ? 'Експрес' : 'Марафон 20'}
              </span>
              <span className="hidden sm:inline text-xs font-medium text-slate-400">|</span>
              <p className="text-xs font-semibold text-slate-800">
                Запитання {activeSession.currentQuestionIndex + 1} з {activeSession.questions.length}
              </p>
            </div>

            <button
              onClick={handleCancel}
              id="cancel-test-session-btn"
              className="rounded-xl bg-slate-50 hover:bg-rose-50 hover:text-rose-600 px-3.5 py-2 text-xs font-bold text-slate-500 border border-slate-100 cursor-pointer transition-colors"
            >
              Перервати
            </button>
          </div>

          {/* Progress dots row */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 py-1 w-full" id="quiz-progress-dots">
            {activeSession.questions.map((q, idx) => {
              const userAnswer = activeSession.userAnswers[q.id];
              const isAnswered = userAnswer !== undefined;
              const isCorrect = userAnswer === q.correctAnswer;
              const isCurrent = activeSession.currentQuestionIndex === idx;

              let dotColor = 'bg-slate-200';
              if (isCurrent) {
                dotColor = 'bg-blue-600 ring-4 ring-blue-100';
              } else if (isAnswered) {
                dotColor = isCorrect ? 'bg-emerald-500' : 'bg-rose-500';
              }

              return (
                <div 
                  key={q.id}
                  className={`h-2.5 rounded-full transition-all shrink-0 ${isCurrent ? 'w-6' : 'w-2.5'} ${dotColor}`} 
                />
              );
            })}
          </div>

          {activeSession.isCompleted ? (
            /* Results page markup */
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-6 animate-fade-in"
              id="quiz-results-screen"
            >
              {/* Main metrics badge card */}
              <div className={`rounded-3xl p-6 sm:p-8 text-center text-white relative overflow-hidden ${
                successPercentage >= 90
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-700'
                  : 'bg-gradient-to-br from-rose-600 to-red-700'
              }`}>
                <div className="absolute -top-12 -right-12 h-44 w-44 rounded-full bg-white/5 blur-xl" />
                <div className="relative mx-auto max-w-lg">
                  <span className="inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-4xs font-bold uppercase tracking-wider text-white">
                    Залік завершено
                  </span>

                  {successPercentage >= 90 ? (
                    <>
                      <Award className="mx-auto mt-6 h-14 w-14 text-emerald-100" />
                      <h2 className="mt-4 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                        Тест Успішно Складено! 🎉
                      </h2>
                      <p className="mt-2 text-xs text-emerald-50 leading-relaxed">
                        Прекрасний результат! Ви правильно відповіли на {correctCount} питань із {totalCount} та уклалися у встановлений норматив похибок.
                      </p>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="mx-auto mt-6 h-14 w-14 text-rose-100 animate-bounce" />
                      <h2 className="mt-4 font-display text-2xl font-bold tracking-tight sm:text-3xl">
                        Тест не складено
                      </h2>
                      <p className="mt-2 text-xs text-rose-50 leading-relaxed">
                        Допущено більше критичних помилок, ніж передбачено нормою ПДР (для заліку треба {activeSession.mode === 'mini' ? '9' : '18'} правильних відповідей). Спробуйте ще раз!
                      </p>
                    </>
                  )}

                  {/* Highlight core statistics table fields */}
                  <div className="mt-6 grid grid-cols-3 gap-2 rounded-2xl bg-black/10 p-4 text-xs font-bold font-mono">
                    <div>
                      <p className="text-white/75 text-3xs uppercase">Вірно</p>
                      <p className="mt-1 text-lg" id="result-correct-count">{correctCount}</p>
                    </div>
                    <div className="border-x border-white/10">
                      <p className="text-white/75 text-3xs uppercase">Помилок</p>
                      <p className="mt-1 text-lg" id="result-errors-count">{errorsCount}</p>
                    </div>
                    <div>
                      <p className="text-white/75 text-3xs uppercase">Успішність</p>
                      <p className="mt-1 text-lg" id="result-percentage">{successPercentage}%</p>
                    </div>
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      onClick={() => startTest(activeSession.mode)}
                      className="rounded-xl bg-white text-slate-900 hover:bg-slate-50 px-5 py-2.5 text-xs font-bold shadow-md cursor-pointer inline-flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Скласти знову
                    </button>
                    <button
                      onClick={() => setActiveSession(null)}
                      className="rounded-xl border border-white/20 hover:bg-white/10 text-white px-5 py-2.5 text-xs font-bold cursor-pointer transition-colors"
                    >
                      Інші тести
                    </button>
                  </div>
                </div>
              </div>

              {/* Analytics & Custom Recommendations Panel */}
              <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-6" id="test-diagnostics-card">
                <div className="border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                      <Award className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-base font-bold text-slate-900">Аналітика результатів & Персональні рекомендації</h3>
                      <p className="text-4xs text-slate-400 uppercase tracking-widest mt-0.5 font-mono">Глибока діагностика вашого теоретичного рівня</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Preparation Level Assessment */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Оцінка рівня підготовки:</h4>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-bold text-xs uppercase tracking-wide leading-none ${prepLevelColor}`}>
                      <Flame className="h-4 w-4" />
                      Рівень: {prepLevel}
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                        <Zap className="h-4 w-4 text-amber-500" />
                        Прогноз готовності до іспиту у СЦ МВС:
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {examForecast}
                      </p>
                    </div>
                  </div>

                  {/* Weak topics list or positive reassurance */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Виявлені слабкі теми та помилки:</h4>
                    {weakTopics.length === 0 ? (
                      <div className="rounded-2xl bg-emerald-50/50 border border-emerald-100 p-4 text-center space-y-2 animate-fade-in">
                        <p className="text-xs font-semibold text-emerald-950">🎉 Жодної слабкої теми не виявлено!</p>
                        <p className="text-xs text-slate-500 leading-normal">
                          Ви продемонстрували ідеальне знання всіх представлених тем у поточному заліку. Так тримати!
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {weakTopics.map((topic) => (
                          <div key={topic.id} className="rounded-xl border border-slate-100 bg-slate-50/50 p-3.5 space-y-2.5 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-bold text-slate-900 truncate max-w-[180px]" title={topic.title}>
                                {topic.title}
                              </span>
                              <span className="inline-flex shrink-0 items-center rounded-md bg-rose-50 px-2 py-0.5 text-4xs font-bold text-rose-700">
                                {topic.mistakes} {topic.mistakes === 1 ? 'помилка' : topic.mistakes < 5 ? 'помилки' : 'помилок'}
                              </span>
                            </div>

                            <p className="text-xs text-slate-500 leading-normal">
                              Рекомендовано додатково вирішити <strong className="font-bold text-slate-800">{topic.suggestedQuestions} питань</strong> з даного розділу для надійного засвоєння.
                            </p>

                            <button
                              onClick={() => setActiveTab('topics')}
                              className="w-full inline-flex items-center justify-center gap-1 bg-white hover:bg-indigo-50/50 hover:text-indigo-700 text-slate-700 border border-slate-200 hover:border-indigo-200 transition-colors py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                            >
                              <BookOpen className="h-3.5 w-3.5" />
                              Читати теорію теми
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Error review breakdown cards */}
              <div className="space-y-4" id="review-mistakes-scroller">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-400">
                  Детальний огляд відповідей та помилок:
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  {activeSession.questions.map((q, qIndex) => {
                    const chosen = activeSession.userAnswers[q.id];
                    const isRight = chosen === q.correctAnswer;

                    return (
                      <div 
                        key={q.id}
                        className={`rounded-2xl border p-5 bg-white shadow-3xs transition-all ${
                          isRight ? 'border-slate-100' : 'border-rose-100 bg-rose-50/10'
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-50 pb-3 mb-3">
                          <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-0.5 text-4xs font-bold text-slate-600 uppercase tracking-wide">
                            Питання {qIndex + 1}
                          </span>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => onToggleBookmark(q.id)}
                              id={`bookmark-toggle-result-${q.id}`}
                              className="inline-flex items-center justify-center p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-yellow-600 cursor-pointer transition-colors border border-slate-100"
                              title={bookmarkedQuestionIds.includes(q.id) ? "Видалити з обраного" : "Зберегти в обране"}
                            >
                              <Bookmark className={`h-3.5 w-3.5 ${bookmarkedQuestionIds.includes(q.id) ? 'fill-yellow-400 text-yellow-500' : 'text-slate-400'}`} />
                            </button>
                            
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-4xs font-bold uppercase ${
                              isRight ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                              {isRight ? 'Правильно ✓' : 'Помилка ✗'}
                            </span>
                          </div>
                        </div>

                        {/* Image inside error review card */}
                        {q.image && (
                          <div className="mb-4 overflow-hidden rounded-xl border border-slate-100 max-h-40 w-full sm:w-auto">
                            <img 
                              src={q.image} 
                              alt="ілюстрація" 
                              className="h-full w-full object-cover max-h-40" 
                              referrerPolicy="no-referrer"
                            />
                          </div>
                        )}

                        <p className="text-xs font-semibold text-slate-900 leading-snug">{q.question}</p>

                        {/* List option markers */}
                        <div className="mt-4 space-y-2">
                          {q.answers.map((answer, ansIdx) => {
                            const isCorrectAns = ansIdx === q.correctAnswer;
                            const isUserSelection = ansIdx === chosen;

                            let optStyle = 'border-slate-100 bg-white text-slate-600';
                            if (isCorrectAns) {
                              optStyle = 'border-emerald-200 bg-emerald-50 text-emerald-950 font-semibold';
                            } else if (isUserSelection) {
                              optStyle = 'border-rose-200 bg-rose-50 text-rose-950 font-semibold';
                            }

                            return (
                              <div 
                                key={ansIdx}
                                className={`rounded-xl border p-3 text-xs flex items-start gap-2.5 ${optStyle}`}
                              >
                                <span className="font-mono text-xs font-semibold">
                                  {['A', 'B', 'C', 'D'][ansIdx]}.
                                </span>
                                <div>
                                  <p>{answer}</p>
                                  {isCorrectAns && (
                                    <span className="text-5xs uppercase tracking-wider text-emerald-600 font-bold block mt-0.5">Відповідно до ПДР</span>
                                  )}
                                  {isUserSelection && !isRight && (
                                    <span className="text-5xs uppercase tracking-wider text-rose-600 font-bold block mt-0.5">Ваш вибір</span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Commentary */}
                        <div className="mt-4 rounded-xl bg-blue-50/40 border border-blue-100/50 p-3.5 text-xs text-blue-900">
                          <p className="font-semibold text-3xs uppercase tracking-wider text-blue-700">Офіційний коментар ПДР України:</p>
                          <p className="mt-1 leading-relaxed text-slate-600 font-normal">{q.explanation}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          ) : (
            /* Active question workspace */
            <div className="rounded-2xl border border-slate-100 bg-white p-5 sm:p-8 shadow-sm space-y-6" id="active-question-card">
              {/* Image box */}
              {activeSession.questions[activeSession.currentQuestionIndex].image && (
                <div className="overflow-hidden rounded-2xl border border-slate-100 max-h-56 shadow-sm">
                  <img 
                    src={activeSession.questions[activeSession.currentQuestionIndex].image || ''} 
                    alt="Автошкола Ситуація ПДР" 
                    className="w-full object-cover h-56 transition-transform duration-300 hover:scale-[1.01]" 
                    referrerPolicy="no-referrer"
                  />
                </div>
              )}

              {/* Question description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-5xs font-bold uppercase tracking-widest text-slate-400 font-mono">
                    Завдання {activeSession.currentQuestionIndex + 1}
                  </span>
                  <button
                    onClick={() => onToggleBookmark(activeSession.questions[activeSession.currentQuestionIndex].id)}
                    id={`bookmark-toggle-btn-${activeSession.questions[activeSession.currentQuestionIndex].id}`}
                    className="inline-flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 hover:text-blue-600 px-3 py-1.5 rounded-lg text-4xs font-bold font-mono transition-all uppercase tracking-wide cursor-pointer border border-slate-100"
                  >
                    <Bookmark className={`h-3.5 w-3.5 ${bookmarkedQuestionIds.includes(activeSession.questions[activeSession.currentQuestionIndex].id) ? 'fill-yellow-400 text-yellow-500' : 'text-slate-400'}`} />
                    <span>{bookmarkedQuestionIds.includes(activeSession.questions[activeSession.currentQuestionIndex].id) ? 'Збережено' : 'В обране'}</span>
                  </button>
                </div>
                <h2 className="text-base font-extrabold leading-snug text-slate-900 sm:text-lg">
                  {activeSession.questions[activeSession.currentQuestionIndex].question}
                </h2>
              </div>

              {/* Options selection */}
              <div className="space-y-3" id="active-question-answers-list">
                {activeSession.questions[activeSession.currentQuestionIndex].answers.map((answer, ansIndex) => {
                  const qId = activeSession.questions[activeSession.currentQuestionIndex].id;
                  const selectedAnswerIdx = activeSession.userAnswers[qId];
                  const hasSelected = selectedAnswerIdx !== undefined;

                  const isSelected = selectedAnswerIdx === ansIndex;
                  const isCorrect = ansIndex === activeSession.questions[activeSession.currentQuestionIndex].correctAnswer;

                  let optionStyle = 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300';
                  
                  if (hasSelected) {
                    if (isCorrect) {
                      optionStyle = 'border-emerald-500 bg-emerald-50/70 text-emerald-950 font-bold ring-1 ring-emerald-300';
                    } else if (isSelected) {
                      optionStyle = 'border-rose-500 bg-rose-50/70 text-rose-950 font-bold ring-1 ring-rose-300';
                    } else {
                      optionStyle = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60 pointer-events-none';
                    }
                  }

                  return (
                    <button
                      key={ansIndex}
                      disabled={hasSelected}
                      onClick={() => handleSelectAnswer(qId, ansIndex)}
                      className={`w-full rounded-2xl border p-4.5 text-left text-xs transition-all flex items-center justify-between ${optionStyle} ${!hasSelected ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="font-mono text-xs font-extrabold text-blue-600 self-center shrink-0">
                          {['A', 'B', 'C', 'D'][ansIndex]}.
                        </span>
                        <p className="leading-relaxed text-xs">{answer}</p>
                      </div>

                      {hasSelected && isCorrect && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 ml-2" />
                      )}
                      {hasSelected && isSelected && !isCorrect && (
                        <XCircle className="h-5 w-5 text-rose-600 shrink-0 ml-2" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Instant feedback explanation panel */}
              {activeSession.userAnswers[activeSession.questions[activeSession.currentQuestionIndex].id] !== undefined && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-blue-100 bg-blue-50/50 p-5 leading-normal"
                >
                  <div className="flex items-center gap-2 text-blue-900 font-bold text-3xs uppercase tracking-wider mb-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    Офіційний коментар до відповіді ПДР:
                  </div>
                  <p className="text-xs text-slate-600">
                    {activeSession.questions[activeSession.currentQuestionIndex].explanation}
                  </p>
                </motion.div>
              )}

              {/* Navigation bars */}
              <div className="border-t border-slate-100 pt-5 flex items-center justify-between">
                <button
                  disabled={activeSession.currentQuestionIndex === 0}
                  onClick={handlePrev}
                  className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-900 disabled:opacity-40 disabled:pointer-events-none inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" /> Назад
                </button>

                <button
                  onClick={handleNext}
                  disabled={activeSession.userAnswers[activeSession.questions[activeSession.currentQuestionIndex].id] === undefined}
                  id="active-question-next-btn"
                  className="rounded-xl bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 text-xs font-bold cursor-pointer shadow-md inline-flex items-center gap-1.5 disabled:opacity-50 disabled:pointer-events-none transition-all"
                >
                  {activeSession.currentQuestionIndex === activeSession.questions.length - 1 ? (
                    <>
                      Завершити тест
                      <Check className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Далі
                      <ChevronRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
