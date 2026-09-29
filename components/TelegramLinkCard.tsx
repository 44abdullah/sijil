'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Send, CheckCircle2, Unlink, Loader2 } from 'lucide-react';

export function TelegramLinkCard() {
  const supabase = createClient();
  const [linked, setLinked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | null>(null);
  const [botUsername, setBotUsername] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data } = await supabase
        .from('telegram_links')
        .select('username, first_name')
        .eq('user_id', user.id)
        .maybeSingle();

      if (data) {
        setLinked(true);
        setUsername(data.username || data.first_name || null);
      }

      try {
        const res = await fetch('/api/telegram/bot-info');
        const json = await res.json();
        if (json.username) setBotUsername(json.username);
      } catch {}

      setLoading(false);
    }
    load();
  }, []);

  async function handleUnlink() {
    if (!confirm('هل تأكد رغبتك في إلغاء ربط حساب تيليجرام؟')) return;
    setLoading(true);

    await supabase.from('telegram_links').delete().eq('user_id', userId);

    setLinked(false);
    setUsername(null);
    setLoading(false);
  }

  const linkUrl = botUsername
    ? `https://t.me/${botUsername}?start=${userId}`
    : '#';

  return (
    <section className="bg-white/80 dark:bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 mb-6 backdrop-blur-xl shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-500 flex items-center justify-center flex-shrink-0">
          <Send className="w-5 h-5 -rotate-45" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">تنبيهات تيليجرام (Telegram)</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            احصل على رسائل تذكير فورية ومباشرة عبر تطبيق تيليجرام قبل موعد الخصم.
          </p>
        </div>
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
            <span>جاري التحميل...</span>
          </div>
        ) : linked ? (
          <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <div>
                <p className="text-sm font-bold text-emerald-800 dark:text-emerald-300">
                  الحساب مربوط بنجاح
                </p>
                {username && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold" dir="ltr">
                    @{username}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleUnlink}
              className="text-xs px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-900 hover:bg-rose-100 transition-colors flex items-center gap-1.5"
            >
              <Unlink className="w-3.5 h-3.5" />
              <span>فصل الحساب</span>
            </button>
          </div>
        ) : (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-sky-500 hover:bg-sky-400 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-sky-500/20"
          >
            <Send className="w-4 h-4 -rotate-45" />
            <span>ربط الحساب عبر تيليجرام الآن</span>
          </a>
        )}
      </div>
    </section>
  );
}
