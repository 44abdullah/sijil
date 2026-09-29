import Link from 'next/link';
import { ThemeToggle } from '@/components/ThemeToggle';
import { 
  Bell, 
  ShieldCheck, 
  TrendingUp, 
  Sparkles, 
  ArrowLeft, 
  CheckCircle2, 
  CreditCard, 
  Calendar,
  Layers,
  Smartphone,
  ChevronLeft
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100 overflow-x-hidden relative bg-mesh">
      {/* Glow decorations */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-slow" />
      <div className="absolute top-1/3 left-10 w-80 h-80 bg-teal-500/10 dark:bg-teal-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <header className="w-full px-6 py-4 border-b border-slate-200/60 dark:border-slate-800/60 sticky top-0 bg-white/70 dark:bg-[#0b0f19]/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-200">
              <Layers className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              سِجل<span className="text-emerald-500">.</span>
            </span>
          </Link>

          <nav className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 px-4 py-2 rounded-xl transition-colors"
            >
              تسجيل الدخول
            </Link>
            <Link
              href="/signup"
              className="text-sm font-semibold px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              ابدأ مجاناً
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 pt-16 pb-20 md:pt-24 md:pb-28 relative">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold mb-8 backdrop-blur-sm shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span>منصة إدارة الاشتراكات الذكية بالسعودية 🇸🇦</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 leading-tight max-w-4xl tracking-tight">
          كل اشتراكاتك في مكان واحد <br className="hidden sm:inline" />
          <span className="gradient-text">بدون مفاجآت تجديد</span>
        </h1>

        <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mb-10 leading-relaxed font-normal">
          سِجل ينبهك عبر الإيميل وتيليجرام قبل تجديد اشتراكاتك، ويحسب مصاريفك الشهرية والسنوية بدقة، ويقترح عليك بدائل سعودية أفضل موفرة للمال.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto mb-16">
          <Link
            href="/signup"
            className="px-8 py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-base font-bold transition-all shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:-translate-y-1 flex items-center justify-center gap-2 group"
          >
            <span>ابدأ الآن مجاناً</span>
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/alternatives"
            className="px-8 py-4 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 text-slate-800 dark:text-slate-200 text-base font-bold hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>استكشف البدائل السعودية</span>
            <Sparkles className="w-4 h-4 text-emerald-500" />
          </Link>
        </div>

        {/* Hero Interactive App Mockup Preview */}
        <div className="w-full max-w-4xl rounded-3xl border border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-2xl p-4 sm:p-6 md:p-8 text-right relative overflow-hidden group">
          <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500" />
          
          <div className="flex items-center justify-between pb-6 border-b border-slate-100 dark:border-slate-800/80 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="text-xs font-medium px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              لوحة التحكم العصرية
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/20 text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">المصروف الشهري</p>
              <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">485.00 ر.س</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">المصروف السنوي المتوقع</p>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-200">5,820.00 ر.س</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-right">
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">الاشتراكات النشطة</p>
              <p className="text-xl font-bold text-slate-800 dark:text-slate-200">6 اشتراكات</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-right">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/40 text-orange-600 flex items-center justify-center font-bold text-lg">
                  🍔
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">هنقرستيشن بلس</h4>
                  <p className="text-xs text-slate-400">تجديد خلال 3 أيام</p>
                </div>
              </div>
              <div className="text-left">
                <p className="font-bold text-sm text-slate-900 dark:text-white">39 ر.س</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-semibold">
                  فعّال
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-slate-100 dark:border-slate-700/80 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center font-bold text-lg">
                  🎬
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">شاهد VIP</h4>
                  <p className="text-xs text-slate-400">تجديد بعد 18 يوم</p>
                </div>
              </div>
              <div className="text-left">
                <p className="font-bold text-sm text-slate-900 dark:text-white">49 ر.س</p>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 font-semibold">
                  فعّال
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-24 bg-white/50 dark:bg-slate-900/40 border-y border-slate-200/60 dark:border-slate-800/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold tracking-wider uppercase mb-2 block">
              مميزات سِجل
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              كل ما تحتاجه للتحكم الكامل بمصاريفك
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mt-3 max-w-xl mx-auto text-base">
              صُمم سِجل خصيصاً ليلائم احتياجات المستخدم في المملكة العربية السعودية.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Bell className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
              title="تنبيهات مسبقة وذكية"
              desc="توصلك إشعارات على الإيميل والتليجرام قبل موعد التجديد بوقت كافٍ لتتخذ قرار الاستمرار أو الإلغاء."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
              title="بدائل سعودية موفرة"
              desc="نقترح عليك أفضل الخدمات والبدائل المحلية المناسبة لتوفير المال ودعم المنتجات الوطنية."
            />
            <FeatureCard
              icon={<TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />}
              title="تحليلات وتقارير مالية"
              desc="رسوم بيانية تفاعلية وتوزيع دقيق لمصروفاتك حسب التصنيفات (ترفيه، توصيل، لياقة، اتصالات)."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-emerald-600 dark:text-emerald-400 text-sm font-bold uppercase mb-2 block">
              خطوات بسيطة
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              كيف يعمل سِجل؟
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <StepCard
              number="1"
              title="أنشئ حسابك مجاناً"
              desc="سجل عبر البريد الإلكتروني في أقل من دقيقة وبدون الحاجة لربط أي بطاقات بنكية."
            />
            <StepCard
              number="2"
              title="أضف اشتراكاتك"
              desc="اختر من القائمة الجاهزة (مثل هنقرستيشن، وقت اللياقة، STC) أو أضف اشتراكك الخاص."
            />
            <StepCard
              number="3"
              title="استمتع بالراحة والتنبيهات"
              desc="استلم التنبيهات المباشرة قبل أي سحب مالي وتابع تحليلات مصاريفك بوضوح."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-5xl mx-auto rounded-3xl bg-gradient-to-r from-emerald-600 to-teal-700 p-8 sm:p-14 text-white text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 relative z-10 leading-tight">
            جاهز لتوفير أموالك والتحكم باشتراكاتك؟
          </h2>
          <p className="text-base sm:text-lg mb-8 opacity-95 max-w-xl mx-auto relative z-10 font-medium">
            انضم الآن إلى سِجل وابدأ في تنظيم مصاريفك الشهرية بذكاء. الحساب مجاني تماماً.
          </p>
          <div className="relative z-10">
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 px-9 py-4 rounded-2xl bg-white text-emerald-800 font-extrabold text-base hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <span>سجّل حسابك المجاني</span>
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-10 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 text-center text-sm text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200">
            <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-xs">
              S
            </div>
            <span>سِجل منصة إدارية سعودية</span>
          </div>
          <p>© {new Date().getFullYear()} سِجل — جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-8 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1">
      <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

function StepCard({
  number,
  title,
  desc,
}: {
  number: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-8 rounded-3xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col justify-between shadow-sm relative overflow-hidden">
      <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-extrabold text-xl flex items-center justify-center mb-6 shadow-md shadow-emerald-600/20">
        {number}
      </div>
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}
