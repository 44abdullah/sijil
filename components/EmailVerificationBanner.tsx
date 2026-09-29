'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { AlertTriangle, MailCheck, X, Loader2, CheckCircle2 } from 'lucide-react';

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

    setMessage('تم إرسال رابط التفعيل إلى بريدك الإلكتروني بنجاح!');
  }

  return (
    <div className="p-5 rounded-3xl border border-amber-500/30 bg-amber-500/10 dark:bg-amber-500/15 text-amber-900 dark:text-amber-200 backdrop-blur-md relative overflow-hidden shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200 mb-1">
              البريد الإلكتروني بحاجة للتأكيد
            </h4>
            <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mb-3 leading-relaxed max-w-xl">
              لتتمكن من استقبال التنبيهات المباشرة قبل تجديد أي اشتراك، يرجى تفعيل البريد الإلكتروني الخاص بك.
            </p>

            {message && (
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-3 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>{message}</span>
              </p>
            )}
            {error && (
              <p className="text-xs font-bold text-rose-700 dark:text-rose-400 mb-3">
                {error}
              </p>
            )}

            <button
              onClick={handleResend}
              disabled={loading}
              className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white transition-all shadow-md shadow-amber-600/20 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <MailCheck className="w-3.5 h-3.5" />}
              <span>{loading ? 'جاري الإرسال...' : 'إعادة إرسال رابط التفعيل'}</span>
            </button>
          </div>
        </div>

        <button
          onClick={() => setDismissed(true)}
          className="p-1 rounded-xl text-amber-700 dark:text-amber-400 hover:bg-amber-500/20 transition-colors"
          aria-label="إغلاق"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
