'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function EmailVerificationBanner({ email }: { email: string }) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  async function handleResend() {
    setLoading(true);
    setMessage('');
    setError('');

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage('وصلك رابط التفعيل على إيميلك. افتحه عشان تفعّل الحساب.');
  }

  return (
    <div className="mb-6 p-4 rounded-2xl border border-yellow-200 dark:border-yellow-900 bg-yellow-50 dark:bg-yellow-900/20">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-1">
            ⚠️ إيميلك غير مفعّل
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-400 mb-3">
            عشان توصلك تنبيهات الاشتراكات، لازم تفعّل إيميلك. افتح إيميلك
            واضغط على الرابط اللي وصلك.
          </p>

          {message && (
            <p className="text-xs text-green-700 dark:text-green-400 mb-2">
              ✅ {message}
            </p>
          )}
          {error && (
            <p className="text-xs text-red-700 dark:text-red-400 mb-2">
              ❌ {error}
            </p>
          )}

          <button
            onClick={handleResend}
            disabled={loading}
            className="text-xs px-3 py-1.5 rounded-lg bg-yellow-600 text-white font-semibold hover:bg-yellow-700 disabled:opacity-50"
          >
            {loading ? 'جاري الإرسال...' : 'أعد إرسال رابط التفعيل'}
          </button>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 text-lg"
          aria-label="إغلاق"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
