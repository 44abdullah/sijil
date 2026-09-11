import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50">
        <Link href="/" className="text-2xl font-bold text-brand-600">
          سِجل
        </Link>
        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-brand-600 px-3 py-2"
          >
            دخول
          </Link>
          <Link
            href="/signup"
            className="text-sm px-4 py-2 rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition"
          >
            ابدأ الآن
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 md:py-28">
        <div className="inline-block px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300 text-xs font-semibold mb-6">
          إدارة الاشتراكات بالسعودية
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight max-w-4xl">
          كل اشتراكاتك في مكان واحد
        </h1>

        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-10 leading-relaxed">
          سِجل ينبهك قبل تجديد اشتراكاتك عشان ما تتفاجأ، ويقترح لك بدائل
          سعودية أفضل. تابع مصاريفك الشهرية والسنوية بسهولة.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/signup"
            className="px-8 py-4 rounded-xl bg-brand-600 text-white text-lg font-semibold hover:bg-brand-700 transition shadow-lg shadow-brand-600/20"
          >
            ابدأ الآن مجانًا
          </Link>
          <Link
            href="/alternatives"
            className="px-8 py-4 rounded-xl border border-gray-200 dark:border-gray-700 text-lg font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            شوف البدائل
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            ليش سِجل؟
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
            كل اللي تحتاجه لإدارة اشتراكاتك في مكان واحد.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard
              icon="🔔"
              title="تنبيهات ذكية"
              desc="نرسل لك إيميل قبل التجديد حسب مدة اشتراكك. تختار: تجدد، تغير، أو تلغي."
            />
            <FeatureCard
              icon="🇸🇦"
              title="بدائل سعودية"
              desc="نقترح لك خدمات سعودية مثل هنقرستيشن، وقت اللياقة، وبودي ماستر."
            />
            <FeatureCard
              icon="📊"
              title="تقارير واضحة"
              desc="شوف كم تصرف شهريًا وسنويًا على اشتراكاتك، وعلى أي خدمة."
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            كيف يشتغل سِجل؟
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-12">
            ثلاث خطوات بسيطة.
          </p>

          <div className="space-y-6">
            <Step
              number="1"
              title="سجل حسابك"
              desc="بإيميلك وكلمة مرور. فعّل إيميلك عشان توصلك التنبيهات."
            />
            <Step
              number="2"
              title="أضف اشتراكاتك"
              desc="هنقرستيشن، شاهد، وقت اللياقة، أو أي اشتراك ثاني. نضبط لك التنبيه تلقائيًا."
            />
            <Step
              number="3"
              title="خلك مرتاح"
              desc="قبل ما يتجدد اشتراكك، يوصلك إيميل. تقرر وش تبي تسوي."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 bg-brand-600 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            جاهز تتحكم باشتراكاتك؟
          </h2>
          <p className="text-lg mb-8 opacity-90">
            سجل الآن مجانًا. ما نطلب بطاقة بنكية.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 rounded-xl bg-white text-brand-600 text-lg font-semibold hover:bg-gray-100 transition"
          >
            ابدأ الآن
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 text-center text-sm text-gray-500 border-t border-gray-100 dark:border-gray-800">
        © {new Date().getFullYear()} سِجل — كل الحقوق محفوظة
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  desc,
}: {
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 transition">
      <div className="w-14 h-14 rounded-2xl bg-brand-50 dark:bg-brand-900/30 flex items-center justify-center text-3xl mb-5">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

function Step({
  number,
  title,
  desc,
}: {
  number: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-5 items-start p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
      <div className="w-12 h-12 rounded-full bg-brand-600 text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
        {number}
      </div>
      <div>
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
          {desc}
        </p>
      </div>
    </div>
  );
}
