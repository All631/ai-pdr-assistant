import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  BookOpen,
  UserRound,
  Paintbrush,
  TrafficCone,
  RotateCcw,
  Trophy,
} from 'lucide-react';
import {
  NoEntrySign,
  NoOvertakingSign,
  NoLeftTurnSign,
  NoUTurnSign,
  SpeedLimitSign,
  WarningSign,
  StopSign,
  GiveWaySign,
  MainRoadSign,
  PedestrianCrossingSign,
  ChildrenSign,
  ParkingSign,
} from './signs';

type TabId = 'signs' | 'regulator' | 'markings' | 'lights';

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  section: string;
}

interface SignEntry {
  sign: React.ReactNode;
  name: string;
  description: string;
  category: string;
}

const TABS: { id: TabId; label: string; emoji: string }[] = [
  { id: 'signs', label: 'Всі знаки (35+)', emoji: '📋' },
  { id: 'regulator', label: 'Регулювальник', emoji: '👮' },
  { id: 'markings', label: 'Розмітка', emoji: '🛣️' },
  { id: 'lights', label: 'Світлофори', emoji: '🚦' },
];

const SIGN_GRID = 'grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5';

function buildSignCatalog(): SignEntry[] {
  const limits = [20, 30, 40, 50, 60, 70, 90, 110];
  const speedSigns: SignEntry[] = limits.map((limit) => ({
    sign: <SpeedLimitSign limit={limit} size={52} />,
    name: `Швидкість ${limit}`,
    description: `Обмеження максимальної швидкості ${limit} км/год`,
    category: 'Заборонні',
  }));

  return [
    {
      sign: <NoEntrySign size={52} />,
      name: "В'їзд заборонено",
      description: "Забороняє в'їзд усіх транспортних засобів",
      category: 'Заборонні',
    },
    {
      sign: <NoOvertakingSign size={52} />,
      name: 'Обгін заборонено',
      description: 'Забороняє обгін інших транспортних засобів',
      category: 'Заборонні',
    },
    {
      sign: <NoLeftTurnSign size={52} />,
      name: 'Поворот ліворуч заборонено',
      description: 'Забороняє поворот ліворуч на перехресті',
      category: 'Заборонні',
    },
    {
      sign: <NoUTurnSign size={52} />,
      name: 'Розворот заборонено',
      description: 'Забороняє розворот на 180°',
      category: 'Заборонні',
    },
    ...speedSigns,
    {
      sign: <WarningSign size={52} label="↷" />,
      name: 'Небезпечний поворот',
      description: 'Попереджає про різкий поворот',
      category: 'Попереджувальні',
    },
    {
      sign: <WarningSign size={52} label="✕" />,
      name: 'Перехрестя',
      description: 'Попереджає про перехрестя',
      category: 'Попереджувальні',
    },
    {
      sign: <WarningSign size={52} label="!" />,
      name: 'Небезпека',
      description: 'Загальне попередження про небезпеку',
      category: 'Попереджувальні',
    },
    {
      sign: <PedestrianCrossingSign size={52} />,
      name: 'Пішохідний перехід',
      description: 'Попереджає про наближення до переходу',
      category: 'Попереджувальні',
    },
    {
      sign: <ChildrenSign size={52} />,
      name: 'Діти',
      description: 'Можливий вихід дітей на дорогу',
      category: 'Попереджувальні',
    },
    {
      sign: <WarningSign size={52} label="~" />,
      name: 'Крутий спуск',
      description: 'Попереджає про крутий спуск',
      category: 'Попереджувальні',
    },
    {
      sign: <WarningSign size={52} label="⛰" />,
      name: 'Крутий підйом',
      description: 'Попереджає про крутий підйом',
      category: 'Попереджувальні',
    },
    {
      sign: <WarningSign size={52} label="🦌" />,
      name: 'Дикі тварини',
      description: 'Можливий вихід тварин на дорогу',
      category: 'Попереджувальні',
    },
    {
      sign: <WarningSign size={52} label="🚧" />,
      name: 'Дорожні роботи',
      description: 'Попереджає про ремонт дороги',
      category: 'Попереджувальні',
    },
    {
      sign: <WarningSign size={52} label="❄" />,
      name: 'Слизька дорога',
      description: 'Попереджає про слизьке покриття',
      category: 'Попереджувальні',
    },
    {
      sign: <StopSign size={52} />,
      name: 'STOP',
      description: 'Повна зупинка перед перехрестям',
      category: 'Пріоритет',
    },
    {
      sign: <GiveWaySign size={52} />,
      name: 'Дати дорогу',
      description: 'Поступитися дорогою на перехресті',
      category: 'Пріоритет',
    },
    {
      sign: <MainRoadSign size={52} />,
      name: 'Головна дорога',
      description: 'Ви рухаєтесь головною дорогою',
      category: 'Пріоритет',
    },
    {
      sign: <WarningSign size={52} label="▬" />,
      name: 'Кінець головної',
      description: 'Закінчення головної дороги',
      category: 'Пріоритет',
    },
    {
      sign: <GiveWaySign size={52} />,
      name: 'Поступись зустрічному',
      description: 'Вузька дорога — дати дорогу зустрічному',
      category: 'Пріоритет',
    },
    {
      sign: <ParkingSign size={52} />,
      name: 'Парковка',
      description: 'Місце для стоянки транспортних засобів',
      category: 'Інформаційні',
    },
    {
      sign: <WarningSign size={52} label="H" />,
      name: 'Лікарня',
      description: 'Наближення до медичного закладу',
      category: 'Інформаційні',
    },
    {
      sign: <WarningSign size={52} label="⛽" />,
      name: 'АЗС',
      description: 'Паливна станція поблизу',
      category: 'Інформаційні',
    },
    {
      sign: <WarningSign size={52} label="🍽" />,
      name: 'Місце відпочинку',
      description: 'Зона відпочинку для водіїв',
      category: 'Інформаційні',
    },
    {
      sign: <WarningSign size={52} label="→" />,
      name: 'Напрямок руху',
      description: 'Вказує дозволений напрямок',
      category: 'Інформаційні',
    },
    {
      sign: <WarningSign size={52} label="⟳" />,
      name: 'Круговий рух',
      description: 'Попереджає про кругове перехрестя',
      category: 'Наказові',
    },
    {
      sign: <WarningSign size={52} label="↑" />,
      name: 'Рух прямо',
      description: 'Дозволено рух лише прямо',
      category: 'Наказові',
    },
    {
      sign: <WarningSign size={52} label="↱" />,
      name: 'Поворот праворуч',
      description: 'Дозволено поворот праворуч',
      category: 'Наказові',
    },
    {
      sign: <WarningSign size={52} label="🚌" />,
      name: 'Смуга для автобусів',
      description: 'Виділена смуга громадського транспорту',
      category: 'Наказові',
    },
    {
      sign: <WarningSign size={52} label="🚲" />,
      name: 'Велосипедна доріжка',
      description: 'Доріжка для велосипедистів',
      category: 'Наказові',
    },
    {
      sign: <NoEntrySign size={52} />,
      name: 'Стоянка заборонена',
      description: 'Забороняє зупинку та стоянку',
      category: 'Заборонні',
    },
    {
      sign: <SpeedLimitSign limit={130} size={52} />,
      name: 'Швидкість 130',
      description: 'Ліміт на автомагістралі',
      category: 'Заборонні',
    },
  ];
}

