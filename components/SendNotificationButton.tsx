'use client';

import { useState } from 'react';
import { Bell, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export function SendNotificationButton({ subscriptionId }: { subscriptionId: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function handleSend() {
    if (loading) return;
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch('/api/notify/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setStatus({
          type: 'error',
          message: data.error || 'فشل إرسال التنبيه',
        });
      } else {
        const details = [];
        if (data.telegramSent) details.push('تيليجرام');
        if (data.emailSent) details.push('الإيميل');

        setStatus({
          type: 'success',
          message: details.length > 0 ? `تم عبر: ${details.join(' و ')}` : 'تم الإرسال بنجاح!',
        });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'تعذر الاتصال بالخادم',
      });
    } finally {
      setLoading(false);
      setTimeout(() => {
        setStatus(null);
      }, 5000);
    }
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={handleSend}
        disabled={loading}
        className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-emerald-950/40 text-slate-700 hover:text-emerald-700 dark:text-slate-300 dark:hover:text-emerald-400 text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1.5 border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-500/30"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
        ) : (
          <Bell className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
        )}
        <span>{loading ? 'جاري الإرسال...' : 'تجربة تنبيه'}</span>
      </button>

      {status && (
        <div
          className={`absolute left-0 mt-2 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap z-20 shadow-xl border flex items-center gap-1.5 backdrop-blur-md ${
            status.type === 'success'
              ? 'bg-emerald-900/90 text-emerald-100 border-emerald-700'
              : 'bg-rose-900/90 text-rose-100 border-rose-700'
          }`}
        >
          {status.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{status.message}</span>
        </div>
      )}
    </div>
  );
}