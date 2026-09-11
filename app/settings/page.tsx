'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { createClient } from '@/lib/supabase/client';

export default function SettingsPage() {
  const router = useRouter();
  const supabase = createClient();
  const { theme, setTheme } = useTheme();

  const [email, setEmail] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push('/login');
        return;
      }
      setEmail(data.user.email ?? '');
      setEmailVerified(data.user.email_confirmed_at != null);
    });
  }, []);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword !== confirmPassword) {
      setError('كلمتا المرور غير متطابقتين.');
      return;
    }

    if (newPassword.length < 6) {
      setError('كلمة المرور لازم تكون 6 أحرف على الأقل.');
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password: newPassword });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setMessage('تم تغيير كلمة المرور بنجاح!');
    setNewPassword('');
    setConfirmPassword('');
  }

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-brand-600 mb-6 inline-block"
        >
          ← رجوع للوحة التحكم
        </Link>

        <h1 className="text-2xl font-bold mb-8">الإعدادات</h1>

        {/* Account info */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 mb-6">
          <h2 className="text-lg font-bold mb-4">معلومات الحساب</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 mb-1">الإيميل</p>
              <p className="text-sm font-medium" dir="ltr">
                {email}
              </p>
            </div>
            <span
              className={`text-xs px-3 py-1 rounded-full ${
                emailVerified
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                  : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
              }`}
            >
              {emailVerified ? 'مفعّل ✓' : 'غير مفعّل'}
            </span>
          </div>
        </section>

        {/* Theme */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 mb-6">
          <h2 className="text-lg font-bold mb-4">المظهر</h2>
          {mounted && (
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 py-3 rounded-lg text-sm font-medium border ${
                  theme === 'light'
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                ☀️ فاتح
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 py-3 rounded-lg text-sm font-medium border ${
                  theme === 'dark'
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                🌙 غامق
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`flex-1 py-3 rounded-lg text-sm font-medium border ${
                  theme === 'system'
                    ? 'bg-brand-600 text-white border-brand-600'
                    : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                💻 تلقائي
              </button>
            </div>
          )}
        </section>

        {/* Change password */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-bold mb-4">تغيير كلمة المرور</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                كلمة المرور الجديدة
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent focus:border-brand-500 focus:outline-none"
                placeholder="6 أحرف على الأقل"
                dir="ltr"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-transparent focus:border-brand-500 focus:outline-none"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="p-3 rounded-lg bg-green-50 text-green-700 text-sm">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 transition disabled:opacity-50"
            >
              {loading ? 'جاري الحفظ...' : 'حفظ كلمة المرور'}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
