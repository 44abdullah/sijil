import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-brand-600">سِجل</span>
        </div>
        <nav className="flex items-center gap-4">
          <Link
            href="/login"
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-brand-600"
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
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          كل اشتراكاتك في مكان واحد
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mb-10">
          سِجل ينبهك قبل تجديد اشتراكاتك عشان ما تتفاجأ، ويقترح لك بدائل سعودية
          أفضل.
        </p>
        <Link
          href="/signup"
          className="px-8 py-4 rounded-xl bg-brand-600 text-white text-lg font-semibold hover:bg-brand-700 transition shadow-lg shadow-brand-600/20"
        >
          ابدأ الآن مجانًا
        </Link>
      </section>

      {/* Features */}
      <section className="px-6 py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <FeatureCard
            title="تنبيهات ذكية"
            desc="نرسل لك إيميل قبل التجديد حسب مدة اشتراكك."
          />
          <FeatureCard
            title="بدائل سعودية"
            desc="نقترح لك خدمات سعودية مثل هنقرستيشن ووقتي."
          />
          <FeatureCard
            title="تقارير واضحة"
            desc="شوف كم تصرف شهريًا وسنويًا على اشتراكاتك."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-6 text-center text-sm text-gray-500 border-t border-gray-100 dark:border-gray-800">
        © {new Date().getFullYear()} سِجل - كل الحقوق محفوظة
      </footer>
    </main>
  );
}

function FeatureCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
        {desc}
      </p>
    </div>
  );
}
