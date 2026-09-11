'use client';

import { useState } from 'react';
import { ManualSubscriptionForm } from '@/components/ManualSubscriptionForm';
import { SuggestionsList } from '@/components/SuggestionsList';

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
      <div className="flex gap-2 mb-6 p-1 rounded-xl bg-gray-100 dark:bg-gray-800">
        <button
          onClick={() => setTab('manual')}
          className={`flex-1 py-3 rounded-lg text-sm font-semibold transition ${
            tab === 'manual'
              ? 'bg-white dark:bg-gray-700 text-brand-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
          }`}
        >
          إضافة يدوية
        </button>
        <button
          onClick={() => setTab('suggestions')}
          className={`flex-1 py-3 rounded-lg text-sm font-semibold transition ${
            tab === 'suggestions'
              ? 'bg-white dark:bg-gray-700 text-brand-600 shadow-sm'
              : 'text-gray-600 dark:text-gray-400 hover:text-gray-900'
          }`}
        >
          اختيار من المقترحات
        </button>
      </div>

      {tab === 'manual' ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
          <ManualSubscriptionForm />
        </div>
      ) : (
        <div>
          <p className="text-sm text-gray-500 mb-6">
            اختر خدمة، وعبّئ السعر والمدة — بنضيفها لك على طول.
          </p>
          <SuggestionsList alternatives={alternatives} />
        </div>
      )}
    </div>
  );
}
