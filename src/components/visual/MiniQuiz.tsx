import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  section: string;
}

interface MiniQuizProps {
  blockId: string;
  title: string;
  questions: QuizQuestion[];
  answers: Record<string, number>;
  submitted: Record<string, boolean>;
  onAnswer: (questionId: string, optionIndex: number, isCorrect: boolean) => void;
}

export function MiniQuiz({
  blockId,
  title,
  questions,
  answers,
  submitted,
  onAnswer,
}: MiniQuizProps) {
  const handleSelect = (questionId: string, optionIndex: number, correctIndex: number) => {
    if (submitted[questionId]) return;
    onAnswer(questionId, optionIndex, optionIndex === correctIndex);
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
