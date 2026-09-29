import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { NewSubscriptionTabs } from '@/components/NewSubscriptionTabs';
import { ArrowRight, PlusCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function NewSubscriptionPage() {
  const supabase = await createClient();

  const { data: alternatives } = await supabase
    .from('alternatives')
    .select('*')
    .order('category');

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 p-4 sm:p-6 md:p-10 bg-mesh pb-20">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للوحة التحكم</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <PlusCircle className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">إضافة اشتراك جديد</h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">سجل اشتراكك لتصلك التنبيهات المسبقة قبل موعد الخصم</p>
          </div>
        </div>

        <NewSubscriptionTabs alternatives={alternatives ?? []} />
      </div>
    </main>
  );
}
