'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';

const BILLING_CYCLES = [
  { value: 'weekly', label: 'أسبوعي', days: 7 },
  { value: 'monthly', label: 'شهري', days: 30 },
  { value: 'quarterly', label: '3 شهور', days: 90 },
  { value: 'semiannual', label: '6 شهور', days: 180 },
  { value: 'yearly', label: 'سنوي', days: 365 },
];

const CATEGORIES = [
  { value: 'delivery', label: 'توصيل' },
  { value: 'fitness', label: 'لياقة' },
  { value: 'entertainment', label: 'ترفيهية' },
  { value: 'telecom', label: 'اتصالات' },
  { value: 'software', label: 'برامج' },
  { value: 'other', label: 'أخرى' },
];

export default function EditSubscriptionPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [category, setCategory] = useState('other');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('SAR');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [startDate, setStartDate] = useState('');
  const [renewalDate, setRenewalDate] = useState('');
  const [reminderDays, setReminderDays] = useState(3);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cancelUrl, setCancelUrl] = useState('');

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('id', params.id)
        .single();

      if (error || !data) {
        setError('ما لقينا الاشتراك');
        setLoading(false);
        return;
      }

      setName(data.name);
      setCategory(data.category);
      setPrice(String(data.price));
      setCurrency(data.currency);
      setBillingCycle(data.billing_cycle);
      setStartDate(data.start_date);
      setRenewalDate(data.renewal_date);
      setReminderDays(data.reminder_days);
      setNotes(data.notes ?? '');
      setPaymentMethod(data.payment_method ?? '');
      setCancelUrl(data.cancel_url ?? '');
      setLoading(false);
    }
    load();
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const cycle = BILLING_CYCLES.find((c) => c.value === billingCycle)!;

    const { error } = await supabase
      .from('subscriptions')
      .update({
        name,
        category,
        price: Number(price),
        currency,
        billing_cycle: billingCycle,
        cycle_days: cycle.days,
        start_date: startDate,
        renewal_date: renewalDate,
        reminder_days: reminderDays,
        notes,
        payment_method: paymentMethod,
        cancel_url: cancelUrl,
      })
      .eq('id', params.id);

    setSaving(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push(`/dashboard/${params.id}`);
    router.refresh();
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>جاري التحميل...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <Link
          href={`/dashboard/${params.id}`}
          className="text-sm text-gray-500 hover:text-brand-600 mb-6 inline-block"
        >
          ← رجوع
        </Link>

        <h1 className="text-2xl font-bold mb-6">تعديل الاشتراك</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4"
        >
          <Field label="اسم الاشتراك">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
            />
          </Field>

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

          <div className="grid grid-cols-2 gap-4">
            <Field label="السعر">
              <input
                type="number"
                step="0.01"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="input"
                dir="ltr"
              />
            </Field>
            <Field label="العملة">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="input"
              >
                <option value="SAR">ريال سعودي</option>
                <option value="USD">دولار</option>
                <option value="AED">درهم</option>
              </select>
            </Field>
          </div>

          <Field label="مدة الاشتراك">
            <select
              value={billingCycle}
              onChange={(e) => setBillingCycle(e.target.value)}
              className="input"
            >
              {BILLING_CYCLES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>

          <Field label="تاريخ البداية">
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input"
              dir="ltr"
            />
          </Field>

          <Field label="تاريخ التجديد">
            <input
              type="date"
              required
              value={renewalDate}
              onChange={(e) => setRenewalDate(e.target.value)}
              className="input"
              dir="ltr"
            />
          </Field>

          <Field label="التنبيه قبل كم يوم؟">
            <input
              type="number"
              required
              min={1}
              value={reminderDays}
              onChange={(e) => setReminderDays(Number(e.target.value))}
              className="input"
              dir="ltr"
            />
          </Field>

          <Field label="طريقة الدفع (اختياري)">
            <input
              type="text"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="input"
            />
          </Field>

          <Field label="رابط الإلغاء (اختياري)">
            <input
              type="url"
              value={cancelUrl}
              onChange={(e) => setCancelUrl(e.target.value)}
              className="input"
              dir="ltr"
            />
          </Field>

          <Field label="ملاحظات (اختياري)">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input"
              rows={3}
            />
          </Field>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 transition disabled:opacity-50"
          >
            {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
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
