import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  UserRound,
  Paintbrush,
  TrafficCone,
  RotateCcw,
  Trophy,
} from 'lucide-react';
import {
  TrafficLightsGallery,
  RegulatorGestureSection,
  REGULATOR_GESTURE_GROUPS,
  RoadMarking,
  MiniQuiz,
  loadVisualLessonsProgress,
  saveVisualLessonsProgress,
  type QuizQuestion,
} from './visual';
import { ROAD_MARKINGS } from '../data/roadMarkingsData';
import { SignGallery } from './visual/signs/SignGallery';
import { TRAFFIC_SIGN_CATALOG } from '../data/trafficSignsCatalog';

type TabId = 'signs' | 'regulator' | 'markings' | 'lights';

const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: 'signs', label: `Всі знаки (${TRAFFIC_SIGN_CATALOG.length})`, emoji: '📋' },
  { id: 'regulator', label: 'Регулювальник', emoji: '👮' },
  { id: 'markings', label: 'Розмітка', emoji: '🛣️' },
  { id: 'lights', label: 'Світлофори', emoji: '🚦' },
];

const SIGNS_QUIZ: QuizQuestion[] = [
  {
    id: 'signs-q1',
    section: 'Знаки',
    question: "Який знак забороняє в'їзд на дорогу?",
    options: ['STOP', "В'їзд заборонено (червоне коло з смугою)", 'Дати дорогу'],
    correctIndex: 1,
    explanation: "Знак «В'їзд заборонено» (3.1) — круглий червоний знак з білою горизонтальною смугою.",
  },
  {
    id: 'signs-q2',
    section: 'Знаки',
    question: 'Обмеження швидкості 20 км/год зазвичай діє в:',
    options: ['На автомагістралі', 'У житлових та пішохідних зонах', 'Поза населеним пунктом'],
    correctIndex: 1,
    explanation: 'У житлових і пішохідних зонах максимальна швидкість — 20 км/год.',
  },
  {
    id: 'signs-q3',
    section: 'Знаки',
    question: 'Що означає знак STOP?',
    options: ['Зупинитися лише якщо є інші авто', 'Повна зупинка перед стоп-лінією', 'Зменшити швидкість до 20 км/год'],
    correctIndex: 1,
    explanation: "STOP вимагає обов'язкової повної зупинки перед перехрестям.",
  },
];

const REGULATOR_QUIZ: QuizQuestion[] = [
  {
    id: 'reg-q1',
    section: 'Регулювальник',
    question: 'Регулювальник підняв руку вгору. Що робити?',
    options: ['Їхати обережно прямо', 'Зупинитися — рух заборонено', 'Поворот лише праворуч'],
    correctIndex: 1,
    explanation: 'Піднята рука означає заборону руху в усіх напрямках.',
  },
  {
    id: 'reg-q2',
    section: 'Регулювальник',
    question: 'Руки регулювальника витягнуті в сторони. З його правого боку дозволено:',
    options: ['Лише ліворуч', 'Прямо та праворуч', 'Рух заборонено'],
    correctIndex: 1,
    explanation: 'При жесті «руки в сторони» з правого боку регулювальника дозволено рух прямо та праворuch.',
  },
  {
    id: 'reg-q3',
    section: 'Регулювальник',
    question: 'Права рука регулювальника витягнута вперед. Який рух дозволено трамваю з лівого боку?',
    options: ['Прямо та праворuch', 'Лише лівoruch', 'У всіх напрямках', 'Заборонено'],
    correctIndex: 1,
    explanation: 'Згідно з п. 8.8 (б) ПДР, з лівого боку трамваю дозволено рух лише лівoruch («з рукава в рукав»).',
  },
];

const MARKINGS_QUIZ: QuizQuestion[] = [
  {
    id: 'mark-q1',
    section: 'Розмітка',
    question: 'Чи можна перетинати суцільну лінію розмітки 1.1?',
    options: [
      'Так, у будь-який час для обгону',
      'Загалом заборонено, але є винятки (повільне ТЗ, перешкода)',
      'Так, якщо немає зустрічного транспорту',
    ],
    correctIndex: 1,
    explanation:
      'Лінію 1.1 заборонено перетинати, окрім винятків розділу 34 та п. 14.6: обгону одиночного ТЗ (<30 км/год), об\'їзду нерухомих перешкод та коли розмітка дозволяє перетин з одного боку.',
  },
  {
    id: 'mark-q2',
    section: 'Розмітка',
    question: 'Переривчаста лінія дозволяє:',
    options: ['Лише зупинку', 'Перетин для обгону та зміни смуги', 'Рух лише в одному напрямку'],
    correctIndex: 1,
    explanation: 'Переривчасту лінію можна перетинати для маневрування, якщо це безпечно.',
  },
  {
    id: 'mark-q3',
    section: 'Розмітка',
    question: 'Подвійна суцільна лінія означає:',
    options: ['Можна обганяти', 'Перетин заборонено з обох боків', 'Дозволено лише вночі'],
    correctIndex: 1,
    explanation: 'Подвійна суцільна лінія забороняє перетин з обох напрямків руху.',
  },
];

