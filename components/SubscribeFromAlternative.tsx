'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Plus, X, Loader2, CheckCircle2 } from 'lucide-react';

const BILLING_CYCLES = [
  { value: 'weekly', label: 'أسبوعي', days: 7 },
  { value: 'monthly', label: 'شهري', days: 30 },
  { value: 'quarterly', label: '3 شهور', days: 90 },
  { value: 'semiannual', label: '6 شهور', days: 180 },
  { value: 'yearly', label: 'سنوي', days: 365 },
];

function getDefaultReminder(cycle: string) {
  switch (cycle) {
    case 'yearly':
      return 14;
    case 'semiannual':
      return 7;
    case 'quarterly':
      return 5;
    case 'monthly':
      return 3;
    case 'weekly':
      return 1;
    default:
      return 3;
  }
}

type Props = {
  alternativeName: string;
  category: string;
  url?: string;
  imageUrl?: string;
  defaultPrice?: number;
  defaultCurrency?: string;
  defaultBillingCycle?: string;
  defaultPlan?: string;
};

export function SubscribeFromAlternative({
  alternativeName,
  category,
  url,
  imageUrl,
  defaultPrice,
  defaultCurrency = 'SAR',
  defaultBillingCycle = 'monthly',
  defaultPlan,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState(defaultPrice != null ? String(defaultPrice) : '');
  const [currency, setCurrency] = useState(defaultCurrency);
  const [billingCycle, setBillingCycle] = useState(defaultBillingCycle);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [reminderDays, setReminderDays] = useState(getDefaultReminder(defaultBillingCycle));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleCycleChange(cycle: string) {
    setBillingCycle(cycle);
    setReminderDays(getDefaultReminder(cycle));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const cycle = BILLING_CYCLES.find((c) => c.value === billingCycle)!;
    const start = new Date(startDate);
    const renewal = new Date(start);
    renewal.setDate(renewal.getDate() + cycle.days);

    const { error } = await supabase.from('subscriptions').insert({
      user_id: user.id,
      name: alternativeName,
      category,
      price: Number(price),
      currency,
      billing_cycle: billingCycle,
      cycle_days: cycle.days,
      start_date: startDate,
      renewal_date: renewal.toISOString().split('T')[0],
      status: 'active',
      reminder_days: reminderDays,
      cancel_url: url ?? '',
      image_url: imageUrl ?? null,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setOpen(false);
    router.push('/dashboard');
    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 mt-3"
      >
        <Plus className="w-4 h-4" />
        <span>إضافة لاشتراكاتي</span>
      </button>

      {open && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">إضافة اشتراك جديد</h3>
                <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{alternativeName}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-xl text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">السعر الافتراضي</label>
                <div className="grid grid-cols-[1fr_100px] gap-2">
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:border-emerald-500 focus:outline-none"
                    placeholder="أدخل سعر الباقة"
                    dir="ltr"
                  />
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:border-emerald-500 focus:outline-none"
                    dir="ltr"
                  >
                    <option value="SAR">SAR</option>
                    <option value="USD">USD</option>
                    <option value="AED">AED</option>
                  </select>
                </div>
                {defaultPlan && (
                  <p className="text-[11px] text-slate-400 mt-1.5">القيمة المقترحة لباقة: {defaultPlan}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">مدة التجديد</label>
                <select
                  value={billingCycle}
                  onChange={(e) => handleCycleChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:border-emerald-500 focus:outline-none"
                >
                  {BILLING_CYCLES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">تاريخ بداية الاشتراك</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:border-emerald-500 focus:outline-none"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  التنبيه قبل التجديد بـ (أيام)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={reminderDays}
                  onChange={(e) => setReminderDays(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white text-sm focus:border-emerald-500 focus:outline-none"
                  dir="ltr"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-bold">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-md shadow-emerald-600/25 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{loading ? 'جاري الحفظ...' : 'تأكيد الحفظ'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
