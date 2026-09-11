'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

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

      // نحصل على اسم البوت
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
    if (!confirm('هل تبي تفصل حسابك من تيليجرام؟')) return;
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
    <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 mb-6">
      <h2 className="text-lg font-bold mb-2">ربط تيليجرام</h2>
      <p className="text-sm text-gray-500 mb-4">
        فعّل هذي الميزة عشان توصلك تنبيهات الاشتراكات على تيليجرام بدل الإيميل (أو معه).
      </p>

      {loading ? (
        <p className="text-sm text-gray-400">جاري التحميل...</p>
      ) : linked ? (
        <div className="flex items-center justify-between p-4 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900">
          <div>
            <p className="text-sm font-semibold text-green-800 dark:text-green-300">
              ✅ مربوط
            </p>
            {username && (
              <p className="text-xs text-green-700 dark:text-green-400 mt-1" dir="ltr">
                @{username}
              </p>
            )}
          </div>
          <button
            onClick={handleUnlink}
            className="text-xs px-3 py-1.5 rounded-lg border border-red-300 text-red-700 hover:bg-red-50"
          >
            فصل
          </button>
        </div>
      ) : (
        <a
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700"
        >
          اربط حسابك الآن
        </a>
      )}
    </section>
  );
}
