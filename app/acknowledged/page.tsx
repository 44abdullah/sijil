import Link from 'next/link';

const MESSAGES: Record<string, { title: string; desc: string }> = {
  continue: {
    title: 'تم تجديد اشتراكك',
    desc: 'أعدنا ضبط تاريخ التجديد من اليوم. بننبهك قبل الموعد الجديد.',
  },
  snooze: {
    title: 'تم تأجيل التنبيه',
    desc: 'بننبهك قبل الاشتراك بيوم واحد بدل المدة السابقة.',
  },
  cancel: {
    title: 'تم إلغاء الاشتراك',
    desc: 'غيّرنا حالة الاشتراك إلى "ملغي". ما بنرسل لك تنبيهات له.',
  },
};

export default function AcknowledgedPage({
  searchParams,
}: {
  searchParams: { action?: string };
}) {
  const action = searchParams.action ?? 'continue';
  const msg = MESSAGES[action] ?? MESSAGES.continue;

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full text-center">
        <Link href="/" className="text-3xl font-bold text-brand-600 inline-block mb-8">
          سِجل
        </Link>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl border border-gray-100 dark:border-gray-700">
          <div className="w-16 h-16 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-6 text-3xl">
            ✓
          </div>

          <h1 className="text-2xl font-bold mb-3">{msg.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-sm leading-relaxed">
            {msg.desc}
          </p>

          <Link
            href="/dashboard"
            className="inline-block px-6 py-3 rounded-lg bg-brand-600 text-white font-semibold hover:bg-brand-700 transition"
          >
            الذهاب للوحة التحكم
          </Link>
        </div>
      </div>
    </main>
  );
}
