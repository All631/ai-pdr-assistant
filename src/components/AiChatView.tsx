import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Trash2, Bot, User, BrainCircuit, AlertOctagon, CornerDownLeft, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const SUGGESTED_PROMPTS = [
  "Яка дозволена швидкість для початківців (стаж до 2 років)?",
  "Принцип дії правила 'права рука' (перешкода праворуч)",
  "Чим відрізняється зупинка від стоянки?",
  "Яка черговість сигналів регулювальника перед знаками?"
];

// Simple formatter to parse **bold** and \n into beautiful HTML elements safely
function formatMessageContent(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="font-extrabold text-slate-900 bg-slate-100/50 px-1 rounded">{part.slice(2, -2)}</strong>;
    }
    // Handle newlines
    const subParts = part.split('\n');
    return subParts.map((sub, sIdx) => (
      <React.Fragment key={`${index}-${sIdx}`}>
        {sub}
        {sIdx < subParts.length - 1 && <br />}
      </React.Fragment>
    ));
  });
}

export default function AiChatView() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem('pdr_ai_chat_history_v1');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load chat history:", e);
    }
    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: "Вітаю! Я ваш інтерактивний AI-асистент з Правил дорожнього руху України. 🚗💨\n\nВи можете запитати мене про будь-яку тему: швидкісні ліміти, дорожні знаки, пріоритети на перехрестях, правила зупинки/стоянки, штрафи за порушення або про екзаменаційні нюанси.\n\nЗадайте мені запитання або скористайтеся готовим шаблоном нижче!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKeyError, setApiKeyError] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('pdr_ai_chat_history_v1', JSON.stringify(messages));
    } catch (e) {
      console.error("Failed to save chat history:", e);
    }
  }, [messages]);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setApiKeyError(null);
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      const conversationHistory = [...messages, userMsg].map(m => ({
        role: m.role,
        content: m.content
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ messages: conversationHistory })
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === 'OPENAI_KEY_MISSING' || !process.env.OPENAI_API_KEY) {
          setApiKeyError(data.message || "Для роботи системи тестування AI необхідно додати OPENAI_API_KEY.");
        } else {
          throw new Error(data.message || "Внутрішня помилка сервера при запиті");
        }
        setIsLoading(false);
        return;
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply || "На жаль, мені не вдалося отримати змістовну відповідь. Спробуйте сформулювати питання інакше.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      setApiKeyError(err.message || "Сталася неочікувана помилка зв'язку з сервером.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Ви впевнені, що хочете очистити історію листування з AI? Повернути її буде неможливо.")) {
      const welcome: ChatMessage = {
        id: 'msg-welcome',
        role: 'assistant',
        content: "Історію очищено. Я готовий відповісти на ваші нові запитання щодо ПДР України. Про що хотіли б запитати?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([welcome]);
      setApiKeyError(null);
    }
  };

  return (
    <div className="py-2 flex flex-col h-[calc(100vh-12rem)] min-h-[500px]" id="ai-chat-view-section">
      {/* Search and stats bar */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5 shrink-0">
        <div>
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
              AI Модель нового покоління
            </span>
            <span className="text-xs text-slate-400 font-mono">OpenAI gpt-4o-mini</span>
          </div>
          <h1 className="mt-2 font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Консультація з AI-помічником</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Отримуйте детальні роз&apos;яснення дорожнього законодавства від штучного інтелекту у режимі реального часу.
          </p>
        </div>

        <button
          onClick={handleClearHistory}
          title="Очистити історію чату"
          id="clear-chat-history-btn"
          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 hover:text-rose-600 hover:border-rose-100 transition-all cursor-pointer shadow-sm"
        >
          <Trash2 className="h-4 w-4" /> Очистити діалог
        </button>
      </div>

      {/* Main chat window container */}
      <div className="flex-1 flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        {/* Messages scroller box */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar" id="messages-scroller-box">
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 max-w-[85%] ${isAssistant ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
                  id={`chat-bubble-${msg.id}`}
                >
                  {/* Avatar wrapper */}
                  <div className={`h-8 w-8 rounded-xl flex items-center justify-center shrink-0 shadow-3xs ${
                    isAssistant 
                      ? 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {isAssistant ? <Bot className="h-4.5 w-4.5" /> : <User className="h-4.5 w-4.5" />}
                  </div>

                  {/* Message bubble */}
                  <div className="space-y-1">
                    <div className={`rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      isAssistant
                        ? 'bg-slate-50 text-slate-800 rounded-tl-none border border-slate-100/50'
                        : 'bg-blue-600 text-white rounded-tr-none shadow-sm shadow-blue-100/50'
                    }`}>
                      <p className="whitespace-pre-wrap">{formatMessageContent(msg.content)}</p>
                    </div>
                    <span className="block text-4xs font-mono text-slate-400 text-right px-0.5">{msg.timestamp}</span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* AI Thinking Animation */}
          {isLoading && (
            <div className="flex gap-3 max-w-[80%] mr-auto" id="ai-loading-indicator">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center animate-pulse shadow-3xs">
                <Bot className="h-4.5 w-4.5" />
              </div>
              <div className="bg-slate-50 border border-slate-100/50 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce delay-75" />
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce delay-150" />
                <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce delay-200" />
                <span className="text-4xs text-slate-400 font-mono ml-1">Аналізую кодекс ПДР...</span>
              </div>
            </div>
          )}

          {/* API Key configuration error block */}
          {apiKeyError && (
            <div className="rounded-xl border border-rose-100 bg-rose-50/50 p-4.5 mx-auto max-w-xl text-center space-y-3 shadow-3xs" id="api-key-error-card">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-100 text-rose-600">
                <AlertOctagon className="h-5.5 w-5.5" />
              </div>
              <div className="space-y-1 text-xs">
                <p className="font-bold text-rose-900">Помилка налаштування AI-ключа</p>
                <p className="text-rose-700 leading-normal">
                  {apiKeyError}
                </p>
              </div>
              <div className="text-3xs font-mono text-slate-500 bg-white p-2.5 rounded-lg border border-rose-100 uppercase tracking-wide">
                Змінна: OPENAI_API_KEY у файлі .env
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested interactive starters */}
        {messages.length <= 2 && (
          <div className="px-4 py-3.5 bg-slate-50/50 border-t border-slate-100 shrink-0" id="chat-starters-tray">
            <p className="text-4xs uppercase tracking-widest font-bold text-slate-400 mb-2 font-mono flex items-center gap-1.5">
              <BrainCircuit className="h-3.5 w-3.5 text-blue-500" /> Швидкі теми для обговорення:
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="rounded-full bg-white hover:bg-blue-50/50 hover:text-blue-700 border border-slate-200/80 px-3.5 py-1.5 text-4xs font-medium text-slate-600 shadow-3xs transition-all cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input box form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage(inputValue);
          }}
          className="border-t border-slate-100 p-4 shrink-0 flex items-center gap-2.5 bg-white"
          id="chat-input-form"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            placeholder={isLoading ? "Будь ласка, зачекайте..." : "Поставте питання по ПДР України (наприклад, яка швидкість у житловій зоні?)..."}
            className="flex-1 rounded-xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 px-4 py-3 text-xs focus:bg-white focus:border-blue-500 focus:outline-none transition-all disabled:opacity-60"
            id="chat-message-input"
          />

          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            id="chat-submit-btn"
            className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center transition-all hover:bg-blue-500 disabled:bg-slate-100 disabled:text-slate-400 cursor-pointer shadow-sm active:scale-95 shrink-0"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>
      </div>

      {/* Footer warning stamp */}
      <p className="text-5xs font-mono text-slate-400 text-center mt-3 uppercase tracking-widest">
        * Відповіді AI базуються на офіційному кодексі ПДР України. Завжди перевіряйте критичні дорожні ситуації.
      </p>
    </div>
  );
}
