'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        className="text-sm px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700"
        aria-label="تبديل الثيم"
      >
        🌓
      </button>
    );
  }

  const isDark = resolvedTheme === 'dark';

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="text-sm px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
      aria-label="تبديل الثيم"
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  );
}
