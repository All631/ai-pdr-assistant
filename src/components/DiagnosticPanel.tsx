import React, { useState } from 'react';
import { AppTab } from '../types';
import { Play, Search, Code, Cpu, Sparkles, X, ChevronRight, CheckCircle, AlertTriangle, BookOpen, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DiagnosticPanelProps {
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
}

interface RagChunk {
  id: string;
  section: string;
  content: string;
}

export default function DiagnosticPanel({ activeTab, setActiveTab }: DiagnosticPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [ragResults, setRagResults] = useState<RagChunk[]>([]);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  const [searchError, setSearchError] = useState('');

  const runSimulation = (pass: boolean) => {
    // 1. Redirect to testing tab first
    setActiveTab('testing');
    
    // 2. Distribute full programmatic event with brief pause so testing view mounts
    setTimeout(() => {
      const event = new CustomEvent('simulate-exam', {
        detail: { pass }
      });
      window.dispatchEvent(event);
    }, 200);
  };

  const handleSearchRag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoadingSearch(true);
    setSearchError('');
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: searchQuery }),
      });

      if (!res.ok) {
        throw new Error(`Помилка сервера: код ${res.status}`);
      }

      const data = await res.json();
      setRagResults(data.chunks || []);
    } catch (err: any) {
      console.error(err);
      setSearchError(err.message || 'Помилка виконання пошуку');
    } finally {
      setIsLoadingSearch(false);
    }
  };

  return (
    <>
      {/* Dev Launcher Button */}
      <div className="fixed bottom-6 left-6 z-50" id="diagnostic-launcher-container">
        <button
          onClick={() => setIsOpen(true)}
          id="diagnostic-open-btn"
          className="flex items-center gap-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-100 px-4 py-2.5 text-xs font-bold shadow-xl border border-slate-700/50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <Code className="h-4 w-4 text-blue-400 animate-pulse" />
          <span>Панель діагностики ПДР</span>
          <span className="rounded bg-blue-500/20 px-1 py-0.5 text-4xs text-blue-300 font-mono">dev</span>
        </button>
      </div>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-3xs" id="diagnostic-modal-backdrop">
            {/* Collapse Zone */}
            <div className="flex-1" onClick={() => setIsOpen(false)} />

            {/* Sidebar Module */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md border-l border-slate-800 bg-slate-950 p-6 text-slate-100 shadow-2xl flex flex-col justify-between h-full overflow-y-auto"
              id="diagnostic-drawer"
            >
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                      <Cpu className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display font-medium text-sm text-white">Діагностична Тест-Панель</h3>
                      <p className="text-4xs text-slate-400 font-mono">MVP ПДР України • v2.0 Dev Panel</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    id="diagnostic-close-btn"
                    className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Section 1: Exam Simulator */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-blue-400" />
                    1. Тест-симуляція (20 питань)
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Імітує миттєве заповнення повного іспиту на 20 питань, самостійно розраховує помилки за темами та перенаправляє на екран результатів.
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Simulator Button 1: Pass */}
                    <button
                      onClick={() => runSimulation(true)}
                      id="diag-sim-pass-btn"
                      className="group flex flex-col items-center justify-center p-3 rounded-xl border border-emerald-950 bg-emerald-950/20 hover:bg-emerald-950/40 hover:border-emerald-500 transition-all text-left cursor-pointer"
                    >
                      <CheckCircle className="h-6 w-6 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-emerald-300">Пройти іспит</span>
                      <span className="text-4xs text-slate-400 mt-1">18/20 правильних</span>
                    </button>

                    {/* Simulator Button 2: Fail */}
                    <button
                      onClick={() => runSimulation(false)}
                      id="diag-sim-fail-btn"
                      className="group flex flex-col items-center justify-center p-3 rounded-xl border border-rose-950 bg-rose-950/20 hover:bg-rose-950/40 hover:border-rose-500 transition-all text-left cursor-pointer"
                    >
                      <AlertTriangle className="h-6 w-6 text-rose-400 mb-1 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-bold text-rose-300">Завалити іспит</span>
                      <span className="text-4xs text-slate-400 mt-1">12/20 (слабкі теми)</span>
                    </button>
                  </div>
                </div>

                {/* Section 2: RAG Tester */}
                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1.5">
                    <Search className="h-3.5 w-3.5 text-indigo-400" />
                    2. Контроверсійний RAG-пошук
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Надішліть будь-який пошуковий запит на Express-сервер для перевірки векторного зіставлення відносно бази <code className="text-indigo-400 font-mono bg-indigo-500/10 px-1 py-0.5 rounded text-4xs">pdr_ukraine.txt</code>.
                  </p>

                  <form onSubmit={handleSearchRag} className="flex gap-2">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Швидкість, обгін, знаки..."
                      className="flex-1 rounded-lg bg-slate-900 border border-slate-800 px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                    />
                    <button
                      type="submit"
                      id="diag-run-rag-search-btn"
                      disabled={isLoadingSearch}
                      className="rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {isLoadingSearch ? 'Пошук...' : 'Шукати'}
                    </button>
                  </form>

                  {/* Results Display */}
                  <div className="space-y-2 mt-4 max-h-72 overflow-y-auto pr-1" id="diagnostic-results-viewport">
                    {searchError && (
                      <div className="p-3 bg-red-950/30 text-rose-400 text-3xs font-mono rounded-lg border border-red-900">
                        {searchError}
                      </div>
                    )}

                    {ragResults.length > 0 ? (
                      ragResults.map((chunk, index) => (
                        <div key={chunk.id} className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 text-3xs space-y-1.5">
                          <div className="flex items-center justify-between font-mono font-bold text-slate-400">
                            <span className="text-blue-400 max-w-[200px] truncate">{chunk.section}</span>
                            <span className="text-4xs bg-slate-800 px-1.5 py-0.5 rounded text-indigo-300">#{chunk.id}</span>
                          </div>
                          <p className="text-slate-300 leading-normal font-sans italic">
                            &ldquo;{chunk.content}&rdquo;
                          </p>
                        </div>
                      ))
                    ) : searchQuery && !isLoadingSearch ? (
                      <p className="text-4xs text-slate-500 text-center py-4">Збігів у векторній базі не знайдено.</p>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Bottom Info bar */}
              <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-between text-4xs font-mono text-slate-500">
                <span>Порт розробки: 3000</span>
                <span>Аналітика AI ПДР</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
