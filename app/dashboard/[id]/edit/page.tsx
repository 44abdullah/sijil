'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ArrowRight, Save, Loader2, Edit } from 'lucide-react';

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
        setError('لم يتم العثور على الاشتراك');
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
      <main className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#0b0f19] text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 p-4 sm:p-6 md:p-10 bg-mesh pb-20">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          href={`/dashboard/${params.id}`}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>إلغاء التعديل والعودة</span>
        </Link>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Edit className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">تعديل معلومات الاشتراك</h1>
            <p className="text-xs text-slate-500">قم بتحديث قيم الاشتراك أو تواريخ التجديد والتنبيه</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/80 dark:bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-sm space-y-5"
        >
          <Field label="اسم الاشتراك">
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-input"
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

          <Field label="مدة الاشتراك">
            <select
              value={billingCycle}
              onChange={(e) => setBillingCycle(e.target.value)}
              className="form-input"
            >
              {BILLING_CYCLES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="تاريخ البداية">
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="form-input"
                dir="ltr"
              />
            </Field>

            <Field label="تاريخ التجديد القادم">
              <input
                type="date"
                required
                value={renewalDate}
                onChange={(e) => setRenewalDate(e.target.value)}
                className="form-input"
                dir="ltr"
              />
            </Field>
          </div>

          <Field label="التنبيه قبل كم يوم؟">
            <input
              type="number"
              required
              min={1}
              value={reminderDays}
              onChange={(e) => setReminderDays(Number(e.target.value))}
              className="form-input"
              dir="ltr"
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="طريقة الدفع (اختياري)">
              <input
                type="text"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="form-input"
              />
            </Field>

            <Field label="رابط الإلغاء (اختياري)">
              <input
                type="url"
                value={cancelUrl}
                onChange={(e) => setCancelUrl(e.target.value)}
                className="form-input"
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
            />
          </Field>

          {error && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
            <span>{saving ? 'جاري حفظ التغييرات...' : 'حفظ التغييرات الآن'}</span>
          </button>
        </form>
      </div>

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
      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">{label}</label>
      {children}
    </div>
  );
}
