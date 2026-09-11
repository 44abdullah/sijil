import { StatusBanner } from '@/components/StatusBanner';
import { DeleteSubscriptionButton } from '@/components/DeleteSubscriptionButton';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

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

  const daysLeft = Math.ceil(
    (new Date(sub.renewal_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-brand-600 mb-6 inline-block"
        >
          ← رجوع للوحة التحكم
        </Link>
        <StatusBanner
          subscriptionId={sub.id}
          status={sub.status}
          billingCycle={sub.billing_cycle}
        />

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1">{sub.name}</h1>
              <p className="text-sm text-gray-500">
                {statusLabels[sub.status] ?? sub.status}
              </p>
            </div>
            <span className="text-sm px-3 py-1 rounded-full bg-brand-50 text-brand-700">
              {daysLeft > 0 ? `باقي ${daysLeft} يوم` : `متأخر ${Math.abs(daysLeft)} يوم`}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <InfoRow label="السعر" value={`${Number(sub.price).toFixed(2)} ${sub.currency}`} />
            <InfoRow label="المدة" value={sub.billing_cycle} />
            <InfoRow label="تاريخ البداية" value={sub.start_date} />
            <InfoRow label="تاريخ التجديد" value={sub.renewal_date} />
            <InfoRow label="التنبيه قبل" value={`${sub.reminder_days} يوم`} />
            {sub.payment_method && (
              <InfoRow label="طريقة الدفع" value={sub.payment_method} />
            )}
          </div>

          {sub.notes && (
            <div className="mb-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-900">
              <p className="text-sm text-gray-500 mb-1">ملاحظات</p>
              <p className="text-sm">{sub.notes}</p>
            </div>
          )}

                   <div className="flex gap-3 flex-wrap">
            <Link
              href={`/dashboard/${sub.id}/edit`}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-sm"
            >
              تعديل
            </Link>
            {sub.cancel_url && (
              <a
                href={sub.cancel_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg bg-brand-50 text-brand-700 hover:bg-brand-100 text-sm"
              >
                رابط الإلغاء
              </a>
            )}
            <DeleteSubscriptionButton id={sub.id} />
          </div>
        </div>
      </div>
    </main>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className="text-sm font-medium" dir="auto">
        {value}
      </p>
    </div>
  );
}
