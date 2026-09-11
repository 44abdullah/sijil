'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

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
};

export function SubscribeFromAlternative({ alternativeName, category, url }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState('');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [reminderDays, setReminderDays] = useState(3);
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
      currency: 'SAR',
      billing_cycle: billingCycle,
      cycle_days: cycle.days,
      start_date: startDate,
      renewal_date: renewal.toISOString().split('T')[0],
      status: 'active',
      reminder_days: reminderDays,
      cancel_url: url ?? '',
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
        className="text-sm px-4 py-2 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 w-full mt-3"
      >
        اشتركت فيه
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold">اشتراك جديد</h3>
                <p className="text-sm text-gray-500 mt-1">{alternativeName}</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">السعر</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent focus:border-brand-500 focus:outline-none"
                  placeholder="29"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">المدة</label>
                <select
                  value={billingCycle}
                  onChange={(e) => handleCycleChange(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent focus:border-brand-500 focus:outline-none"
                >
                  {BILLING_CYCLES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">تاريخ البداية</label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent focus:border-brand-500 focus:outline-none"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  التنبيه قبل كم يوم؟
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  value={reminderDays}
                  onChange={(e) => setReminderDays(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent focus:border-brand-500 focus:outline-none"
                  dir="ltr"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 transition disabled:opacity-50"
              >
                {loading ? 'جاري الحفظ...' : 'حفظ الاشتراك'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