const LIGHTS_QUIZ: QuizQuestion[] = [
  {
    id: 'light-q1',
    section: 'Світлофори',
    question: 'Червоний сигнал світлофора означає:',
    options: ['Обережно їхати', 'Стоп — рух заборонено', 'Підготуватися до руху'],
    correctIndex: 1,
    explanation: 'Червоний сигнал забороняє рух.',
  },
  {
    id: 'light-q2',
    section: 'Світлофори',
    question: 'Зелена стрілка при червоному основному сигналі означає:',
    options: ['Можна їхати у всіх напрямках', 'Рух лише у напрямку стрілки, поступившись іншим', 'Стоп'],
    correctIndex: 1,
    explanation: 'Додаткова зелена стрілка при червоному дозволяє рух у напрямку стрілки з обов\'язковим поступленням.',
  },
  {
    id: 'light-q3',
    section: 'Світлофори',
    question: 'Червоний Х на реверсивному світлофорі означає:',
    options: ['Можна їхати обережно', 'Рух смугою заборонено', 'Увімкнеться зелений'],
    correctIndex: 1,
    explanation: 'Червоний Х забороняє рух реверсивною смугою.',
  },
];

const ALL_QUIZ_QUESTIONS = [...SIGNS_QUIZ, ...REGULATOR_QUIZ, ...MARKINGS_QUIZ, ...LIGHTS_QUIZ];

