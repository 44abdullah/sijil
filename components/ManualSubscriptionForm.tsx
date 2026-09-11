'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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

function getDefaultReminder(cycle: string) {
  switch (cycle) {
    case 'yearly':
      return 14;
    case 'semiannual':
      return 7;
    case 'quarterly':
      return 5;
    case 'monthly':
      return 3;
    case 'weekly':
      return 1;
    default:
      return 3;
  }
}

export function ManualSubscriptionForm() {
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('other');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('SAR');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [reminderDays, setReminderDays] = useState(3);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cancelUrl, setCancelUrl] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleCycleChange(cycle: string) {
    setBillingCycle(cycle);
    setReminderDays(getDefaultReminder(cycle));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push('/login');
      return;
    }

    const cycle = BILLING_CYCLES.find((c) => c.value === billingCycle)!;
    const start = new Date(startDate);
    const renewal = new Date(start);
    renewal.setDate(renewal.getDate() + cycle.days);

    const { error } = await supabase.from('subscriptions').insert({
      user_id: user.id,
      name,
      category,
      price: Number(price),
      currency,
      billing_cycle: billingCycle,
      cycle_days: cycle.days,
      start_date: startDate,
      renewal_date: renewal.toISOString().split('T')[0],
      status: 'active',
      reminder_days: reminderDays,
      notes,
      payment_method: paymentMethod,
      cancel_url: cancelUrl,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="اسم الاشتراك">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input"
          placeholder="مثال: هنقرستيشن، وقت اللياقة، شاهد"
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
            placeholder="29"
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
          onChange={(e) => handleCycleChange(e.target.value)}
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
        <p className="text-xs text-gray-500 mt-1">
          افتراضي حسب مدة الاشتراك، تقدر تعدله.
        </p>
      </Field>

      <Field label="طريقة الدفع (اختياري)">
        <input
          type="text"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="input"
          placeholder="مدى، Apple Pay، STC Pay..."
        />
      </Field>

      <Field label="رابط الإلغاء (اختياري)">
        <input
          type="url"
          value={cancelUrl}
          onChange={(e) => setCancelUrl(e.target.value)}
          className="input"
          placeholder="https://..."
          dir="ltr"
        />
      </Field>

      <Field label="ملاحظات (اختياري)">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="input"
          rows={3}
          placeholder="أي شي تبي تتذكره"
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
        {loading ? 'جاري الحفظ...' : 'حفظ الاشتراك'}
      </button>

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
    </form>
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
