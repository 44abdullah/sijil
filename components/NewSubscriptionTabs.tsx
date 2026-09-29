'use client';

import { useState } from 'react';
import { ManualSubscriptionForm } from '@/components/ManualSubscriptionForm';
import { SuggestionsList } from '@/components/SuggestionsList';
import { Edit3, Sparkles } from 'lucide-react';

type Alternative = {
  id: string;
  category: string;
  name_ar: string;
  name_en: string;
  url: string | null;
  note_ar: string | null;
  note_en: string | null;
};

export function NewSubscriptionTabs({
  alternatives,
}: {
  alternatives: Alternative[];
}) {
  const [tab, setTab] = useState<'manual' | 'suggestions'>('suggestions');
  
  return (
    <div>
      <div className="flex gap-2 mb-8 p-1.5 rounded-2xl bg-slate-200/60 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md">
        <button
          onClick={() => setTab('suggestions')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            tab === 'suggestions'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span>اختيار من المقترحات السعودية الشائعة</span>
        </button>
        <button
          onClick={() => setTab('manual')}
          className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            tab === 'manual'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-md'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>إضافة يدوية مخصصة</span>
        </button>
      </div>

      {tab === 'manual' ? (
        <div className="bg-white/80 dark:bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-sm">
          <ManualSubscriptionForm />
        </div>
      ) : (
        <div>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6">
            اختر أحد الاشتراكات السعودية الشائعة أدناه وضبط قيمته ومدة تجديده للإضافة السريعة:
          </p>
          <SuggestionsList alternatives={alternatives} />
        </div>
      )}
    </div>
  );
}