const SIGN_CATALOG = buildSignCatalog();

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
    explanation: 'При жесті «руки в сторони» з правого боку регулювальника дозволено рух прямо та праворуч.',
  },
];

const MARKINGS_QUIZ: QuizQuestion[] = [
  {
    id: 'mark-q1',
    section: 'Розмітка',
    question: 'Чи можна перетинати суцільну лінію розмітки 1.1?',
    options: ['Так, для обгону', 'Ні, перетинати заборонено', 'Так, якщо немає зустрічного транспорту'],
    correctIndex: 1,
    explanation: 'Суцільна лінія 1.1 перетинати категорично заборонено.',
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
    question: 'Червоний + жовтий сигнал означає:',
    options: ['Стоп', 'Приготуватися — скоро зелений', 'Можна їхати'],
    correctIndex: 1,
    explanation: 'Комбінація червоного та жовтого попереджає про увімкнення зеленого.',
  },
  {
    id: 'light-q3',
    section: 'Світлофори',
    question: 'Жовтий сигнал (без червоного) означає:',
    options: ['Можна прискоритися', 'Стоп, якщо можна безпечно зупинитись', 'Зелена зона для пішоходів'],
    correctIndex: 1,
    explanation: 'Жовтий забороняє рух, крім випадків, коли зупинка неможлива без екстреного гальмування.',
  },
];

const ALL_QUIZ_QUESTIONS = [...SIGNS_QUIZ, ...REGULATOR_QUIZ, ...MARKINGS_QUIZ, ...LIGHTS_QUIZ];

