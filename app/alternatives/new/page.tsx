'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const CATEGORIES = [
  { value: 'delivery', label: 'توصيل' },
  { value: 'fitness', label: 'لياقة' },
  { value: 'entertainment', label: 'ترفيهية' },
  { value: 'telecom', label: 'اتصالات' },
  { value: 'software', label: 'برامج' },
  { value: 'other', label: 'أخرى' },
];

export default function NewAlternativePage() {
  const router = useRouter();
  const supabase = createClient();

  const [category, setCategory] = useState('other');
  const [nameAr, setNameAr] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [url, setUrl] = useState('');
  const [noteAr, setNoteAr] = useState('');
  const [noteEn, setNoteEn] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.from('alternatives').insert({
      category,
      name_ar: nameAr,
      name_en: nameEn,
      url,
      note_ar: noteAr,
      note_en: noteEn,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push('/alternatives');
    router.refresh();
  }

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/alternatives"
          className="text-sm text-gray-500 hover:text-brand-600 mb-6 inline-block"
        >
          ← رجوع للبدائل
        </Link>

        <h1 className="text-2xl font-bold mb-6">إضافة بديل جديد</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4"
        >
          <Field label="التصنيف">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input"
            >
              {CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="الاسم بالعربي">
            <input
              type="text"
              required
              value={nameAr}
              onChange={(e) => setNameAr(e.target.value)}
              className="input"
              placeholder="مثال: بودي ماستر"
            />
          </Field>

          <Field label="الاسم بالإنجليزي">
            <input
              type="text"
              required
              value={nameEn}
              onChange={(e) => setNameEn(e.target.value)}
              className="input"
              placeholder="Body Masters"
              dir="ltr"
            />
          </Field>

          <Field label="الرابط (اختياري)">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="input"
              placeholder="https://..."
              dir="ltr"
            />
          </Field>

          <Field label="ملاحظة بالعربي (اختياري)">
            <textarea
              value={noteAr}
              onChange={(e) => setNoteAr(e.target.value)}
              className="input"
              rows={2}
              placeholder="وصف مختصر"
            />
          </Field>

          <Field label="ملاحظة بالإنجليزي (اختياري)">
            <textarea
              value={noteEn}
              onChange={(e) => setNoteEn(e.target.value)}
              className="input"
              rows={2}
              placeholder="Short description"
              dir="ltr"
            />
          </Field>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 transition disabled:opacity-50"
          >
            {loading ? 'جاري الحفظ...' : 'حفظ البديل'}
          </button>
        </form>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          border: 1px solid rgb(229 231 235);
          background: transparent;
          outline: none;
        }
        .input:focus {
          border-color: rgb(20 184 166);
        }
        .dark .input {
          border-color: rgb(55 65 81);
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      {children}
    </div>
  );
}
