import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const CATEGORY_LABELS: Record<string, string> = {
  delivery: 'توصيل',
  fitness: 'لياقة',
  entertainment: 'ترفيهية',
  telecom: 'اتصالات',
  software: 'برامج',
};

export default async function AlternativesPage() {
  const supabase = await createClient();

  const { data: alternatives } = await supabase
    .from('alternatives')
    .select('*')
    .order('category');

  const grouped = (alternatives ?? []).reduce<
    Record<string, typeof alternatives>
  >((acc, alt) => {
    if (!alt) return acc;
    if (!acc[alt.category]) acc[alt.category] = [];
    acc[alt.category]!.push(alt);
    return acc;
  }, {});

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="text-2xl font-bold text-brand-600">
            سِجل
          </Link>
          <Link
            href="/dashboard"
            className="text-sm px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
          >
            ← رجوع
          </Link>
        </div>

                       <p className="text-gray-600 dark:text-gray-300 text-lg mb-10">
          اقتراحات لخدمات من كل تصنيف، تختار منها اللي يناسبك.
        </p>

        <div className="space-y-10">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h2 className="text-xl font-bold mb-4 text-brand-600">
                {CATEGORY_LABELS[category] ?? category}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(items ?? []).map((alt) => (
                  <div
                    key={alt!.id}
                    className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
                  >
                    <h3 className="font-bold text-lg mb-1">{alt!.name_ar}</h3>
                    <p className="text-xs text-gray-400 mb-3" dir="ltr">
                      {alt!.name_en}
                    </p>
                    {alt!.note_ar && (
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        {alt!.note_ar}
                      </p>
                    )}
                    {alt!.url && (
                      <a
                        href={alt!.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-brand-600 font-semibold hover:underline"
                      >
                        زيارة الموقع →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
