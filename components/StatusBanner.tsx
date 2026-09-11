'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

const BILLING_CYCLES = [
  { value: 'weekly', days: 7 },
  { value: 'monthly', days: 30 },
  { value: 'quarterly', days: 90 },
  { value: 'semiannual', days: 180 },
  { value: 'yearly', days: 365 },
];

type Props = {
  subscriptionId: string;
  status: string;
  billingCycle: string;
};

export function StatusBanner({ subscriptionId, status, billingCycle }: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [showRenew, setShowRenew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (status !== 'awaiting_renewal' && status !== 'expired') {
    return null;
  }

  const isExpired = status === 'expired';

  async function handleRenew() {
    setLoading(true);
    setError('');

    const cycle = BILLING_CYCLES.find((c) => c.value === billingCycle);
    const days = cycle?.days ?? 30;

    const today = new Date();
    const newRenewal = new Date(today);
    newRenewal.setDate(newRenewal.getDate() + days);

    const { error } = await supabase
      .from('subscriptions')
      .update({
        status: 'active',
        start_date: today.toISOString().split('T')[0],
        renewal_date: newRenewal.toISOString().split('T')[0],
      })
      .eq('id', subscriptionId);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setShowRenew(false);
    router.refresh();
  }

  async function handleCancel() {
    setLoading(true);
    const { error } = await supabase
      .from('subscriptions')
      .update({ status: 'cancelled' })
      .eq('id', subscriptionId);

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.refresh();
  }

  return (
    <>
      <div
        className={`mb-6 p-4 rounded-2xl border ${
          isExpired
            ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-900'
            : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-900'
        }`}
      >
        <p
          className={`text-sm font-semibold mb-3 ${
            isExpired
              ? 'text-red-800 dark:text-red-300'
              : 'text-yellow-800 dark:text-yellow-300'
          }`}
        >
          {isExpired
            ? '⏰ هذا الاشتراك منتهي. جدده، ولا ألغه.'
            : '⏰ هذا الاشتراك تجدد. أكد وش تبي تسوي.'}
        </p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowRenew(true)}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-50"
          >
            جددت الاشتراك
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50"
          >
            ألغيت الاشتراك
          </button>
        </div>
        {error && (
          <p className="text-xs text-red-700 mt-2">{error}</p>
        )}
      </div>

      {showRenew && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-2">تأكيد التجديد</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              بنحدّث تاريخ البداية لليوم، وبنضبط تاريخ التجديد الجديد
              حسب مدة الاشتراك.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleRenew}
                disabled={loading}
                className="flex-1 py-2 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 disabled:opacity-50"
              >
                {loading ? 'جاري...' : 'نعم، جددته'}
              </button>
              <button
                onClick={() => setShowRenew(false)}
                className="flex-1 py-2 rounded-lg border border-gray-200 dark:border-gray-700 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
