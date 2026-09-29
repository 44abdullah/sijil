'use client';

import { SubscribeFromAlternative } from '@/components/SubscribeFromAlternative';
import { ExternalLink, Tag } from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
  delivery: 'توصيل',
  fitness: 'لياقة',
  entertainment: 'ترفيهية',
  telecom: 'اتصالات',
  software: 'برامج',
  other: 'أخرى',
};

type Alternative = {
  id: string;
  category: string;
  name_ar: string;
  name_en: string;
  url: string | null;
  note_ar: string | null;
  note_en: string | null;
};

export function SuggestionsList({ alternatives }: { alternatives: Alternative[] }) {
  const grouped = alternatives.reduce<Record<string, Alternative[]>>(
    (acc, alt) => {
      if (!acc[alt.category]) acc[alt.category] = [];
      acc[alt.category]!.push(alt);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-10">
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category}>
          <h3 className="text-base font-extrabold mb-4 text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
            <Tag className="w-4 h-4" />
            <span>{CATEGORY_LABELS[category] ?? category}</span>
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {items.map((alt) => (
              <div
                key={alt.id}
                className="p-5 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/40 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-extrabold text-base text-slate-900 dark:text-white">{alt.name_ar}</h4>
                      <p className="text-xs text-slate-400 font-medium" dir="ltr">
                        {alt.name_en}
                      </p>
                    </div>
                    {alt.url && (
                      <a
                        href={alt.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                        title="زيارة الموقع"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  {alt.note_ar && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                      {alt.note_ar}
                    </p>
                  )}
                </div>

                <SubscribeFromAlternative
                  alternativeName={alt.name_ar}
                  category={alt.category}
                  url={alt.url ?? undefined}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