function CombinedTest({
  questions,
  onClose,
}: {
  questions: QuizQuestion[];
  onClose: () => void;
}) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const results = useMemo(() => {
    if (!submitted) return null;
    const wrong = questions.filter((q) => answers[q.id] !== q.correctIndex);
    const correct = questions.length - wrong.length;
    const percent = Math.round((correct / questions.length) * 100);
    return { wrong, correct, percent };
  }, [submitted, answers, questions]);

  const allAnswered = questions.every((q) => answers[q.id] !== undefined);

  const handleClose = () => {
    setAnswers({});
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="mt-6 rounded-2xl border-2 border-blue-200 bg-blue-50/30 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Загальний тест ({questions.length} питань)
        </h4>
        <button type="button" onClick={handleClose} className="text-4xs font-bold text-slate-500 hover:text-slate-700">
          Закрити
        </button>
      </div>

      {!submitted ? (
        <>
          <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
            {questions.map((q, qIdx) => (
              <div key={q.id}>
                <p className="text-4xs font-bold text-blue-600 uppercase mb-1">{q.section}</p>
                <p className="text-sm font-semibold text-slate-800 mb-2">
                  {qIdx + 1}. {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((option, optIdx) => (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelect(q.id, optIdx)}
                      className={`w-full rounded-xl border p-3 text-left text-xs transition-all ${
                        answers[q.id] === optIdx
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            disabled={!allAnswered}
            onClick={() => setSubmitted(true)}
            className="mt-5 w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            Перевірити відповіді
          </button>
        </>
      ) : (
        results && (
          <div className="text-center">
            <p className="text-4xl font-bold text-slate-900">{results.percent}%</p>
            <p className="mt-1 text-sm text-slate-600">
              Правильно: {results.correct} з {questions.length}
            </p>
            {results.wrong.length > 0 && (
              <div className="mt-4 text-left rounded-xl bg-white border border-slate-100 p-4">
                <p className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1">
                  <RotateCcw className="h-3.5 w-3.5" />
                  Повторіть помилки:
                </p>
                <ul className="space-y-2">
                  {results.wrong.map((q) => (
                    <li key={q.id} className="text-4xs text-slate-600 leading-relaxed">
                      <span className="font-semibold text-slate-800">{q.section}:</span> {q.explanation}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}

export default function TrafficLessons({ standalone = false }: { standalone?: boolean }) {
  const [activeTab, setActiveTab] = useState<TabId>('signs');
  const [showCombinedTest, setShowCombinedTest] = useState(false);
  const [combinedTestKey, setCombinedTestKey] = useState(0);
  const [progress, setProgress] = useState(loadVisualLessonsProgress);

  useEffect(() => {
    saveVisualLessonsProgress(progress);
  }, [progress]);

  const { answers, submitted, miniQuizScore } = progress;

  const handleMiniAnswer = (questionId: string, optionIndex: number, isCorrect: boolean) => {
    setProgress((prev) => {
      if (prev.submitted[questionId]) return prev;
      return {
        answers: { ...prev.answers, [questionId]: optionIndex },
        submitted: { ...prev.submitted, [questionId]: true },
        miniQuizScore: {
          correct: prev.miniQuizScore.correct + (isCorrect ? 1 : 0),
          total: prev.miniQuizScore.total + 1,
        },
      };
    });
  };

  return (
    <section className={`space-y-6 ${standalone ? '' : 'mt-10'}`} id="traffic-lessons">
      <div className={standalone ? '' : 'border-t border-slate-200 pt-8'}>
        <h2 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">Візуальне навчання ПДР</h2>
        <p className="mt-1.5 text-sm text-slate-500">
          {TRAFFIC_SIGN_CATALOG.length} знаків (ДСТУ 4100), регулювальник (п. 8.7.3), {ROAD_MARKINGS.length} типів
          розмітки та 5 інтерактивних світлофорів.
        </p>
      </div>

      <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 custom-scrollbar">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`shrink-0 rounded-xl px-3 py-2 text-xs font-bold transition-all sm:px-4 sm:py-2.5 sm:text-sm ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.emoji} {tab.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => {
            setCombinedTestKey((k) => k + 1);
            setShowCombinedTest(true);
            setActiveTab('signs');
          }}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 transition-colors"
        >
          <Trophy className="h-4 w-4" />
          ПРОЙТИ ВСІ ТЕСТИ
        </button>
        {miniQuizScore.total > 0 && (
          <p className="text-4xs sm:text-xs text-slate-500">
            Міні-тести: {Math.round((miniQuizScore.correct / miniQuizScore.total) * 100)}% (
            {miniQuizScore.correct}/{miniQuizScore.total})
          </p>
        )}
      </div>

      {showCombinedTest && (
        <CombinedTest
          key={combinedTestKey}
          questions={ALL_QUIZ_QUESTIONS}
          onClose={() => setShowCombinedTest(false)}
        />
      )}

      {activeTab === 'signs' && (
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h3 className="font-display text-lg font-bold text-slate-900">
              Галерея дорожніх знаків ({TRAFFIC_SIGN_CATALOG.length})
            </h3>
          </div>
          <SignGallery />
          <MiniQuiz
            blockId="signs"
            title="Дорожні знаки"
            questions={SIGNS_QUIZ}
            answers={answers}
            submitted={submitted}
            onAnswer={handleMiniAnswer}
          />
        </div>
      )}

      {activeTab === 'regulator' && (
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-2">
            <UserRound className="h-5 w-5 text-indigo-600" />
            <h3 className="font-display text-lg font-bold text-slate-900">Регулювальник</h3>
          </div>
          <div className="space-y-8">
            {REGULATOR_GESTURE_GROUPS.map((group) => (
              <RegulatorGestureSection key={group.id} group={group} />
            ))}
          </div>
          <MiniQuiz
            blockId="regulator"
            title="Регулювальник"
            questions={REGULATOR_QUIZ}
            answers={answers}
            submitted={submitted}
            onAnswer={handleMiniAnswer}
          />
        </div>
      )}

      {activeTab === 'markings' && (
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-2">
            <Paintbrush className="h-5 w-5 text-slate-600" />
            <h3 className="font-display text-lg font-bold text-slate-900">Дорожня розмітка</h3>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ROAD_MARKINGS.map((marking) => (
              <RoadMarking key={marking.code} entry={marking} />
            ))}
          </div>
          <MiniQuiz
            blockId="markings"
            title="Дорожня розмітка"
            questions={MARKINGS_QUIZ}
            answers={answers}
            submitted={submitted}
            onAnswer={handleMiniAnswer}
          />
        </div>
      )}

      {activeTab === 'lights' && (
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-2">
            <TrafficCone className="h-5 w-5 text-red-600" />
            <h3 className="font-display text-lg font-bold text-slate-900">Світлофори</h3>
          </div>
          <TrafficLightsGallery />
          <MiniQuiz
            blockId="lights"
            title="Світлофори"
            questions={LIGHTS_QUIZ}
            answers={answers}
            submitted={submitted}
            onAnswer={handleMiniAnswer}
          />
        </div>
      )}
    </section>
  );
}
