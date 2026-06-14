import React, { useState, useEffect } from 'react';
import { PdrTopic, Question } from '../types';
import { TOPICS, QUESTIONS } from '../data/pdrData';
import { 
  BookOpen, 
  TrafficLight,
  Signpost,
  Route,
  Sparkles, 
  AlertTriangle, 
  CreditCard, 
  Check, 
  HelpCircle, 
  CheckSquare, 
  Play, 
  Lightbulb, 
  Search, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const topicsAdaptiveStyles = `
<style>
@media (max-width: 768px) {
  .topic-card-icon {
    width: 1.5rem;
    height: 1.5rem;
  }
}
</style>
`;

function getTopicCardIcon(topic: PdrTopic) {
  switch (topic.id) {
    case 'general':
      return <BookOpen className="topic-card-icon w-8 h-8 text-blue-500 mr-3 shrink-0" />;
    case 'regulation':
      return <TrafficLight className="topic-card-icon w-8 h-8 text-red-500 mr-3 shrink-0" />;
    case 'signs':
      return <Signpost className="topic-card-icon w-8 h-8 text-green-500 mr-3 shrink-0" />;
    case 'intersections':
      return <Route className="topic-card-icon w-8 h-8 text-purple-500 mr-3 shrink-0" />;
    default:
      if (topic.warnings && topic.warnings.length > 0) {
        return <AlertTriangle className="topic-card-icon w-8 h-8 text-amber-500 mr-3 shrink-0" />;
      }
      return <ShieldCheck className="topic-card-icon w-8 h-8 text-slate-500 mr-3 shrink-0" />;
  }
}

interface TopicsViewProps {
  onMarkTopicCompleted: (topicId: string) => void;
  completedTopicIds: string[];
}

export default function TopicsView({ onMarkTopicCompleted, completedTopicIds }: TopicsViewProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('general');
  const [activeCategory, setActiveCategory] = useState<string>('Всі');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // AI assistant states
  const [isAiStreaming, setIsAiStreaming] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string>('');
  const [showAiBlock, setShowAiBlock] = useState<boolean>(false);

  // Mini quiz state per topic
  const [quizAnswerSelected, setQuizAnswerSelected] = useState<number | null>(null);
  const [isQuizSubmitted, setIsQuizSubmitted] = useState<boolean>(false);

  const selectedTopic = TOPICS.find((t) => t.id === selectedTopicId) || TOPICS[0];

  // Reset states when changing topic
  useEffect(() => {
    setAiResponse('');
    setIsAiStreaming(false);
    setShowAiBlock(false);
    setQuizAnswerSelected(null);
    setIsQuizSubmitted(false);
  }, [selectedTopicId]);

  // Categories list
  const categories = ['Всі', 'Основи', 'Регулювання', 'Знаки', 'Проїзд', 'Зупинка'];

  // Filter topics
  const filteredTopics = TOPICS.filter((topic) => {
    const matchesCategory = activeCategory === 'Всі' || topic.category === activeCategory;
    const matchesSearch = 
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      topic.shortDescription.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get mini-quiz question for current topic
  const topicQuestion = QUESTIONS.find((q) => q.topicId === selectedTopic.id);

  // Simulated AI Explain Content Generator
  const getAiExplanationText = (topicId: string): string => {
    switch (topicId) {
      case 'general':
        return `### 🤖 AI-Аналіз теми "Загальні положення"
        
Привіт! Давайте розберемо базові концепції нормальної мовою без сухого юридичного тексту.

**1. Головний принцип безпеки:**
Ви маєте ПРАВО очікувати, що інші водії також знають і дотримуються правил (п. 1.4). Але на практиці завжди застосовуйте тактику **"захисного водіння"**: якщо бачите непевну поведінку — пригальмуйте заздалегідь.

**2. Пакет документів (п. 2.1):**
*   **Права відповідної категорії** (для легковиків — B, мотоциклів — A).
*   **Техпаспорт** на машину (реєстраційний документ).
*   **Автоцивілка (страховка)**.
*   *Лайфхак:* Дія повністю легальна! Ви можете показати цифрові документи. Проте завантажте їх завчасно в офлайн, оскільки на трасі може зникнути інтернет.

**3. Золоте правило взаємовідносин:**
Заборонено смітити на дорозі або створювати небезпеку. Будь-яке розлите мастило або загублене колесо — це потенційний кримінальний термін у разі масштабного ДТП.`;

      case 'regulation':
        return `### 🤖 AI-Аналіз теми "Регулювання та жести"

Жести регулювальника — нічний кошмар усіх курсантів автомобільної школи. Спростимо їх за допомогою народних запоминалок!

**Запам'ятайте головну приказку водіїв:**
> *"Груди та спина регулювальника — це залізобетонна стіна!"*
Якщо поліцейський стоїть до вас грудьми чи спиною — рух КАТЕГОРИЧНО заборонено.

**Три віршовані підказки:**
1.  **"Рука піднята вгору:"**
    > *"Рука догори піднята — шлях закрито всім малятам!"* (Зупиняються всі машини, трамваї й навіть пішоходи).
2.  **"Права рука витягнута вперед (поліцейський тиче паличкою у ваш бік):"**
    > *"Якщо палка дивиться в рот — роби тільки правий поворот!"* (Вам дозволено поворот праворуч).
3.  **"Поліцейський повернутий лівим боком, а паличка вказує вліво:"**
    > *"Якщо палка дивиться вліво — їдь як хочеш, королево!"* (Вам дозволено прямо, праворуч, ліворуч або на розворот).

*Зверніть увагу:* Сигнали регулювальника **скасовують** роботу світлофора та знаків пріоритету! Навіть якщо горить червоне світло, але жест дозволяє їхати — ви МАЄТЕ їхати.`;

      case 'signs':
        return `### 🤖 AI-Аналіз теми "Дорожні знаки"

Знаки на дорогах спроектовані так, щоб навіть заляпані брудом вони зчитувалися за формою.

**1. Класичний трюк з формою:**
*   🟥 **Трикутники (червоні)** — Попереджають про небезпеку. Самі по собі вони нічого не забороняють, а дають час подумати. Пам'ятайте відстані: в місті за 50-100м, на трасі — 150-300м (через високі швидкості).
*   🔴 **Круги (червоні)** — Заборонні знаки. Вони строго карають і діють від місця встановлення до першого перехрестя (або знака скасування).
*   🔵 **Круги (сині)** — Наказові. Вони вказують обов'язковий напрямок (наприклад, тільки прямо).

**2. Підступний знак STOP (2.2):**
На відміну від звичайного трикутника "Дати дорогу", знак «STOP» вимагає обов'язкової зупинки коліс (фіксації швидкості 0 км/год) біля стоп-лінії. Поліція обожнює штрафувати за проїзд STOP "накатом"!`;

      case 'intersections':
        return `### 🤖 AI-Аналіз теми "Проїзд перехресть"

Проїзд перехресть базується на трьох послідовних кроках:

**Крок 1. Визначте тип перехрестя:**
*   Регульоване (працює світлофор або стоїть регулювальник). *Підказка:* знаки "Головна дорога" чи "Дати дорогу" в такому разі НЕ ДІЮТЬ!
*   Нерегульоване (світлофори вимкнені або блимають жовтим). Тільки тепер дивимося на знаки пріоритету.

**Крок 2. Правило трамвая:**
У рівних умовах (наприклад, ви обидва на головній дорозі або обидва на другорядній) трамвай ЗАВЖДИ має перевагу. Пропускайте трамвай спочатку!

**Крок 3. Правило правої руки (перешкода праворуч):**
Застосовується на нерегульованих рівнозначних дорогах та при повороті ліворуч/розвороті.
*   При повороті ліворуч ви завжди підставляєте свій правий борт зустрічним машинам, тому ви ПОВИННІ пропустити зустрічний потік, що їде прямо чи повертає праворуч.`;

      case 'speed':
        return `### 🤖 AI-Аналіз теми "Швидкість руху"

Система обмежень швидкості — це математичний розрахунок безпеки для життя.

**1. Головні ліміти в голові:**
*   **20 км/год** — Житлові та пішохідні зони (двори). Пішохід тут цар.
*   **50 км/год** — Межі будь-якого населеного пункту (за білими знаками назви міст).
*   **70 км/год** — Важлива цифра! Це максимум для молодих водіїв зі стажем менше 2 років по всій Україні поза містом.

**2. Похибка +20 км/год:**
В Україні діє безштрафний ліміт перевищення швидкості до 20 км/год. Тобто при ліміті 50 км/год водія оштрафують лише при швидкості від 73 км/год (з урахуванням похибки приладу 3 км/год). Проте пам'ятайте: при 70 км/год у разі наїзду на пішохода шанси вижити знижуються у 4 рази порівняно з 50 км/год.`;

      case 'parking':
        return `### 🤖 AI-Аналіз теми "Зупинка і стоянка"

Тут найцінніше — знати чарівне число **10 метрів**, яке рятує ваше авто від евакуатора та штрафу.

**Чарівний ліміт 10 метрів:**
Пам'ятайте, де категорично не можна паркуватися на відстані до 10 метрів:
*   До та після пішохідного переходу (щоб не закривати перехід іншим водіям).
*   Від краю будь-якого перехрестя.
*   Від виїздів з дворів або прилеглих територій.

**Важливі деталі:**
*   *Зупинка* — до 5 хвилин (або більше для навантаження/пасажирів).
*   *Стоянка* — понад 5 хвилин без мети навантаження.
*   Зупинка біля громадського транспорту заборонена на **30 метрів** з обох боків від знака зупинки автобуса!`;

      default:
        return 'Тема наразі опрацьовується системою.';
    }
  };

  const handleStartAiExplain = () => {
    setShowAiBlock(true);
    setIsAiStreaming(true);
    setAiResponse('');
    
    const textToStream = getAiExplanationText(selectedTopic.id);
    const chars = textToStream.split('');
    let currentIndex = 0;
    
    // speed up streaming slightly for user responsiveness
    const timer = setInterval(() => {
      if (currentIndex < chars.length - 1) {
        setAiResponse((prev) => prev + chars[currentIndex]);
        currentIndex++;
      } else {
        clearInterval(timer);
        setIsAiStreaming(false);
      }
    }, 8); // extremely fast typing effect

    return () => clearInterval(timer);
  };

  const isCompleted = completedTopicIds.includes(selectedTopic.id);

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: topicsAdaptiveStyles }} aria-hidden="true" />
    <div className="py-2" id="topics-view-container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">Теми навчання ПДР</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Актуальна освітня програма з детальним юридичним розбором та інтерактивними інструментами запам&apos;ятовування.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between" id="filter-search-bar">
        {/* Category list */}
        <div className="relative w-full sm:w-auto">
          <p className="mb-1.5 text-4xs font-medium text-slate-400 sm:hidden">гортай →</p>
          <div className="flex flex-nowrap gap-1.5 custom-scrollbar overflow-x-auto pb-3 sm:flex-wrap sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold tracking-wide transition-all ${
                activeCategory === cat 
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-100'
                  : 'bg-white border border-slate-100 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Шукати тему за назвою..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left column: Topic cards */}
        <div className="space-y-3 lg:col-span-4" id="topic-cards-list">
          {filteredTopics.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 p-8 text-center text-slate-500">
              <p className="text-sm font-medium">Жодної теми не знайдено за вашим запитом.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('Всі'); }}
                className="mt-3 text-xs text-blue-600 font-bold hover:underline"
              >
                Скинути фільтри
              </button>
            </div>
          ) : (
            filteredTopics.map((topic) => {
              const isTopicDone = completedTopicIds.includes(topic.id);
              const isActive = selectedTopic.id === topic.id;

              return (
                <div
                  key={topic.id}
                  onClick={() => setSelectedTopicId(topic.id)}
                  id={`topic-list-card-${topic.id}`}
                  className={`group relative rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-500/50 shadow-sm'
                      : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-md'
                  }`}
                >
                  <div className="flex flex-row items-center">
                    {getTopicCardIcon(topic)}
                    <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-0.5 text-4xs font-bold text-slate-600 uppercase">
                      Рзд {topic.number} • {topic.category}
                    </span>
                    {isTopicDone && (
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 shrink-0">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2.5 font-display text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {topic.title}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-xs leading-normal text-slate-500">
                    {topic.shortDescription}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-slate-100/70 pt-2.5 text-4xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                    <span>{topic.questionsCount} питань</span>
                    <span className="flex items-center text-blue-600 group-hover:translate-x-0.5 transition-transform">
                      Вивчати <ChevronRight className="ml-0.5 h-3 w-3" />
                    </span>
                  </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right column: Topic details */}
        <div className="lg:col-span-8" id="topic-detail-view-container">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
            {/* Detail Brand Header */}
            <div className="border-b border-slate-100 pb-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-600/10">
                  Розділ {selectedTopic.number} • {selectedTopic.category}
                </span>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      onMarkTopicCompleted(selectedTopic.id);
                    }}
                    id="mark-topic-complet"
                    className={`inline-flex items-center rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer'
                    }`}
                  >
                    <CheckSquare className="mr-1.5 h-3.5 w-3.5" />
                    {isCompleted ? 'Вивчено' : 'Позначити як вивчену'}
                  </button>
                </div>
              </div>

              <h2 className="mt-4 font-display text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {selectedTopic.title}
              </h2>

              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                {selectedTopic.shortDescription}
              </p>
            </div>

            {/* Official Traffic Rules Paragraphs */}
            <div className="space-y-5 py-6">
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-slate-400">
                Офіційний звід правил
              </h3>
              
              <div className="space-y-4">
                {selectedTopic.content.map((clause, idx) => (
                  <div key={idx} className="flex items-start space-x-3.5 text-slate-700 text-sm leading-relaxed">
                    <span className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-blue-50 text-3xs font-bold text-blue-600 font-mono">
                      {selectedTopic.number}.{idx + 1}
                    </span>
                    <p className="leading-normal">{clause}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Warnings block */}
            {selectedTopic.warnings && selectedTopic.warnings.length > 0 && (
              <div className="mb-6 rounded-2xl bg-amber-50/50 border border-amber-100 p-5 text-amber-900 text-xs">
                <div className="flex items-center space-x-2 font-bold mb-2">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  <span>Критичні نکات безпеки та пастки іспиту</span>
                </div>
                <ul className="list-disc pl-5 space-y-1.5 leading-relaxed text-amber-800">
                  {selectedTopic.warnings.map((warn, i) => (
                    <li key={i}>{warn}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Fines subsection (Unique domestic value addition!) */}
            {selectedTopic.fines && selectedTopic.fines.length > 0 && (
              <div className="mb-6 rounded-2xl bg-rose-50/30 border border-rose-100 p-5 text-rose-950 text-xs">
                <div className="flex items-center space-x-2 font-bold mb-3">
                  <CreditCard className="h-4 w-4 text-rose-500" />
                  <span>Штрафи за порушення цих пунктів (КпАП України)</span>
                </div>
                <div className="divide-y divide-rose-100/50 space-y-2.5">
                  {selectedTopic.fines.map((fine, idx) => (
                    <div key={idx} className={`pt-2.5 first:pt-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1`}>
                      <div>
                        <p className="font-bold text-slate-800">{fine.violation}</p>
                        <p className="text-3xs text-slate-500 mt-0.5 leading-normal">{fine.description}</p>
                      </div>
                      <span className="inline-flex items-center rounded-full bg-rose-50 px-2.5 py-0.5 text-3xs font-bold text-rose-700 ring-1 ring-rose-700/10 font-mono shrink-0">
                        {fine.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Assistant Simulated Stream Section */}
            <div className="mb-6 border-t border-slate-100 pt-6">
              {!showAiBlock ? (
                <div className="rounded-2xl border border-slate-100 bg-gradient-to-tr from-slate-50 to-blue-50/20 p-5 text-center">
                  <Sparkles className="mx-auto h-6 w-6 text-indigo-500 animate-pulse" />
                  <p className="mt-3 text-xs font-bold text-slate-800">
                    Важко зрозуміти суху термінологію МВС?
                  </p>
                  <p className="mt-1 text-4xs text-slate-500">
                    Наш AI Помічник готовий розкрити тему за допомогою простих життєвих аналогій та лайфхаків!
                  </p>
                  <button
                    onClick={handleStartAiExplain}
                    id="trigger-ai-explain"
                    className="mt-4 inline-flex items-center justify-center rounded-xl bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 text-xs font-bold shadow-md cursor-pointer transition-all duration-150"
                  >
                    Пояснити простими словами 🤖
                  </button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/30 to-blue-50/30 p-5 relative"
                >
                  <div className="absolute top-4 right-4 flex items-center space-x-2">
                    {isAiStreaming ? (
                      <span className="flex items-center text-4xs font-mono text-indigo-600 font-bold tracking-widest uppercase">
                        <RefreshCw className="h-3 w-3 mr-1 animate-spin" /> Аналіз...
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-indigo-100 px-2 py-0.5 text-4xs font-bold text-indigo-700">
                        Готово
                      </span>
                    )}
                  </div>

                  {/* Typing content */}
                  <div className="markdown-body text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-wrap">
                    {aiResponse}
                    {isAiStreaming && (
                      <span className="w-1.5 h-4 bg-indigo-600 inline-block animate-pulse ml-0.5 align-middle" />
                    )}
                  </div>

                  {!isAiStreaming && (
                    <div className="mt-4 flex items-center space-x-2 border-t border-indigo-100/50 pt-3">
                      <Lightbulb className="h-4 w-4 text-indigo-500 shrink-0" />
                      <p className="text-4xs text-indigo-600 font-medium">
                        Сподобалося розшифрування? Позначте тему прапорцем зверху, щоб зафіксувати свій прогрес!
                      </p>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Quick Test Knowledge Section */}
            {topicQuestion && (
              <div className="border-t border-slate-100 pt-6">
                <h3 className="font-display text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                  <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-100">
                    <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
                  </span>
                  Швидкий самоконтроль по темі
                </h3>

                <p className="text-xs font-semibold text-slate-800 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100 mb-4">
                  {topicQuestion.text}
                </p>

                <div className="space-y-2">
                  {topicQuestion.options.map((option, index) => {
                    const isSelected = quizAnswerSelected === index;
                    const isAnswerCorrect = index === topicQuestion.correctAnswerIndex;
                    let optionClass = 'border-slate-100 bg-white hover:border-slate-200';

                    if (isQuizSubmitted) {
                      if (isAnswerCorrect) {
                        optionClass = 'border-emerald-500 bg-emerald-50/60 text-emerald-900 font-semibold';
                      } else if (isSelected) {
                        optionClass = 'border-rose-500 bg-rose-50/60 text-rose-900 font-semibold';
                      } else {
                        optionClass = 'border-slate-50 bg-slate-50 text-slate-400 opacity-60 pointer-events-none';
                      }
                    }

                    return (
                      <button
                        key={index}
                        disabled={isQuizSubmitted}
                        onClick={() => {
                          setQuizAnswerSelected(index);
                          setIsQuizSubmitted(true);
                        }}
                        className={`w-full rounded-xl border p-3.5 text-left text-xs transition-all flex items-center justify-between ${optionClass} ${!isQuizSubmitted ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default'}`}
                      >
                        <span className="leading-snug">{option}</span>
                        {isQuizSubmitted && isAnswerCorrect && (
                          <ShieldCheck className="h-4.5 w-4.5 text-emerald-600 shrink-0 ml-2" />
                        )}
                        {isQuizSubmitted && isSelected && !isAnswerCorrect && (
                          <span className="h-2 w-2 rounded-full bg-rose-500 shrink-0 ml-2" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {isQuizSubmitted && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-3 text-4xs font-medium text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-lg"
                  >
                    <p className="font-bold text-slate-700">Офіційне роз&apos;яснення ПДР:</p>
                    <p className="mt-1">{topicQuestion.explanation}</p>
                    <p className="font-bold text-slate-600 mt-1 uppercase">Пункт правил: {topicQuestion.articleNumber}</p>
                  </motion.div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
