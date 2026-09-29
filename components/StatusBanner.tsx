'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { AlertTriangle, Clock, RefreshCw, XCircle, CheckCircle2, Loader2 } from 'lucide-react';

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
        className={`mb-6 p-5 rounded-3xl border ${
          isExpired
            ? 'bg-rose-500/10 border-rose-500/20 text-rose-900 dark:text-rose-200'
            : 'bg-amber-500/10 border-amber-500/20 text-amber-900 dark:text-amber-200'
        } backdrop-blur-md shadow-sm`}
      >
        <div className="flex items-start gap-3 mb-4">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${
              isExpired ? 'bg-rose-500/20 text-rose-600' : 'bg-amber-500/20 text-amber-600'
            }`}
          >
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold mb-1">
              {isExpired
                ? 'الاشتراك منتهي حالياً. هل ترغب في تجديده أم إلغائه؟'
                : 'موعد تجديد الاشتراك حان الآن. حدد حالتك الحالية.'}
            </p>
            <p className="text-xs opacity-80">
              يمكنك تحديث حالة الاشتراك للحفاظ على دقة التحليلات والتنبيهات.
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowRenew(true)}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 flex items-center gap-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>تم تجديد الاشتراك</span>
          </button>
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 text-xs sm:text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            <XCircle className="w-4 h-4 text-rose-500" />
            <span>تم إلغاء الاشتراك</span>
          </button>
        </div>
        {error && <p className="text-xs text-rose-600 mt-2 font-bold">{error}</p>}
      </div>

      {showRenew && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-bold mb-2 text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              تأكيد تجديد الاشتراك
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              سيتم تحديث تاريخ بداية الاشتراك لليوم وحساب تاريخ التجديد القادم تلقائياً.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleRenew}
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>نعم، تم التجديد</span>}
              </button>
              <button
                onClick={() => setShowRenew(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 font-bold text-xs sm:text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
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
