'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Loader2, Save, CreditCard, Tag, Calendar, BellRing, Link2, FileText, CheckCircle2 } from 'lucide-react';

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
  const [imageUrl, setImageUrl] = useState('');

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
      image_url: imageUrl || null,
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="اسم الاشتراك">
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="form-input"
          placeholder="مثال: هنقرستيشن، وقت اللياقة، شاهد VIP"
        />
      </Field>

      <Field label="التصنيف">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="form-input"
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
            className="form-input"
            placeholder="29.00"
            dir="ltr"
          />
        </Field>
        <Field label="العملة">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="form-input"
          >
            <option value="SAR">ريال سعودي (SAR)</option>
            <option value="USD">دولار (USD)</option>
            <option value="AED">درهم (AED)</option>
          </select>
        </Field>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="مدة الاشتراك">
          <select
            value={billingCycle}
            onChange={(e) => handleCycleChange(e.target.value)}
            className="form-input"
          >
            {BILLING_CYCLES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>

        <Field label="تاريخ بداية الاشتراك">
          <input
            type="date"
            required
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="form-input"
            dir="ltr"
          />
        </Field>
      </div>

      <Field label="التنبيه قبل كم يوم من التجديد؟">
        <input
          type="number"
          required
          min={1}
          value={reminderDays}
          onChange={(e) => setReminderDays(Number(e.target.value))}
          className="form-input"
          dir="ltr"
        />
        <p className="text-xs text-slate-400 mt-1">
          تم التحديد تلقائياً بناءً على دورة الاشتراك، ويمكنك تخصيص الأيام.
        </p>
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="طريقة الدفع (اختياري)">
          <input
            type="text"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="form-input"
            placeholder="مدى، Apple Pay، STC Pay..."
          />
        </Field>

        <Field label="رابط إلغاء الاشتراك (اختياري)">
          <input
            type="url"
            value={cancelUrl}
            onChange={(e) => setCancelUrl(e.target.value)}
            className="form-input"
            placeholder="https://..."
            dir="ltr"
          />
        </Field>
      </div>

      <Field label="ملاحظات (اختياري)">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="form-input resize-none"
          rows={3}
          placeholder="أي تفاصيل أو شروط ترغب بتدوينها"
        />
      </Field>

      <Field label="رابط صورة أو شعار الاشتراك (اختياري)">
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="form-input"
          placeholder="https://example.com/logo.png"
          dir="ltr"
        />
      </Field>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        <span>{loading ? 'جاري حفظ الاشتراك...' : 'حفظ الاشتراك الآن'}</span>
      </button>

      <style jsx global>{`
        .form-input {
          width: 100%;
          padding: 0.875rem 1.25rem;
          border-radius: 1rem;
          border: 1px solid rgba(226, 232, 240, 0.8);
          background-color: rgba(255, 255, 255, 0.8);
          color: inherit;
          font-size: 0.875rem;
          font-weight: 500;
          outline: none;
          transition: all 0.2s ease;
        }
        .dark .form-input {
          border-color: rgba(31, 45, 70, 0.8);
          background-color: rgba(19, 28, 46, 0.8);
        }
        .form-input:focus {
          border-color: #10b981;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.15);
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
      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
