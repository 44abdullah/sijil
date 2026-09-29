import { SubscribeFromAlternative } from '@/components/SubscribeFromAlternative';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Sparkles, ArrowRight, ExternalLink, Layers, Tag } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export const dynamic = 'force-dynamic';

const CATEGORY_LABELS: Record<string, string> = {
  delivery: 'توصيل وتطبيقات',
  fitness: 'لياقة ورياضة',
  entertainment: 'ترفيه وبث',
  telecom: 'اتصالات وانترنت',
  software: 'برامج وأدوات',
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
    <main className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 p-4 sm:p-6 md:p-10 bg-mesh pb-20">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center justify-between gap-4 p-4 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-sm">
          <Link href="/dashboard" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-xl font-black text-slate-900 dark:text-white">
              سِجل<span className="text-emerald-500">.</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
              <span>لوحة التحكم</span>
            </Link>
          </div>
        </header>

        {/* Title Section */}
        <div className="text-right">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-3 border border-emerald-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>البدائل المحلية والخدمات الموصى بها</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">دليل البدائل والخدمات السعودية</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 max-w-2xl">
            قائمة منسقة بأفضل الخدمات المحلية، يمكنك تصفحها وزيارة موقعها أو إضافتها بضغطة زر إلى جدول اشتراكاتك.
          </p>
        </div>

        {/* Grouped alternatives grid */}
        <div className="space-y-12">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="space-y-4">
              <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2 pb-2 border-b border-slate-200/80 dark:border-slate-800/80">
                <Tag className="w-5 h-5 text-emerald-500" />
                <span>{CATEGORY_LABELS[category] ?? category}</span>
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {(items ?? []).map((alt) => (
                  <div
                    key={alt!.id}
                    className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 hover:border-emerald-500/40 transition-all shadow-sm hover:shadow-lg flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-4">
                        <div className="flex items-center gap-3 min-w-0">
                          {alt!.image_url ? (
                            <img
                              src={alt!.image_url}
                              alt={`شعار ${alt!.name_ar}`}
                              className="w-12 h-12 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex-shrink-0"
                              loading="lazy"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0">
                              <Tag className="w-5 h-5" />
                            </div>
                          )}
                          <div className="min-w-0">
                          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">{alt!.name_ar}</h3>
                          <p className="text-xs font-medium text-slate-400" dir="ltr">
                            {alt!.name_en}
                          </p>
                        </div>
                        </div>
                        {alt!.url && (
                          <a
                            href={alt!.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                            title="زيارة الموقع الرسمية"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      {alt!.note_ar && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4 mt-2">
                          {alt!.note_ar}
                        </p>
                      )}
                    </div>

                    <SubscribeFromAlternative
                      alternativeName={alt!.name_ar}
                      category={alt!.category}
                      url={alt!.url ?? undefined}
                      imageUrl={alt!.image_url ?? undefined}
                      defaultPrice={alt!.default_price != null ? Number(alt!.default_price) : undefined}
                      defaultCurrency={alt!.default_currency ?? undefined}
                      defaultBillingCycle={alt!.default_billing_cycle ?? undefined}
                      defaultPlan={alt!.default_plan ?? undefined}
                    />
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
