import React from 'react';
import { AppTab, UserStats, Achievement } from '../types';
import { ACHIEVEMENTS } from '../data/pdrData';
import { 
  Flame, 
  CheckCircle2, 
  ShieldAlert, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Clock, 
  User, 
  FileText,
  Percent,
  Check,
  ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell 
} from 'recharts';
import { motion } from 'motion/react';

interface StatsViewProps {
  stats: UserStats;
  completedTopicIds: string[];
  setActiveTab: (tab: AppTab) => void;
}

export default function StatsView({ stats, completedTopicIds, setActiveTab }: StatsViewProps) {
  // Let's dynamically calculate achievements progress
  const dynamicAchievements: Achievement[] = ACHIEVEMENTS.map((ach) => {
    let progress = 0;
    
    if (ach.id === 'ach_1') {
      // General provisions read
      progress = completedTopicIds.includes('general') ? 100 : 0;
    } else if (ach.id === 'ach_2') {
      // First test taken
      progress = stats.totalTestsTaken > 0 ? 100 : 0;
    } else if (ach.id === 'ach_3') {
      // Exam pass
      progress = stats.examsPassedCount > 0 ? 100 : 0;
    } else if (ach.id === 'ach_4') {
      // Streak progress
      progress = Math.min((stats.dailyStreak / 3) * 100, 100);
    } else if (ach.id === 'ach_5') {
      // Regulation topic completed
      progress = completedTopicIds.includes('regulation') ? 100 : 0;
    }

    return {
      ...ach,
      progress: Math.round(progress),
      unlockedAt: progress >= 100 ? new Date().toLocaleDateString('uk-UA') : undefined
    };
  });

  const accuracy = stats.totalAnswersCount > 0 
    ? Math.round((stats.correctAnswersCount / stats.totalAnswersCount) * 100) 
    : 0;

  // Icons map helper
  const renderAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'Award': return <Award className="h-6 w-6 text-amber-500" />;
      case 'CheckCircle2': return <CheckCircle2 className="h-6 w-6 text-emerald-500" />;
      case 'ShieldAlert': return <ShieldAlert className="h-6 w-6 text-indigo-500" />;
      case 'Flame': return <Flame className="h-6 w-6 text-orange-500" />;
      case 'UserCheck': return <BookOpen className="h-6 w-6 text-blue-500" />;
      default: return <Award className="h-6 w-6 text-slate-500" />;
    }
  };

  // Card summary metrics data
  const metrics = [
    {
      title: 'Ударний режим',
      value: `${stats.dailyStreak} дн.`,
      desc: 'Поточна щоденна серія',
      icon: Flame,
      color: 'text-amber-500 bg-amber-50 border-amber-100',
    },
    {
      title: 'Точність відповідей',
      value: `${accuracy}%`,
      desc: `${stats.correctAnswersCount} з ${stats.totalAnswersCount} правильних`,
      icon: CheckCircle2,
      color: 'text-emerald-500 bg-emerald-50 border-emerald-100',
    },
    {
      title: 'Складено іспитів',
      value: `${stats.examsPassedCount} / ${stats.examsTakenCount}`,
      desc: 'Симуляції МВС пройдено',
      icon: ShieldAlert,
      color: 'text-indigo-500 bg-indigo-50 border-indigo-100',
    },
    {
      title: 'Вивчені теми ПДР',
      value: `${completedTopicIds.length} / 6`,
      desc: 'Опрацьовано розділів',
      icon: BookOpen,
      color: 'text-blue-500 bg-blue-50 border-blue-100',
    },
  ];

  return (
    <div className="py-2" id="stats-view-container">
      {/* Title */}
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">Аналітика та прогрес</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Стежте за показниками успішності та перевіряйте слабкі теми перед виїздом на дорогу або іспитом.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4" id="stats-metrics-cards">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div 
              key={idx} 
              className={`rounded-2xl border p-5 bg-white shadow-sm flex items-center justify-between hover:shadow-md transition-shadow`}
            >
              <div className="space-y-1.5">
                <p className="text-3xs font-bold font-mono text-slate-400 uppercase tracking-wider">{metric.title}</p>
                <p className="text-2xl font-bold text-slate-950 tracking-tight">{metric.value}</p>
                <p className="text-4xs text-slate-500 font-medium">{metric.desc}</p>
              </div>
              <div className={`h-11 w-11 rounded-xl flex items-center justify-center border ${metric.color}`}>
                <Icon className="h-5.5 w-5.5 fill-current/10" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12" id="stats-charts-panel">
        {/* Weekly Activity Line Chart */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6 lg:col-span-7">
          <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-4">
            <div>
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">Активність навчання</h3>
              <h2 className="text-sm font-bold text-slate-800 mt-0.5">Кількість відповідей за тиждень</h2>
            </div>
            <div className="flex items-center space-x-1 text-4xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>Дійсний темп збережено</span>
            </div>
          </div>

          <div className="h-64 w-full" id="weekly-trends-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={stats.weeklyPerformance}
                margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorSolved" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorCorrect" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="day" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderRadius: '12px', 
                    border: 'none', 
                    color: '#fff', 
                    fontSize: '11px' 
                  }} 
                />
                <Area 
                  name="Всього спроб" 
                  type="monotone" 
                  dataKey="answered" 
                  stroke="#2563eb" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorSolved)" 
                />
                <Area 
                  name="Вірні відповіді" 
                  type="monotone" 
                  dataKey="correct" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCorrect)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Knowledge bar chart */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6 lg:col-span-5">
          <div className="flex items-center justify-between border-b border-slate-55 pb-4 mb-4">
            <div>
              <h3 className="font-display text-xs font-bold uppercase tracking-wider text-slate-400">Рівень підготовки</h3>
              <h2 className="text-sm font-bold text-slate-800 mt-0.5">Успішність за категоріями (%)</h2>
            </div>
          </div>

          <div className="h-64 w-full" id="categories-bar-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={stats.topicDistribution}
                layout="vertical"
                margin={{ top: 10, right: 10, left: -10, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis 
                  type="number" 
                  domain={[0, 100]} 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontSize: 10, fill: '#64748b' }} 
                />
                <YAxis 
                  dataKey="category" 
                  type="category" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fontSize: 10, fill: '#475569', fontWeight: 600 }} 
                  width={90}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e293b', 
                    borderRadius: '12px', 
                    border: 'none', 
                    color: '#fff', 
                    fontSize: '11px' 
                  }} 
                />
                <Bar dataKey="value" name="Знання (%)" radius={[0, 4, 4, 0]} barSize={14}>
                  {stats.topicDistribution.map((entry, index) => {
                    // alternate gradient colors or nice solid colors
                    const colors = ['#3b82f6', '#4f46e5', '#10b981', '#f59e0b'];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Gamification Badges Achievements */}
      <div className="mt-8 border-t border-slate-100 pt-8" id="achievements-section">
        <div className="mb-6">
          <h2 className="font-display text-lg font-bold tracking-tight text-slate-900 sm:text-xl">Система досягнень водія</h2>
          <p className="mt-1 text-xs text-slate-500">Виконуйте завдання на курсі ПДР та заробляйте почесні знаки майстерності водіння.</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {dynamicAchievements.map((ach) => {
            const isUnlocked = ach.progress >= 100;

            return (
              <div 
                key={ach.id}
                id={`achievement-card-${ach.id}`}
                className={`relative rounded-2xl border p-4.5 bg-white transition-all duration-200 ${
                  isUnlocked 
                    ? 'border-emerald-100 bg-gradient-to-tr from-white to-emerald-50/10 shadow-sm ring-1 ring-emerald-100/50' 
                    : 'border-slate-100 bg-white/70'
                }`}
              >
                {/* Badges */}
                <div className="flex items-start gap-3.5">
                  <div className={`h-11 w-11 rounded-1.5xl flex items-center justify-center shrink-0 border ${
                    isUnlocked
                      ? 'bg-emerald-50 border-emerald-100'
                      : 'bg-slate-50 border-slate-100 grayscale'
                  }`}>
                    {renderAchievementIcon(ach.iconName)}
                  </div>

                  <div className="space-y-1 w-full">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-extrabold text-slate-800 leading-none">{ach.title}</h4>
                      {isUnlocked && (
                        <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white">
                          <Check className="h-2.5 w-2.5 stroke-[4px]" />
                        </span>
                      )}
                    </div>
                    <p className="text-4xs text-slate-500 leading-normal mr-4">{ach.description}</p>
                  </div>
                </div>

                {/* Progress bar inside cards */}
                <div className="mt-5 space-y-1.5">
                  <div className="flex items-center justify-between text-4xs font-mono font-medium text-slate-400">
                    <span>Прогрес виконання</span>
                    <span className={isUnlocked ? 'text-emerald-600 font-bold' : 'text-slate-600'}>
                      {ach.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        isUnlocked ? 'bg-emerald-500' : 'bg-blue-600'
                      }`}
                      style={{ width: `${ach.progress}%` }}
                    />
                  </div>
                  {isUnlocked && ach.unlockedAt && (
                    <p className="text-4xs text-slate-400 text-right mt-1">Отримано: {ach.unlockedAt}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
