import React, { useState, useEffect } from 'react';
import rawLearningTopics from '../data/learningTopics.json';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  MapPin, 
  Signpost, 
  Layers, 
  Gauge, 
  Car, 
  Award, 
  Clock, 
  BookMarked,
  ThumbsUp,
  Sparkles,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Lesson {
  id: string;
  title: string;
  content: string;
  points: string[];
}

interface LearningTopic {
  id: string;
  title: string;
  description: string;
  lessonsCount: number;
  lessons: Lesson[];
}

const learningTopics = rawLearningTopics as LearningTopic[];

export default function LearningView() {
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [activeLessonIndex, setActiveLessonIndex] = useState<number>(0);
  const [completedLessons, setCompletedLessons] = useState<Record<string, boolean>>(() => {
    try {
      const stored = localStorage.getItem('pdr_completed_lessons_v1');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Track finished topics for celebratory status
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  // Sync completed lessons to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pdr_completed_lessons_v1', JSON.stringify(completedLessons));
    } catch (e) {
      console.error(e);
    }
  }, [completedLessons]);

  const activeTopic = learningTopics.find(t => t.id === selectedTopicId);

  const getTopicIcon = (id: string) => {
    switch (id) {
      case 'learning-signs':
        return <Signpost className="h-6 w-6 text-blue-600" />;
      case 'learning-markings':
        return <Layers className="h-6 w-6 text-indigo-600" />;
      case 'learning-intersections':
        return <MapPin className="h-6 w-6 text-emerald-600" />;
      case 'learning-parking':
        return <Car className="h-6 w-6 text-rose-600" />;
      case 'learning-speed':
        return <Gauge className="h-6 w-6 text-amber-600" />;
      default:
        return <BookOpen className="h-6 w-6 text-blue-600" />;
    }
  };

  const getTopicBadgeStyle = (id: string) => {
    switch (id) {
      case 'learning-signs':
        return 'bg-blue-50 text-blue-700 ring-blue-700/10';
      case 'learning-markings':
        return 'bg-indigo-50 text-indigo-700 ring-indigo-700/10';
      case 'learning-intersections':
        return 'bg-emerald-50 text-emerald-700 ring-emerald-700/10';
      case 'learning-parking':
        return 'bg-rose-50 text-rose-700 ring-rose-700/10';
      case 'learning-speed':
        return 'bg-amber-50 text-amber-700 ring-amber-700/10';
      default:
        return 'bg-slate-50 text-slate-700 ring-slate-700/10';
    }
  };

  const handleToggleLessonCompleted = (lessonId: string) => {
    setCompletedLessons(prev => {
      const isDone = !prev[lessonId];
      const updated = { ...prev, [lessonId]: isDone };

      // See if all lessons of the currently selected topic are now done
      if (activeTopic && isDone) {
        const allOtherDone = activeTopic.lessons.every(l => l.id === lessonId ? true : updated[l.id]);
        if (allOtherDone) {
          setShowCelebration(true);
          setTimeout(() => setShowCelebration(false), 5000);
        }
      }

      return updated;
    });
  };

  // Get progressive scores per topic
  const getTopicProgress = (topic: LearningTopic) => {
    if (!topic.lessons || topic.lessons.length === 0) return 0;
    const completedCount = topic.lessons.filter(l => completedLessons[l.id]).length;
    return Math.round((completedCount / topic.lessons.length) * 100);
  };

  const getCompletedLessonsCountByTopic = (topic: LearningTopic) => {
    if (!topic.lessons) return 0;
    return topic.lessons.filter(l => completedLessons[l.id]).length;
  };

  return (
    <div className="py-2" id="learning-section-root">
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-1/2 z-50 -translate-x-1/2 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-500 px-6 py-4 text-center text-white shadow-2xl flex items-center gap-3"
            id="celebration-toast"
          >
            <Award className="h-8 w-8 text-amber-300 animate-bounce shrink-0" />
            <div>
              <p className="font-bold text-sm">Вітаємо! Тему завершено 🎉</p>
              <p className="text-3xs text-emerald-100 mt-0.5">Ви успішно вивчили всі матеріали цієї теми.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!activeTopic ? (
        <div id="learning-landing-view">
          {/* Section Description */}
          <div className="mb-8">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-800">
                Новий розділ
              </span>
              <span className="text-xs text-slate-400 font-mono">Академія ПДР 2026</span>
            </div>
            <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Інтерактивна програма навчання</h1>
            <p className="mt-1.5 text-sm text-slate-500">
              Покроковий розбір фундаментальних тем дорожнього руху за допомогою структурованих мікро-уроків та карток самоконтролю.
            </p>
          </div>

          {/* Core metrics overview row */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3" id="learning-global-stats">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <span className="text-4xs font-bold uppercase tracking-wider text-slate-400">Всього тем в академії</span>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{learningTopics.length}</span>
                <span className="text-xs text-slate-400">підготовлені до іспиту</span>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <span className="text-4xs font-bold uppercase tracking-wider text-slate-400">Ваш загальний прогрес</span>
              <div className="mt-1.5 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">
                  {Object.values(completedLessons).filter(Boolean).length}
                </span>
                <span className="text-xs text-slate-400">вивчених уроків</span>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
              <span className="text-4xs font-bold uppercase tracking-wider text-slate-400">Статус підготовки</span>
              <div className="mt-1.5 flex items-center gap-1.5">
                <span className="inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-sm font-semibold text-slate-700">Активний режим навчання</span>
              </div>
            </div>
          </div>

          {/* Cards container */}
          <h2 className="font-display text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Доступні теми для вивчення</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" id="learning-topics-grid">
            {learningTopics.map((topic) => {
              const progress = getTopicProgress(topic);
              const readLessons = getCompletedLessonsCountByTopic(topic);
              const isPerfect = progress === 100;

              return (
                <div
                  key={topic.id}
                  onClick={() => {
                    setSelectedTopicId(topic.id);
                    setActiveLessonIndex(0);
                  }}
                  id={`learning-card-${topic.id}`}
                  className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all duration-200 hover:scale-[1.01] hover:shadow-lg cursor-pointer ${
                    isPerfect 
                      ? 'border-emerald-200 bg-gradient-to-b from-white to-emerald-50/10' 
                      : 'border-slate-100 bg-white hover:border-slate-200'
                  }`}
                >
                  <div>
                    {/* Header line */}
                    <div className="flex items-center justify-between">
                      <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 group-hover:bg-white transition-colors">
                        {getTopicIcon(topic.id)}
                      </div>
                      <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-4xs font-bold uppercase tracking-wider ${getTopicBadgeStyle(topic.id)}`}>
                        {topic.lessonsCount} {topic.lessonsCount === 1 ? 'урок' : topic.lessonsCount < 5 ? 'уроки' : 'уроків'}
                      </span>
                    </div>

                    {/* Meta information */}
                    <h3 className="mt-4 font-display text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {topic.title}
                    </h3>

                    <p className="mt-2 text-xs leading-normal text-slate-500 line-clamp-3">
                      {topic.description}
                    </p>
                  </div>

                  {/* Progressive meter bar */}
                  <div className="mt-6 border-t border-slate-100/80 pt-4">
                    <div className="flex items-center justify-between text-4xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-1.5">
                      <span>Опрацьовано {readLessons} з {topic.lessons.length}</span>
                      <span className={isPerfect ? 'text-emerald-600' : 'text-slate-500'}>{progress}%</span>
                    </div>
                    
                    <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                        className={`h-full rounded-full ${isPerfect ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-600'}`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick study guide banner */}
          <div className="mt-12 rounded-2xl border border-indigo-50 bg-gradient-to-r from-indigo-50/20 to-blue-50/40 p-6 flex flex-col sm:flex-row items-center gap-5">
            <div className="rounded-2xl bg-indigo-500 p-3 text-white shadow-md">
              <BookMarked className="h-6 w-6" />
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h4 className="font-display font-bold text-sm text-slate-900">Методологія мікро-навчання</h4>
              <p className="text-xs text-slate-500 leading-normal max-w-xl">
                Замість виснажливого багатогодинного читання кодексів, ми розбили кожну тему на компактні смислові блоки. Вивчайте по одному уроку на день і зберігайте високий фокус уваги!
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* Subpage: Individual topic view */
        <div id="learning-topic-detail-page">
          {/* Navigation back and header */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
            <button
              onClick={() => setSelectedTopicId(null)}
              id="back-to-learning-list"
              className="inline-flex items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm transition-all hover:bg-slate-50 cursor-pointer"
            >
              <ChevronLeft className="mr-1.5 h-4 w-4" /> Назад до тем
            </button>

            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-bold uppercase tracking-wider ${getTopicBadgeStyle(activeTopic.id)}`}>
                Тема: {activeTopic.title}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left rail: Lessons Navigator list */}
            <div className="lg:col-span-4 space-y-3" id="lessons-side-navigator">
              <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between text-xs font-bold mb-4 pb-2 border-b border-slate-100">
                  <span className="text-slate-400 uppercase tracking-widest font-mono">Список уроків ({activeTopic.lessons.length})</span>
                  <span className="text-blue-600 font-bold">{getTopicProgress(activeTopic)}% тема вивчена</span>
                </div>

                <div className="space-y-2 max-h-[420px] overflow-y-auto custom-scrollbar">
                  {activeTopic.lessons.map((lesson, idx) => {
                    const isActive = idx === activeLessonIndex;
                    const isDone = completedLessons[lesson.id];

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLessonIndex(idx)}
                        id={`lesson-item-btn-${lesson.id}`}
                        className={`w-full rounded-xl border p-3 text-left transition-all flex items-start gap-2.5 ${
                          isActive
                            ? 'border-blue-600 bg-blue-50/40 text-blue-900 font-semibold ring-1 ring-blue-400/20'
                            : 'border-slate-100 bg-white text-slate-700 hover:border-slate-200 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className={`mt-0.5 flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-4xs font-bold ${
                          isDone 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {isDone ? <Check className="h-3 w-3" /> : idx + 1}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs leading-snug line-clamp-2">{lesson.title}</p>
                          <span className="text-4xs font-medium text-slate-400 font-mono">
                            {isDone ? 'прочитано' : 'не опрацьовано'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
              
              {/* Checklist box */}
              <div className="rounded-2xl border border-slate-100 bg-slate-900/95 p-5 text-white shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-indigo-400 shrink-0" />
                  <span className="text-xs font-bold tracking-tight">Розумний супровід</span>
                </div>
                <p className="text-4xs leading-relaxed text-slate-300">
                  Вивчаючи кожен короткий матеріал і позначаючи його як прочитаний, ви поповнюєте свій статистичний профіль знань. Усі дані одразу інтегруються у локальний сейв-файл.
                </p>
                <div className="text-indigo-400 text-3xs font-bold font-mono uppercase tracking-widest bg-slate-800 p-2.5 rounded-xl border border-slate-700/60">
                  Мобільність: Офлайн режим
                </div>
              </div>
            </div>

            {/* Right: Active lesson workspace rendering */}
            <div className="lg:col-span-8" id="active-lesson-workspace">
              {activeTopic.lessons[activeLessonIndex] ? (
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all sm:p-8" id="active-lesson-card">
                  {/* Lesson Meta */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <span className="text-4xs font-bold uppercase tracking-widest text-slate-400 font-mono">
                      Урок {activeLessonIndex + 1} з {activeTopic.lessons.length}
                    </span>
                    <button
                      onClick={() => handleToggleLessonCompleted(activeTopic.lessons[activeLessonIndex].id)}
                      id="toggle-lesson-completed-btn"
                      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-3xs font-extrabold uppercase tracking-wider shadow-sm transition-all ${
                        completedLessons[activeTopic.lessons[activeLessonIndex].id]
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                          : 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-md cursor-pointer'
                      }`}
                    >
                      <Check className="h-3 w-3 shrink-0" />
                      {completedLessons[activeTopic.lessons[activeLessonIndex].id] ? 'Вивчено ✓' : 'Вивчив(ла)'}
                    </button>
                  </div>

                  {/* Title */}
                  <h2 className="mt-5 font-display text-lg font-bold tracking-tight text-slate-900 sm:text-2xl">
                    {activeTopic.lessons[activeLessonIndex].title}
                  </h2>

                  {/* Intro description */}
                  <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/50 p-4 text-xs leading-relaxed text-slate-600">
                    <p>{activeTopic.lessons[activeLessonIndex].content}</p>
                  </div>

                  {/* Core points / lessons bullets */}
                  <div className="mt-6 space-y-4">
                    <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">Ключові тези уроку для швидкого запам&apos;ятовування:</h4>
                    
                    <div className="grid grid-cols-1 gap-3.5">
                      {activeTopic.lessons[activeLessonIndex].points.map((pt, index) => (
                        <div 
                          key={index}
                          className="flex items-start gap-3 rounded-xl border border-slate-100/70 p-3.5 hover:bg-slate-50/30 transition-all text-xs text-slate-700 leading-normal"
                        >
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-3xs font-extrabold text-indigo-600 font-mono">
                            {index + 1}
                          </span>
                          <p>{pt}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Navigation bar between lessons of this topic */}
                  <div className="mt-10 flex items-center justify-between border-t border-slate-100 pt-6">
                    <button
                      disabled={activeLessonIndex === 0}
                      onClick={() => setActiveLessonIndex(p => Math.max(0, p - 1))}
                      id="prev-lesson-btn"
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" /> Попередній урок
                    </button>

                    {activeLessonIndex < activeTopic.lessons.length - 1 ? (
                      <button
                        onClick={() => {
                          // Auto mark current lesson as read to guide user flow gracefully
                          const currentLessonId = activeTopic.lessons[activeLessonIndex].id;
                          if (!completedLessons[currentLessonId]) {
                            handleToggleLessonCompleted(currentLessonId);
                          }
                          setActiveLessonIndex(p => p + 1);
                        }}
                        id="next-lesson-btn"
                        className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        Наступний урок <ChevronRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          const currentLessonId = activeTopic.lessons[activeLessonIndex].id;
                          if (!completedLessons[currentLessonId]) {
                            handleToggleLessonCompleted(currentLessonId);
                          }
                          setSelectedTopicId(null);
                        }}
                        id="finish-topic-btn"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 py-2.5 px-4 text-xs font-bold text-white hover:bg-slate-800 shadow-md transition-all active:scale-95"
                      >
                        Завершити тему <Award className="h-4 w-4 text-yellow-400" />
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-12 text-center text-slate-400">
                  <Info className="mx-auto h-8 w-8 text-slate-300 animate-spin mb-3" />
                  <p className="text-sm">Завантаження інформації про урок...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
