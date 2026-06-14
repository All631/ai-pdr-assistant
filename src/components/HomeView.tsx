import React, { useState } from 'react';
import { AppTab, Question } from '../types';
import { QUESTIONS } from '../data/pdrData';
import rawQuestions from '../data/questions.json';
import { 
  Sparkles, 
  ArrowRight, 
  BookOpen, 
  Compass, 
  ShieldAlert, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  Timer,
  AlertCircle,
  Clock,
  Gauge,
  Bookmark,
  Trash2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const adaptiveStyles = `
<style>
@media (max-width: 768px) {
  .hero-buttons { flex-direction: column; width: 100%; }
  .hero-buttons button { width: 100%; margin-bottom: 12px; }
  .stats-grid { grid-template-columns: 1fr; }
  .stats-card { padding: 16px; text-align: center; }
  .stats-value { font-size: 28px; }
  .features-grid { grid-template-columns: 1fr; }
  .bookmark-item { flex-direction: column; align-items: flex-start; }
  .hero-title { font-size: 20px; }
  .container { padding: 0 16px; }
  .question-card { padding: 16px; }
}
</style>
`;

interface HomeViewProps {
  setActiveTab: (tab: AppTab) => void;
  streak: number;
  bookmarkedQuestionIds: string[];
  onToggleBookmark: (id: string) => void;
}

export default function HomeView({ setActiveTab, streak, bookmarkedQuestionIds, onToggleBookmark }: HomeViewProps) {
  // Let's grab one interesting question of the day
  const questionOfDay: Question = QUESTIONS[1]; // q_gen_2 about documents required for driving
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);

  const [expandedQuestionIds, setExpandedQuestionIds] = useState<string[]>([]);

  const toggleExpandQuestion = (qId: string) => {
    setExpandedQuestionIds(prev => 
      prev.includes(qId) 
        ? prev.filter(id => id !== qId) 
        : [...prev, qId]
    );
  };

  const QUESTION_TOPIC_MAP_LOCAL: Record<string, string> = {
    'q-1': 'Швидкісний режим',
    'q-2': 'Проїзд перехресть',
    'q-3': 'Проїзд перехресть',
    'q-4': 'Зупинка та стоянка',
    'q-5': 'Зупинка та стоянка',
    'q-6': 'Дорожні знаки',
    'q-7': 'Проїзд перехресть',
    'q-8': 'Швидкісний режим',
    'q-9': 'Проїзд перехресть',
    'q-10': 'Швидкісний режим',
    'q-11': 'Дорожні знаки',
    'q-12': 'Зупинка та стоянка',
    'q-13': 'Швидкісний режим',
    'q-14': 'Дорожня розмітка',
    'q-15': 'Швидкісний режим',
    'q-16': 'Швидкісний режим',
    'q-17': 'Дорожні знаки',
    'q-18': 'Проїзд перехресть',
    'q-19': 'Дорожня розмітка',
    'q-20': 'Зупинка та стоянка',
  };

  const getBookmarkedQuestions = () => {
    const list: {
      id: string;
      text: string;
      options: string[];
      correctAnswerIndex: number;
      explanation: string;
      image?: string | null;
      topicTitle?: string;
    }[] = [];

    bookmarkedQuestionIds.forEach(id => {
      // Look in rawQuestions from questions.json
      const qJson = (rawQuestions as any[]).find((q: any) => q.id === id);
      if (qJson) {
        list.push({
          id: qJson.id,
          text: qJson.question,
          options: qJson.answers,
          correctAnswerIndex: qJson.correctAnswer,
          explanation: qJson.explanation,
          image: qJson.image || null,
          topicTitle: QUESTION_TOPIC_MAP_LOCAL[qJson.id] || 'Тестування'
        });
        return;
      }

      // Look in QUESTIONS from pdrData.ts
      const qPdr = QUESTIONS.find((q: any) => q.id === id);
      if (qPdr) {
        list.push({
          id: qPdr.id,
          text: qPdr.text,
          options: qPdr.options,
          correctAnswerIndex: qPdr.correctAnswerIndex,
          explanation: qPdr.explanation,
          image: null,
          topicTitle: qPdr.topicTitle
        });
      }
    });

    return list;
  };

  const bookmarkedQuestions = getBookmarkedQuestions();

  // Stats for highlighting
  const miniStats = [
    { title: 'Дозволена швидкість в місті', value: '50 км/год', desc: 'п. 12.4 ПДР України' },
    { title: 'Максимальний поріг аварійності', value: '+20 км/год', desc: 'Адмінкодекс штрафів' },
    { title: 'Ліміт помилок на іспиті', value: 'До 2-х помилок', desc: 'З 20 можливих питань' },
  ];

  const features = [
    {
      title: 'Академія мікро-навчання',
      desc: 'Проходьте структуровані уроки за базовими темами та відстежуйте свій прогрес.',
      icon: BookOpen,
      color: 'bg-blue-50 text-blue-600',
      actionText: 'Почати навчання',
      tab: 'learning' as AppTab,
    },
    {
      title: 'Симуляція реального іспиту',
      desc: 'Точне відтворення умов офіційного іспиту СЦ МВС: 20 питань, 20 хвилин.',
      icon: Timer,
      color: 'bg-indigo-50 text-indigo-600',
      actionText: 'Почати тест',
      tab: 'testing' as AppTab,
    },
    {
      title: 'Детальна статистика умінь',
      desc: 'Аналіз слабких місць, прогресу, успішності та утримання водійських навичок.',
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-600',
      actionText: 'Переглянути графіки',
      tab: 'stats' as AppTab,
    },
  ];

  const handleAnswerSubmit = (index: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(index);
    setIsAnswerSubmitted(true);
  };

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: adaptiveStyles }} aria-hidden="true" />
    <div className="space-y-12 py-6 sm:py-8 container" id="home-view-container">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 px-6 py-12 text-white sm:px-12 sm:py-16 lg:px-16 lg:py-20 shadow-xl shadow-slate-900/10">
        {/* Glow decoration */}
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-gradient-to-tr from-blue-500/20 to-indigo-500/30 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-gradient-to-tr from-cyan-500/10 to-blue-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-1.5 rounded-full bg-blue-500/10 px-3.5 py-1.5 text-xs font-semibold text-blue-300 ring-1 ring-blue-400/20"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Інтелектуальний помічник водія</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 font-display text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl text-white hero-title"
          >
            Класичні ПДР України у <span className="text-blue-400">сучасному</span> форматі
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-base text-slate-300 sm:text-lg"
          >
            Підготовка до теоретичного іспиту за офіційними темами МВС з розумними поясненнями складних ситуацій, інтерактивними тестами та моментальними штраф-гайдами.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10 flex flex-col justify-center gap-4 sm:flex-row hero-buttons"
          >
            <button
              onClick={() => setActiveTab('learning')}
              id="cta-start-study"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:bg-blue-500 hover:shadow-cyan-500/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 cursor-pointer"
            >
              <BookOpen className="mr-2 h-4.5 w-4.5" />
              Почати навчання
            </button>
            <button
              onClick={() => setActiveTab('testing')}
              id="cta-start-test"
              className="inline-flex items-center justify-center rounded-xl bg-slate-800 px-6 py-3.5 text-sm font-bold text-slate-200 border border-slate-700 hover:border-slate-600 transition-all hover:bg-slate-750 cursor-pointer"
            >
              <Gauge className="mr-2 h-4.5 w-4.5 text-blue-400" />
              Пройти тест
            </button>
          </motion.div>
        </div>
      </section>

      {/* Quick Dashboard Info */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3 stats-grid" id="mini-fines-rules-grid">
        {miniStats.map((stat, idx) => (
          <div key={idx} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow stats-card">
            <p className="text-xs font-semibold text-slate-500">{stat.title}</p>
            <p className="mt-2 text-2xl font-mono font-bold tracking-tight text-slate-900 stats-value">{stat.value}</p>
            <p className="mt-1 text-3xs text-slate-400 font-medium">{stat.desc}</p>
          </div>
        ))}
      </section>

      {/* Features Bento Banner */}
      <section className="space-y-6" id="features-section">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-2">
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900">Ефективні інструменти MVP курсу</h2>
            <p className="mt-1 text-sm text-slate-500">Ми пропонуємо комплексний підхід для успішного засвоєння правил з першого разу.</p>
          </div>
          <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg w-max">
            <Clock className="h-4 w-4" />
            <span>Середній час вивчення: 3 тижні</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 features-grid">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div 
                key={idx} 
                className="group flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:border-slate-200 hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${feat.color} shadow-inner`}>
                    <Icon className="h-5.5 w-5.5" />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {feat.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-500">
                    {feat.desc}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab(feat.tab)}
                  className="mt-6 inline-flex items-center text-xs font-bold text-blue-600 group-hover:text-blue-700 transition-colors cursor-pointer"
                >
                  {feat.actionText}
                  <ArrowRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* Interactive Question of the Day Widget */}
      <section className="rounded-2xl border border-blue-100 bg-gradient-to-b from-blue-50/50 to-white/70 p-6 sm:p-8 question-card" id="question-of-day">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="space-y-4 md:max-w-[55%]">
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-blue-100/80 px-3 py-1 text-xs font-bold text-blue-800">
              <Compass className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Питання дня • {questionOfDay.topicTitle}</span>
            </div>
            
            <h3 className="text-lg font-bold leading-snug text-slate-900 md:text-xl">
              {questionOfDay.text}
            </h3>

            <p className="text-xs text-slate-500 italic bg-white/60 p-2.5 rounded-lg border border-slate-100 font-mono">
              Порада: Це запитання часто зустрічається на офіційному іспиті СЦ МВС. Перевірте свої сили!
            </p>

            {isAnswerSubmitted && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`rounded-xl border p-4 text-sm ${
                  selectedOption === questionOfDay.correctAnswerIndex
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-red-200 bg-red-50 text-red-800'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {selectedOption === questionOfDay.correctAnswerIndex ? (
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                  ) : (
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
                  )}
                  <div>
                    <h4 className="font-bold">
                      {selectedOption === questionOfDay.correctAnswerIndex ? 'Правильно!' : 'Помилка.'}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">
                      {questionOfDay.explanation}
                    </p>
                    <p className="mt-2 text-2xs font-mono font-bold text-slate-500 uppercase">
                      Посилання на закон: {questionOfDay.articleNumber}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Options Grid */}
          <div className="w-full space-y-2.5 md:max-w-[40%]">
            {questionOfDay.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === questionOfDay.correctAnswerIndex;
              let btnClass = 'border-slate-200 bg-white hover:border-blue-400 text-slate-700';

              if (isAnswerSubmitted) {
                if (isCorrect) {
                  btnClass = 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-semibold ring-1 ring-emerald-400';
                } else if (isSelected) {
                  btnClass = 'border-red-500 bg-red-50/70 text-red-900 font-semibold ring-1 ring-red-400';
                } else {
                  btnClass = 'border-slate-100 bg-slate-50 text-slate-400 opacity-60 pointer-events-none';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswerSubmitted}
                  onClick={() => handleAnswerSubmit(idx)}
                  className={`w-full rounded-xl border p-4 text-left text-xs transition-all flex items-center justify-between ${btnClass} ${!isAnswerSubmitted ? 'cursor-pointer hover:-translate-y-0.5 active:translate-y-0 duration-150' : 'cursor-default'}`}
                >
                  <span className="leading-normal">{opt}</span>
                  {isAnswerSubmitted && isCorrect && <CheckCircle2 className="h-4.5 w-4.5 text-emerald-600 shrink-0 ml-2" />}
                  {isAnswerSubmitted && isSelected && !isCorrect && <XCircle className="h-4.5 w-4.5 text-red-600 shrink-0 ml-2" />}
                </button>
              );
            })}

            {isAnswerSubmitted && (
              <button
                onClick={() => {
                  setSelectedOption(null);
                  setIsAnswerSubmitted(false);
                }}
                className="mt-2 w-full text-center text-xs font-bold text-blue-600 hover:text-blue-700 underline cursor-pointer"
              >
                Спробувати ще раз
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Bookmarked Questions Section */}
      <section className="space-y-6" id="bookmarks-section">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-yellow-50 text-yellow-650 border border-yellow-105">
              <Bookmark className="h-5 w-5 fill-yellow-400 text-yellow-500" />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold tracking-tight text-slate-900">
                Мої збережені питання ({bookmarkedQuestions.length})
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Ваші збережені складні запитання для швидкого та регулярного повторення
              </p>
            </div>
          </div>
        </div>

        {bookmarkedQuestions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-455">
              <Bookmark className="h-5 w-5" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <p className="text-sm font-semibold text-slate-700">Список обраного порожній</p>
              <p className="text-xs leading-relaxed text-slate-400">
                Коли ви проходите тренувальні тести в розділі <strong>Тестування</strong>, ви можете натискати на іконку-закладку 🔖 у кутку будь-якого питання, щоб зберегти його сюди для легкого повторення.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4" id="bookmarks-list-accordions">
            {bookmarkedQuestions.map((q) => {
              const isExpanded = expandedQuestionIds.includes(q.id);
              return (
                <div 
                  key={q.id}
                  className="rounded-2xl border border-slate-100 bg-white shadow-3xs overflow-hidden hover:border-slate-200 transition-all"
                >
                  {/* Top Bar / Header click target */}
                  <div 
                    onClick={() => toggleExpandQuestion(q.id)}
                    className="flex items-center justify-between p-4.5 hover:bg-slate-5/50 cursor-pointer transition-colors select-none bookmark-item"
                  >
                    <div className="space-y-1 flex-1 pr-4">
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center rounded bg-blue-50 px-2 py-0.5 text-5xs font-bold text-blue-700 font-mono uppercase tracking-wider">
                          {q.topicTitle}
                        </span>
                        <span className="text-5xs text-slate-400 font-mono">ID: {q.id}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-800 leading-snug line-clamp-2 md:line-clamp-none">
                        {q.text}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleBookmark(q.id);
                        }}
                        id={`delete-bookmark-btn-${q.id}`}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                        title="Видалити з обраного"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="p-1.5 rounded-lg text-slate-400">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-slate-500" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-slate-500" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Body */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="border-t border-slate-100 bg-slate-50/40 p-4.5 space-y-4">
                          {/* Image inside bookmark detail */}
                          {q.image && (
                            <div className="overflow-hidden rounded-xl border border-slate-100 max-h-40 max-w-sm">
                              <img 
                                src={q.image} 
                                alt="ПДР Ситуація" 
                                className="h-full w-full object-cover max-h-40" 
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}

                          {/* Options list */}
                          <div className="space-y-2">
                            <p className="text-5xs font-bold uppercase tracking-wider text-slate-400 font-mono font-medium">Варіанти відповідей:</p>
                            <div className="grid grid-cols-1 gap-2">
                              {q.options.map((option, idx) => {
                                const isCorrect = idx === q.correctAnswerIndex;
                                return (
                                  <div 
                                    key={idx}
                                    className={`rounded-xl border p-3 text-xs flex items-start gap-2.5 ${
                                      isCorrect 
                                        ? 'border-emerald-200 bg-emerald-50/50 text-emerald-950 font-medium'
                                        : 'border-slate-100 bg-white text-slate-600'
                                    }`}
                                  >
                                    <span className="font-mono text-xs font-semibold">
                                      {['A', 'B', 'C', 'D'][idx]}.
                                    </span>
                                    <div>
                                      <p>{option}</p>
                                      {isCorrect && (
                                        <span className="text-5xs uppercase tracking-wider text-emerald-600 font-extrabold block mt-0.5">
                                          Правильна відповідь ✓
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>

                          {/* Explanatory Banner */}
                          <div className="rounded-xl border border-blue-100/60 bg-blue-50/30 p-4 text-xs text-blue-900 leading-normal">
                            <div className="flex items-center gap-1.5 font-bold text-3xs uppercase tracking-wider text-blue-700 mb-1">
                              <AlertCircle className="h-4 w-4 text-blue-500 shrink-0" />
                              Офіційний роз&apos;яснювальний коментар:
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed font-normal">
                              {q.explanation}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Safety Quote Warning Banner */}
      <section className="rounded-2xl border border-amber-100 bg-amber-50/40 p-4 shrink-0 flex items-start space-x-3 text-amber-900" id="safety-disclaimer">
        <AlertCircle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="text-xs">
          <p className="font-bold">Пам&apos;ятка ПДР України:</p>
          <p className="mt-1 leading-normal text-amber-800">
            Знання ПДР України — це не просто успішно пройдений тест, а передусім збережене здоров&apos;я та життя людей. Практикуйте теорію разом з уважним водінням з досвідченим інструктором.
          </p>
        </div>
      </section>
    </div>
    </>
  );
}