interface MiniQuizProps {
  blockId: string;
  title: string;
  questions: QuizQuestion[];
  onAnswer?: (questionId: string, optionIndex: number, isCorrect: boolean) => void;
}

function MiniQuiz({ blockId, title, questions, onAnswer }: MiniQuizProps) {
  const [answers, setAnswers] = useState<Record<string, number | null>>({});
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({});

  const handleSelect = (questionId: string, optionIndex: number, correctIndex: number) => {
    if (submitted[questionId]) return;
    setAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
    setSubmitted((prev) => ({ ...prev, [questionId]: true }));
    onAnswer?.(questionId, optionIndex, optionIndex === correctIndex);
  };

  return (
    <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 sm:p-5">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4">
        Міні-тест: {title}
      </h4>
      <div className="space-y-5">
        {questions.map((q, qIdx) => {
          const selected = answers[q.id];
          const isDone = submitted[q.id];

          return (
            <div key={q.id} id={`${blockId}-quiz-${qIdx}`}>
              <p className="text-sm font-semibold text-slate-800 mb-2">
                {qIdx + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((option, optIdx) => {
                  const isCorrect = optIdx === q.correctIndex;
                  const isSelected = selected === optIdx;
                  let optionClass = 'border-slate-200 bg-white text-slate-700';

                  if (isDone && isCorrect) {
                    optionClass = 'border-emerald-300 bg-emerald-50 text-emerald-900';
                  } else if (isDone && isSelected && !isCorrect) {
                    optionClass = 'border-rose-300 bg-rose-50 text-rose-900';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={isDone}
                      onClick={() => handleSelect(q.id, optIdx, q.correctIndex)}
                      className={`w-full rounded-xl border p-3 text-left text-xs transition-all flex items-center justify-between gap-2 ${optionClass} ${!isDone ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default'}`}
                    >
                      <span className="leading-snug">{option}</span>
                      {isDone && isCorrect && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                      )}
                      {isDone && isSelected && !isCorrect && (
                        <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
              {isDone && (
                <p className="mt-2 text-4xs text-slate-500 leading-relaxed bg-white p-2.5 rounded-lg border border-slate-100">
                  {q.explanation}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SignCard({ sign, name, description }: { sign: React.ReactNode; name: string; description: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-3 sm:p-4 text-center shadow-sm">
      <div className="mb-2 sm:mb-3 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center">{sign}</div>
      <p className="text-4xs sm:text-xs font-bold text-slate-800 leading-tight">{name}</p>
      <p className="mt-1 text-4xs leading-relaxed text-slate-500 hidden sm:block">{description}</p>
    </div>
  );
}

function RegulatorGesture({
  variant,
  label,
  description,
}: {
  variant: 1 | 2 | 3;
  label: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 text-center shadow-sm">
      <svg viewBox="0 0 120 140" className="mx-auto h-28 w-24 sm:h-32 sm:w-28" role="img" aria-label={label}>
        <circle cx="60" cy="22" r="12" fill="#fde68a" stroke="#1e293b" strokeWidth="2" />
        <rect x="52" y="34" width="16" height="30" rx="4" fill="#3b82f6" />
        {variant === 1 && (
          <>
            <rect x="44" y="38" width="10" height="28" rx="3" fill="#fde68a" stroke="#1e293b" strokeWidth="1.5" transform="rotate(-30 49 52)" />
            <rect x="66" y="38" width="10" height="28" rx="3" fill="#fde68a" stroke="#1e293b" strokeWidth="1.5" transform="rotate(30 71 52)" />
          </>
        )}
        {variant === 2 && (
          <>
            <rect x="18" y="48" width="36" height="10" rx="3" fill="#fde68a" stroke="#1e293b" strokeWidth="1.5" />
            <rect x="66" y="48" width="36" height="10" rx="3" fill="#fde68a" stroke="#1e293b" strokeWidth="1.5" />
          </>
        )}
        {variant === 3 && (
          <>
            <rect x="66" y="48" width="36" height="10" rx="3" fill="#fde68a" stroke="#1e293b" strokeWidth="1.5" />
            <rect x="44" y="38" width="10" height="28" rx="3" fill="#fde68a" stroke="#1e293b" strokeWidth="1.5" transform="rotate(-20 49 52)" />
          </>
        )}
        <rect x="48" y="64" width="10" height="40" rx="3" fill="#1e293b" />
        <rect x="62" y="64" width="10" height="40" rx="3" fill="#1e293b" />
        <rect x="40" y="100" width="40" height="8" rx="2" fill="#64748b" />
      </svg>
      <p className="mt-3 text-sm font-bold text-slate-900">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{description}</p>
    </div>
  );
}

function RoadMarking({
  type,
  label,
  rule,
}: {
  type: 'solid' | 'dashed' | 'double';
  label: string;
  rule: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 shadow-sm">
      <svg viewBox="0 0 280 60" className="w-full h-14 mb-3" role="img" aria-label={label}>
        <rect x="0" y="0" width="280" height="60" fill="#334155" rx="4" />
        {type === 'solid' && <line x1="140" y1="8" x2="140" y2="52" stroke="white" strokeWidth="6" />}
        {type === 'dashed' && (
          <>
            <line x1="140" y1="8" x2="140" y2="20" stroke="white" strokeWidth="6" />
            <line x1="140" y1="28" x2="140" y2="40" stroke="white" strokeWidth="6" />
            <line x1="140" y1="48" x2="140" y2="52" stroke="white" strokeWidth="6" />
          </>
        )}
        {type === 'double' && (
          <>
            <line x1="132" y1="8" x2="132" y2="52" stroke="white" strokeWidth="5" />
            <line x1="148" y1="8" x2="148" y2="52" stroke="white" strokeWidth="5" />
          </>
        )}
      </svg>
      <p className="text-xs font-bold text-slate-800">{label}</p>
      <p className="mt-1 text-4xs leading-relaxed text-slate-500">{rule}</p>
    </div>
  );
}

function TrafficLightCard({
  redOn,
  yellowOn,
  greenOn,
  label,
  rule,
}: {
  redOn: boolean;
  yellowOn: boolean;
  greenOn: boolean;
  label: string;
  rule: string;
}) {
  const off = '#374151';
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 text-center shadow-sm">
      <svg viewBox="0 0 80 200" className="mx-auto h-40 w-16" role="img" aria-label={label}>
        <rect x="10" y="10" width="60" height="180" rx="8" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
        <circle cx="40" cy="45" r="18" fill={redOn ? '#dc2626' : off} />
        <circle cx="40" cy="100" r="18" fill={yellowOn ? '#eab308' : off} />
        <circle cx="40" cy="155" r="18" fill={greenOn ? '#16a34a' : off} />
      </svg>
      <p className="mt-3 text-sm font-bold text-slate-900">{label}</p>
      <p className="mt-1 text-xs leading-relaxed text-slate-500">{rule}</p>
    </div>
  );
}

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

  return (
    <div className="mt-6 rounded-2xl border-2 border-blue-200 bg-blue-50/30 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Загальний тест ({questions.length} питань)
        </h4>
        <button
          type="button"
          onClick={onClose}
          className="text-4xs font-bold text-slate-500 hover:text-slate-700"
        >
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
            {results.percent >= 80 ? (
              <p className="mt-3 text-sm font-medium text-emerald-700">
                Чудовий результат! Ви добре знаєте ПДР.
              </p>
            ) : results.percent >= 50 ? (
              <p className="mt-3 text-sm font-medium text-amber-700">
                Непогано, але варто повторити теми з помилками.
              </p>
            ) : (
              <p className="mt-3 text-sm font-medium text-rose-700">
                Рекомендуємо ще раз переглянути знаки, регулювальника та розмітку.
              </p>
            )}
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
            <button
              type="button"
              onClick={() => {
                setAnswers({});
                setSubmitted(false);
              }}
              className="mt-4 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
            >
              Пройти ще раз
            </button>
          </div>
        )
      )}
    </div>
  );
}

export default function TrafficLessons({ standalone = false }: { standalone?: boolean }) {
  const [activeTab, setActiveTab] = useState<TabId>('signs');
  const [showCombinedTest, setShowCombinedTest] = useState(false);
  const [miniQuizScore, setMiniQuizScore] = useState({ correct: 0, total: 0 });

  const signCategories = useMemo(() => {
    const map = new Map<string, SignEntry[]>();
    for (const entry of SIGN_CATALOG) {
      const list = map.get(entry.category) ?? [];
      list.push(entry);
      map.set(entry.category, list);
    }
    return map;
  }, []);

  const handleMiniAnswer = (_questionId: string, _optionIndex: number, isCorrect: boolean) => {
    setMiniQuizScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  return (
    <section className={`space-y-6 ${standalone ? '' : 'mt-10'}`} id="traffic-lessons">
      <div className={standalone ? '' : 'border-t border-slate-200 pt-8'}>
        <h2 className="font-display text-xl font-bold text-slate-900 sm:text-2xl">
          Візуальне навчання ПДР
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          {SIGN_CATALOG.length} знаків, регулювальник, розмітка та світлофори з міні-тестами.
        </p>
      </div>

      {/* Tabs */}
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

      {/* Pass all tests button */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={() => {
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
        <CombinedTest questions={ALL_QUIZ_QUESTIONS} onClose={() => setShowCombinedTest(false)} />
      )}

      {/* Signs tab */}
      {activeTab === 'signs' && (
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            <h3 className="font-display text-lg font-bold text-slate-900">
              Галерея дорожніх знаків ({SIGN_CATALOG.length})
            </h3>
          </div>

          <div className="space-y-8">
            {Array.from(signCategories.entries()).map(([category, signs]) => (
              <div key={category}>
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  {category}
                </h4>
                <div className={SIGN_GRID}>
                  {signs.map((entry) => (
                    <SignCard
                      key={entry.name}
                      sign={entry.sign}
                      name={entry.name}
                      description={entry.description}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <MiniQuiz
            blockId="signs"
            title="Дорожні знаки"
            questions={SIGNS_QUIZ}
            onAnswer={handleMiniAnswer}
          />
        </div>
      )}

      {/* Regulator tab */}
      {activeTab === 'regulator' && (
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-2">
            <UserRound className="h-5 w-5 text-indigo-600" />
            <h3 className="font-display text-lg font-bold text-slate-900">Регулювальник</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <RegulatorGesture
              variant={1}
              label="Рука вгору"
              description="Увага! Всім стояти! Рух заборонено в усіх напрямках."
            />
            <RegulatorGesture
              variant={2}
              label="Руки в сторони / опущені"
              description="Можна їхати прямо та праворуч (з правого боку регулювальника)."
            />
            <RegulatorGesture
              variant={3}
              label="Праворуч витягнута вперед"
              description="Можна їхати ліворуч (з лівого боку регулювальника)."
            />
          </div>

          <MiniQuiz
            blockId="regulator"
            title="Регулювальник"
            questions={REGULATOR_QUIZ}
            onAnswer={handleMiniAnswer}
          />
        </div>
      )}

      {/* Markings tab */}
      {activeTab === 'markings' && (
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-2">
            <Paintbrush className="h-5 w-5 text-slate-600" />
            <h3 className="font-display text-lg font-bold text-slate-900">Дорожня розмітка</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <RoadMarking
              type="solid"
              label="Суцільна лінія (1.1)"
              rule="Не перетинати. Забороняє виїзд на смугу зустрічного руху та обгін."
            />
            <RoadMarking
              type="dashed"
              label="Переривчаста лінія"
              rule="Можна перетинати для обгону або зміни смуги, якщо це безпечно."
            />
            <RoadMarking
              type="double"
              label="Подвійна суцільна"
              rule="Перетин заборонено з обох напрямків руху."
            />
          </div>

          <MiniQuiz
            blockId="markings"
            title="Дорожня розмітка"
            questions={MARKINGS_QUIZ}
            onAnswer={handleMiniAnswer}
          />
        </div>
      )}

      {/* Traffic lights tab */}
      {activeTab === 'lights' && (
        <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-8">
          <div className="mb-6 flex items-center gap-2">
            <TrafficCone className="h-5 w-5 text-red-600" />
            <h3 className="font-display text-lg font-bold text-slate-900">Світлофори</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <TrafficLightCard
              redOn
              yellowOn={false}
              greenOn={false}
              label="Червоний"
              rule="Стоп — рух заборонено."
            />
            <TrafficLightCard
              redOn
              yellowOn
              greenOn={false}
              label="Червоний + жовтий"
              rule="Приготуватися — скоро увімкнеться зелений."
            />
            <TrafficLightCard
              redOn={false}
              yellowOn={false}
              greenOn
              label="Зелений"
              rule="Можна їхати, якщо перехрестя вільне."
            />
            <TrafficLightCard
              redOn={false}
              yellowOn
              greenOn={false}
              label="Жовтий"
              rule="Стоп, якщо можна безпечно зупинитись."
            />
          </div>

          <MiniQuiz
            blockId="lights"
            title="Світлофори"
            questions={LIGHTS_QUIZ}
            onAnswer={handleMiniAnswer}
          />
        </div>
      )}
    </section>
  );
}
