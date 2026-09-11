'use client';

import { SubscribeFromAlternative } from '@/components/SubscribeFromAlternative';

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
          <h3 className="text-lg font-bold mb-4 text-brand-600">
            {CATEGORY_LABELS[category] ?? category}
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {items.map((alt) => (
              <div
                key={alt.id}
                className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
              >
                <h4 className="font-bold text-lg mb-1">{alt.name_ar}</h4>
                <p className="text-xs text-gray-400 mb-3" dir="ltr">
                  {alt.name_en}
                </p>
                {alt.note_ar && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {alt.note_ar}
                  </p>
                )}
                {alt.url && (
                  <a
                    href={alt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand-600 font-semibold hover:underline inline-block mb-3"
                  >
                    زيارة الموقع →
                  </a>
                )}
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
