import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: subscriptions } = await supabase
    .from('subscriptions')
    .select('*')
    .order('renewal_date', { ascending: true });

  const subs = subscriptions ?? [];

  const activeCount = subs.filter((s) => s.status === 'active').length;

  const monthlyTotal = subs
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => {
      const cyclesPerMonth: Record<string, number> = {
        weekly: 4.33,
        monthly: 1,
        quarterly: 1 / 3,
        semiannual: 1 / 6,
        yearly: 1 / 12,
      };
      const factor = cyclesPerMonth[s.billing_cycle] ?? 1;
      return sum + Number(s.price) * factor;
    }, 0);

  const yearlyTotal = monthlyTotal * 12;

  return (
    <main className="min-h-screen p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link href="/" className="text-2xl font-bold text-brand-600">
              سِجل
            </Link>
            <p className="text-sm text-gray-500 mt-1">{user.email}</p>
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="text-sm px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              خروج
            </button>
          </form>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <StatCard
            label="صرف شهري"
            value={`${monthlyTotal.toFixed(2)} ريال`}
          />
          <StatCard
            label="صرف سنوي"
            value={`${yearlyTotal.toFixed(2)} ريال`}
          />
          <StatCard label="اشتراكات فعّالة" value={String(activeCount)} />
        </div>

        {/* Add button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">اشتراكاتك</h2>
          <Link
            href="/dashboard/new"
            className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700"
          >
            + إضافة اشتراك
          </Link>
        </div>

        {/* Subscriptions */}
        {subs.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 mb-4">
              ما عندك أي اشتراك بعد.
            </p>
            <Link
              href="/dashboard/new"
              className="inline-block px-6 py-3 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700"
            >
              أضف أول اشتراك
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subs.map((sub) => (
              <SubscriptionCard key={sub.id} sub={sub} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}

function SubscriptionCard({ sub }: { sub: any }) {
  const statusColors: Record<string, string> = {
    active: 'bg-green-100 text-green-700',
    awaiting_renewal: 'bg-yellow-100 text-yellow-700',
    trial: 'bg-blue-100 text-blue-700',
    expired: 'bg-gray-100 text-gray-700',
    cancelled: 'bg-red-100 text-red-700',
  };

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
    <Link
      href={`/dashboard/${sub.id}`}
      className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-brand-500 transition block"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-bold text-lg">{sub.name}</h3>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            statusColors[sub.status] ?? statusColors.active
          }`}
        >
          {statusLabels[sub.status] ?? sub.status}
        </span>
      </div>
      <p className="text-sm text-gray-500 mb-3">
        {Number(sub.price).toFixed(2)} {sub.currency}
      </p>
      <p className="text-xs text-gray-400">
        {daysLeft > 0 ? `باقي ${daysLeft} يوم` : `متأخر ${Math.abs(daysLeft)} يوم`}
      </p>
    </Link>
  );
}
