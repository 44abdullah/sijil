import { StatusBanner } from '@/components/StatusBanner';
import { DeleteSubscriptionButton } from '@/components/DeleteSubscriptionButton';
import { SendNotificationButton } from '@/components/SendNotificationButton';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { 
  ArrowRight, 
  Edit3, 
  ExternalLink, 
  Clock, 
  CreditCard, 
  Calendar, 
  BellRing,
  FileText,
  Tag
} from 'lucide-react';

export default async function SubscriptionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: sub } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!sub) {
    notFound();
  }

  const statusLabels: Record<string, string> = {
    active: 'فعّال',
    awaiting_renewal: 'بانتظار تجديد',
    trial: 'تجريبي',
    expired: 'منتهي',
    cancelled: 'ملغي',
  };

  const cycleLabels: Record<string, string> = {
    weekly: 'أسبوعي',
    monthly: 'شهري',
    quarterly: 'كل 3 شهور',
    semiannual: 'كل 6 شهور',
    yearly: 'سنوي',
  };

  const daysLeft = Math.ceil(
    (new Date(sub.renewal_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 p-4 sm:p-6 md:p-10 bg-mesh pb-20">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للوحة التحكم</span>
        </Link>

        <StatusBanner
          subscriptionId={sub.id}
          status={sub.status}
          billingCycle={sub.billing_cycle}
        />

        <div className="bg-white/80 dark:bg-slate-900/80 p-6 sm:p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8 pb-6 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-4">
              {sub.image_url && (
                <img
                  src={sub.image_url}
                  alt={`شعار ${sub.name}`}
                  className="w-16 h-16 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  referrerPolicy="no-referrer"
                />
              )}
              <div>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 block">
                تفاصيل الاشتراك
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">{sub.name}</h1>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {statusLabels[sub.status] ?? sub.status}
              </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-3 py-1.5 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                {daysLeft > 0 ? `متبقي ${daysLeft} يوم للتجديد` : `متأخر ${Math.abs(daysLeft)} يوم`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-8">
            <InfoItem
              icon={<CreditCard className="w-4 h-4 text-emerald-500" />}
              label="السعر والعملة"
              value={`${Number(sub.price).toFixed(2)} ${sub.currency || 'SAR'}`}
            />
            <InfoItem
              icon={<Clock className="w-4 h-4 text-emerald-500" />}
              label="دورة الاشتراك"
              value={cycleLabels[sub.billing_cycle] || sub.billing_cycle}
            />
            <InfoItem
              icon={<Calendar className="w-4 h-4 text-emerald-500" />}
              label="تاريخ البداية"
              value={sub.start_date}
            />
            <InfoItem
              icon={<Calendar className="w-4 h-4 text-emerald-500" />}
              label="تاريخ التجديد القادم"
              value={sub.renewal_date}
            />
            <InfoItem
              icon={<BellRing className="w-4 h-4 text-emerald-500" />}
              label="التنبيه المسبق"
              value={`قبل ${sub.reminder_days} أيام`}
            />
            {sub.payment_method && (
              <InfoItem
                icon={<CreditCard className="w-4 h-4 text-emerald-500" />}
                label="طريقة الدفع"
                value={sub.payment_method}
              />
            )}
          </div>

          {sub.notes && (
            <div className="mb-8 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                <span>ملاحظات إضافية</span>
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">{sub.notes}</p>
            </div>
          )}

          <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2 flex-wrap items-center">
              <SendNotificationButton subscriptionId={sub.id} />

              <Link
                href={`/dashboard/${sub.id}/edit`}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
              >
                <Edit3 className="w-4 h-4" />
                <span>تعديل التفاصيل</span>
              </Link>

              {sub.cancel_url && (
                <a
                  href={sub.cancel_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>صفحة إلغاء الخدمة</span>
                </a>
              )}
            </div>

            <DeleteSubscriptionButton id={sub.id} />
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-semibold mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-base font-extrabold text-slate-900 dark:text-white" dir="auto">
        {value}
      </p>
    </div>
  );
}
