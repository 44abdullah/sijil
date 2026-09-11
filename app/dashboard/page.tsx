import { EmailVerificationBanner } from '@/components/EmailVerificationBanner';
import { SubscriptionsFilter } from '@/components/SubscriptionsFilter';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SpendingChart } from '@/components/SpendingChart';
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

  const emailVerified = user.email_confirmed_at != null;
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

  
  const categoryTotals = Object.entries(
    subs
      .filter((s) => s.status === 'active')
      .reduce<Record<string, number>>((acc, s) => {
        const cyclesPerMonth: Record<string, number> = {
          weekly: 4.33,
          monthly: 1,
          quarterly: 1 / 3,
          semiannual: 1 / 6,
          yearly: 1 / 12,
        };
        const factor = cyclesPerMonth[s.billing_cycle] ?? 1;
        acc[s.category] = (acc[s.category] ?? 0) + Number(s.price) * factor;
        return acc;
      }, {})
  ).map(([category, total]) => ({ category, total }));

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
         <div className="flex gap-2 items-center">
  <ThemeToggle />
  <Link
    href="/settings"
    className="text-sm px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
  >
    الإعدادات
  </Link>
           <Link
    href="/alternatives"
    className="text-sm px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
  >
    البدائل
  </Link>
  <form action="/auth/signout" method="post">
    <button
      type="submit"
      className="text-sm px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
    >
      خروج
    </button>
  </form>
</div>
        </div>
        {/* Email verification banner */}
        {!emailVerified && user.email && (
          <EmailVerificationBanner email={user.email} />
        )}

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
        
        {/* Chart */}
        {subs.length > 0 && (
          <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 mb-8">
            <h2 className="text-lg font-bold mb-4">الصرف حسب التصنيف</h2>
            <SpendingChart data={categoryTotals} />
          </div>
        )}

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
        <SubscriptionsFilter subs={subs} />
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
