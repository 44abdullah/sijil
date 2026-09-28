'use client';

import { useState } from 'react';

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
        if (data.emailSent) details.push('البريد الإلكتروني');

        setStatus({
          type: 'success',
          message: details.length > 0 ? `تم الإرسال عبر: ${details.join(' و ')}` : 'تم إرسال التنبيه بنجاح!',
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
        className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium transition disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
      >
        <span>🔔</span>
        <span>{loading ? 'جاري الإرسال...' : 'إرسال تنبيه'}</span>
      </button>

      {status && (
        <div
          className={`absolute left-0 mt-2 px-3 py-1.5 rounded-lg text-xs whitespace-nowrap z-10 shadow-lg border ${
            status.type === 'success'
              ? 'bg-green-50 text-green-800 border-green-200 dark:bg-green-950 dark:text-green-200 dark:border-green-800'
              : 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-200 dark:border-red-800'
          }`}
        >
          {status.message}
        </div>
      )}
    </div>
  );
}