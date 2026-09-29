import { EmailVerificationBanner } from '@/components/EmailVerificationBanner';
import { SubscriptionsFilter } from '@/components/SubscriptionsFilter';
import { ThemeToggle } from '@/components/ThemeToggle';
import { SpendingChart } from '@/components/SpendingChart';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { 
  Plus, 
  Layers, 
  Settings, 
  Sparkles, 
  LogOut, 
  CreditCard, 
  Calendar, 
  CheckCircle2, 
  TrendingUp,
  User
} from 'lucide-react';

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
    <main className="min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 p-4 sm:p-6 md:p-10 bg-mesh pb-20">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-sm">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-black text-slate-900 dark:text-white block leading-none">
                  سِجل<span className="text-emerald-500">.</span>
                </span>
                <span className="text-xs text-slate-400 font-medium">إدارة الاشتراكات</span>
              </div>
            </Link>

            <div className="hidden sm:flex items-center gap-2 mr-4 pr-4 border-r border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 max-w-[180px] truncate" dir="ltr">
                {user.email}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <ThemeToggle />

            <Link
              href="/alternatives"
              className="text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>البدائل</span>
            </Link>

            <Link
              href="/settings"
              className="text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors flex items-center gap-1.5"
            >
              <Settings className="w-4 h-4 text-slate-500" />
              <span>الإعدادات</span>
            </Link>

            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="text-xs sm:text-sm font-semibold px-3.5 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/50 text-rose-600 dark:text-rose-400 border border-rose-200/50 dark:border-rose-900/50 transition-colors flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>خروج</span>
              </button>
            </form>
          </div>
        </header>

        {/* Email verification banner */}
        {!emailVerified && user.email && (
          <EmailVerificationBanner email={user.email} />
        )}

        {/* Welcome Section & Add CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              لوحة التحكم
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              نظرة عامة على مصاريفك وتنبيهات تجديد اشتراكاتك
            </p>
          </div>

          <Link
            href="/dashboard/new"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>إضافة اشتراك جديد</span>
          </Link>
        </div>

        {/* KPI Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <StatCard
            icon={<CreditCard className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
            iconBg="bg-emerald-500/10 dark:bg-emerald-500/15"
            label="المصروف الشهري"
            value={`${monthlyTotal.toLocaleString('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ر.س`}
            accentColor="emerald"
            badge="مستمر"
          />
          <StatCard
            icon={<Calendar className="w-6 h-6 text-teal-600 dark:text-teal-400" />}
            iconBg="bg-teal-500/10 dark:bg-teal-500/15"
            label="المصروف السنوي المتوقع"
            value={`${yearlyTotal.toLocaleString('ar-SA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ر.س`}
            accentColor="teal"
            badge="تقديري"
          />
          <StatCard
            icon={<CheckCircle2 className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />}
            iconBg="bg-cyan-500/10 dark:bg-cyan-500/15"
            label="الاشتراكات الفعّالة"
            value={`${activeCount} اشتراك`}
            accentColor="cyan"
            badge="نشط"
          />
        </div>
        
        {/* Spending Chart */}
        {subs.length > 0 && (
          <div className="p-6 sm:p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-500" />
                  توزيع المصاريف حسب التصنيف
                </h2>
                <p className="text-xs text-slate-400 mt-1">نسبة التكاليف الشهرية الموزعة على كل قطاع</p>
              </div>
            </div>
            <SpendingChart data={categoryTotals} />
          </div>
        )}

        {/* Subscriptions Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">قائمة الاشتراكات</h2>
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
              إجمالي: {subs.length}
            </span>
          </div>

          <SubscriptionsFilter subs={subs} />
        </div>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  iconBg,
  label,
  value,
  accentColor,
  badge,
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string;
  accentColor: string;
  badge: string;
}) {
  return (
    <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
          {badge}
        </span>
      </div>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{label}</p>
      <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        {value}
      </p>
    </div>
  );
}
