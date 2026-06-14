import React, { useState, useEffect } from 'react';
import { AppTab, UserStats } from './types';
import { DEFAULT_STATS } from './data/pdrData';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import LearningView from './components/LearningView';
import TopicsView from './components/TopicsView';
import VisualLearningView from './components/VisualLearningView';
import TestingView from './components/TestingView';
import StatsView from './components/StatsView';
import AiChatView from './components/AiChatView';
import DiagnosticPanel from './components/DiagnosticPanel';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Compass, AlertCircle, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('home');

  // Load completed topics from localstorage
  const [completedTopicIds, setCompletedTopicIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('pdr_completed_topics');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Load stats from localstorage
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const stored = localStorage.getItem('pdr_user_stats');
      return stored ? JSON.parse(stored) : DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });

  // Load bookmarks from localstorage
  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('pdr_bookmarks');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Check and update streak on load
  useEffect(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      setStats((prev) => {
        // If there's no lastActiveDate, initialize correctly
        if (!prev.lastActiveDate) {
          return {
            ...prev,
            lastActiveDate: today,
            dailyStreak: 1,
          };
        }

        if (prev.lastActiveDate === today) {
          return prev;
        }

        const lastDate = new Date(prev.lastActiveDate);
        const currentDate = new Date(today);
        const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        let newStreak = prev.dailyStreak;
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          // If missed a day, reset back to 1
          newStreak = 1;
        }

        return {
          ...prev,
          lastActiveDate: today,
          dailyStreak: newStreak,
        };
      });
    } catch (err) {
      console.error('Streak calculation error:', err);
    }
  }, []);

  // Keep state synced to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pdr_completed_topics', JSON.stringify(completedTopicIds));
    } catch (e) {
      console.error(e);
    }
  }, [completedTopicIds]);

  useEffect(() => {
    try {
      localStorage.setItem('pdr_user_stats', JSON.stringify(stats));
    } catch (e) {
      console.error(e);
    }
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem('pdr_bookmarks', JSON.stringify(bookmarkedQuestionIds));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarkedQuestionIds]);

  const handleToggleBookmark = (questionId: string) => {
    setBookmarkedQuestionIds((prev) =>
      prev.includes(questionId)
        ? prev.filter((id) => id !== questionId)
        : [...prev, questionId]
    );
  };

  // Mark topic and update stats
  const handleMarkTopicCompleted = (topicId: string) => {
    setCompletedTopicIds((prev) => {
      const exists = prev.includes(topicId);
      const next = exists ? prev.filter((id) => id !== topicId) : [...prev, topicId];
      
      // Update stats topicsCompleted as well
      setStats((pStats) => ({
        ...pStats,
        completedTopicIds: next,
      }));

      return next;
    });
  };

  // Register test outcomes
  const handleRegisterTestCompleted = (
    correctCount: number,
    totalQuestions: number,
    isExam: boolean,
    isExamPassed: boolean
  ) => {
    setStats((prev) => {
      // increase current date's activity inside weeklyPerformance
      // Identify current weekday
      const weekdays = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
      const todayIndex = new Date().getDay();
      const todayLabel = weekdays[todayIndex];

      const updatedWeekly = prev.weeklyPerformance.map((dayItem) => {
        if (dayItem.day === todayLabel) {
          return {
            ...dayItem,
            answered: dayItem.answered + totalQuestions,
            correct: dayItem.correct + correctCount,
          };
        }
        return dayItem;
      });

      // Update category mastery ratings dynamically if total answered changes
      const updatedDistribution = prev.topicDistribution.map((dist) => {
        // give small incremental boost across respective dimensions based on success rate
        const ratio = totalQuestions > 0 ? correctCount / totalQuestions : 0.5;
        const rewardFactor = Math.round(ratio * 5); // small stats boost
        return {
          ...dist,
          value: Math.min(dist.value + rewardFactor, 100),
        };
      });

      return {
        ...prev,
        totalTestsTaken: prev.totalTestsTaken + 1,
        totalAnswersCount: prev.totalAnswersCount + totalQuestions,
        correctAnswersCount: prev.correctAnswersCount + correctCount,
        examsTakenCount: isExam ? prev.examsTakenCount + 1 : prev.examsTakenCount,
        examsPassedCount: isExamPassed ? prev.examsPassedCount + 1 : prev.examsPassedCount,
        weeklyPerformance: updatedWeekly,
        topicDistribution: updatedDistribution,
        dailyStreak: prev.dailyStreak === 0 ? 1 : prev.dailyStreak // safeguard streak
      };
    });
  };

  // Render current tab views
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeView 
            setActiveTab={setActiveTab} 
            streak={stats.dailyStreak} 
            bookmarkedQuestionIds={bookmarkedQuestionIds}
            onToggleBookmark={handleToggleBookmark}
          />
        );
      case 'learning':
        return (
          <LearningView />
        );
      case 'topics':
        return (
          <TopicsView 
            onMarkTopicCompleted={handleMarkTopicCompleted} 
            completedTopicIds={completedTopicIds} 
          />
        );
      case 'visual-learning':
        return <VisualLearningView />;
      case 'testing':
        return (
          <TestingView 
            onRegisterTestCompleted={handleRegisterTestCompleted} 
            setActiveTab={setActiveTab} 
            bookmarkedQuestionIds={bookmarkedQuestionIds}
            onToggleBookmark={handleToggleBookmark}
          />
        );
      case 'stats':
        return (
          <StatsView 
            stats={stats} 
            completedTopicIds={completedTopicIds} 
            setActiveTab={setActiveTab} 
          />
        );
      case 'ai-chat':
        return (
          <AiChatView />
        );
      default:
        return (
          <HomeView 
            setActiveTab={setActiveTab} 
            streak={stats.dailyStreak} 
            bookmarkedQuestionIds={bookmarkedQuestionIds}
            onToggleBookmark={handleToggleBookmark}
          />
        );
    }
  };

  const handleResetLocalStorage = () => {
    localStorage.removeItem('pdr_completed_topics');
    localStorage.removeItem('pdr_user_stats');
    localStorage.removeItem('pdr_bookmarks');
    setCompletedTopicIds([]);
    setStats(DEFAULT_STATS);
    setBookmarkedQuestionIds([]);
    setActiveTab('home');
    alert('Дані успішно очищено!');
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans" id="app-root-container">
      {/* Navbar with reactive details */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        streak={stats.dailyStreak}
        totalCorrect={stats.correctAnswersCount}
        totalAnswered={stats.totalAnswersCount}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            id={`tab-wrapper-${activeTab}`}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-20 border-t border-slate-100 bg-white py-8 text-center text-xs text-slate-400" id="global-footer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-4">
          <div className="flex justify-center items-center space-x-1">
            <Compass className="h-4 w-4 text-blue-500 animate-spin" style={{ animationDuration: '10s' }} />
            <span className="font-bold text-slate-800">AI ПДР Помічник © 2026</span>
          </div>
          <p className="max-w-md mx-auto leading-normal">
            Сучасний освітній інструмент підготовки до іспитів на отримання посвідчення водія України. MVP версія без серверної бази даних.
          </p>
          
          <div className="flex items-center justify-center space-x-3 text-3xs font-bold uppercase tracking-wider font-mono">
            <button 
              onClick={handleResetLocalStorage}
              id="reset-stats-btn"
              className="text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
            >
              Очистити прогрес навчання
            </button>
            <span>•</span>
            <span className="flex items-center text-slate-400">
              Зроблено з <Heart className="mx-1 h-3 w-3 text-rose-500 fill-current animate-pulse" /> в Україні
            </span>
          </div>
        </div>
      </footer>

      {/* Developer Diagnostic Portal overlay */}
      <DiagnosticPanel activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
