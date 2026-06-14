import React, { useState } from 'react';
import { AppTab } from '../types';
import { BookOpen, Award, CheckCircle2, Menu, X, Flame, ShieldAlert, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NavbarProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  streak: number;
  totalCorrect: number;
  totalAnswered: number;
}

export default function Navbar({ activeTab, setActiveTab, streak, totalCorrect, totalAnswered }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const tabs = [
    { id: 'home' as AppTab, label: 'Головна' },
    { id: 'learning' as AppTab, label: 'Навчання' },
    { id: 'topics' as AppTab, label: 'Правила ПДР' },
    { id: 'testing' as AppTab, label: 'Тестування' },
    { id: 'stats' as AppTab, label: 'Статистика' },
    { id: 'ai-chat' as AppTab, label: 'Запитати AI' },
  ];

  const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

  return (
    <header id="main-navbar" className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <div 
          onClick={() => setActiveTab('home')} 
          className="flex cursor-pointer items-center space-x-2.5 transition-opacity hover:opacity-90"
          id="navbar-brand"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-100">
            <Sparkles className="h-5 w-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-display text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                AI ПДР Помічник
              </span>
              <span className="hidden sm:inline-block items-center rounded-full bg-blue-50 px-1.5 py-0.5 text-3xs font-medium text-blue-700 ring-1 ring-blue-700/10 ring-inset">
                MVP
              </span>
            </div>
            <p className="hidden sm:block text-4xs font-medium tracking-wider text-slate-400 uppercase">Освітня Платформа</p>
          </div>
        </div>

        {/* Desktop Nav Tabs */}
        <nav className="hidden md:ml-6 md:flex md:space-x-1" id="desktop-nav">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`relative px-4 py-2 text-sm font-semibold transition-colors focus:outline-none ${
                  isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
                {isActive && (
                  <motion.div
                    layoutId="active-nav-indicator"
                    className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-blue-600"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Stats Block */}
        <div className="hidden items-center space-x-4 md:flex" id="navbar-stats">
          {/* Daily Streak */}
          <div className="flex items-center space-x-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-600/10 ring-inset">
            <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span>{streak} {streak === 1 ? 'день' : streak < 5 ? 'дні' : 'днів'}</span>
          </div>

          {/* Accuracy Score */}
          <div className="flex items-center space-x-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/1 ring-inset">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>Успішність: {accuracy}%</span>
          </div>
        </div>

        {/* Hamburger Menu (Mobile) */}
        <div className="flex items-center md:hidden" id="mobile-menu-control">
          {/* Mobile quick fire */}
          <div className="mr-3 flex items-center space-x-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
            <Flame className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span>{streak}</span>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            id="mobile-hamburger-btn"
            className="inline-flex items-center justify-center rounded-lg p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 focus:outline-none"
            aria-expanded="false"
          >
            <span className="sr-only">Toggle menu</span>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="mobile-nav-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.15 }}
            className="border-b border-slate-100 bg-white md:hidden"
          >
            <div className="space-y-1.5 px-3 py-4">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    id={`mobile-tab-btn-${tab.id}`}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setIsOpen(false);
                    }}
                    className={`block w-full rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
              {/* Mobile Stats Summary */}
              <div className="mt-4 border-t border-slate-100 pt-3 flex items-center justify-between px-4 text-xs text-slate-500">
                <div className="flex items-center space-x-1">
                  <Flame className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span>Ударний режим: {streak} дн.</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Відсоток відповідей: {accuracy}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
